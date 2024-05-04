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
    const username = nsSocket.handshake.query.username;

    nsSocket.emit("nsRoomLoad", namespace.rooms);
    nsSocket.on("joinRoom", async (roomToJoin, numberOfUsersCallBack) => {
      const roomToLeave = Array.from(nsSocket.rooms)[1];
      nsSocket.leave(roomToLeave);

      updateUsersInRoom(namespace.endpoint, roomToLeave);
      nsSocket.join(roomToJoin);

      // we did it at the end so it's not important
      // let sockets = await io.of(namespace.endpoint).in(roomToJoin).fetchSockets();
      // numberOfUsersCallBack(sockets.length);

      let nsRoom;
      for (let index = 0; index < namespace.rooms.length; index++) {
        if (namespace.rooms[index].roomTitle == roomToJoin) {
          nsRoom = namespace.rooms[index];
          break;
        }
      }

      nsSocket.emit("historyCatchUp", nsRoom.history);
      updateUsersInRoom(namespace.endpoint, roomToJoin);
    });

    nsSocket.on("newMessageToServer", (msg) => {
      const fulMsg = {
        text: msg.text,
        time: Date.now(),
        username,
        avatar: "https://via.placeholder.com/30",
      };
      const roomTitle = Array.from(nsSocket.rooms)[1];

      for (let index = 0; index < namespace.rooms.length; index++) {
        if (namespace.rooms[index].roomTitle == roomTitle) {
          namespace.rooms[index].addMessage(fulMsg);
        }
      }

      io.of(namespace.endpoint)
        .in(roomTitle)
        .emit("newMessageToClients", fulMsg);
    });
  });
});

async function updateUsersInRoom(nsEndpoint, room) {
  let sockets = await io.of(nsEndpoint).in(room).fetchSockets();
  io.of(nsEndpoint).in(room).emit("updateMembers", sockets.length);
}
