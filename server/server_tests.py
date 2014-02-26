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

    def test_1(self):
        #rv = self.app.get('/')
        #print rv.data
        #rv = self.app.get('/create')
        #print rv.data
        #rv = self.app.get('/view/asdf')
        #print rv.data
        assert True

if __name__ == '__main__':
    unittest.main()
