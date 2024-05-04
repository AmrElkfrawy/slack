const express = require("express");
const app = express();
const socketio = require("socket.io");
let namespaces = require("./data/namespaces");

app.use(express.static("public"));

const server = app.listen(3000, () => {
  console.log("Server Started");
});

const io = socketio(server);

// io.on = io.of("/").on
io.on("connection", (socket) => {
  let nsData = namespaces.map((namespace) => {
    return {
      img: namespace.img,
      endpoint: namespace.endpoint,
    };
  });

  // we used socket not io to send it only to this socket
  socket.emit("nsList", nsData);
});

namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connection", (socket) => {
    console.log(`${socket.id} connected to ${namespace.endpoint}`);
  });
});
