class Room {
  constructor(roomId, roomTitle, namespace, previousRoom = false) {
    this.roomId = roomId;
    this.roomTitle = roomTitle;
    this.namespace = namespace;
    this.previousRoom = previousRoom;
    this.history = [];
  }
  addMessage(message) {
    this.history.push(message);
  }
  clearHistory() {
    this.history = [];
  }
}

module.exports = Room;
