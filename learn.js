const express = require("express");
const http = require("http");
const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path");
const server = http.createServer(app);

const { Server } = require("socket.io");
//Serve Static Files
app.use(express.static(path.resolve("./public")));

//creating io instance
const io = new Server(server);

//Socket.IO handle
io.on("connection", (socket) => {
  //   console.log("A new User Connected", socket.id);
  socket.on("user-message", (message) => {
    io.emit("message", message);
    // console.log("A new User Message=>", message);
  });
});

app.get("/", (req, res) => {
  return res.sendFile("./public/index.html");
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
