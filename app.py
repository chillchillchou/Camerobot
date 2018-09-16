from InstagramAPI import InstagramAPI
import os
import json
import datetime
import base64
from flask import Flask, render_template, request
from flask_cors import *

api = InstagramAPI("camerobot", "choutaojiao")
api.login()
app = Flask(__name__)
CORS(app, resources=r'/*')

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
