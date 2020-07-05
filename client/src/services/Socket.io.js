import io from "socket.io-client"
import localforge from "localforage"
import User from "../classes/Users"
const socket = io("http://localhost:3000")

function createGame(data = {}, cb) {
  socket.emit("createGame", data).on("gameRoom", gameRoom => {
    if (typeof cb === "function") cb(gameRoom)
  })
}
async function joinGame(id, username, cb) {
  try {
    let user = await localforge.getItem("user")
    localforge.clear()
    if (user) {
      user.uid = id
      socket.emit("joinGame", user).on("game", game => {
        user.game = game
        localforge.setItem("user", user, (err, value) => cb(game))
      })
    } else {
      let user = new User(id, username, null)

      socket.emit("joinGame", user).on("game", game => {
        user.updateGame(game)
        localforge.setItem("user", user, (err, value) => cb(game))
      })
    }
    return
  } catch (error) {
    console.log(error)
  }

  // socket.emit("joinGame", data).on("gameRoom", gameRoom => {
  //   if (typeof cb === "function") cb(gameRoom)
  // })
}
function leaveGame(data) {
  socket.emit("leaveGame", data)
}
function movePiece(data) {
  socket.emit("movePiece", data)
}
function opponentMovedPiece(cb) {
  socket.on("opponentMove", data => {
    if (typeof cb === "function") cb(data)
  })
}

// export default socket
export {
  socket,
  createGame,
  joinGame,
  leaveGame,
  movePiece,
  opponentMovedPiece,
}
