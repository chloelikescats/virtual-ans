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
import bcrypt
from sightengine.client import SightengineClient
UPLOAD_FOLDER = 'static/uploaded_images/'

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
    if 'user_id' in session:
        user_id = session['user_id']
        user_imgs = Image.query.filter(Image.user_id == user_id).all()
        faved_imgs = Image.query.filter(Heart.user_id == user_id).all()
    else:
        user_imgs = []
        faved_imgs = []

    imgs = Image.query.filter(Image.private == False).all()
    return render_template("homepage.html", imgs=imgs, user_imgs=user_imgs, faved_imgs=faved_imgs)


@app.route('/about')
def about_page():
    """About page"""
    return render_template("about.html")


@app.route('/heart-image', methods=['POST'])
def like_process():
    """Processes user's like of specific image."""
    print "Hi now I am in here"
    img_id = int(request.form['img_id'])
    heart = Heart(img_id=img_id, user_id=session['user_id'])
    db.session.add(heart)
    db.session.commit()
    return 'Thanks for liking me!'

@app.route('/unheart-image', methods=['POST'])
def unlike_process():
    """Processes user's unlike of specific image."""
    
    img_id = int(request.form['img_id'])
    unheart = Heart.query.filter(Heart.img_id == img_id, Heart.user_id == session['user_id']).first()
    if unheart != None:
        db.session.delete(unheart)
        db.session.commit()
    return "That's fine too!"


@app.route('/frequencies.json')
def jsonify_freqs():
    """Jsonify frequencies for Flocking"""
    frequencies = get_freqs()
    return jsonify(frequencies)


@app.route('/pixel_data.json')
def jsonify_pixel_data():
    """Get pixel data and jsonify"""
    img_id = request.args.get("img_id")
    pixel_data = get_pixel_data(img_id)
    return jsonify(pixel_data)


@app.route('/process-image.json', methods=["POST"])
def process_image():
    """Convert and analyze image, add to DB"""
    # privacy = request.form.get("privacy")
    # img = request.files['pic']
    privacy = request.form.get("privacy")
    img = request.files["img_file"]

    # Define path and save image to local directory
    img_path = UPLOAD_FOLDER + img.filename
    img.save(img_path)

    #SightEngine check image for nudity/weapons/drugs
    client = SightengineClient('860162422', 'eFiRDeywSC9mCCjXse5q')
    output = client.check('nudity','wad').set_file(img_path)
    print output
    if output['weapon'] > 0.8:
        message = "Weapons detected, please upload a different image."
        print("NO WEAPONS")
        return jsonify({'error_message': message})

    elif output['alcohol'] > 0.8:
        message = "Drugs or alcohol detected, please upload a different image."
        print("NO ALCOHOLS")
        return jsonify({'error_message': message})

    elif output['nudity']['raw'] > 0.5:
        message = "Nudity detected, please upload a different image."
        print("NO NAKEY PICS")
        return jsonify({'error_message': message})

    else:
        # Convert image and analyze, redirect to homepage
        upload = convert_resize_image(img_path, privacy)
        img_id = upload.img_id
        img_url = upload.img_url
        results = {"id": img_id, "url": img_url}
        pillow_analyze_image(img_path)
        # Return results
        return jsonify(results)


@app.route('/process-canvas.json', methods=["POST"])
def process_canvas():
    """Convert and Analyze image from Canvas, add to DB"""
    img = request.files['myFileName']
    privacy = request.form.get("privacy")

    if 'user_id' in session:
        user_id = session['user_id']
    else:
        user_id = None

    # Add DB record with dummy URL
    new_img_record = Image(user_id=user_id,
                           img_url="")
    db.session.add(new_img_record)
    db.session.commit()
    # Set the filename
    new_img_id = new_img_record.img_id
    filename = "image_" + str(new_img_id) + '.jpg'
    img_path = UPLOAD_FOLDER + filename
    # Save img to folder
    img.save(img_path)
    # Update DB with real URL
    new_img_record.img_url = img_path
    db.session.commit()
    # Convert and Resize Image and Analyze Pixels
    upload = convert_resize_image(img_path, privacy)
    img_id = upload.img_id
    img_url = upload.img_url
    results = {"id": img_id, "url": img_url}
    pillow_analyze_image(img_path)

    # Return results
    return jsonify(results)


