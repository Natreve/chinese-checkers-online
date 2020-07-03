const Express = require("express")();
const Http = require("http").Server(Express);
const io = require("socket.io")(Http);
let gameRooms = {};
io.on("connection", (socket) => {
  console.log("Client Connected");
  socket.on("disconnect", () => console.log("client disconnected"));
  socket.on("joinGame", (player) => {
      
  });
  //   socket.on("createGame", (id,config) => createGame(config));
});
Http.listen(3000, () => {
  console.clear();
  console.log("Listening on port *:3000");
});
function joinGame(player, host) {
  console.log(player);
}

// function createGame(config) {
//   while (true) {
//     const gameID = Math.random().toString(36).substring(2);
//     if (!gameRooms[gameID]) {
//       const gameRoom = io.of(`/${gameID}`);
//       gameRooms[gameID] = { public: false, config: config, gameID: gameID };

//       gameRoom.on("connection", (socket) => {
//         console.log(`Player joined room/${roomID}`);
//       });
//       gameRoom.emit("waiting on other player!");
//       return gameRooms[gameID];
//     }
//   }
// }
