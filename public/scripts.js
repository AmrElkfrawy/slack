const socket = io("http://localhost:3000", { transports: ["websocket"] }); //the / endpoint
const socket2 = io("http://localhost:3000/wiki", {
  transports: ["websocket"],
});
const socket3 = io("http://localhost:3000/mozilla", {
  transports: ["websocket"],
});
const socket4 = io("http://localhost:3000/linux", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log(`connected ${socket.id}`);
});

socket.on("nsList", (nsData) => {
  let namespaceDiv = document.querySelector(".namespaces");
  namespaceDiv.innerHTML = "";
  nsData.forEach((ns) => {
    namespaceDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><div><img src="${ns.img}"/></div>`;
  });

  Array.from(document.getElementsByClassName("namespace")).forEach(
    (element) => {
      element.addEventListener("click", (e) => {
        const nsEndpoint = element.getAttribute("ns");
        console.log(nsEndpoint);
        socket.emit("joinNs", nsEndpoint);
      });
    }
  );
});

socket.on("messageFromServer", (msg) => {
  console.log(msg);
  socket.emit("messageToServer", { data: "message from client" });
});

document.querySelector(".message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const newMessage = document.querySelector("#user-message").value;
  if (newMessage === "") return;
  socket.emit("newMessageToServer", { text: newMessage });
});

socket.on("newMessageToClients", (msg) => {
  console.log(msg);
  document.querySelector("#messages").innerHTML += `<li>${msg.text}</li>`;
});
