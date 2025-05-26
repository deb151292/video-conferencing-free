const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

// Serve static files (index.html)
app.use(express.static('public'));
// Variable to store the room ID
let currentRoomId = null;

// Expose a function to get the current room ID
module.exports.getRoomId = () => currentRoomId;

// Object to track users and their names in each room
const rooms = {};

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Store the room ID when received from the client
    socket.on('set-room-id', (roomId) => {
        currentRoomId = roomId;
        console.log(`Room ID set to: ${roomId}`);
    });

    // Join a room based on the room ID from the client
    socket.on('join-room', ({ roomId, username }) => {
        socket.join(roomId);
        console.log(`User ${socket.id} (${username}) joined room ${roomId}`);

        // Initialize the room if it doesn't exist
        if (!rooms[roomId]) {
            rooms[roomId] = new Map();
        }

        // Add the user to the room with their username
        rooms[roomId].set(socket.id, username);

        // Get the list of existing users in the room (excluding the new user)
        const existingUsers = Array.from(rooms[roomId].entries())
            .filter(([userId]) => userId !== socket.id)
            .map(([userId, username]) => ({ userId, username }));

        // Send the list of existing users to the new user
        socket.emit('existing-users', existingUsers);

        // Notify other users in the room about the new user with their username
        socket.to(roomId).emit('user-connected', { userId: socket.id, username });

        // Handle WebRTC signaling messages
        socket.on('offer', (data) => {
            socket.to(data.target).emit('offer', { sdp: data.sdp, sender: socket.id });
        });

        socket.on('answer', (data) => {
            socket.to(data.target).emit('answer', { sdp: data.sdp, sender: socket.id });
        });

        socket.on('ice-candidate', (data) => {
            socket.to(data.target).emit('ice-candidate', { candidate: data.candidate, sender: socket.id });
        });

        // Handle user disconnect
        socket.on('disconnect', () => {
            console.log(`User ${socket.id} disconnected`);
            socket.to(roomId).emit('user-disconnected', socket.id);

            // Remove the user from the room
            if (rooms[roomId]) {
                rooms[roomId].delete(socket.id);
                if (rooms[roomId].size === 0) {
                    delete rooms[roomId];
                }
            }
        });
    });
});

// Start the server
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});