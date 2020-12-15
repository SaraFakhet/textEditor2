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

class Files:
    def __init__(self, filename, text='', bold=False, italic=False, underline=False, alignement='left', font='Sans-Serif'):
        self.filename = filename
        self.text = text
        self.bold = bold
        self.italic = italic
        self.underline = underline
        self.alignement = alignement
        self.font = font


list_open_files = []


def getName(f):
    return f.filename


@app.route('/list-open-files')
def getListOpenFiles():
    return jsonify(list_open_files)


@app.route('/load-file/<filename>')
def loadFile(filename):
    for f in list_open_files:
        if (f.filename == filename):
            return jsonify(f)
    return None


'''
@app.route('/save/<filename>')
def save(filename):
    # Push dans la DB le open file qui a le nom filename
'''


@app.route('/open-files/<filename>')
def openFile(filename):
    f = Files(filename)
    list_open_files.append(f) # use files class


@app.route('/text-box/<file>', methods = ['POST'])
def textBox(file):
    data = json.loads(request.data) # load JSON data from request
    pusher_client.trigger(file, 'text-box', data)

    for f in list_open_files:
        if (f.filename == file):
            f.text = data
            break

    return jsonify(data)


@app.route('/tool-box/<file>', methods = ['POST'])
def toolBox(file):
    data = json.loads(request.data) # load JSON data from request
    pusher_client.trigger(file, 'tool-box', data)
    return jsonify(data)

@app.route('/user/<username>')
def profile(username):
    return '{}\'s profile'.format(escape(username))

with app.test_request_context():
    print(url_for('index'))
    print(url_for('textBox'))
    print(url_for('toolBox'))
    print(url_for('profile', username='John Doe'))

# run Flask app in debug mode
app.run(debug=True)

pusher_client.trigger('my-channel', 'my-event', {'message': 'hello world'})