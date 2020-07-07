const Express = require("express")();
const Http = require("http").Server(Express);
const io = require("socket.io")(Http);
const Game = require("./classes/Game");

let games = {};
/**
 * Adds a isEmpty function to objects in order to test if a object such as games has any available game in it
 */
Object.prototype.isEmpty = function () {
  for (var key in this) {
    if (this.hasOwnProperty(key)) return false;
  }
  return true;
};

io.on("connection", (socket) => {
  console.log("A User connected");

  //creates a new game when a user requests it and then sets the gameID so it can be accessed when user disconnects
  socket.on("createGame", (player) => {
    console.log(player.username, "create game");
    socket.player = player;
    // createGame(socket, player, (gameID) => (_gameID = gameID));
  });

  socket.on("joinGame", (player) => {
    console.log(player.username, "attempting to join game");
    socket.player = player;
    joinGame(io, socket, (gameID) => (socket.player.gameID = gameID));
  });
  socket.on("disconnect", () => {
    if (socket.player) leaveGame(socket);
    else console.log("A user disconnected");
  });
});

Http.listen(3000, () => {
  console.clear();
  console.log("Listening on port *:3000");
});
/**
 * If the games list is empty go ahead and create a game with the first ID generated
 * else loop until a unique game ID not present in the games list is generated
 *  @param {SocketIO.Socket} socket A socket IO socket
 *  @param {object} user A connected user object that contains a username, uid, config and optional gameID. The config object consists of a playerLimit:Number, isPublic:Boolean and status:[queued,started,ended] if none is provided defualt values are [random, true, queued]
 */
function createGame(socket, cb) {
  /**
   * This just addes a function called random to all javascript objects, this function basically picks a random index within an array
   */
  Object.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
  };
  console.log(socket.player.username, "attepting to create game...");

  const config = socket.player.config || {
    playerLimit: [2, 3, 4, 6].random(),
    isPublic: true,
    status: "queued",
  };
  if (games.isEmpty()) {
    const id = Math.random().toString(36).substring(2);
    console.log(socket.player.username, "Create a public game");

    games[id] = new Game(id, socket.player, config);
    socket.join(id); // the current connected player socket joins the game
    socket.emit("game", games[id]); // sends the game object to the host
    cb(id); //returns the game id via callback for the current connected client for later use such as disconnection
  } else {
    while (true) {
      const id = Math.random().toString(36).substring(2);
      if (!games[id]) {
        console.log(socket.player.username, "Create a public game");
        //A game in the games list doesn't have this id
        games[id] = new Game(id, socket.player, config);
        socket.join(id);
        socket.emit("game", games[id]);
        cb(id);
        break; // don't want an infinite loop now do we 😄
      }
    }
  }
}
/**
 * @param {SocketIO.Server} io
 * @param {SocketIO.Socket} socket
 * @param {object} user
 * @param {Function} cb
 */
function joinGame(io, socket, cb) {
  //If there are no games to join create one

  if (games.isEmpty()) {
    console.log("No game available...");

    createGame(socket, (gameID) => cb(gameID));
    return true;
  }
  if (socket.player.gameID) {
    const gameID = socket.player.gameID;
    console.log("Attempting to re-join game...");

    // If the gameID is true, connect the user to the specified game if it is still queued or started and not full
    // and notify the other players that the user has reconnected or joined the game

    // check if game is no longer available
    if (!games[gameID]) {
      console.log("Game no longer available");

      socket.emit("denied", { reason: "Game no longer available" });
      cb(null);
      return false;
    }
    //check if game has already ended
    if (games[gameID].config.status === "ended") {
      console.log("Game as already ended");
      socket.emit("denied", { reason: "Game has already ended" });
      cb(null);
      return false;
    }
    //check if player is apart of this game
    games[gameID].players.filter((player, index) => {
      if (player.uid === socket.player.uid) {
        console.log(socket.player.username, "re-joined the game");
        games[gameID].players[index].setOnline(true);
        socket.broadcast
          .to(gameID)
          .emit("player re-join game", { player: username });
        socket.emit("game", games[gameID]); //send the reconnected player the game
        cb(gameID);
        return true;
      }
    });
    //if the player wasn't apart of the game previously, check if the game is not full
    // if (!games[gameID].isFull()) {
    //   //if the game isn't full add the player and check if the game is full after, if it is start the game
    //   games[gameID].add(socket.player);
    //   socket.join(gameID);
    //   if (games[gameID].isFull()) {
    //     games[gameID].start();
    //     io.to(gameID).emit("game", games[gameID]); // notifies all players in the current game that the game has started
    //     cb(gameID);
    //     return true;
    //   } else {
    //     socket.emit("game", games[gameID]); // send the connected player the game
    //     cb(gameID);
    //     return true;
    //   }
    // }
  } else {
    // No game ID was presented so join a available public game
    console.log("Attempting to join a public game...");
    for (let id in games) {
      if (games[id].config.isPublic && !games[id].isFull()) {
        console.log(socket.player.username, "Joined a public game");
        games[id].add(socket.player);
        socket.join(id);
        if (games[id].isFull()) {
          games[id].start();
          io.to(id).emit("game", games[id]);
          cb(id);
          return true;
        } else {
          socket.emit("game", games[id]);
          cb(id);
          return true;
        }
        
      }
    }
    
  }
}
/**
 *
 * @param {SocketIO.Socket} socket
 * @param {string} gameID
 * @param {object} player
 * @param {Function} cb
 */
function leaveGame(socket, cb) {
  const game = games[socket.player.gameID];
  const gameID = socket.player.gameID;
  console.log(`${socket.player.username} disconnected`);
  //check if this game exsist
  if (game) {
    //check if this game has players
    if (game.config.playerCount > 0) {
      //check if this game has started, if it has started, remove the player and notify the other players also set the disconnected players online status to false
      if (game.config.status === "started") {
        socket.leave(gameID);
        games.players.filter((player, index) => {
          if (player.uid !== socket.player.uid) {
            games.players[index].setOnline(false);
            return true;
          }
        });
        socket.broadcast
          .to(gameID)
          .emit("player left", { player: socket.player.username });
      } else {
        //remove the disconnected player from the players queued list
        socket.leave(gameID);
        game.remove(socket.player.uid);
      }
    }
    console.log(game);
  }
}

