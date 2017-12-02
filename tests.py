from unittest import TestCase
from model import connect_to_db, db, example_data
import server
import model
from server import app
from flask import session


class FlaskTestsBasic(TestCase):
    """Flask Tests"""

    def setUp(self):
        """Do before every test."""
        # Get the Flask test client:
        self.client = app.test_client()

        # Show Flask errors that happen during tests:
        app.config['TESTING'] = True

    def test_index(self):
        """Test homepage route."""
        result = self.client.get("/")
        self.assertIn("Upload Image", result.data)

    def test_about(self):
        """Test about page route."""
        result = self.client.get("/about")
        self.assertIn("photoelectronic musical instrument", result.data)


class ServerHelperFunctions(TestCase):
    """Tests server helper functions using the database."""

    def setUp(self):
        """Do before every test."""
        # Get the Flask test client:
        self.client = app.test_client()

        # Show Flask errors that happen during tests:
        app.config['TESTING'] = True

        # Connect to test database:
        connect_to_db(app, "postgresql:///testdb")

        # Create tables and add sample data:
        db.create_all()
        example_data()

    def tearDown(self):
        """Do at end of every test."""
        db.session.close()
        db.drop_all()

    def test_get_freqs(self):
        """Test get_freqs helper function."""
        frequencies = server.get_freqs()
        assert len(frequencies) == 120

    def test_get_pixel_data(self):
        """Test get_pixel_data helper function."""
        columns = server.get_pixel_data()
        pass


class FlaskTestsDatabase(TestCase):
    """Flask tests that use the database."""

    def setUp(self):
        """Do before every test."""
        # Get the Flask test client:
        self.client = app.test_client()

        # Show Flask errors that happen during tests:
        app.config['TESTING'] = True

        # Connect to test database:
        connect_to_db(app, "postgresql:///testdb")

        # Create tables and add sample data:
        db.create_all()
        example_data()

    def tearDown(self):
        """Do at end of every test."""
        db.session.close()
        db.drop_all()


class FlaskTestsLoggedIn(TestCase):
    """Flask tests with user logged into session."""

    def setup(self):
        """Do before every test."""
        app.config['TESTING'] = True
        app.config['SECRET_KEY'] = 'SECRET'
        self.client = app.test_client()

        with self.client as c:
            with c.session_transaction() as session:
                session['user_id'] = 1

    def test_logged_in_homepage(self):
        """Test that user can see important homepage elements when logged in."""
        result = self.client.get("/", follow_redirects=True)
        self.assertNotIn("Log In", result.data)
        self.assertIn("Log Out", result.data)


class FlaskTestsLoggedOut(TestCase):
    """Flask tests with user logged out of session."""

    def setUp(self):
        """Do before every test."""
        app.config['TESTING'] = True
        self.client = app.test_client()

    def test_logged_out_homepage(self):
        """Test that user can see important homepage elements when logged out."""
        result = self.client.get("/", follow_redirects=True)
        self.assertNotIn("Log Out", result.data)
        self.assertIn("Log In", result.data)


class FlaskTestsLogInLogOut(TestCase):
    """Test log in and log out."""

    def setUp(self):
        """Do before every test."""
        app.config['TESTING'] = True
        self.client = app.test_client()

    def test_login(self):
        """Test log in form."""
        with self.client as c:
            result = c.post("/login",
                            data={'email': 'hugh_jarse@yahoo.com',
                                  'password': 'password'},
                            follow_redirects=True
                            )
            self.assertEqual(session['user_id'], '2')
            self.assertIn("successfully logged in.", result.data)

    def test_logout(self):
        """Test log out route."""
        with self.client as c:
            with c.session_transaction() as session:
                session['user_id'] = '2'

                result = self.client.get('/logout', follow_redirects=True)

                self.assertNotIn('user_id', session)
                self.assertIn('successfully logged out.', result.data)


if __name__ == "__main__":
    import unittest
    unittest.main()

# test database
# seed test data -- example data
# 
