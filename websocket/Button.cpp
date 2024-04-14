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
    // reset the debouncing timer
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    // whatever the reading is at, it's been there for longer than the debounce
    // delay, so take it as the actual current state:

    // if the button state has changed:
    if (reading != state) {
      state = reading;
      
      return true;
    }
  }

  lastState = reading;

  return false;
}