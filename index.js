const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 4000;
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

mongoose.connect("mongodb://localhost:27017/CHAT_MESSAGES").then(() => {
  console.log("MongoDB Connected");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const users = {};

io.on("connection", (socket) => {
  socket.on("user connected", (userName) => {
    users[socket.id] = userName;
    io.emit("chat message", `${userName} joined the chat`);
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", `${users[socket.id]}: ${msg}`);
  });

  socket.on("disconnect", () => {
    const userName = users[socket.id];
    if (userName) {
      io.emit("chat message", `${userName} left the chat`);
      delete users[socket.id];
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is Running on ${PORT}`);
});
