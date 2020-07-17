const functions = require("firebase-functions");
const app = require("express")();
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
const Game = require("./classes/Game");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chinese-checkers-io.firebaseio.com",
});

const firestore = admin.firestore();
const database = admin.database();
const gamesRef = firestore.collection("games");

let gamesList = {}; //Stores a list of all created games, Note: list items should be deleted 8-12 hours after being created
let playerList = {}; //Stores a list of all the players that join a game, this is used to resend the game data to reconnecting player
//function to check if a object is empty
const isEmpty = function (obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.set("Access-Control-Allow-Origin", "http://localhost:8000");
  res.set(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.set("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  res.set("Access-Control-Allow-Credentials", true);
  next();
});

app.post("/", (req, res) => {
  const user = req.body.user;
  const action = req.body.action;
  if (action === "joinGame" && user) {
    joinGame(user).then((gameID) => res.send({ gameID: gameID }));
  } else {
    res.send({ msg: "Invalid action" });
  }
});

async function joinGame(player) {
  //Player not on the current list of players, add them to it in order to assign them to a game
  if (!playerList[player.uid]) playerList[player.uid] = player;
  else if (playerList[player.uid].gameID) {
    // Player already assigned to a game have them rejoin the same game by sending back the game ID
    return playerList[player.uid].gameID;
  }
  // no games are available create a new one, add the player to it and send back the game ID
  if (isEmpty(gamesList)) return await createGame(player);
  // Search for an available game for the player to join, add them to it and send back the game ID
  for (let id in gamesList) {
    const isPublic = gamesList[id].config.isPublic;
    const isFull = gamesList[id].isFull();
    if (isPublic && !isFull) {
      //adds the player to the currently selected game in the list
      gamesList[id].add(player);
      // add the game id to the player object in the list
      playerList[player.uid].gameID = id;
      //if the game is full after adding player start the game and updates the game document to so players can start playing
      if (gamesList[id].isFull()) {
        gamesList[id].start();
        await firestore.collection("games").doc(id).set(gamesList[id].toJson());
      }

      //return the game ID
      return id;
    }
  }
}
//creates a new game
async function createGame(player) {
  const game = new Game(null, {
    playerLimit: 2,
    playerCount: 0,
    isPublic: true,
    status: "queued",
  });
  game.add(player);
  const gameDoc = await firestore.collection("games").add(game.toJson());
  game.id = gameDoc.id;
  gamesList[gameDoc.id] = game;
  playerList[player.uid].gameID = gameDoc.id;
  return game.id;
}
//ToDo: a function th keep track of the players online and offline status in order to notify players within the current game when a player disconnects or reconnects

// exports.onUserStatusChanged = functions.database
//   .ref("/status/{uid}")
//   .onUpdate(async (change, context) => {
//     const eventStatus = change.after.val();
//     // console.log("uid", context.params.uid);
//     // console.log("event status", eventStatus);
//   });
exports.app = functions.https.onRequest(app);
