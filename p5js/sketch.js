// where the serial server is (your local machine):
var host = '172.20.10.9:81';
var socket; // the websocket
var sensorValue = 0; // the sensor value
var c= "black";

var indEll;

var blueBut = document.getElementById("blue");
var greenBut = document.getElementById("green");
var redBut = document.getElementById("red");
var yellowBut = document.getElementById("yellow");
var blackBut = document.getElementById("black");
var rubberBut = document.getElementById("rubber");
var strokeVal = 3;

function setup() {
  
  createCanvas(windowWidth, windowHeight);
  noStroke();
  background("#F0F8FF");

  text("Thickness", 1000, 0,)

  slider = createSlider(1, 100, 20, 1);
  slider.position(1040, 100);
  slider.style('width', '180px');

  
  

  
  socket = new WebSocket('ws://' + host);
  
  socket.onopen = sendIntro;
  
  socket.onmessage = readMessage;
}

function draw() {
  
  
  

  if (mouseIsPressed) {
    
    if (c == "#F0F8FF") {
      strokeWeight(slider.value());
    } else {
      
      strokeWeight(slider.value());
    }
    stroke(c); 
    line(pmouseX, pmouseY, mouseX, mouseY); 
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
  sensorValue = Number(msg);
  println(sensorValue); // print it
}