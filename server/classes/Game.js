const Player = require("./Player");

/**
 * This just adds a function called random to all javascript objects, this function basically picks a random index within an array specifically to randomly choose the number of players in a game if it wasn't provided
 */
Object.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

class Game {
  /**
   *
   * @param {string} id A unique id for a new game.
   * @param {object} host The player that created the game, this parameter is optional
   * @param {object} config The configuration for the game which includes the *playerLimit*:number of players that can join the game, *isPublic*: whether the game can be joined by anyone looking for a game or via a generated link, *status*: Whether the game as started, ended or queued by players
   */
  constructor(id, host, { playerLimit, isPublic, status }) {
    this.id = id;
    this.host = host;
    this.players = host ? [host] : [];
    this.config = {
      playerLimit: playerLimit,
      playerCount: 1,
      isPublic: isPublic,
      status: status,
    };

    this.state = {
      history: [], //the current players move history for their current turn
      playablePos: {}, //Position of every playable locations on the board
      currentPlayerTurn: null, //The ID of the current players turn
      currenPlayerMoved: false, //keeps track of whether the current player moved a piece
      turnOrder: [], // Which players goes first, second, etc
      zones: [0, 0, 0, 0, 0, 0], // The amount of player pieces within their destination zone
    };
  }
  //adds a player to the game
  add(player) {
    if (this.isFull()) return this.updateStatus("started");

    this.players.push(player);
    this.config.playerCount++;
  }
  //removes a player from the game based on their uid
  remove(uid) {
    this.players = this.players.filter((player) => player.uid !== uid);
    if (this.config.playerCount !== 0) this.config.playerCount--;
  }

  //sets the status of the game: started, queued, ended
  updateStatus(status) {
    this.config.status = status;
    return false;
  }

  // checks if the game is full, this generally means the game has already started
  isFull() {
    if (this.config.playerLimit === this.config.playerCount) return true;
    else return false;
  }

