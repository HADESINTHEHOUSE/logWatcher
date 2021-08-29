const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path"); 
let content;
const fs = require("fs");
let fpath = path.join(__dirname, "log.txt");
content = fs.readFileSync(fpath).toString();
let count = 0;

app.use("/get",function (req, res, next) {
    
    data = `${count++} ${req.url} ${res.statusCode} ${req.method} \n`;
    fs.appendFileSync(fpath, data);
    
    next();
});
app.use("/log",function (req, res, next) {
    
    data = `new user connected \n`;
    fs.appendFileSync(fpath, data);
    
    next();
});

app.get("/log", (req, res) => {
    res.sendFile(__dirname + "/ind.html");
    
});

app.get("/get", (req, res) => {
    res.send("make calls from here");
});

server.listen(3000, () => {
    console.log("listening on *:3000");
});
let watching = false;

function last10Line(content, n) {
    let arr = content.replace(/\r\n/g, "\n").split("\n");

    arr = arr.slice(arr.length - n);
    // console.log(arr)
    return arr;
}

io.on("connection", (socket) => {
   // console.log("a user connected");
    socket.emit("initial", last10Line(content, 11));
    // socket.emit("message", socket);

    // socket.emit("change",data)
    
});

wat()
function wat()
{
    fs.watch(fpath, function (ev, filename) {
        
        content = fs.readFileSync(filename).toString();
        if (ev == "change") {
            //content = fs.readFileSync(body).toString();
            let data = last10Line(content, 2);
            io.sockets.emit("change", data);
        }
        
    });
}