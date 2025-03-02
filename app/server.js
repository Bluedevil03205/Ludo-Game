const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");
require("dotenv").config();

// Serve static files (if frontend exists)
app.use(express.static(path.join(__dirname, "public")));

// Default route for homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "app", "views", "index.html"));
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

//
///CUSTOM FUNCTIONS
//

//to randomise the color a player can get when he 'fetch'es.
function generate_member_id(s_id,rc){
    let m_id = Math.floor(Math.random()*4);
    let m_r = Object.keys(rooms[rc]);
    if(m_r.length <= 4){
        if(m_r.includes(m_id.toString())){
            return generate_member_id(s_id,rc)
        }else{
            rooms[rc][m_id] = {sid:s_id,num:0};
            return m_id;
        }
    } else{
        return -1;
    }
}

//to delete the extra place when (only one) user refreshes.
function deleteThisid(id){
    for(var roomcd in rooms){
        if(rooms.hasOwnProperty(roomcd)){
            ky = Object.keys(rooms[roomcd]).find( key => rooms[roomcd][key]['sid'] == id);
            if(typeof(ky) === 'string'){
                delete rooms[roomcd][ky];
                return {key:ky,room:roomcd};
            }
            if(Object.keys(rooms[roomcd]).length == 0){
                delete rooms[roomcd];
                return undefined;
            }
        }
    }

}

//to validate a winner, by comparing the data provided by all 4
function validateWinner(OBJ,socket){
    win[OBJ.room][OBJ.player] = {o:OBJ,s:socket.id};
    if(()=>{
        if(Object.keys(win[OBJ.room]).length == 4){
            for(let i=0;i<4;i++){
                if(win[OBJ.room][String(i)]['s']==rooms[OBJ.room][String(i)]['sid']){
                    continue;
                }else{return false}
            }
            return true;
        }else{return false;}
    }){
        for(let i=0;i<3;i++){
            if(win[OBJ.room][String(i)]['o'].id == win[OBJ.room][String(i+1)]['o'].id){
                continue;
            }else{return false}
        }
        return true;
    }else{return false;}

}


require("dotenv").config();  // Load environment variables


// Start the server
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});