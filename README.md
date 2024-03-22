# Ph.draw: Physical Joystick Controlled Drawing Environment

Ph.draw is a project aimed at creating a drawing environment using a physical joystick controller and an ESP32 microchip. It allows users to control the drawing process by moving the joystick, which translates movements into mouse coordinates for drawing shapes on a screen. The project also includes plans for integrating voice commands for drawing shapes using a voice sensor and adding more customization settings and features in future versions.

## Features

- Control drawing process using a physical joystick controller.
- ESP32 microchip serves as the main controller for communication and interpretation of joystick movements.
- WebSocket server facilitates communication between the ESP32 and drawing software.
- Drawing software interprets commands from the ESP32 and draws shapes accordingly.
- Future plans include integration of voice commands for drawing shapes and adding more customization settings and features.

## Components

- **ESP32 Microchip**: Handles communication with the joystick controller and hosts the WebSocket server.
- **Joystick Controller**: Provides physical input for controlling the drawing process.
- **WebSocket Server**: Facilitates communication between the ESP32 and drawing software.
- **Drawing Software**: Receives commands from the ESP32 and draws shapes on the screen.
- **Voice Sensor (Planned)**: Detects voice commands for drawing shapes in future versions.

## Setup and Installation

1. **Hardware Setup**:
   - Connect the joystick controller to the ESP32 microchip according to the wiring diagram.
   - Ensure the ESP32 is properly connected to a power source and configured for programming.

2. **Software Setup**:
   - Flash the ESP32 microchip with the provided firmware.
   - Install the necessary dependencies for the WebSocket server and drawing software.

3. **Run the Project**:
   - Start the WebSocket server on the ESP32.
   - Launch the drawing software on your computer or device.
   - Begin controlling the drawing process using the joystick controller.

## Usage

- Use the joystick controller to move the cursor and control drawing actions.
- Press buttons on the joystick controller for additional functionalities (if supported).
- Experiment with different shapes and drawing modes supported by the software.

## Future Enhancements

- Integration of voice commands for drawing shapes using a voice sensor.
- Addition of more customization settings and features such as color selection, line thickness adjustment, and drawing modes.
