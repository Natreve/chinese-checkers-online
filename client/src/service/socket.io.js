import io from "socket.io-client";

const socket = io("http://localhost:3000");
/**
 * Creates a new game with the host configurations and returns a game url to be shared
 * @param {object} config - A object that contains. Host player, nPlayers, which is the number of players and the game options such as play time
 */
function createGame(config, cb) {
  socket.emit("createGame", config, (data) => {
    if (typeof cb === "function") cb(data);
  });
}

function joinGame(data, cb) {
  socket.emit("joinGame", data, (room) => {
    if (typeof cb === "function") cb(room);
  });
}
function leaveGame(data) {
  socket.emit("leaveGame", data);
}
function playerMove(data) {
  socket.emit("playerMove", data);
}
function opponentMove(cb) {
  socket.on("opponentMove", (data) => {
    if (typeof cb === "function") cb(data);
  });
}
export default socket;
export { createGame, joinGame, leaveGame, playerMove, opponentMove };