@app.route('/register', methods=["GET"])
def register_form(): 
    """Shows user registration form"""
    return render_template("registration.html")


@app.route('/register', methods=["POST"])
def process_registration():
    """Adds new user and redirects to homepage."""
    email = request.form.get("email")
    password = request.form.get("password")
    password = password.encode("utf-8")

    hashedpw = bcrypt.hashpw(password, bcrypt.gensalt())

    user = User.query.filter(User.email == email).first()

    if user:
        flash('That email address is already registered, please login')
        return redirect("/login")
    new_user = User(email=email, password=hashedpw)
    db.session.add(new_user)
    db.session.commit()

    # automatically login user by adding user_id to session:
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

    user_password = user.password.encode("utf-8")
    password = password.encode("utf-8")

    if bcrypt.checkpw(password, user_password):
        session['user_id'] = user.user_id
        flash('You have successfully logged in.')
        return redirect('/')
    else:
        flash('Incorrect password, please try again')
        return redirect("/login")


@app.route("/logout")
def logout():
    """User account logout."""
    # delete user_id from session
    del session['user_id']
    flash('You have successfully logged out.')

    return redirect("/")

#*****************************************************#
# Logic

def get_freqs():
    """Get frequencies in hz out of frequencies."""
    table_freqs = Frequency.query.all()
    frequencies = {}
    freq_list = []

    for freq in table_freqs:
        new_freq = freq.freq_hz
        freq_list.append(new_freq)

    frequencies['frequency'] = freq_list
    return frequencies


def get_pixel_data(img_id):
    """Get pixel data for each image column out of image_columns"""
    image_columns = ImageColumn.query.filter(ImageColumn.img_id == img_id).all()
    columns = {}
    column_list = []

    for column in image_columns:
        new_column = column.pixel_array
        column_list.append(new_column)

    columns['column'] = column_list
    return columns


def convert_resize_image(img_url, privacy):
    """Convert image to greyscale and resize before adding to db"""
    baseheight = 720
    img = PILimage.open(img_url).convert('L')
    height_percent = (baseheight / float(img.size[1]))
    width_size = int((float(img.size[0]) * float(height_percent)))
    #If image is over 480px in width after scaling, crop width to 480px
    if width_size > 480:
        width_size = 480
    img = img.resize((width_size, baseheight), PILimage.ANTIALIAS)
    img.save(img_url)

    if privacy == 'private':
        private = True
    else:
        private = False

    if 'user_id' in session:
        user_id = session['user_id']
    else:
        user_id = None

    # Check if img_url in database, if not, add image to table
    db_img = Image.query.filter(Image.img_url == img_url).first()
    if not db_img:
        new_img = Image(img_url=img_url,
                        user_id=user_id,
                        private=private)
        db.session.add(new_img)
        db.session.commit()
        return new_img
    else:
        return db_img

def pillow_analyze_image(img_url):
    """Analyze each pixel with Pillow and add data to image_columns"""
    img = PILimage.open(img_url)
    i = Image.query.filter(Image.img_url == img_url).first()
    img_id = i.img_id

    for x in range(img.width):
        undiv_pixel_array = []
        for y in range(img.height):
            pixel = img.getpixel((x, y))
            undiv_pixel_array.append(pixel)

        pixel_array = []
        morsel_size = 6
        for i in xrange(0, len(undiv_pixel_array), morsel_size):
            morsel = undiv_pixel_array[i:i + morsel_size]

            morsel_sum = 0
            for i in morsel:
                morsel_sum = morsel_sum + i
                i += 1
            average = morsel_sum / 6
            pixel_array.append(average)

        new_array = ImageColumn(img_id=img_id,
                                pixel_array=pixel_array
                                )

        db.session.add(new_array)
    db.session.commit()


if __name__ == "__main__":
    # We have to set debug=True here, since it has to be True at the
    # point that we invoke the DebugToolbarExtension
    app.debug = True
    # make sure templates, etc. are not cached in debug mode
    app.jinja_env.auto_reload = app.debug  

    connect_to_db(app)

    # Use the DebugToolbar
    # DebugToolbarExtension(app)

    app.run(port=5000, host='0.0.0.0')