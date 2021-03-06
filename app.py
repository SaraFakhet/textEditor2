# ./app.py

from flask import Flask, request, jsonify, url_for
from markupsafe import escape
from pusher import Pusher
import json
import os
from flask_cors import CORS
import psycopg2
import datetime


# create flask app
app = Flask(__name__)
CORS(app)

con = psycopg2.connect(dbname='de9ihpsvb026re', user='lstjhnbldzlhii', host='ec2-176-34-114-78.eu-west-1.compute.amazonaws.com', password='9636d9938d4215d06f268862ab7d4dbc645f3bdede8e1f9281ae128eccb174a1')
cur = con.cursor()
con.commit()

cur.execute("create table if not exists files (id serial primary key, filename varchar(255) not null, text varchar(1000), bold bool, italic bool, underline bool, alignement varchar(10), font varchar(100), fontsize integer);")
cur.execute("create table if not exists version (filename varchar(255) not null, text varchar(1000), created_at TIMESTAMP, users varchar(100) not null)")  # FIXME a tester

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
    def __init__(self, filename, text='', bold=False, italic=False, underline=False, alignement='left', font='Sans-Serif', fontsize = 14):
        self.filename = filename
        self.text = text
        self.bold = bold
        self.italic = italic
        self.underline = underline
        self.alignement = alignement
        self.font = font
        self.fontsize = fontsize

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.dict, sort_keys=True, indent=4)


list_open_files = []


def getName(f):
    return f.filename


@app.route('/list-open-files')
def getListOpenFiles():
    print("list_open_files : " + str(list_open_files))
    print("len(list_open_files) : " + str(len(list_open_files)))
    return jsonify({ "data": list(map(lambda f: vars(f), list_open_files))})


@app.route('/load-file/<filename>')
def loadFile(filename):
    for f in list_open_files:
        if (f.filename == filename):
            return jsonify(vars(f))
    return '200'



@app.route('/save', methods = ['POST'])
def save():
    new_file = Files(filename='bibi', text='mémarshwesdh')
    print(new_file)

    # Push dans la DB le open file qui a le nom filename
    return '200'


@app.route('/open-files/<filename>')
def openFile(filename):
    for f in list_open_files:
        if f.filename == filename:
            return '200'

    f = Files(filename)
    print("f " + f.filename)
    print("before : " + str(list_open_files))
    list_open_files.append(f) # use files class
    print("after : " + str(list_open_files))

    cur.execute( \
        "INSERT INTO files (filename, text, bold, italic, underline, alignement, font, fontsize) VALUES ('" + f.filename + "', '" + f.text + "', " + \
        str(f.bold) + ", " + str(f.italic) + ", " + str(f.underline) + ", '" + f.alignement + "', '" + f.font + "'," + str(f.fontsize) + ")")
    con.commit()

    return '200'


@app.route('/text-box/<file>', methods = ['POST'])
def textBox(file):
    print(file)
    print(request.data)
    data = json.loads(request.data) # load JSON data from request
    pusher_client.trigger(file, 'text-box', data)


    for f in list_open_files:
        if (f.filename == file):
            f.text = data['body'].replace("'", "''")

            cur.execute("UPDATE files SET text = '" + f.text + "' WHERE filename LIKE '" + file + "'")
            cur.execute("INSERT INTO version VALUES ('"+ f.filename +"','" + f.text + "', NOW(),'" + data['user'] + "')") # FIXME a tester
            con.commit()
            pusher_client.trigger(file, 'version', { "filename": f.filename, "text": f.text,"date": datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f'), "user": data['user']})
            break

    return jsonify(data)


@app.route('/tool-box/<file>', methods = ['POST'])
def toolBox(file):
    data = json.loads(request.data) # load JSON data from request
    pusher_client.trigger(file, 'tool-box', data)

    for f in list_open_files:
        if f.filename == file:
            key = list(data.keys())[0]
            if key == 'bold':
                f.bold = data[key]
                cur.execute("UPDATE files SET bold = '" + str(data[key]) + "' WHERE filename LIKE '" + file + "'")
            elif key == 'italic':
                f.italic = data[key]
                cur.execute("UPDATE files SET italic = '" + str(data[key]) + "' WHERE filename LIKE '" + file + "'")
            elif key == 'underline':
                f.underline = data[key]
                cur.execute("UPDATE files SET underline = '" + str(data[key]) + "' WHERE filename LIKE '" + file + "'")
            elif key == 'align':
                f.alignement = data[key]
                cur.execute("UPDATE files SET alignement = '" + data[key] + "' WHERE filename LIKE '" + file + "'")
            elif key == 'fontFamily':
                f.font = data[key]
                cur.execute("UPDATE files SET font = '" + data[key] + "' WHERE filename LIKE '" + file + "'")
            elif key == 'fontSize':
                f.fontsize = data[key]
                cur.execute("UPDATE files SET fontsize = " + str(data[key]) + " WHERE filename LIKE '" + file + "'")
            con.commit()
            break

    return jsonify(data)


@app.route('/versions/<file>')
def getVersions(file):
    rows_count = cur.execute("SELECT * FROM version WHERE filename LIKE '" + file + "' ORDER BY created_at DESC")
    try:
        records =  cur.fetchall()
    except:
        print('EXCEPT')
        records = []
    return jsonify(records)

@app.route('/user/<username>')
def profile(username):
    return '{}\'s profile'.format(escape(username))

with app.test_request_context():
    print(url_for('index'))
    print(url_for('profile', username='John Doe'))

# run Flask app in debug mode
if __name__ == "__main__":
    app.run()


pusher_client.trigger('my-channel', 'my-event', {'message': 'hello world'})

