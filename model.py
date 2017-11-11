""" Models and database functions for Virtual ANS. """

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

#*****************************************************#
# Model Definitions

class Frequency(db.Model):
    """ Frequencies in Hz for Flocking Ugens """

    __tablename__ = "frequencies"

    freq_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    freq_hz = db.Column(db.Float, nullable=False)

    def __repr__(self):
        """Provide helpful object representation when printed."""
        return "<Freq freq_id(row)=%s, freq_hz=%s>" % (self.freq_id,
                                                      self.freq_hz)


class Image(db.Model):
    """Images available for analysis and playback"""

    __tablename__ = "images"

    img_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    img_url = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=True)
    private = db.Column(db.Boolean, default=False, nullable=False)

    # Define Relationship to User:
    user = db.relationship("User",
                           backref=db.backref("images",
                           order_by=img_id
                           ))

    def __repr__(self):
        """Provide helpful object representation when printed."""
        return "<Image img_id=%s, img_url=%s, user_id=%s>" % (self.img_id,
                                                             self.img_url,
                                                             self.user_id)


class ImageColumn(db.Model):
    """ Data from previously analyzed images for playback """

    __tablename__ = "image_columns"

    img_col_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    img_id = db.Column(db.Integer, db.ForeignKey('images.img_id'), nullable=False)
    # col_num = db.Column(db.Integer, nullable=False)
    pixel_array = db.Column(db.ARRAY(db.Integer), nullable=False)


    # Define Relationship to Image:
    image = db.relationship("Image",
                            backref=db.backref("image_columns",
                            order_by=img_col_id
                            ))

    def __repr__(self):
        """Provide helpful object representation when printed."""
        return "<Image Data img_col_id=%s, img_id=%s>" % (self.img_col_id,
                                                                 self.img_id)


class Heart(db.Model):
    """ Favorited Images """

    __tablename__ = "hearts"

    heart_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    img_id = db.Column(db.Integer, db.ForeignKey("images.img_id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))

    # Define Relationship to Image:
    image = db.relationship("Image",
                            backref=db.backref("hearts",
                            order_by=heart_id
                            ))

    # Define Relationship to User:
    user = db.relationship("User",
                           backref=db.backref("hearts",
                           order_by=heart_id
                           ))

    def __repr__(self):
        """Provide helpful object representation when printed."""
        return "<Heart heart_id=%s, img_id=%s, user_id=%s>" % (self.heart_id,
                                                               self.img_id,
                                                               self.user_id)


class User(db.Model):
    """ Users of Virtual ANS app """

    __tablename__ = "users"

    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    email = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(25), nullable=False)

    def __repr__(self):
        """Provide helpful object representation when printed."""
        return "<User user_id=%s, email=%s, password=%s>" % (self.user_id,
                                                             self.email,
                                                             self.password)

#*****************************************************#
# Helper Functions

def connect_to_db(app, db_uri="postgresql:///ans"):
    """Connect database to Flask app."""

    #Configure PostgreSQL database:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.app = app
    db.init_app(app)


def calculate_semitones():
    """Calculate frequencies for each octave and add to table."""
    base = [20.31,
            20.91, 21.52,
            22.15, 22.80, 
            23.47, 24.16, 
            24.86, 25.59, 
            26.34, 27.11, 
            27.91, 28.73, 
            29.57, 30.43, 
            31.33, 32.24]

    for freq in base:
        db.session.add(Frequency(freq_hz=freq))
    db.session.commit()

    current_octave = [32.70, 33.68,
                      34.65, 35.68, 
                      36.71, 37.80,
                      38.89, 40.05,
                      41.20, 42.43,
                      43.65, 44.95,
                      46.25, 47.62,
                      49.00, 50.46,
                      51.91, 53.46,
                      55.00, 56.64,
                      58.27, 60.00,
                      61.74, 63.57]

    for octave_num in range(9):
        for freq in current_octave:
            db.session.add(Frequency(freq_hz=freq))
        db.session.commit()
        current_octave = [freq * 2 for freq in current_octave]

    over = [16742.40, 17244.16,
            17740.80, 18268.16,
            18795.52, 19353.60,
            19911.68]

    for freq in over:
        db.session.add(Frequency(freq_hz=freq))
    db.session.commit() 


if __name__ == "__main__":
    # As a convenience, if you run this module interactively, it will leave
    # you in a state of being able to work with the database directly.

    from server import app
    connect_to_db(app)
    print "Connected to DB."

    db.create_all()
    calculate_semitones()

