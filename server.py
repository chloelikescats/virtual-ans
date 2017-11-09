""" Virtual ANS Synthesizer. """

from jinja2 import StrictUndefined
from flask import (Flask, jsonify,
                   render_template,
                   redirect, request,
                   flash, session)
from flask_debugtoolbar import DebugToolbarExtension
from model import (connect_to_db, db, Frequency, Image, ImageColumn, Heart, User)
from PIL import Image as PILimage
import os
UPLOAD_FOLDER = 'static/uploaded_images/'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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
    """Jsonify frequencies for Flocking"""
    frequencies = get_freqs()
    return jsonify(frequencies)

@app.route('/upload-image', methods=["GET"])
def upload_image():
    """Upload image via form"""
    return render_template("homepage.html")

@app.route('/process-image', methods=["POST"])
def process_image():
    """Convert and analyze image, add to DB"""
    img = request.files['pic']
    img.save(os.path.join(app.config['UPLOAD_FOLDER'], img.filename))
    img_path = app.config['UPLOAD_FOLDER'] + img.filename

    convert_resize_image(img_path)
    img = Image.query.filter(Image.img_url == img_path).first()
    img_url = img.img_url
    pillow_analyze_image(img_url)
    return redirect("/")

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
    img = PILimage.open(img_url).convert('L')
    height_percent = (baseheight / float(img.size[1]))
    width_size = int((float(img.size[0]) * float(height_percent)))
    img = img.resize((width_size, baseheight), PILimage.ANTIALIAS)
    img.save(img_url)

    #still need to set whether image is private or public

    if 'user_id' in session:
        user_id = session['user_id']
    else:
        user_id = None
    # import pdb; pdb.set_trace()

    new_img = Image(img_url=img_url,
                    user_id=user_id)
                    # private=private)

 
    db.session.add(new_img)
    db.session.commit()


def pillow_analyze_image(img_url):
    """Analyze each pixel with Pillow and add data to image_columns"""
    img = PILimage.open(img_url)
    i = Image.query.filter(Image.img_url == img_url).first()
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

        db.session.add(new_array)
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