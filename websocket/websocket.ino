// Load Wi-Fi library
#include <WiFi.h>
#include <WebSocketsServer.h>
#include "Button.h"

const int HOR_PIN = 32;
const int VER_PIN = 33;
const int BTN_PIN = 35;
const int BUTTON = 25;
const int COLOR_BUTTON = 26;

Button* drawBtn;
Button* colorBtn;

WebSocketsServer webSocket = WebSocketsServer(81);

const char* ssid = "Websocket";
const char* password = "12345678";

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
        Serial.printf("[%u] Disconnected!\n", num);
        break;
    case WStype_CONNECTED:
        {
            IPAddress ip = webSocket.remoteIP(num);
            Serial.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);

            webSocket.sendTXT(num, "Connected");
        }
        break;
    case WStype_TEXT:
    case WStype_BIN:
    case WStype_ERROR:      
    case WStype_FRAGMENT_TEXT_START:
    case WStype_FRAGMENT_BIN_START:
    case WStype_FRAGMENT:
    case WStype_FRAGMENT_FIN:
      break;
  }
}

void setup() {
  Serial.begin(9600);

  drawBtn = new Button(BUTTON);
  colorBtn = new Button(COLOR_BUTTON);

  // Connect to Wi-Fi network with SSID and password
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  // Print local IP address
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  // server address, port and URL
  webSocket.begin();

  // event handler
  webSocket.onEvent(webSocketEvent);
}

unsigned long timer = 0;

void loop() {
  webSocket.loop();

  bool drawBtnPressed = drawBtn->update();
  bool colorBtnPressed = colorBtn->update();

  if (drawBtnPressed) {
    webSocket.broadcastTXT("2");
  }

  if (colorBtnPressed) {
    webSocket.broadcastTXT("3");
  }

  String message =String(digitalRead(BTN_PIN)) + "," +
                String(analogRead(VER_PIN)) + "," +
                String(analogRead(HOR_PIN));

  webSocket.broadcastTXT(message);
}