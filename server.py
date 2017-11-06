""" Virtual ANS Synthesizer. """

from jinja2 import StrictUndefined
from flask import (Flask, jsonify,
                   render_template,
                   redirect, request,
                   flash, session)
from flask_debugtoolbar import DebugToolbarExtension
from model import (connect_to_db, db, Frequency, Image, ImageColumn, Heart, User)

app = Flask(__name__)

# Required to use Flask sessions and debug toolbar:
app.secret_key = "SECRET"

# Raise error for undefined variable in jinja2
app.jinja_env.undefined = StrictUndefined

#*****************************************************#
# Routes

@app.route('/')
def index():
    """Homepage."""
    return render_template("homepage.html")

#*****************************************************#
# Logic

if __name__ == "__main__":
    # We have to set debug=True here, since it has to be True at the
    # point that we invoke the DebugToolbarExtension
    app.debug = True
    app.jinja_env.auto_reload = app.debug  # make sure templates, etc. are not cached in debug mode

    connect_to_db(app)

    # Use the DebugToolbar
    DebugToolbarExtension(app)

    app.run(port=5000, host='0.0.0.0')