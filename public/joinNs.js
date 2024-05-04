function joinNs(endpoint) {
  const nSocket = io(`http://localhost:3000${endpoint}`, {
    transports: ["websocket"],
  });

  nSocket.on("nsRoomLoad", (nsRooms) => {
    let roomList = document.querySelector(".room-list");
    roomList.innerHTML = "";
    nsRooms.forEach((room) => {
      let glyph;
      if (room.privateRoom) {
        glyph = "lock";
      } else {
        glyph = "globe";
      }
      roomList.innerHTML += `<li class="room" room="${room.roomId}"><span class="glyphicon glyphicon-${glyph}"></span> ${room.roomTitle}</li>`;
    });

    Array.from(document.getElementsByClassName("room")).forEach((element) => {
      element.addEventListener("click", (e) => {
        const roomId = element.getAttribute("room");
        console.log(roomId);
      });
    });
  });

  nSocket.on("newMessageToClients", (msg) => {
    console.log(msg);
    document.querySelector("#messages").innerHTML += `<li>${msg.text}</li>`;
  });

  document.querySelector(".message-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const newMessage = document.querySelector("#user-message").value;
    if (newMessage === "") return;
    socket.emit("newMessageToServer", { text: newMessage });
  });
}
