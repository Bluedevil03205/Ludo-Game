const {join} = require('path')
const views = join(__dirname, '../publish');

const path = require("path");
const ludoController = require(path.join(__dirname, "app", "controllers", "ludoController"));


module.exports = {
  test: (req, res) => {
    res.send("Ludo Controller is working!");
  }
};


exports.root = (_req,res)=>{
    res.redirect(301,'/');
}

exports.room = (req,res)=>{
    if(
    Object.keys(rooms).includes(req.params.ROOMCODE) &&
    Object.keys(req.query).length===0  &&
    Object.keys(rooms[req.params.ROOMCODE]).length < 4 &&
        (
        !(NumberOfMembers[req.params.ROOMCODE].constant) ||
        Object.keys(rooms[req.params.ROOMCODE]).length < NumberOfMembers[req.params.ROOMCODE].members
        )
    ){
        res.sendFile('../app/public/ludo.html', { root: views });
    } else{
        res.statusCode = 404;
        res.end('404!:(\nThis is either not a valid Room Code or The room is filled up, Go to home and create a room!');
    }
}
