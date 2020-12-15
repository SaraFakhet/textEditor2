# ./app.py

from flask import Flask, request, jsonify, url_for
from markupsafe import escape
from pusher import Pusher
import json
import os
from flask_cors import CORS
import psycopg2


# create flask app
app = Flask(__name__)
CORS(app)

con = psycopg2.connect(dbname='de9ihpsvb026re', user='lstjhnbldzlhii', host='ec2-176-34-114-78.eu-west-1.compute.amazonaws.com', password='9636d9938d4215d06f268862ab7d4dbc645f3bdede8e1f9281ae128eccb174a1')
cur = con.cursor()
con.commit()

cur.execute("create table files (id serial primary key, filename varchar(255) not null, text varchar(1000), bold bool, italic bool, underline bool, alignement varchar(10), font varchar(100));")

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
    return  jsonify({ "data": list_open_files })


@app.route('/load-file/<filename>')
def loadFile(filename):
    for f in list_open_files:
        if (f.filename == filename):
            return jsonify(f)
    return '200'



@app.route('/save', methods = ['POST'])
def save():
    new_file = Files(filename='bibi', text='mémarshwesh')
    print(new_file)

    # Push dans la DB le open file qui a le nom filename
    return '200'



@app.route('/open-files/<filename>')
def openFile(filename):
    f = Files(filename)
    list_open_files.append(f) # use files class
    return '200'


@app.route('/text-box/<file>', methods = ['POST'])
def textBox(file):
    print(file)
    print(request.data)
    data = json.loads(request.data) # load JSON data from request
    pusher_client.trigger(file, 'text-box', data)

    for f in list_open_files:
        if (f.filename == file):
            f.text = data
            cur.execute( \
                "INSERT INTO files (filename, text, bold, italic, underline, alignement, font) VALUES ('" + f.filename + "', '" + f.text + "', " + \
                str(f.bold) + ", " + str(f.italic) + ", " + str(f.underline) + ", '" + f.alignement + "', '" + f.font + "')")
            con.commit()

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
    #print(url_for('textBox'))
    #print(url_for('toolBox'))
    print(url_for('profile', username='John Doe'))

# run Flask app in debug mode
if __name__ == "__main__":
    print("tzoerzoirjizr")
    app.run()

#app.run(debug=True)

pusher_client.trigger('my-channel', 'my-event', {'message': 'hello world'})

