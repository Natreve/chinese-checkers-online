// jshint esversion: 8

/**
 *
 * @author Andrew Gray <contact@andrewgray.dev>
 * @version 1.0
 * @copyright 2020 ©
 *
 * Represents a chinese checkers board
 * @param {object} - The html canvas object
 * @param {number} - The number of players for the current game
 */
import Piece from "./Piece.js";
class Board {
  constructor(canvas, nPlayers) {
    if (!canvas || !nPlayers) return;

    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.history = []; //players move history
    this.playablePos = {}; //position of every playable locations on the board
    this.config = {
      width: canvas.width,
      height: canvas.height,
      radius: ~~(canvas.width / 31), // The radius of the node points(holes on the board)
      background: "#E1BC8B",
      activeColor: "#000",
      scale: 25,
      players: {
        red: {
          id: "red",
          pos: 1,
          color: "#F55145",
          area: { x: 0, y: 0, offset: 6.15 },
        },
        yellow: {
          id: "yellow",
          pos: 2,
          color: "#FFEC41",
          area: { x: 4.38, y: 4, offset: 0 },
        },
        blue: {
          id: "blue",
          pos: 3,
          color: "#2597F3",
          area: { x: 4.38, y: 9, offset: 0 },
        },
        green: {
          id: "green",
          pos: 4,
          color: "#45FF41",
          area: { x: 0, y: 13, offset: 6.15 },
        },
        black: {
          id: "black",
          pos: 5,
          color: "#505457",
          area: { x: -4.6, y: 9, offset: 0 },
        },
        white: {
          id: "white",
          pos: 6,
          color: "#F5F5F5",
          area: { x: -4.6, y: 4, offset: 0 },
        },
      },
    };

    this.init(nPlayers);
  }
  /**
   *
   * @param {Number} nPlayers - The number of players that will join the game.
   */
  init(nPlayers) {
    this.gameState = {
      selectedPiece: null,
      currentPlayerID: null,
      currentPlayerMoved: false,
      turnOrder: [],
      posOrder: ["red", "yellow", "blue", "green", "black", "white"],
    };

    this.drawBoard();
    this.drawPlayerBases();
    this.initPlayers(nPlayers);
    this.initGameEvents();
  }
  /**
   * The drawBoard() method draws each individual playable node points accross a x/y axis.
   */
  drawBoard() {
    /**
     * The number of playable positions accross the x-axis where the y-axis is represented by the array index.
     * Ane xample of this would be that, at index 2(y-axis:2) there are 3 playable positions at x-axis:1, x-axis:2, x-axis:3.
     */

    [1, 2, 3, 4, 13, 12, 11, 10, 9, 10, 11, 12, 13, 4, 3, 2, 1].forEach(
      (nNodes, ny) => {
        this.calcXYpos(nNodes, ny, (x, y, _x, _y) => {
          let id = this.getNodeID(_x, _y);
          this.playablePos[id] = { x: x, y: y, id: id, _x: _x, _y: _y };
          this.drawCircle(x, y);
        });
      }
    );
  }
  /**
   * The drawPlayerBases() method draws a triangle at each player starting points to represent the players home base.
   */
  drawPlayerBases() {
    //RED BASE
    this.calcTrianglePos(141, 110, 118, false, (pos) => {
      this.drawTriangle(...pos, "rgba(245, 81, 69, 0.5)");
    });
    //YELLOW BASE
    this.calcTrianglePos(280, 135, 118, true, (pos) => {
      this.drawTriangle(...pos, "rgba(255, 236, 65, 0.5)");
    });
    //BLUE BASE
    this.calcTrianglePos(281, 392, 118, false, (pos) => {
      this.drawTriangle(...pos, "rgba(37, 151, 243, 0.5)");
    });
    //Green BASE
    this.calcTrianglePos(141, 410, 118, true, (pos) => {
      this.drawTriangle(...pos, "rgba(69, 255, 65, 0.5)");
    });
    //BLACK BASE
    this.calcTrianglePos(1, 389, 118, false, (pos) => {
      this.drawTriangle(...pos, "rgba(80, 84, 87, 0.5)");
    });
    //WHITE BASE
    this.calcTrianglePos(1, 135, 118, true, (pos) => {
      this.drawTriangle(...pos, "rgba(245, 245, 245, 0.5)");
    });
  }
  /**
   * Clears and redraws the canvas evertime a player moves a piece
   *
   * @param {Piece} piece - The selected location that the player piece will be moved to. Might need to change the name 😆
   */

