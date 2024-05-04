function joinRoom(roomName) {
  nSocket.emit("joinRoom", roomName, (newNumberOfMembers) => {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${newNumberOfMembers}<span class="glyphicon glyphicon-user"></span>`;
  });

  nSocket.on("historyCatchUp", (history) => {
    const messagesUL = document.querySelector("#messages");
    messagesUL.innerHTML = "";
    history.forEach((msg) => {
      const newMsg = buildHTML(msg);
      const currentMessages = messagesUL.innerHTML;
      messagesUL.innerHTML = currentMessages + newMsg;
    });
    messagesUL.scrollTo(0, messagesUL.scrollHeight);
  });

  nSocket.on("updateMembers", (numMembers) => {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${numMembers}<span class="glyphicon glyphicon-user"></span>`;
    document.querySelector(".curr-room-text").innerText = `${roomName}`;
  });
}
