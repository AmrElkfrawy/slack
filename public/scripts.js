let username = prompt("What is your username");
if (!username) {
  username = "Unknown";
}

const socket = io("http://localhost:3000", {
  transports: ["websocket", "polling"],
  query: { username },
}); //the / endpoint
let nSocket = "";
socket.on("nsList", (nsData) => {
  let namespaceDiv = document.querySelector(".namespaces");
  namespaceDiv.innerHTML = "";
  nsData.forEach((ns) => {
    namespaceDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><div><img src="${ns.img}"/></div>`;
  });
  let nsEndpoint;
  Array.from(document.getElementsByClassName("namespace")).forEach(
    (element) => {
      element.addEventListener("click", (e) => {
        nsEndpoint = element.getAttribute("ns");
        // console.log(nsEndpoint);
        console.log("here");
        joinNs(nsEndpoint);
      });
    }
  );
  joinNs("/wiki");
});
