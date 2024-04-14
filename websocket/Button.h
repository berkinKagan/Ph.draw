#ifndef LED_FUNCTIONS_H
#define LED_FUNCTIONS_H

#include <Arduino.h>

class Button {
  public:
    Button();
    Button(int pin);
    bool update();
  private:
    int PIN;

    unsigned long lastDebounceTime = 0;
    const unsigned long debounceDelay = 50;

    int state;
    int lastState;
};

#endif