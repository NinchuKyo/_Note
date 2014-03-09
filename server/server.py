# -*- coding: utf-8 -*-
"""
_Note
COMP 4350 Software Development 2 Project
Group 1: Lyndon Quigley, Graeme Peters, Harrison Mulder, 
         Duong Nguyen, Tony Young, Mathias Eurich
"""

from flask import Flask, request, session, redirect, url_for, abort, \
     render_template, flash, _app_ctx_stack
from dropbox.client import DropboxClient, DropboxOAuth2Flow
from sqlite3 import dbapi2 as sqlite3
from OpenSSL import SSL
import os, uuid, dropbox, string, json

# configuration
DEBUG = True
DATABASE = '_Note.db'
SECRET_KEY = '[+[z>$pC6zpz"X[P2{TwY$.v'
DROPBOX_APP_KEY = 'uwjvcs6f8kegvt1'
DROPBOX_APP_SECRET = 'l8p42osw8uriwyj'

app = Flask(__name__)
app.config.from_object(__name__)
# app.config.from_envvar('FLASKR_SETTINGS', silent=True)

# setup SSL
context = SSL.Context(SSL.SSLv23_METHOD)
context.use_privatekey_file('ssl/server.key')
context.use_certificate_file('ssl/server.crt')

# constants
TITLE_ALLOWED_CHARS = set(string.ascii_letters + string.digits + '_' + '-' + ' ')

# Ensure instance directory exists
try:
    os.makedirs(app.instance_path)
except OSError:
    pass

def init_db():
    """Creates the database tables."""
    with app.app_context():
        db = get_db()
        with app.open_resource("schema.sql", mode="r") as f:
            db.cursor().executescript(f.read())
        db.commit()

def get_db():
    """
    Opens a new database connection if there is none yet for the current application context.
    """
    top = _app_ctx_stack.top
    if not hasattr(top, 'sqlite_db'):
        sqlite_db = sqlite3.connect(os.path.join(app.instance_path, app.config['DATABASE']))
        sqlite_db.row_factory = sqlite3.Row
        top.sqlite_db = sqlite_db
    return top.sqlite_db

@app.route('/')
def splash():
    uid = session.get('uid', None)
    real_name = session.get('real_name', None)
    app.logger.info('uid = %s', uid)
    app.logger.info('real_name = %s', real_name)
    return render_template('splash.html', real_name=real_name)

def get_access_token():
    uid = session.get('uid')
    if uid is None:
        return None
    db = get_db()
    row = db.execute('SELECT access_token FROM users WHERE uid = ?', [uid]).fetchone()
    if row is None:
        return None
    return row[0]

@app.route('/dropbox-auth-start')
def dropbox_auth_start():
    if 'uid' not in session:
        uid = str(uuid.uuid4())
        db = get_db()
        db.execute('INSERT OR IGNORE INTO users (uid) VALUES (?)', [uid])
        db.commit()
        session['uid'] = uid
    else:
        uid = session['uid']
    return redirect(get_auth_flow().start())

def get_auth_flow():
    redirect_uri = url_for('dropbox_auth_finish', _external=True)
    return DropboxOAuth2Flow(DROPBOX_APP_KEY, DROPBOX_APP_SECRET, redirect_uri, session, 'dropbox-auth-csrf-token')

@app.route('/dropbox-auth-finish')
def dropbox_auth_finish():
    uid = session.get('uid')
    if uid is None:
        abort(403)
    try:
        access_token, user_id, url_state = get_auth_flow().finish(request.args)
    except DropboxOAuth2Flow.BadRequestException, e:
        abort(400)
    except DropboxOAuth2Flow.BadStateException, e:
        abort(400)
    except DropboxOAuth2Flow.CsrfException, e:
        abort(403)
    except DropboxOAuth2Flow.NotApprovedException, e:
        flash('Not approved?  Why not?')
        return redirect(url_for('splash'))
    except DropboxOAuth2Flow.ProviderException, e:
        app.logger.exception("Auth error" + e)
        abort(403)
    db = get_db()
    data = [access_token, uid]
    db.execute('UPDATE users SET access_token = ? WHERE uid = ?', data)
    db.commit()

    client = DropboxClient(access_token)
    account_info = client.account_info()
    real_name = account_info["display_name"]
    session['real_name'] = real_name

    app.logger.info('access_token = %s', access_token)

    return redirect(url_for('home'))

