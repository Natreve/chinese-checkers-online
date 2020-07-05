class Player {
  constructor(uid, username, game) {
    this.uid = uid
    this.username = username
    this.game = game
  }
  /**
   * @param {object} game
   */
  set updateGame(game) {
    this.game = game
  }
  /**
   * @param {String} uid
   */
  set updateUid(uid) {
    this.uid = uid
  }
  /**
   * @param {String} username
   */
  set updateUsername(username) {
    this.username = username
  }
}
module.exports = Player;
