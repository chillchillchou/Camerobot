var serial; // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbmodem1411'; // fill in your serial port name here

// canvas
var cnv;

//incoming data
var data, previousSendValue, currentSendValue;
var buttonReleasedAction = false;
var buttonPressedAction = false;
var buttonAllowed = true;
var button;

// loading bar
var countingStart, countingStop, showImgStop;
var countingTime = 7000;
var showImg = false;
var showImgStart, showImgStop;
var imgShown;
var showImgTime = 4000;
var loadingBarWidth, loadingPercentage, rectWidth;
var waitText, waitTextLine;

// live feed
var ip, img;
var snapShots = [];

function preload() {
  waitText = loadStrings("static/other/wait.txt");
  waitTextLine = int(random(0, 16));
  cameraSound = loadSound("static/other/clickSound.mp3");
  greeting = loadSound("static/other/greetings.mp3");
}

function setup() {
  cnv = createCanvas(768, 900);
  // cnv = createCanvas(200, 256);
  cnv.id("mycanvas");

  rectMode(CENTER);
  textAlign(CENTER, CENTER);

  loadingBarWidth = 4 * width / 5;
 
   serial = new p5.SerialPort(document.location.hostname); // make a new instance of the serialport library
   serial.on('list', printList); // set a callback function for the serialport list event
   serial.on('connected', serverConnected); // callback for connecting to the server
   serial.on('open', portOpen); // callback for the port opening
   serial.on('data', serialEvent); // callback for when new data arrives
   serial.on('error', serialError); // callback for errors
   serial.on('close', portClose); // callback for the port closing
   serial.list(); // list the serial ports
   serial.open(portName); // open a serial port


  //set camera
  // ip = "localhost";
  // img = new Image();
  // img.setAttribute('crossOrigin', 'anonymous');
  // img.src = "http://"+ip+":3000/mjpg/video.mjpg";


  img = createCapture(VIDEO);
  img.hide();
  // if (buttonPressedAction == false) {
  //   setInterval(greet, random(8000, 30000));
  //   }
    // img.size(width,height);
  }

  function draw() {
    // background(0);

    // var ctx = mycanvas.getContext("2d");
    // ctx.drawImage(img, 0, 0);

    if (showImg && millis() >= showImgStart) {
      imgShown = image(snapShots[snapShots.length - 1], -(height * 4 / 3 - width) / 2, 0, height * 4 / 3, height);
      //imgShown = image(snapShots[snapShots.length-1], 0, 0, width, height);
      console.log(showImgStop);
      console.log(millis());
      if (millis() >= showImgStop - 100) {
        showImg = false;
        // console.log(showImg);
        img = createCapture(VIDEO);
        img.hide();

      }

    } else if (!showImg) {
      image(img, -(height * 4 / 3 - width) / 2, 0, height * 4 / 3, height);
      // setInterval(greet, 8000);
    }



  }
  // loading bar
  if (buttonPressedAction) {

    buttonAllowed = false; // ban user from taking shots again during loading.
    background(0);

    noStroke(); // for text of loading bar
    fill(255);
    textSize(32);

    if (millis() > countingStart && millis() < countingStop) { // check if loading starts.

      // loading bar width
      rectWidth = loadingBarWidth - (countingStop - millis()) / countingTime * loadingBarWidth;
      rect(width / 2, height / 2 + 20, rectWidth, 5);
      loadingPercentage = int(map(rectWidth, 0, loadingBarWidth, 0, 100)) + 1;

      if (loadingPercentage == 12 || loadingPercentage == 57) { // reset line number for wait.txt
        waitTextLine = int(random(0, 16));

      } else if (loadingPercentage > 12 && loadingPercentage <= 40) { // show wait text
        waitTextShown();

      } else if (loadingPercentage > 57 && loadingPercentage <= 82) { // show wait text
        waitTextShown();

      } else if (loadingPercentage >= 99) { // reset loading bar
        buttonPressedAction = false;
        loadingPercentage = 0;
        buttonAllowed = true;
        showImg = true;
        showImgStart = millis();
        showImgStop = showImgStart + showImgTime;

      } else { // show percentage
        waitPercentageShown();

      }
    }

  }

  function mousePressed() {
    if (buttonAllowed) {
      // save('camerobot');

      canvas.toBlob(function(Blob) {
        saveAs(Blob);
      });
      //send to image to server
      var imageUri = canvas.toDataURL("image/jpeg");
      $.post("http://127.0.0.1:5000/upload",
             {
                 image: imageUri,
             },
             function(data, status){
                 // alert("Data: " + data + "\nStatus: " + status);
             }
      );
      //play click camera sound
      cameraSound.play();
      buttonPressedAction = true;
      countingStart = millis();
      countingStop = countingStart + countingTime;
      snapShots.push(img.get());
    }
  }

  function waitTextShown() {
    text(waitText[waitTextLine], width / 2, height / 2 - 20);
  }

  function waitPercentageShown() {
    text(loadingPercentage + "%", width / 2, height / 2 - 20);
  }

  // get the list of ports:
  function printList(portList) {
    // portList is an array of serial port names
    for (var i = 0; i < portList.length; i++) {}
  }

  //incoming data and set status
  function serialEvent() {
    previousSendValue = currentSendValue;
    //previousSendValueButton = currentSendValueButton;
    data = serial.read();
    currentSendValue = parseInt(data);
    console.log(buttonPressedAction);

    if ((currentSendValue - previousSendValue) == 1 && buttonAllowed) {
      //save('camerobot');
      // saveCanvas('camerobot');
      canvas.toBlob(function(Blob) {
        saveAs(Blob);
      });
      cameraSound.play();
      buttonPressedAction = true;
      countingStart = millis();
      countingStop = countingStart + countingTime;
      snapShots.push(img.get());
      console.log(0);
      //downloadCanvas(down, 'mycanvas', 'test.png');


    }

  }


  // function greet() {
  //   // greeting.setLoop(false);
  //   // if (!greeting.isPlaying()) {
  //   console.log("call the function");
  //
  //   greeting.play();
  //   // greeting.stop();
  //   // }
  // }

  function serverConnected() {
    console.log('connected to server.');
  }

  function portOpen() {
    console.log('the serial port opened.');
  }

  function serialError(err) {
    console.log('Something went wrong with the serial port. ' + err);
  }

  function portClose() {
    console.log('The serial port closed.');
  }
