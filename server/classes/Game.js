class Game {
  constructor(id, host, config) {
    this.id = id;
    this.host = host;
    this.playerLimit = config.nPlayers;
    this.playerCount = 1;
    this.players = [host];
    this.config = config;
    this.isPublic = config.isPublic;
    this.status = "queued";
    this.state = null;
  }

  add(player) {
    if (this.isFull()) return false;

    this.players.push(player);
    this.playerCount++;
  }
  setStatus(status) {
    this.status = status;
  }
  setState(state) {
    this.state = state;
  }
  isFull() {
    if (this.playerLimit == this.playerCount) {
      return true;
    } else {
      return false;
    }
  }
}
module.exports = Game;
