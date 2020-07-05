const Express = require("express")();
const Http = require("http").Server(Express);
const io = require("socket.io")(Http);
const Game = require("./classes/Game");
/**
 * Game represents all created games on the server
 * {id: "834hd3208", config:{playerLimit: 6, players:[], public:false}}
 */

let games = {};
/**
 * Adds a isEmpty function to objects in order to test if a object such as gameRooms has any rooms in it
 */
Object.prototype.isEmpty = function () {
  for (var key in this) {
    if (this.hasOwnProperty(key)) return false;
  }
  return true;
};
io.on("connection", (socket) => {
  console.log("client connected");
  let uName = "";
  let _gameID = null;
  socket.on("joinGame", ({ uid, username, gameID }) => {
    console.log( uid, username, gameID);
    
    uName = username;
    if (games.isEmpty()) {
      console.log(`${username} created a game`);

      // Create new public game & join it
      const host = { uid: uid, username: username };
      const config = {
        nPlayers: 2,
        isPublic: true,
      };

      createGame(host, config, (game) => {
        socket.join(game.id);
        socket.emit("game", game);
        _gameID = game.id;
      });
    } else if (gameID) {
      //Join game via ID
    } else {
      //Join public game
      console.log(`${username} joined game`);
      let publicGame = null;
      for (let id in games) {
        if (games[id].isPublic && !games[id].isFull()) {
          games[id].add({ uid: uid, username: username });
          _gameID = id;
          socket.join(id);

          if (games[id].isFull()) {
            games[id].status = "start";
            socket.broadcast.to(id).emit("game", games[id]);
          } else {
            games[id].status = "queued";
            socket.emit("game", games[id]);
          }
          publicGame = games[id];
        }
      }
      console.log(games);
      //There are no available public games so create one
      if (!publicGame) {
        console.log(`${username} created game`);
        const host = { uid: uid, username: username };
        const config = {
          nPlayers: 2,
          isPublic: true,
        };
        createGame(host, config, (game) => {
          socket.join(game.id);
          socket.emit("game", game);
          _gameID = game.id;
        });
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`${uName} disconnected`);
    //check if this game exsist
    if (games[_gameID]) {
      //check if this game has players
      if (games[_gameID].players) {
        //check if this game has started, if it has not started, remove the player
        if (games[_gameID].status !== "start") {
          //remove the disconnected player from the players list
          games[_gameID].players = games[_gameID].players.filter((player) => {
            player.uid !== socket.id;
          });
          //check if the players count is not equal to zero, if it is not reduce it by 1
          if (games[_gameID].playerCount !== 0) {
            games[_gameID].playerCount--;
          }
        }
      }
    }

    socket.leave(_gameID);
    socket.broadcast.to(_gameID).emit("player left", { uid: socket.id });
  });
});
Http.listen(3000, () => {
  console.clear();
  console.log("Listening on port *:3000");
});
function createGame(host, config, cb) {
  while (true) {
    const id = Math.random().toString(36).substring(2);
    if (!games[id]) {
      games[id] = new Game(id, host, config);
      cb(games[id]);
      break;
    }
  }
}
