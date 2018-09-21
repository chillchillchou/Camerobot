from InstagramAPI import InstagramAPI
import os
import json
import datetime
import base64

from picamera import PiCamera
from time import sleep
from gpiozero import Button

api = InstagramAPI("camerobot", "choutaojiao")
api.login()

camera = PiCamera()
button = Button(17)

def take_pic():
    camera.start_preview()
    button.wait_for_press()
    sleep(2)
    
    camera.annotate_text="Your Picture has been taken"
    t=datetime.datetime.now()
    file_path = ('/home/huiyi/itpcam/images/image_' + t.isoformat().replace(":",".")+ '.jpg')
    camera.capture(file_path)
    api.uploadPhoto(file_path, caption='Hello From Makers Faire!#Makerfaire2018 #NYC")
    return json.dumps({'status':'OK'})
 
    sleep(3)
    #button = False

def main():
    while(1):
        take_pic()
    


if __name__ == "__main__":
    main()
