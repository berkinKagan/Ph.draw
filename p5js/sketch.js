// where the serial server is (your local machine):
var host = '192.168.25.1:81';
var socket; // the websocket
var sensorValue = 0; // the sensor value
var c= "black";
var xCor;
var yCor;

var indEll;
var initial = true;
var joyStickInitial = true;
var blueBut = document.getElementById("blue");
var greenBut = document.getElementById("green");
var redBut = document.getElementById("red");
var yellowBut = document.getElementById("yellow");
var blackBut = document.getElementById("black");
var rubberBut = document.getElementById("rubber");
var strokeVal = 3;

let cursorLayer;

function setup() {
  
  createCanvas(windowWidth, windowHeight);
  noCursor();
  //noStroke();

  cursorLayer = createGraphics(windowWidth, windowHeight);

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
  // Draw a red circle as the custom cursor
  
    fill(c);
    //noStroke();
    ellipse(x, y, 20, 20); // Adjust the size of the cursor as needed
}

function draw() {
  background("#F0F8FF");
  image(cursorLayer, 0 , 0);

  drawCursor(mouseX, mouseY);

  if (mouseIsPressed) {
    
    if (c == "#F0F8FF") {
      cursorLayer.strokeWeight(slider.value());
    } else {
      
      cursorLayer.strokeWeight(slider.value());
    }

    cursorLayer.stroke(c); 
    cursorLayer.line(mouseX/2, mouseY/2, pmouseX/2, pmouseY/2); 
  }

}



function bluePress(){
  c = "blue";
}
function greenPress(){
  c = "green";
}
function redPress(){
  c = "red";
}
function yellowPress(){
  c = "yellow";
}
function blackPress(){
  c = "black";
}
function rubberPress(){
  c = "#F0F8FF";
}



function sendIntro() {
  // convert the message object to a string and send it:
  socket.send("Hello");
}

function readMessage(event) {
  var msg = event.data; // read data from the onmessage event
  sensorValue = msg;

  const coorArr = sensorValue.split(", ");

  

  if(joyStickInitial){
    xCor = width/2;
    yCor = height/2;
    joyStickInitial = false;
  }

  if(coorArr[1] < 1800){xCor++;}
  else if(coorArr[1] > 2200){xCor--;}

  if(coorArr[2] < 1800){yCor--;}
  else if(coorArr[2] > 2200){yCor++;}


  

  console.log(xCor, yCor);

  //console.log(windowHeight, windowWidth);

  println(sensorValue); // print it
}

