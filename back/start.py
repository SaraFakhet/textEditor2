# ./app.py

from flask import Flask, request, jsonify, url_for
from markupsafe import escape
from pusher import Pusher
import json
from flask_cors import CORS

# create flask app
app = Flask(__name__)
CORS(app)

# configure pusher object
pusher_client = Pusher(
    app_id = "1105624",
    key = "e0f07ea56123ef7bab7b",
    secret = "63ec953d6edd77f0ddf6",
    cluster = "eu",
    ssl=True
)

@app.route('/')
def index():
    return jsonify('index')



@app.route('/text-box', methods = ['POST'])
def textBox():
    data = json.loads(request.data) # load JSON data from request
    pusher_client.trigger('editor', 'text-box', data)
    return jsonify(data)

@app.route('/user/<username>')
def profile(username):
    return '{}\'s profile'.format(escape(username))

with app.test_request_context():
    print(url_for('index'))
    print(url_for('textBox'))
    print(url_for('profile', username='John Doe'))

# run Flask app in debug mode
app.run(debug=True)

pusher_client.trigger('my-channel', 'my-event', {'message': 'hello world'})