function joinRoom(roomName) {
  nSocket.emit("joinRoom", roomName, (newNumberOfMembers) => {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${newNumberOfMembers}<span class="glyphicon glyphicon-user"></span>`;
  });
}
