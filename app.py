from InstagramAPI import InstagramAPI
import os
import json
import datetime
import base64
from flask import Flask, render_template, request, send_from_directory
from flask_cors import *

api = InstagramAPI("camerobot", "choutaojiao")
api.login()


# @app.route('/')
app = Flask(__name__, static_url_path='/static')
CORS(app, resources=r'/*')


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/<path>', methods=['GET'])
def serve_static(path):
    if path.endswith('.js'):
        return send_from_directory('js', path)
    if path.endswith('.css'):
        return send_from_directory('style', path)
    else:
        return send_from_directory('other', path)

# @app.route('/style/<path:path>')
# def send_js(path):
#     return send_from_directory('style', path)
#
# @app.route('/other/<path:path>')
# def send_js(path):
#     return send_from_directory('other', path)



@app.route('/upload', methods=['POST'])
def upload_file():
    # print("hello...")
    file = request.form
    # print(file['image'])
    t = datetime.datetime.now()
    photo_path ="/Users/huiyi/Desktop/Camerobot/" + t.isoformat().replace(":", ".") + ".jpg"
    f = open(photo_path, 'wb')
    f.write(base64.b64decode(file['image'].split(",")[1]))
    f.close()
    # here = os.path.dirname(os.path.realpath(__file__))
    # photo_path = os.path.join(here, 'koji.jpg')
    api.uploadPhoto(photo_path, caption='Hello From ITP Floor #itworks')
    return json.dumps({'status':'OK'})

if __name__ == "__main__":
    app.run()
