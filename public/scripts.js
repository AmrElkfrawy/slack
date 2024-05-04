const socket = io("http://localhost:3000", { transports: ["websocket"] }); //the / endpoint
let nSocket = "";
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

  joinNs("/wiki");
});
