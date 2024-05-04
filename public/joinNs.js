function joinNs(endpoint) {
  if (nSocket) {
    nSocket.close();
    document
      .querySelector("#user-input")
      .removeEventListener("submit", formSubmission);
  }
  nSocket = io(`http://localhost:3000${endpoint}`, {
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
        joinRoom(e.target.innerText.trim());
      });
    });
    const topRoom = document.querySelector(".room");

    joinRoom(topRoom.innerText.trim());
  });

  nSocket.on("newMessageToClients", (msg) => {
    msg = buildHTML(msg);
    newMsg = document.querySelector("#messages").innerHTML += msg;
  });

  document
    .querySelector(".message-form")
    .addEventListener("submit", formSubmission);
}

function formSubmission(e) {
  e.preventDefault();
  const newMessage = document.querySelector("#user-message").value;
  if (newMessage === "") return;
  nSocket.emit("newMessageToServer", { text: newMessage });
  document.querySelector("#user-message").value = "";
}

function buildHTML(msg) {
  const convertedDate = new Date(msg.time).toLocaleString();
  const newHTML = `
  <li>
    <div class="user-image">
      <img src=${msg.avatar} />
    </div>
    <div class="user-message">
      <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
      <div class="message-text">${msg.text}</div>
    </div>
  </li>
  `;
  return newHTML;
}