  async updateBoard(piece) {
    this.ctx.clearRect(0, 0, this.config.width, this.config.height);
    let nodes = this.playablePos;

    this.drawPlayerBases();
    for (let node in nodes) {
      if (nodes[node].player) {
        new Piece(
          nodes[node].player,
          this.ctx,
          nodes[node].x,
          nodes[node].y,
          this.config.radius,
          nodes[node].player.color
        );
      } else {
        this.drawCircle(nodes[node].x, nodes[node].y);
      }
    }

    if (piece) this.setSelected(piece);
  }
  /**
   * This method initialises the starting positions of each player pieces on the game board, this method is called after the board has been drawn
   * @param {number} nPlayers -The number of players who will play the game
   */
  initPlayers(nPlayers) {
    let playOrder = [];
    if (nPlayers === 2) playOrder = [1, 4];
    else if (nPlayers === 3) playOrder = [6, 2, 4];
    else if (nPlayers === 4) playOrder = [6, 2, 3, 5];
    else if (nPlayers === 6) playOrder = [1, 2, 3, 4, 5, 6];
    else return;
    let nNodes = []; // Number of nodes on the x-axis where the position in the array represents a y-axis position that will be calculated.
    playOrder.forEach((pos, index) => {
      const playerID = this.gameState.posOrder[pos - 1];
      const player = this.config.players[playerID];
      if (index === 0) this.gameState.currentPlayerID = playerID; //sets the current player ID
      this.gameState.turnOrder.push(playerID); // sets the game turn order
      //Checks the players position to determine if the triangle area where the player pieces are, is rightsideup or upsidedown
      if (player.pos % 2 !== 0) nNodes = [1, 2, 3, 4];
      else nNodes = [4, 3, 2, 1];
      nNodes.forEach((nx, y) => {
        if (player.pos === 1 || player.pos === 4) {
          this.calcPlayerXYpos(nx, y + player.area.y, 1, (x, y, _x, _y) => {
            let id = this.getNodeID(_x, _y);
            let pId = playerID;
            this.playablePos[id].player = player;
            new Piece(pId, this.ctx, x, y, this.config.radius, player.color);
          });
        } else if (player.pos === 5 || player.pos === 6)
          this.calcPlayerXYpos(nx, y + player.area.y, 0, (x, y, _x, _y) => {
            let id = this.getNodeID(_x, _y);
            let pId = playerID;
            this.playablePos[id].player = player;
            new Piece(pId, this.ctx, x, y, this.config.radius, player.color);
          });
        else if (player.pos === 2 || player.pos === 3)
          this.calcPlayerXYpos(nx, y + player.area.y, 2, (x, y, _x, _y) => {
            let id = this.getNodeID(_x, _y);
            let pId = playerID;
            this.playablePos[id].player = player;
            new Piece(pId, this.ctx, x, y, this.config.radius, player.color);
          });
      });
    });
  }
  /**
   * initGameEvents() initialises all game event listeners in order to handle all player interaction with board and it's other connecting functions
   */
  initGameEvents() {
    let onBoardClick = this.onBoardClick.bind(this);
    this.canvas.addEventListener("click", onBoardClick, false);
  }
  /**
   * The onBoardClick handles a user clicking or touching an area on the board in order to check if they are allowed to perform a particular interaction such has move a piece.
   * @param {object} event - The document event object for the canvas
   */
  onBoardClick(event) {
    const currentPlayer = this.gameState.currentPlayerID;
    const pos = { x: event.offsetX, y: event.offsetY };
    const selectedPos = this.isPlayable(pos); //checks if the location clicked is a playable position
    const playerMoved = this.gameState.currentPlayerMoved;
    const selectedPiece = this.gameState.selectedPiece;

    if (selectedPos) {
      if (selectedPos.player) {
        if (selectedPos.player.id === currentPlayer && !playerMoved) {
          this.setSelected(selectedPos);
        }
      } else if (selectedPiece) {
        this.move(selectedPiece, selectedPos);
      }
    }
  }
  //Moves the current piece back to the previous position and re-renders board
  undoMove() {
    if (this.history.length < 1) return;
    const id = this.history.pop();
    const prevPos = this.playablePos[id];
    const selectedPiece = this.gameState.selectedPiece;
    console.log([prevPos, selectedPiece]);

    this.playablePos[prevPos.id].player = selectedPiece.player;
    delete this.playablePos[selectedPiece.id].player; // removed the previous position
    this.updateBoard(prevPos);
  }
  endTurn() {
    return new Promise((resolve, reject) => {
      this.history = [];
      this.gameState.currentPlayerMoved = false;
      this.nextPlayer();
      resolve(this.gameState.currentPlayerID);
    });
  }
  /**
   * Checks if clicked area is the current player piece, empty gameboard area or another players piece. If it's an area outside the board playable area it returns null.
   * @param {object} - the pos object contains the x and y position of the area a user clicked
   */

