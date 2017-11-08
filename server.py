""" Virtual ANS Synthesizer. """

from jinja2 import StrictUndefined
from flask import (Flask, jsonify,
                   render_template,
                   redirect, request,
                   flash, session)
from flask_debugtoolbar import DebugToolbarExtension
from model import (connect_to_db, db, Frequency, Image, ImageColumn, Heart, User)
import PIL


app = Flask(__name__)

# Required to use Flask sessions and debug toolbar:
app.secret_key = "SECRET"

# Raise error for undefined variable in jinja2
app.jinja_env.undefined = StrictUndefined

#*****************************************************#
# Routes
"""TO DO:
    - image upload and processing
    - 
"""

@app.route('/')
def index():
    """Homepage."""
    return render_template("homepage.html")


@app.route('/frequencies.json')
def jsonify_freqs():
    frequencies = get_freqs()
    return jsonify(frequencies)


@app.route('/register', methods=["GET"])
def register_form():
    """Shows user registration form"""
    return render_template("registration.html")


@app.route('/register', methods=["POST"])
def process_registration():
    """Adds new user and redirects to homepage."""
    email = request.form.get("email")
    password = request.form.get("password")

    user = User.query.filter(User.email == email).first()

    if user:
        flash('That email address is already registered, please login')
        return redirect("/login")
    new_user = User(email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    #automatically login user by adding user_id to session:
    session['user_id'] = new_user.user_id
    flash('Successfully registered.')
    return redirect("/")


@app.route('/login', methods=["GET"])
def login():
    """User account login."""
    return render_template("login.html")


@app.route("/login", methods=["POST"])
def process_login():
    """Process user account login."""

    email = request.form.get("email")
    password = request.form.get("password")

    user = User.query.filter(User.email == email).first()
    if not user:
        flash('This email is not registered, please register.')
        return redirect("/register")

    if user.password == password:
        session['user_id'] = user.user_id
        flash('You have successfully logged in.')
        return redirect('/')
    else:
        flash('Incorrect password, please try again')
        return redirect("/login")


@app.route("/logout", methods=["POST"])
def logout():
    """User account logout."""
    # session.pop removes user_id key/value from session, does not set value to none
    # session.pop('user_id', None)
    # print session['user_id']

    #delete user_id from session
    del session['user_id']
    flash('You have successfully logged out.')

    return redirect("/")


#*****************************************************#
# Logic

def get_freqs():
    # get frequencies in hz out of db
    table_freqs = Frequency.query.all()
    frequencies = {}
    freq_list = []

    for freq in table_freqs:
        new_freq = freq.freq_hz
        freq_list.append(new_freq)

    frequencies['frequency'] = freq_list
    return frequencies


#Not sure whether or not I want to constrain the width to specified width
#right now I am scaling width based on set height
def convert_resize_image(img_url):
    """Convert image to greyscale and resize before adding to db"""
    baseheight = 720
    img = PIL.Image.open(img_url).convert('L')
    height_percent = (baseheight / float(img.size[1]))
    width_size = int((float(img.size[0]) * float(height_percent)))
    img = img.resize((width_size, baseheight), PIL.Image.ANTIALIAS)
    img.save(img_url)

    new_img = Image(img_url=img_url,
                    # user_id=user_id,
                    private=private)
 
    db.session.add(new_img)
    db.session.commit()


def pillow_analyze_image(img_url):
    """Analyze each pixel with Pillow and add data to image_columns"""
    img = PIL.Image.open(img_url)
    i = Image.query.filter(images.img_url == img_url).all()
    img_id = i.img_id

    col_num = 0

    for x in range(img.width):
        pixel_array = []
        for y in range(img.height):
            pixel = img.getpixel((x, y))
            pixel_array.append(pixel)
            col_num += 1
        new_array = ImageColumn(img_id=img_id,
                                col_num=col_num,
                                pixel_array=pixel_array
                                )

        db.session.add(pixel_array)
    db.session.commit()


if __name__ == "__main__":
    # We have to set debug=True here, since it has to be True at the
    # point that we invoke the DebugToolbarExtension
    app.debug = True
    app.jinja_env.auto_reload = app.debug  # make sure templates, etc. are not cached in debug mode

    connect_to_db(app)

    # Use the DebugToolbar
    DebugToolbarExtension(app)

    app.run(port=5000, host='0.0.0.0')