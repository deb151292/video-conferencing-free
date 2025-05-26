# Video Conferencing System

## Overview

This project is a web-based video conferencing system developed using Node.js, Express, Socket.IO, and WebRTC. It allows users to join video calls, share call links, and communicate via video and audio. Key features include muting audio, disabling video, and tracking call duration, which is displayed on a "Call Ended" page after the call concludes.

## Features

- **Join a Call**: Users can enter their name and join a video call.
- **Shareable Link**: Generate and share a unique room link to invite others.
- **Video and Audio Controls**: Toggle microphone and camera during the call.
- **End Call**: End the call and view the call duration.
- **Call Duration Tracking**: Displays the duration of the call after it ends (e.g., "Call duration: 2 minutes and 30 seconds").

## Prerequisites

Before setting up the project, ensure the following are installed:

- **Node.js** (version 18.x or later recommended):
  - Download and install Node.js from [nodejs.org](https://nodejs.org/). This project was developed and tested with Node.js v22.12.0, but v18.x (LTS) should also work.
- **npm**:
  - npm is bundled with Node.js and is used to manage dependencies.
- **LocalTunnel** (optional, for public URL testing):
  - LocalTunnel exposes your local server to the internet for multi-device testing. Install it globally via npm.
- A modern web browser (e.g., Chrome, Firefox, Edge) that supports WebRTC.
- A device with a camera and microphone for video and audio functionality.

## Installation

Follow these steps to set up and run the project locally:

1. **Clone or Download the Project**:
   - If the project is in a repository, clone it:
     ```
     git clone https://github.com/deb151292/video-conferencing-free.git
     cd video-conferencing-free
     ```
   - Alternatively, download the project files and navigate to the project directory in your terminal.

2. **Install Node.js and npm** (if not already installed):
   - Verify Node.js installation:
     ```
     node -v
     ```
     - This should output a version number (e.g., `v22.12.0`).
   - Verify npm installation:
     ```
     npm -v
     ```
     - This should output a version number (e.g., `10.8.3`).
   - If Node.js or npm is not installed, download and install it from [nodejs.org](https://nodejs.org/).

3. **Install Project Dependencies**:
   - In the project directory, install the required Node.js packages:
     ```
     npm install
     ```
   - This installs dependencies like `express` and `socket.io`, as listed in `package.json`.

4. **Install LocalTunnel (Optional)**:
   - To test the application across multiple devices over the internet, install LocalTunnel globally:
     ```
     npm install -g localtunnel
     ```
   - LocalTunnel provides an HTTPS URL, which is required for WebRTC to work on remote servers (localhost can use HTTP).

## Project Structure

- `server.js`: Backend server using Express and Socket.IO to handle WebRTC signaling and serve static files.
- `index.html`: Frontend interface for joining calls, managing video/audio, and tracking call duration.
- `thankyou.html`: Page displayed after the call ends, showing the call duration.
- `package.json`: Contains project metadata and dependencies.
- `README.md`: This documentation file.

## How It Works

### Backend (`server.js`)
- Built with Express to serve static files (`index.html`, `thankyou.html`).
- Uses Socket.IO for real-time communication, managing rooms, and exchanging WebRTC signaling messages (offers, answers, ICE candidates).
- When a user joins a room, the server notifies other participants in the same room.

### Frontend (`index.html`)
- Users enter their name and click "Join Call" to start a video call.
- WebRTC establishes peer-to-peer connections for video and audio streaming.
- A unique room ID is generated (or extracted from the URL) to identify the call session.
- Users can:
  - Share the room link to invite others.
  - Mute their microphone or turn off their camera.
  - End the call, which redirects to the "Call Ended" page.
- Call duration is tracked from the moment the user joins until they end the call.

### Call Duration Tracking
- The call start time is recorded when the user clicks "Join Call".
- When the user clicks "End Call", the duration is calculated and passed to `thankyou.html` via a query parameter (e.g., `/thankyou.html?duration=120`).

### Call Ended Page (`thankyou.html`)
- Displays a "Call Ended" message and the call duration in a human-readable format (e.g., "Call duration: 2 minutes").

## How to Run the Application

1. **Start the Server**:
   - In the project directory, run:
     ```
     node server.js
     ```
   - The server will start on port 3000, and you’ll see:
     ```
     Server running on http://localhost:3000
     ```

2. **Expose the Server with LocalTunnel (Optional)**:
   - To test with multiple devices over the internet, use LocalTunnel:
     ```
     lt --port 3000
     ```
   - LocalTunnel will provide a public URL (e.g., `https://your-subdomain.loca.lt`).
   - Note: WebRTC requires HTTPS for `getUserMedia` on remote servers. LocalTunnel provides an HTTPS URL. If testing on localhost, HTTP works fine.

3. **Access the Application**:
   - Open a web browser and navigate to:
     ```
     http://localhost:3000
     ```
   - If using LocalTunnel, use the provided URL (e.g., `https://your-subdomain.loca.lt`).

## How to Use the Application

1. **Join a Call**:
   - On the homepage (`index.html`), enter your name in the input field.
   - Click "Join Call".
   - Grant camera and microphone permissions when prompted.
   - If media access fails, you can still join the call without video/audio, and the duration will be tracked.

2. **Share the Call Link**:
   - After joining, a shareable link appears (e.g., `http://localhost:3000/?room=abc123`).
   - Click "Copy Link" to copy the URL to your clipboard.
   - Share this link with others to invite them to the call.

3. **Participate in the Call**:
   - Your video will appear (if media access was granted).
   - As others join using the shared link, their video streams will appear.
   - Use the control buttons at the bottom to:
     - Mute/unmute your microphone.
     - Turn on/off your camera.
     - End the call.

4. **End the Call**:
   - Click the "End Call" button (red button with a phone icon).
   - You’ll be redirected to the "Call Ended" page (`thankyou.html`), which shows the call duration (e.g., "Call duration: 2 minutes and 30 seconds").

## Troubleshooting

- **Camera/Microphone Not Working**:
  - Ensure your browser has permission to access your camera and microphone (check browser settings).
  - Verify your device has a working camera and microphone.
  - If testing on a remote server, ensure the server uses HTTPS (LocalTunnel provides this).

- **"Call duration: Not available" Message**:
  - This may occur if the call duration couldn’t be calculated.
  - Check the browser console (F12) for errors.
  - Ensure you’re following the steps to join and end the call properly.

- **LocalTunnel Issues**:
  - If the LocalTunnel URL doesn’t work, ensure your server is running on port 3000 and LocalTunnel is installed.
  - Generate a new LocalTunnel URL by restarting the `lt --port 3000` command.

## Dependencies

- **express**: Web framework for Node.js to serve static files and handle HTTP requests.
- **socket.io**: Real-time communication library for WebRTC signaling.
- **WebRTC**: Browser API for peer-to-peer video and audio streaming.
- **Font Awesome** (CDN): Provides icons for the UI (e.g., microphone, camera, end call).

## Future Improvements

- Add user authentication to secure call rooms.
- Implement a live call timer displayed during the call.
- Store call durations in a database for analytics.
- Support screen sharing and chat features.

## License

This project is for educational purposes and does not include a specific license. Feel free to use it as needed.
