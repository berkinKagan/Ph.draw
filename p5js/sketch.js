// where the serial server is (your local machine):
var host = '192.168.204.1:81';
var socket; // the websocket
var sensorValue = 0; // the sensor value

var c = "black";
var allColors = ["blue", "green", "red", "yellow", "black", "#F0F8FF","thickness"];

var cIndex = 4;

var xCor;
var yCor;
var prevXCor;
var prevYCor;

var indEll;
var initial = true;
var joyStickInitial = true;
var blueBut = document.getElementById("blue");
var greenBut = document.getElementById("green");
var redBut = document.getElementById("red");
var yellowBut = document.getElementById("yellow");
var blackBut = document.getElementById("black");
var rubberBut = document.getElementById("rubber");
var buttonList = [blueBut, greenBut, redBut, yellowBut, blackBut, rubberBut];
var strokeVal = 3;
let sketchLayer;

var drawEnabled = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();
  noStroke();

  sketchLayer = createGraphics(windowWidth, windowHeight);

  background("#F0F8FF");

  text("Thickness", 1000, 0,)

  slider = createSlider(1, 100, 20, 1);
  slider.position(1040, 100);
  slider.style('width', '180px');

  socket = new WebSocket('ws://' + host);
  socket.onopen = sendIntro;
  socket.onmessage = readMessage;
}

function drawCursor(x, y) {
  fill(255, 0, 0);
  noStroke();
  ellipse(x, y, 20, 20);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background("#F0F8FF")
  image(sketchLayer, 0 , 0);
  drawCursor(xCor, yCor);

  if (drawEnabled) {
    sketchLayer.strokeWeight(slider.value());
    sketchLayer.stroke(c); 
    sketchLayer.line(xCor/2, yCor/2, prevXCor/2, prevYCor/2); 
  }  
}

function bluePress() {
  c = "blue";
  blueBut.style.backgroundColor = "blue";
}

function greenPress() {
  c = "green";
  greenBut.style.backgroundColor = "green";
}

function redPress() {
  c = "red";
  redBut.style.backgroundColor = "red";
}

function yellowPress() {
  c = "yellow";
  yellowBut.style.backgroundColor = "yellow";
}

function blackPress() {
  c = "black";
  blackBut.style.backgroundColor = "black";
}

function rubberPress() {
  c = "#F0F8FF";
  rubberBut.style.backgroundColor = "black";
}

function changeColor() {
  cIndex = (cIndex + 1) % allColors.length;
  c = allColors[cIndex];
  var btnn = buttonList[cIndex];
  btnn.style.backgroundColor = c;
  btnn.style.color = "white";

  //if c == "thickness" -> drawEnabled = !drawEnabled
  // thicknessMode = true
  
  for(var i = 0; i < buttonList.length; i++){
    if(i != cIndex){
      buttonList[i].style.color = allColors[i];
      buttonList[i].style.backgroundColor = "white"; 
    }
  }
}

function sendIntro() {
  // convert the message object to a string and send it:
  socket.send("Hello");
}

function readMessage(event) {
  var msg = event.data; // read data from the onmessage event
  sensorValue = msg;

  const coorArr = sensorValue.split(",");

  //if thicknessMode == True

  if (coorArr[0] == 2) {
    drawEnabled = !drawEnabled;
  }
  else if (coorArr[0] == 3) {
    changeColor();
  }
  else {
    if(joyStickInitial){
      xCor = width/2;
      yCor = height/2;
      joyStickInitial = false;
    }
  
    prevXCor = xCor;
    prevYCor = yCor;
  
    if (Math.abs(coorArr[1] - 2000) > 200)
      xCor += mapJoystickInput(coorArr[1]);

    if (Math.abs(coorArr[2] - 2000) > 200)
      yCor -= mapJoystickInput(coorArr[2]);
  }

  console.log(xCor, yCor);

  //console.log(windowHeight, windowWidth);

  println(sensorValue); // print it
  
}

function mapJoystickInput(input) {
  return -1 + (2 * input) / 4095;
}