  //Init the game states such has playable positions, player positions, etc
  start() {
    //game can't start unless the game is full
    if (!this.isFull()) return false;
    let turnOrder = []; // the turn order in terms of the index of each player position, example would be the player that goes third is at the third position on the board going clockwise
    let nNodes = []; // Number of nodes on the x-axis where the position in the array represents a y-axis position that will be calculated.
    //playerConfig is data for the player pieces location, color and homeZones in the game, this data is assigned to a player based on their turn order value
    let playerConfig = [
      { colorID: "red", homeZone: 4, color: "#F55145", x: 0, y: 0 },
      { colorID: "yellow", homeZone: 5, color: "#FFEC41", x: 0, y: 4 },
      { colorID: "blue", homeZone: 6, color: "#2597F3", x: 0, y: 9 },
      { colorID: "green", homeZone: 1, color: "#45FF41", x: 0, y: 13 },
      { colorID: "black", homeZone: 2, color: "#505457", x: 0, y: 9 },
      { colorID: "white", homeZone: 3, color: "#F5F5F5", x: 0, y: 4 },
    ];
    [1, 2, 3, 4, 13, 12, 11, 10, 9, 10, 11, 12, 13, 4, 3, 2, 1].forEach(
      (nNodes, y) => {
        for (let i = 0; i < nNodes; i++) {
          let x = 14 - nNodes + (i + i);
          let id = `${x.toFixed(0)}:${y.toFixed(0)}`;
          this.state.playablePos[id] = { id: id, x: x, y: y };
        }
      }
    );

    if (this.config.playerLimit === 2) turnOrder = [1, 4];
    else if (this.config.playerLimit === 3) turnOrder = [6, 2, 4];
    else if (this.config.playerLimit === 4) turnOrder = [6, 2, 3, 5];
    else if (this.config.playerLimit === 6) turnOrder = [1, 2, 3, 4, 5, 6];
    else return;

    //using the turn order to add each player piece to a playable position
    turnOrder.forEach((pos, index) => {
      const _player = this.players[index];
      _player.pos = pos; // sets the player position on the board clockwise based on their turn order value

      //checks player position to determine if player piece are rightsideup or upsidedown
      if (_player.pos % 2 !== 0) {
        nNodes = [1, 2, 3, 4];
      } else {
        nNodes = [4, 3, 2, 1];
      }

      nNodes.forEach((nx, y) => {
        if (_player.pos === 1 || _player.pos === 4) {
          const player = new Player(
            _player.uid,
            _player.username,
            pos,
            playerConfig[pos - 1]
          );

          this.players[index] = player;
          this._calcPlayerXYpos(nx, y + player.area.y, 1, (x, y) => {
            let id = `${x.toFixed(0)}:${y.toFixed(0)}`;
            this.state.playablePos[id].player = player;
            this.state.zones[player.pos - 1]++;
            this.state.playablePos[id].zone = player.pos;
          });
        } else if (_player.pos === 5 || _player.pos === 6) {
          const player = new Player(
            _player.uid,
            _player.username,
            pos,
            playerConfig[pos - 1]
          );
          this.players[index] = player;
          this._calcPlayerXYpos(nx, y + player.area.y, 0, (x, y) => {
            let id = `${x.toFixed(0)}:${y.toFixed(0)}`;
            this.state.playablePos[id].player = player;
            this.state.zones[player.pos - 1]++;
            this.state.playablePos[id].zone = player.pos;
          });
        } else if (_player.pos === 2 || _player.pos === 3) {
          const player = new Player(
            _player.uid,
            _player.username,
            pos,
            playerConfig[pos - 1]
          );
          this.players[index] = player;
          this._calcPlayerXYpos(nx, y + player.area.y, 2, (x, y) => {
            let id = `${x.toFixed(0)}:${y.toFixed(0)}`;
            this.state.playablePos[id].player = player;
            this.state.zones[player.pos - 1]++;
            this.state.playablePos[id].zone = player.pos;
          });
        }
      });
      if (index === 0) {
        this.state.currentPlayerTurn = _player;
      }
      this.state.turnOrder.push(_player);
      this.config.status = "started";
    });
  }
  /**
   * TODO
   * Implement the clean up function
   */
  // signals the game has ended and cleans up the game object
  end() {}
  //EVENT HANDLERS
  onPlayerMove(from, to) {
    if (!to) {
      console.log("Invalid move to location");
      return false;
    }
    let xMoveBy = Math.abs(to.x - from.x);
    let yMoveBy = Math.abs(to.y, -from.y);

    //If current player already moved, check if they can chain another move
    if (this.state.currenPlayerMoved) {
      //prevent player from moving backwards without using undo action as well as to spor player from going around in circles
      if (
        this.state.history[this.state.history.length - 1] === to.id ||
        this.state.history[0] === to.id
      ) {
        console.log("Invalid move player can't move backwards");
        return false;
      }
      let moveX = from.x + (to.x - from.x) / 2;
      let moveY = from.y + (to.y - from.y) / 2;
      let id = `${moveX.toFixed(0)}:${moveY.toFixed(0)}`;
      //Allow hoping move left/right if available
      if (
        (xMoveBy === 4 && yMoveBy === 0) ||
        (xMoveBy === 2 && yMoveBy === 2)
      ) {
        //check if player movement is a valid position
        if (!this.state.playablePos[id]) {
          console.log("Invalid hop to location");
          return false;
        }
        //check is position is a player piece that can be hopped
        if (this.state.playablePos[id].player) {
          this.state.playablePos[to.id].player = from.player;
          //check is the movement resulted in a player win
          this.winningMove(from, to);
          this.state.history.push(from.id);
          delete this.state.playablePos[from.id].player;
          console.log("valid hop move");

          return true;
        } else {
          console.log("Invalid hop move");

          return false;
        }
      }
      console.log("Valid Move");
      return true;
    }
    //Check if player made a valid move
    if (
      (xMoveBy === 1 && yMoveBy === 1) ||
      (xMoveBy === 1 && yMoveBy === 0) ||
      (xMoveBy === 2 && yMoveBy === 0)
    ) {
      this.state.playablePos[to.id].player = from.player;
      this.winningMove(from, to);
      this.state.history.push(from.id);
      this.state.currenPlayerMoved = true;
      delete this.state.playablePos[from.id].player;
      console.log("Valid player move");

      return true;
    } else if (
      (xMoveBy === 2 && yMoveBy === 2) ||
      (xMoveBy === 4 && yMoveBy === 0)
    ) {
      let moveX = from.x + (to.x - from.x) / 2;
      let moveY = from.y + (to.y - from.y) / 2;
      let id = `${moveX.toFixed(0)}:${moveY.toFixed(0)}`;

      if (this.state.playablePos[id].player) {
        this.state.playablePos[to.id].player = from.player;
        this.winningMove(from, to);
        this.state.history.push(from.id);
        this.state.currenPlayerMoved = true;
        delete this.state.playablePos[from.id].player;
        console.log("valid player move");
        return true;
      } else {
        console.log("Invalide player move");

        return false;
      }
    } else {
      console.log("Invalid move");
      return false;
    }
  }
  onPlayerTurnEnd() {
    this.state.history = [];
    this.state.currenPlayerMoved = false;
    this.nextPlayer();
    return this.state.currentPlayerTurn;
  }
  /**
   * TODO
   * Implement player undo function
   */
  onPlayerUndo() {}
  winningMove(from, to) {
    if (from.player.homeZone === to.zone && from.zone !== to.zone) {
      this.state.zones[from.player.homeZone - 1]++;
      if (this.state.zones[from.player.homeZone - 1] === 10) {
        return true; //player won the game
      }
    } else if (from.zone === from.player.homeZone && from.zone !== to.zone) {
      this.state.zones[from.player.homeZone - 1]--;
    } else if (from.zone === from.player.pos && from.zone !== to.zone) {
      this.state.zones[from.player.pos - 1]--;
    } else if (from.player.pos === to.zone && from.zone !== to.zone) {
      this.state.zones[from.player.pos - 1]++;
    }
  }
  nextPlayer() {
    let currentPlayer = this.state.currentPlayerTurn;
    let turnOrder = this.state.turnOrder;
    for (let index = 0; index < turnOrder.length; index++) {
      if (currentPlayer.uid === turnOrder[index].uid) {
        if (turnOrder[index + 1]) {
          this.state.currentPlayerTurn = turnOrder[index + 1];
        } else {
          this.state.currentPlayerTurn = this.state.turnOrder[0];
        }
        break;
      }
    }
  }
  /**
   * Calculates the X,Y position for the player pieces based on the
   * number of points(nodes) on the X axis(nn), Y axis(ny) and the start point(sp),
   * where 0:left,  1:center , 2:right.
   * @param {number} nn - Number of nodes on the x axis
   * @param {number} ny - Where on on the y-axis the nodes a present
   * @param {number} sp  - where the nodes start 0 being at the begining of the y-axis, 1 at the enter and 2 and the end.
   * @param {number} callback - callback function to return the actual x, y coordinates on the board.
   */
  _calcPlayerXYpos(nn, y, sp, cb) {
    for (let i = 0; i < nn; i++) {
      let x = 0;
      if (sp === 0) {
        x = 4 - nn + (i + i) + 1;
      } else if (sp === 1) {
        x = 14 - nn + (i + i);
      } else if (sp === 2) {
        x = 20 - nn + (i + i) + 3;
      }

      if (typeof cb === "function") cb(x, y);
    }
  }
}
module.exports = Game;
