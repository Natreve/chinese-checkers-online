class User {
  constructor(uid, username, game) {
    this.uid = uid
    this.username = username
    this.game = game
  }
  updateGame(game) {
    this.game = game
  }
  updateUid(uid) {
    this.uid = uid
  }
  updateUsername(username) {
    this.username = username
  }
}
export default User
