#include "Button.h"

Button::Button() {
  
}

Button::Button(int pin) {
  PIN = pin;
  pinMode(PIN, INPUT_PULLUP);
}

bool Button::update() {
  int reading = digitalRead(PIN);

  if (reading != lastState) {
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (reading != state) {
      state = lastState = reading;
      return state == 1;
    }
  }

  lastState = reading;

  return false;
}