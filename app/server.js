const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");
require("dotenv").config();

// ✅ Define missing variables
const rooms = {}; // Stores active game rooms
const win = {};   // Stores win validation data

// ✅ Serve static files correctly
app.use(express.static(path.join(__dirname, "public")));

// ✅ Default route for homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// ✅ Randomize color a player gets when joining
function generate_member_id(s_id, rc) {
  let m_id = Math.floor(Math.random() * 4);
  let m_r = Object.keys(rooms[rc] || {});

  if (m_r.length <= 4) {
    if (m_r.includes(m_id.toString())) {
      return generate_member_id(s_id, rc);
    } else {
      rooms[rc][m_id] = { sid: s_id, num: 0 };
      return m_id;
    }
  } else {
    return -1;
  }
}

// ✅ Delete disconnected player's ID
function deleteThisid(id) {
  for (let roomcd in rooms) {
    if (rooms.hasOwnProperty(roomcd)) {
      let ky = Object.keys(rooms[roomcd]).find(key => rooms[roomcd][key]['sid'] == id);
      if (typeof ky === 'string') {
        delete rooms[roomcd][ky];
        return { key: ky, room: roomcd };
      }
      if (Object.keys(rooms[roomcd]).length === 0) {
        delete rooms[roomcd];
        return undefined;
      }
    }
  }
}

// ✅ Validate game winner
function validateWinner(OBJ, socket) {
  if (!win[OBJ.room]) win[OBJ.room] = {};
  win[OBJ.room][OBJ.player] = { o: OBJ, s: socket.id };

  if (Object.keys(win[OBJ.room]).length === 4) {
    for (let i = 0; i < 4; i++) {
      if (win[OBJ.room][String(i)]['s'] !== rooms[OBJ.room][String(i)]['sid']) {
        return false;
      }
    }

    for (let i = 0; i < 3; i++) {
      if (win[OBJ.room][String(i)]['o'].id !== win[OBJ.room][String(i + 1)]['o'].id) {
        return false;
      }
    }
    return true;
  }
  return false;
}

// ✅ Start the server
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
