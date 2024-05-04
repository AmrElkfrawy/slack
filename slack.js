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
  io.of(namespace.endpoint).on("connection", (nsSocket) => {
    // console.log(`${nsSocket.id} connected to ${namespace.endpoint}`);
    nsSocket.emit("nsRoomLoad", namespaces[0].rooms);
    nsSocket.on("joinRoom", async (roomToJoin, numberOfUsersCallBack) => {
      nsSocket.join(roomToJoin);

      const sockets = await io.of("/wiki").in(roomToJoin).fetchSockets();

      numberOfUsersCallBack(sockets.length);
    });

    nsSocket.on("newMessageToServer", (msg) => {
      const fulMsg = {
        text: msg.text,
        time: Date.now(),
        username: "rbunch",
        avatar: "https://via.placeholder.com/30",
      };
      const roomTitle = Array.from(nsSocket.rooms)[1];
      io.of(namespace.endpoint)
        .in(roomTitle)
        .emit("newMessageToClients", fulMsg);
    });
  });
});
