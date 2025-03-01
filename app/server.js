// Import required modules (Declare only once!)
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Ludo game server running on port ${PORT}`);
});
