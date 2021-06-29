const express = require("express");
const app = express();

app.use(express.static("public"));

const http = require("http").Server(app);
const serverSocket = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

serverSocket.on("connection", (socket) => {
  socket.on("login", (nickname) => {
    console.log("Cliente conectado", nickname);
    serverSocket.emit("chat msg", `Usúario ${nickname} conectou`);
    socket.nickname = nickname;
  });

  socket.on("chat msg", (msg) => {
    console.log(`Cliente ${socket.nickname}, enviou: ${msg}`);
    serverSocket.emit("chat msg", socket.nickname + ":" + msg);
  });

  socket.on("status",(status)=>{
    socket.broadcast.emit('status',status);
  })

});

http.listen(3000, () => {
  console.log("Server ON");
});
