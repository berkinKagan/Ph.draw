// Load Wi-Fi library
#include <WiFi.h>
#include <WebSocketsServer.h>

WebSocketsServer webSocket = WebSocketsServer(81);



// Replace with your network credentials
const char* ssid = "Mel's Kitchen";
const char* password = "19584706";

void hexdump(const void* mem, uint32_t len, uint8_t cols = 16) {
  const uint8_t* src = (const uint8_t*)mem;
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

void webSocketEvent(uint8_t num, WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected!\n", num);
      break;
    case WStype_CONNECTED:
      {
        IPAddress ip = webSocket.remoteIP(num);
        Serial.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);

        // send message to client
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

const int HOR_PIN = 14;
const int VER_PIN = 12;
const int BTN_PIN = 27;


void setup() {
  Serial.begin(9600);

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

  // Set button pin mode
  pinMode(BTN_PIN, INPUT);

  // server address, port and URL
  webSocket.begin();

  // event handler
  webSocket.onEvent(webSocketEvent);
}

unsigned long timer = 0;
int counter = 0;




void loop() {
  webSocket.loop();

  String message = String(digitalRead(BTN_PIN)) + ", " +
                String(analogRead(VER_PIN)) + ", " +
                String(analogRead(HOR_PIN));

  Serial.println(message);
  webSocket.broadcastTXT(message);
}