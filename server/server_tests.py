import os
import server
import unittest
import tempfile

class ServerTestCase(unittest.TestCase):
    
    def setUp(self):
        self.db_fd, server.app.config['DATABASE'] = tempfile.mkstemp()
        self.app = server.app.test_client()
        server.init_db()

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(server.app.config['DATABASE'])

    def test_no_access_token(self):
        rv = self.app.get('/')
        assert 'Please log in through Dropbox.' in rv.data

        rv = self.app.get('/dropbox-auth-start', follow_redirects=False)
        assert 'You should be redirected automatically to target URL: <a href="https://www.dropbox.com/' in rv.data

        rv = self.app.get('/dropbox-auth-finish', follow_redirects=False)
        assert '400 Bad Request' in rv.data

        rv = self.app.get('/list')
        assert 'You should be redirected automatically to target URL: <a href="/">/</a>' in rv.data

        rv = self.app.get('/view/')
        assert '404 Not Found' in rv.data

        rv = self.app.get('/view/asdf')
        assert 'You should be redirected automatically to target URL: <a href="/">/</a>' in rv.data

        rv = self.app.post('/save')
        assert 'You are not currently logged in through Dropbox.' in rv.data

        rv = self.app.get('/logout')
        assert 'You should be redirected automatically to target URL: <a href="/">/</a>' in rv.data

if __name__ == '__main__':
    unittest.main()
