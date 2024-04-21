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

void hexdump(const void *mem, uint32_t len, uint8_t cols = 16) {
  const uint8_t* src = (const uint8_t*) mem;
  Serial.printf("\n[HEXDUMP] Address: 0x%08X len: 0x%X (%d)", (ptrdiff_t)src, len, len);
  for (uint32_t i = 0; i < len; i++) {
    if (i % cols == 0) {
      Serial.printf("\n[0x%08X] 0x%08X: ", (ptrdiff_t)src, i);
    }

    Serial.printf("%02X ", *src);
    src++;
  }

  Serial.printf("\n");
}

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
            Serial.printf("[%u] get Text: %s\n", num, payload);

            // send message to client
            // webSocket.sendTXT(num, "message here");

            // send data to all connected clients
            // webSocket.broadcastTXT("message here");
            break;
        case WStype_BIN:
            Serial.printf("[%u] get binary length: %u\n", num, length);
            hexdump(payload, length);

            // send message to client
            // webSocket.sendBIN(num, payload, length);
            break;
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
int counter = 0;

void loop() {
  webSocket.loop();

  if (millis() - timer > 2000) // send a counter value every 2 sec.
  {
    String numberString = String(counter);
    webSocket.broadcastTXT(numberString);
    counter = counter + 1;
    timer = millis();
  }

  bool drawBtnPressed = drawBtn->update();
  bool colorBtnPressed = colorBtn->update();

  if (drawBtnPressed) {
    webSocket.broadcastTXT("2");
  }

  if (colorBtnPressed) {
    webSocket.broadcastTXT("3");
  }

  String message = String(digitalRead(BTN_PIN)) + "," +
                String(analogRead(VER_PIN)) + "," +
                String(analogRead(HOR_PIN));

  //Serial.println(message);
  //Serial.println(digitalRead(COLOR_BUTTON));
  webSocket.broadcastTXT(message);
}