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
import os

# configuration
DEBUG = True
DATABASE = '_Note.db'
SECRET_KEY = '[+[z>$pC6zpz"X[P2{TwY$.v'
DROPBOX_APP_KEY = 'uwjvcs6f8kegvt1'
DROPBOX_APP_SECRET = 'l8p42osw8uriwyj'

app = Flask(__name__)
app.config.from_object(__name__)
app.config.from_envvar('FLASKR_SETTINGS', silent=True)

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
def home():
    if 'user' not in session:
        #TODO: generate some sort of id
        username = '123'
        db = get_db()
        db.execute('INSERT OR IGNORE INTO users (username) VALUES (?)', [username])
        db.commit()
        session['user'] = username
    access_token = get_access_token()
    real_name = None
    app.logger.info('access token = %r', access_token)
    if access_token is not None:
        client = DropboxClient(access_token)
        account_info = client.account_info()
        real_name = account_info["display_name"]
    return render_template('index.html', real_name=real_name)

def get_access_token():
    username = session.get('user')
    if username is None:
        return None
    db = get_db()
    row = db.execute('SELECT access_token FROM users WHERE username = ?', [username]).fetchone()
    if row is None:
        return None
    return row[0]

@app.route('/dropbox-auth-start')
def dropbox_auth_start():
    if 'user' not in session:
        abort(403)
    return redirect(get_auth_flow().start())

def get_auth_flow():
    #TODO: redirect_uri has to use SSL (https://)
    redirect_uri = url_for('dropbox_auth_finish', _external=True)
    return DropboxOAuth2Flow(DROPBOX_APP_KEY, DROPBOX_APP_SECRET, redirect_uri,
                                       session, 'dropbox-auth-csrf-token')

@app.route('/dropbox-auth-finish')
def dropbox_auth_finish():
    username = session.get('user')
    if username is None:
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
        flash('Not approved?  Why not')
        return redirect(url_for('home'))
    except DropboxOAuth2Flow.ProviderException, e:
        app.logger.exception("Auth error" + e)
        abort(403)
    db = get_db()
    data = [access_token, username]
    db.execute('UPDATE users SET access_token = ? WHERE username = ?', data)
    db.commit()
    return redirect(url_for('home'))

@app.route('/dropbox-logout')
def dropbox_logout():
    username = session.get('user')
    if username is None:
        abort(403)
    db = get_db()
    db.execute('UPDATE users SET access_token = NULL WHERE username = ?', [username])
    db.commit()
    return redirect(url_for('home'))

@app.route('/logout')
def logout():
    session.pop('user', None)
    flash('You were logged out')
    return redirect(url_for('home'))

if __name__ == "__main__":
    init_db()
    app.run(host='0.0.0.0', debug=True)