  isPlayable(pos) {
    let radius = this.config.radius;

    for (let ID in this.playablePos) {
      let piece = this.playablePos[ID];
      let result = Math.sqrt((pos.x - piece.x) ** 2 + (pos.y - piece.y) ** 2);
      if (result < radius) return piece;
    }
    return null;
  }
  /**
   * Sets the clicked player piece to an active state by drawing a stroke around it.
   * @param {Piece} piece - The player's currently selected  game piece
   */
  setSelected(piece) {
    this.clearSelectedPiece();
    this.gameState.selectedPiece = piece;
    this.drawStroke(piece.x, piece.y);
  }
  /**
   * Moves the user game piece to the new location and then updates the game board, it also checks to see if the move is valid.
   * @param {object} moveTo - The players selected area to move selected piece.
   * @param {object} moveFrom -  The players currently selected game piece area.
   */
  move(moveFrom, moveTo) {
    if (!moveTo) return;
    let xMoveBy = Math.abs(moveTo._x - moveFrom._x);
    let yMoveBy = Math.abs(moveTo._y - moveFrom._y);

    //chain move allowed
    if (this.gameState.currentPlayerMoved) {
      //prevents use from moving backwards without triggering the undo action or going around in circles 😆
      if (
        this.history[this.history.length - 1] === moveTo.id ||
        this.history[0] === moveTo.id
      )
        return;
      let moveX = moveFrom._x + (moveTo._x - moveFrom._x) / 2;
      let moveY = moveFrom._y + (moveTo._y - moveFrom._y) / 2;
      let id = this.getNodeID(moveX, moveY);

      //Double move left/right acceptable
      if (
        (xMoveBy === 4 && yMoveBy === 0) ||
        (xMoveBy === 2 && yMoveBy === 2)
      ) {
        if (!this.playablePos[id]) return;
        if (this.playablePos[id].player) {
          this.playablePos[moveTo.id].player = moveFrom.player;
          this.history.push(moveFrom.id); // adds player previous location to history move history
          delete this.playablePos[moveFrom.id].player; // removed the previous position
          this.updateBoard(moveTo);
        }
      }

      return;
    }

    if (
      (xMoveBy === 1 && yMoveBy === 1) ||
      (xMoveBy === 1 && yMoveBy === 0) ||
      (xMoveBy === 2 && yMoveBy === 0)
    ) {
      // single moves allowed
      this.playablePos[moveTo.id].player = moveFrom.player;
      this.history.push(moveFrom.id); // adds player previous location to history move history
      this.gameState.currentPlayerMoved = true; // the current player moved
      delete this.playablePos[moveFrom.id].player;
      this.updateBoard(moveTo);
    }
    //hop moves allowed
    else if (
      (xMoveBy === 2 && yMoveBy === 2) ||
      (xMoveBy === 4 && yMoveBy === 0)
    ) {
      let moveX = moveFrom._x + (moveTo._x - moveFrom._x) / 2;
      let moveY = moveFrom._y + (moveTo._y - moveFrom._y) / 2;
      let id = this.getNodeID(moveX, moveY);

      if (this.playablePos[id].player) {
        this.playablePos[moveTo.id].player = moveFrom.player;
        this.history.push(moveFrom.id); // adds player previous location to history move history
        this.gameState.currentPlayerMoved = true; // the current player moved
        delete this.playablePos[moveFrom.id].player; // removed the previous position
        this.updateBoard(moveTo);
      }
    }
  }
  /**
   * Clears the selected player piece when they click the cancel selection button and updates the game board
   */
  clearSelectedPiece() {
    const selectedPiece = this.gameState.selectedPiece;
    if (selectedPiece) this.gameState.selectedPiece = null;
    this.updateBoard();
  }
  /**
   * Ends the current players, turn, clear any previous player selection and moves to the next player
   */
  nextPlayer() {
    let currentPlayer = this.gameState.currentPlayerID;
    let turnOrder = this.gameState.turnOrder;
    let currentPlayerIndex = this.config.players[currentPlayer].pos;
    let nextPlayerIndex = currentPlayerIndex;

    if (turnOrder[nextPlayerIndex]) {
      this.gameState.currentPlayerID = turnOrder[nextPlayerIndex];
    } else {
      this.gameState.currentPlayerID = this.gameState.turnOrder[0]; //"red"
    }

    this.clearSelectedPiece();
  }

  /**
   * Draws a circle with a fill color.
   * @param {number} x - x position
   * @param {number} y - y poistion
   * @param {string} color - circle fill color
   */
  drawCircle(x, y, color = "#D0A984") {
    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.config.radius, 0, 2 * Math.PI);
    this.ctx.clip();
    this.ctx.fill();

