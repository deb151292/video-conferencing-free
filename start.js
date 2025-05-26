const localtunnel = require('localtunnel');
const server = require('./server.js');

// Function to start the server and Localtunnel
async function start() {
    console.log('Starting the Node.js server...');
    // The server is already started when we require server.js
    // It listens on port 3000 as defined in server.js

    console.log('Starting Localtunnel...');
    const tunnel = await localtunnel({ 
        port: 3000,
        subdomain: 'myvideocall' // Optional: Request a custom subdomain
    });

    console.log(`Localtunnel URL: ${tunnel.url}`);

    // Wait for the room ID to be set
    console.log('Waiting for room ID to be generated...');
    const waitForRoomId = () => new Promise((resolve) => {
        const checkRoomId = () => {
            const roomId = server.getRoomId();
            if (roomId) {
                resolve(roomId);
            } else {
                setTimeout(checkRoomId, 1000); // Check every second
            }
        };
        checkRoomId();
    });

    const roomId = await waitForRoomId();
    console.log(`Room ID received: ${roomId}`);

    // Combine the Localtunnel URL with the room ID
    const finalUrl = `${tunnel.url}/?room=${roomId}`;
    console.log(`Share this link with your friend: ${finalUrl}`);

    // Handle tunnel errors
    tunnel.on('error', (err) => {
        console.error('Localtunnel error:', err);
        process.exit(1);
    });

    // Handle tunnel close
    tunnel.on('close', () => {
        console.log('Localtunnel closed');
        process.exit(0);
    });
}

// Run the start function
start().catch(err => {
    console.error('Error starting the system:', err);
    process.exit(1);
});