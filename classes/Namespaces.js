class Namespace {
  constructor(id, nTitle, img, endpoint) {
    this.id = id;
    this.img = img;
    this.nTitle = nTitle;
    this.endpoint = endpoint;
    this.rooms = [];
  }

  addRoom(roomObj) {
    this.rooms.push(roomObj);
  }
}

module.exports = Namespace;