    this.ctx.shadowColor = "rgba(0,0,0,.25)";
    this.ctx.shadowBlur = 4;
    this.ctx.shadowOffsetY = 4;
    this.ctx.stroke();
    this.ctx.restore();
  }
  /**
   * Draws a circular stroke.
   * @param {number} x - x position
   * @param {number} y - y poistion
   * @param {string} color - stroke color
   */
  drawStroke(x, y, color) {
    const radius = this.config.radius;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.strokeStyle = color ? color : this.config.activeColor;
    this.ctx.stroke();
  }
  /**
   * Draws a triangle with a fill color
   * @param {number} x1 - x position for first point of the triangle
   * @param {number} x2 - x position for second point of the triangle
   * @param {number} x3 - x position for thrid point of the triangle
   * @param {number} y1 - y position for first point of the triangle
   * @param {number} y2 - y position for last point of the triangle
   * @param {string} color - fill color
   */
  drawTriangle(x1, x2, x3, y1, y2, color = "#FFCC00") {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y1);
    this.ctx.lineTo(x3, y2);
    this.ctx.closePath();

    // the outline
    // this.ctx.lineWidth = 1;
    // this.ctx.strokeStyle = "#666666";
    // this.ctx.stroke();
    // the fill color
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }
  /**
   * Performs a calculation to position the triangle on the game board while maintaining its size.
   * @param {number} moveX - Moves the triangle x amount of spaces on the x-axis
   * @param {number} moveY - Moves the triangle y amount of spaces on the y-axis
   * @param {number} width  - the lenght for the base of the triangle
   * @param {boolean} inverted - Whether the triangle is reverse or not
   */
  calcTrianglePos(moveX, moveY, width, inverted = false, callback) {
    const height = width * Math.cos(Math.PI / 6);
    let x1 = moveX;
    let x2 = width + moveX;
    let x3 = moveX + width / 2;
    let y1 = moveY;
    let y2 = moveY - height * (inverted ? -1 : 1);
    if (typeof callback === "function") callback([x1, x2, x3, y1, y2]);
  }

  /**
   * Calculates the X,Y position based on the number of points(nodes) on the X-axis(n),
   * Y-axis(ny). The _x and _y are whole number points that will be used to calculate movement.
   * @param {number} n  - Number of nodes on the x-axis
   * @param {number} ny - Where on on the y-axis the nodes a present
   * @param {Function} callback  - callback function to return the actual x, y coordinates on the board as well as the grid x, y positions such as x=1, y=2 instead of x=273.57363, y=374.384
   */
  calcXYpos(n, ny, callback) {
    let pad = 1.245;
    let adj = 15.5625;
    for (let i = 0; i < n; i++) {
      let x = 13 + 25 * (i + 6) * pad - (n > 1 ? adj * (n - 1) : 0);
      let y = 13 + 25 * ny * pad;
      let _x = 14 - n + (i + i);
      if (typeof callback === "function") callback(x, y, _x, ny);
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
  calcPlayerXYpos(nn, ny, sp, callback) {
    let pad = 1.245;
    let adj = 15.5625;
    // let s = sp * (13 - nn);
    for (let i = 0; i < nn; i++) {
      let x = 0;
      let y = 13 + 25 * ny * pad;
      let _x = 0;
      if (sp === 0) {
        x = 13 + 25 * (nn - i + 0.5) * pad - (nn > 1 ? adj * (nn - 1) : 0);
        _x = 4 - nn + (i + i) + 1;
        // s = 0 * (13 - nn);
        // x = 13 + 25 * (i + 6) * pad - adj * (13 - 1) + 31.13 * s;
      } else if (sp === 1) {
        x = 13 + 25 * (i + 6) * pad - (nn > 1 ? adj * (nn - 1) : 0);
        _x = 14 - nn + (i + i);
      } else if (sp === 2) {
        x = 13 + 25 * (nn - i + 9.5) * pad - (nn > 1 ? adj * (nn - 1) : 0);
        _x = 20 - nn + (i + i) + 3;
        // s = 1 * (13 - nn);
        // x = 13 + 25 * (i + 6) * pad - adj * (13 - 1) + 31.13 * s;
      }
      if (typeof callback === "function") callback(x, y, _x, ny);
    }
  }

  /**
   * Creates a position ID for each playable area by combining the x and y and rounded to a whole number. this enables queryable positions on the canvas
   * @param {number} x - x position
   * @param {number} y - y position
   */
  getNodeID(x, y) {
    return `${x.toFixed(0)}:${y.toFixed(0)}`;
  }
}

export default Board;
