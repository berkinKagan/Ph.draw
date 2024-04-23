// where the serial server is (your local machine):
var host = '192.168.204.1:81';
var socket; // the websocket
var sensorValue = 0; // the sensor value
 
var c = "black";
var allColors = ["blue", "green", "red", "yellow", "black", "#F0F8FF"];
 
var cIndex = 4;
 
var xCor;
var yCor;
var prevXCor;
var prevYCor;
 
var indEll;
var initial = true;
var thicknessMode = false; // Track thickness mode
 
var joyStickInitial = true;
var blueBut = document.getElementById("blue");
var greenBut = document.getElementById("green");
var redBut = document.getElementById("red");
var yellowBut = document.getElementById("yellow");
var blackBut = document.getElementById("black");
var rubberBut = document.getElementById("rubber");
var uiOptionsList = [blueBut, greenBut, redBut, yellowBut, blackBut, rubberBut, "thickness"];
var strokeVal = 3;
let cursorLayer;
 
var drawEnabled = true;

const switchButtonInput = 3;
const drawButtonInput = 2;
 
function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();
  noStroke();
 
  cursorLayer = createGraphics(windowWidth, windowHeight);
 
  background("#F0F8FF");
 
  text("Thickness", 1000, 0,)
 
  slider = createSlider(1, 100, 20, 1);
  slider.position(1040, 100);
  slider.style('width', '180px');
 
  socket = new WebSocket('ws://' + host);
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
  image(cursorLayer, 0 , 0);
  drawCursor(xCor, yCor);
 
  if (drawEnabled) {
    cursorLayer.strokeWeight(slider.value());
    cursorLayer.stroke(c); 
    cursorLayer.line(xCor/2, yCor/2, prevXCor/2, prevYCor/2); 
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
  c = allColors[cIndex];
  var btnn = uiOptionsList[cIndex];
  btnn.style.backgroundColor = c;
  btnn.style.color = "white";
  
  for(var i = 0; i < allColors.length; i++){
    if(i != cIndex){
      uiOptionsList[i].style.color = allColors[i];
      uiOptionsList[i].style.backgroundColor = "white"; 
    }
  }
}
 
function readMessage(event) {
  var msg = event.data; // read data from the onmessage event
 
  const coorArr = msg.split(",");
 
  if (coorArr[0] == drawButtonInput) {
    drawEnabled = !drawEnabled;
  }
  else if (coorArr[0] == switchButtonInput) {
    handleColorAndThicknessSwitch();
  }
  else {
    if (thicknessMode) {
      handleThicknessMode(coorArr);
    } else {
      handleDrawingMode(coorArr);
    }
  }
}
 
function handleColorAndThicknessSwitch() {
  cIndex = (cIndex + 1) % uiOptionsList.length;

  thicknessMode = cIndex == uiOptionsList.length - 1;

  if (!thicknessMode)
    changeColor();
} 

function handleThicknessMode(coorArr) {
  if (Math.abs(coorArr[1] - 2000) > 200) {
    var deltaX = mapJoystickInput(coorArr[1]);
    
    slider.value(slider.value() + deltaX);
  }
}
 
function handleDrawingMode(coorArr) {
    if (joyStickInitial) {
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
 
function mapJoystickInput(input) {
  return -1 + (2 * input) / 4095;
}