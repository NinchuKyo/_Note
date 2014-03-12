import os, server, unittest, tempfile, json

TEST_UID = 'f3a2fcc4-52b4-4227-8196-752244a5ca5a'
TEST_ACCESS_TOKEN = 'oI1wj7JzS7wAAAAAAAAAAT-MLePwbwhCDqIXC6uhFVCc6vu-f__PESTFQSDwn5Vf'
TEST_REAL_NAME = '_Note Test User'

class ServerTestCase(unittest.TestCase):
    def login(self):
        db = server.get_db()
        db.execute('INSERT OR IGNORE INTO users (uid) VALUES (?)', [TEST_UID])
        db.execute('UPDATE users SET access_token = ? WHERE uid = ?', [TEST_ACCESS_TOKEN, TEST_UID])
        db.commit()

    def logout(self):
        return self.app.get('/logout', follow_redirects=True)

    def setUp(self):
        self.db_fd, server.app.config['DATABASE'] = tempfile.mkstemp()

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(server.app.config['DATABASE'])

    def test_with_access_token(self):
        with server.app.test_client() as self.app:
            with self.app.session_transaction() as sess:
                sess['uid'] = TEST_UID
                sess['real_name'] = TEST_REAL_NAME
            server.init_db()
            with server.app.app_context():
                self.login()

            rv = self.app.get('/is-logged-in')
            response = json.loads(rv.data)
            assert response['success'] and response['is_logged_in']

            rv = self.app.get('/')
            assert 'Welcome _Note Test User' in rv.data
            assert 'Please log in through Dropbox.' not in rv.data

            rv = self.app.get('/home')
            assert 'ng-app="mainApp"' in rv.data

            rv = self.app.get('/dropbox-auth-start', follow_redirects=False)
            assert 'You should be redirected automatically to target URL: <a href="https://www.dropbox.com/' in rv.data

            rv = self.app.get('/dropbox-auth-finish', follow_redirects=False)
            assert '400 Bad Request' in rv.data

            rv = self.app.get('/lists')
            response = json.loads(rv.data)
            assert response['success'] and 'note_titles' in response

            rv = self.app.get('/view_note/')
            assert '404 Not Found' in rv.data

            rv = self.app.get('/view_note/testing')
            response = json.loads(rv.data)
            assert response['success'] and 'note' in response

            rv = self.app.get('/view_note/this_note_does_not_exist')
            response = json.loads(rv.data)
            assert not response['success'] and 'msg' in response

            # rv = self.app.post('/save')
            # assert 'You are not currently logged in through Dropbox.' in rv.data

            rv = self.logout()
            assert 'Please log in through Dropbox.' in rv.data


    def test_no_access_token(self):
        self.app = server.app.test_client()
        server.init_db()

        rv = self.app.get('/is-logged-in')
        response = json.loads(rv.data)
        assert not response['is_logged_in']

        rv = self.app.get('/')
        assert 'Please log in through Dropbox.' in rv.data
        assert 'Feel free to try out the text editor.' in rv.data

        rv = self.app.get('/home', follow_redirects=True)
        assert 'Please log in through Dropbox.' in rv.data
        assert 'Feel free to try out the text editor.' in rv.data

        # without cookie
        rv = self.app.get('/dropbox-auth-finish', follow_redirects=False)
        assert '403 Forbidden' in rv.data

        rv = self.app.get('/dropbox-auth-start', follow_redirects=False)
        assert 'You should be redirected automatically to target URL: <a href="https://www.dropbox.com/' in rv.data

        # with cookie
        rv = self.app.get('/dropbox-auth-finish', follow_redirects=False)
        assert '400 Bad Request' in rv.data

        rv = self.app.get('/lists')
        assert 'You are not currently logged in through Dropbox.' in rv.data

        rv = self.app.get('/view_note/')
        assert '404 Not Found' in rv.data

        rv = self.app.get('/view_note/asdf')
        assert 'You are not currently logged in through Dropbox.' in rv.data
        
        rv = self.app.get('/dropbox-auth-finish', follow_redirects=False)
        assert '400 Bad Request' in rv.data

        rv = self.app.post('/save')
        assert 'You are not currently logged in through Dropbox.' in rv.data

        rv = self.logout()
        assert 'Please log in through Dropbox.' in rv.data

if __name__ == '__main__':
    unittest.main()