@app.route('/home')
def home():
    access_token = get_access_token()
    if not access_token:
        return redirect(url_for('splash'))

    uid = session.get('uid', None)
    real_name = session.get('real_name', None)
    app.logger.info('uid = %s', uid)
    app.logger.info('real_name = %s', real_name)
    return render_template('index.html', real_name=real_name)

@app.route('/is-logged-in')
def is_logged_in():
    access_token = get_access_token()
    is_logged_in = True if access_token else False
    return json_response(True, '', is_logged_in=is_logged_in)

# @app.route('/list')
# def list():
#     access_token = get_access_token()
#     if not access_token:
#         return redirect(url_for('home'))

#     real_name = session.get('real_name', None)
#     return render_template('list.html', real_name=real_name)

@app.route('/lists')
def lists():
    access_token = get_access_token()
    if not access_token:
        return json_response(False, 'You are not currently logged in through Dropbox.')

    client = DropboxClient(access_token)
    folder_metadata = client.metadata('/')['contents']
    note_titles = []
    for file in folder_metadata:
        note_titles.append({ 'Title': file['path'][1:] })
    return json_response(True, '', note_titles=note_titles)

# @app.route('/view/<note_title>')
# def view(note_title):
#     access_token = get_access_token()
#     if not access_token:
#         return redirect(url_for('home'))
    
#     client = DropboxClient(access_token)
#     try:
#         f, metadata = client.get_file_and_metadata('/' + note_title)
#         note_content = f.read().replace('\n', '')
#         json_content = json.loads(note_content)
#     except dropbox.rest.ErrorResponse:
#         flash('File not found.')
#         return redirect(url_for('home'))
#     real_name = session.get('real_name', None)
#     return render_template('view.html', real_name=real_name, note_content=json_content)

@app.route('/view_note/<note_title>')
def view_note(note_title):
    access_token = get_access_token()
    if not access_token:
        return json_response(False, 'You are not currently logged in through Dropbox.')
    
    client = DropboxClient(access_token)
    try:
        f, metadata = client.get_file_and_metadata('/' + note_title)
        #TODO: validate it's real json
        json_content = f.read().replace('\n', '')
    except dropbox.rest.ErrorResponse as e:
        app.logger.exception(e)
        return json_response(False, e.user_error_msg)

    real_name = session.get('real_name', None)
    return json_response(True, '', note=json_content)

# @app.route('/create')
# def create():
#     access_token = get_access_token()
#     if not access_token:
#         return redirect(url_for('home'))

#     real_name = session.get('real_name', None)
#     return render_template('create.html', real_name=real_name)

@app.route('/save', methods=['POST'])
def save():
    access_token = get_access_token()
    if not access_token:
        return json_response(False, 'You are not currently logged in through Dropbox.')

    try:
        json = request.get_json()
    except:
        return json_response(False, 'Unable to process data.')

    return save_note(access_token, json)

def save_note(access_token, json):
    if set(json['title']) > TITLE_ALLOWED_CHARS:
        return json_response(False, 'Allowed characters: A-Z, a-z, 0-9, -, _')
    if 'overwrite' not in json:
        return json_response(False, 'Missing parameter.')

    try:
        client = DropboxClient(access_token)
        #TODO: determine if the title was changed, if so, remove old note
        response = client.put_file('/' + json['title'], request.data, overwrite=json['overwrite'])
    except dropbox.rest.ErrorResponse as e:
        app.logger.exception(e)
        return json_response(False, e.user_error_msg)

    return json_response(True, 'Your note was saved successfully.')

def json_response(success, msg, **kwargs):
    response = {'success': success, 'msg': msg}
    for key, value in kwargs.iteritems():
        response[key] = value
    return json.dumps(response)

@app.route('/logout')
def logout():
    uid = session.get('uid')
    if uid is None:
        abort(403)
    db = get_db()
    db.execute('UPDATE users SET access_token = NULL WHERE uid = ?', [uid])
    db.commit()
    session.pop('uid', None)
    session.pop('real_name', None)
    return json_response(True, 'You have been logged out.')

if __name__ == "__main__":
    init_db()
    app.run(host='0.0.0.0', ssl_context=context)
