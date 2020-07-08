class Player {
  constructor(uid, username, pos, { colorID, homeZone, x, y, color }) {
    this.uid = uid;
    this.username = username;
    this.pos = pos; // the position on the board the player pieces are present, this determines when it is their turn
    this.colorID = colorID ? colorID : null; // the name of the color, this is optional
    this.homeZone = homeZone; // the zone where the player needs to move their pieces on the board to win
    this.area = { x: x, y: y }; // the x and y position of the first pieces for the player that is added to the board, x value is basically useless however 😆
    this.color = color; // the color of the players game piece
    this.online = true; // if the player is connected to the online game
    this.isWinner = false; // if the player is the winner of the game(They have no more turns available if true)
    this.placed = null; // if the player placed 1st, 2nd 3rd, etc in the current game
  }
  /**
   * sets the player online status, if the playe is offline during a current game their turn is skipped until they rejoin
   * @param {boolean} status
   */
  setOnline(status) {
    this.online = status;
  }
  /**
   * sets the player as the winner of the current game
   * @param {boolean} status
   */
  setIsWinner(status) {
    this.isWinner = status;
  }
  /**
   * sets the postion the player placed in the game
   * @param {number} placed
   */
  setPlaced(placed) {
    this.placed = placed;
  }
}
module.exports = Player;
