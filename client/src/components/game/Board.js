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
import Piece from "./Piece.js"
import blop from "./audio/Blop.wav"
import click from "./audio/Click.wav"
class Board {
  constructor(canvas, nPlayers) {
    if (!canvas || !nPlayers) return

    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.players = []
    this.config = {
      nPlayers: nPlayers,
      space: 6, // This is used to determine the space between each node
      width: canvas.width,
      height: 0, // The height of the canvas is automatically generated based on the window size
      radius: 0, // The radius of the canvas is automatically generated based on the window size
      background: "#E1BC8B",
      activeColor: "#000",
      aspectRatio: 0, // The aspect ratio is automatically generated base on the window size
      audio: {
        clicked: new Audio(click),
        move: new Audio(blop),
      },
    }
    this.state = {
      selectedPiece: null, // the currently selected piece on the board
      history: [], //the current players move history for their current turn
      playablePos: {}, //Position of every playable locations on the board
      currentPlayerTurn: null, //The ID of the current players turn
      currentPlayerMoved: false, //keeps track of whether the current player moved a piece
      turnOrder: [], // Which players goes first, second, etc
      zones: [0, 0, 0, 0, 0, 0], // The amount of player pieces within their destination zone
    }

    this.init()
  }

  init() {
    //In order to make the canvas reponsive the following calculations have to be performed
    this.config.radius = (this.config.width - this.config.space * 12) / 13 / 2 //calculates the radius of each circle to be drawn evenly with space on the x-axis
    this.config.height = this.config.radius * 2 * 17 + this.config.space * 16 //calculates the height of the canvas based on the about of circles that be be drawn on the y-axis
    this.canvas.height = this.config.height //sets the canvas height to the calculated height
    this.config.aspectRatio = this.config.width / this.config.height
    // this.drawPlayerBases() //draw the game board player base triangle
    this.drawBoard() // draw the game board playable positions
    this.initPlayers() //draws the player pieces on the board
    this.initGameEvents() // initialise game event listener(s)
  }
  /**
   * This function should be called when the canvas is resized in order to recalculate all the positions on the board
   * @param {number} width The new width of the canvas use to calculate the new positions of the pieces on the board
   */
  resize(width) {
    //when resized redraw board to match new dimentions
    this.config.width = width
    this.config.radius = (this.config.width - this.config.space * 12) / 13 / 2
    this.config.height = this.config.radius * 2 * 17 + this.config.space * 16
    this.canvas.height = this.config.height //sets the canvas height
    this.config.aspectRatio = this.config.width / this.config.height
    ;[1, 2, 3, 4, 13, 12, 11, 10, 9, 10, 11, 12, 13, 4, 3, 2, 1].forEach(
      (nNodes, ny) => {
        this.calcXYpos(nNodes, ny, (x, y, _x, _y) => {
          let id = this.getNodeID(_x, _y)
          this.state.playablePos[id].x = x
          this.state.playablePos[id].y = y
          this.drawCircle(x, y) //draw the position node
          //if the position node has a player draw the new player piece
          if (this.state.playablePos[id].player) {
            new Piece(
              this.state.playablePos[id].player.name,
              this.ctx,
              this.state.playablePos[id].x,
              this.state.playablePos[id].y,
              this.config.radius,
              this.state.playablePos[id].player.color
            )
          }
          // this.state.playablePos[id] = { x: x, y: y, id: id, _x: _x, _y: _y };
        })
      }
    )
    //if a piece was selected on resized, reselect it
    if (this.state.selectedPiece) {
      this.setSelected(this.state.selectedPiece)
    }
  }
  /**
   * The drawBoard() method draws each individual playable node points accross a x/y axis.
   */
  drawBoard() {
    /**
     * The number of playable positions accross the x-axis where the y-axis is represented by the array index.
     * Ane xample of this would be that, at index 2(y-axis:2) there are 3 playable positions at x-axis:1, x-axis:2, x-axis:3.
     */

    ;[1, 2, 3, 4, 13, 12, 11, 10, 9, 10, 11, 12, 13, 4, 3, 2, 1].forEach(
      (nNodes, ny) => {
        this.calcXYpos(nNodes, ny, (x, y, _x, _y) => {
          let id = this.getNodeID(_x, _y)
          this.state.playablePos[id] = { x: x, y: y, id: id, _x: _x, _y: _y }
          this.drawCircle(x, y)
        })
      }
    )
  }
  /**
   * TODO: This needs to be reimplemented to scale along with the rest of the board
   * The drawPlayerBases() method draws a triangle at each player starting points to represent the players home base.
   */
  drawPlayerBases() {
    //RED BASE
    this.calcTrianglePos(141, 110, 118, false, pos => {
      this.drawTriangle(...pos, "rgba(245, 81, 69, 0.5)")
    })
    //YELLOW BASE
    this.calcTrianglePos(280, 135, 118, true, pos => {
      this.drawTriangle(...pos, "rgba(255, 236, 65, 0.5)")
    })
    //BLUE BASE
    this.calcTrianglePos(281, 392, 118, false, pos => {
      this.drawTriangle(...pos, "rgba(37, 151, 243, 0.5)")
    })
    //Green BASE
    this.calcTrianglePos(141, 410, 118, true, pos => {
      this.drawTriangle(...pos, "rgba(69, 255, 65, 0.5)")
    })
    //BLACK BASE
    this.calcTrianglePos(1, 389, 118, false, pos => {
      this.drawTriangle(...pos, "rgba(80, 84, 87, 0.5)")
    })
    //WHITE BASE
    this.calcTrianglePos(1, 135, 118, true, pos => {
      this.drawTriangle(...pos, "rgba(245, 245, 245, 0.5)")
    })
  }
  /**
   * Clears and redraws the canvas evertime a player moves a piece
   *
   * @param {Piece} piece - The selected location that the player piece will be moved to. Might need to change the name 😆
   */

  updateBoard(piece) {
    this.ctx.clearRect(0, 0, this.config.width, this.config.height)
    let nodes = this.state.playablePos

    // this.drawPlayerBases() TODO: Need to be reimplemented to scale with the board
    for (let node in nodes) {
      if (nodes[node].player) {
        new Piece(
          nodes[node].player,
          this.ctx,
          nodes[node].x,
          nodes[node].y,
          this.config.radius,
          nodes[node].player.color
        )
      } else {
        this.drawCircle(nodes[node].x, nodes[node].y)
      }
    }

    if (piece) this.setSelected(piece)
  }

  initPlayers() {
    let turnOrder = [] // the turn order in terms of the index of each player position, example would be the player that goes third is at the third position on the board going clockwise
    let nNodes = [] // Number of nodes on the x-axis where the position in the array represents a y-axis position that will be calculated.
    //playerConfig is data for the player pieces location, color and homeZones in the game, this data is assigned to a player based on their turn order value
    let playerConfig = [
      { colorID: "red", homeZone: 4, color: "#F55145", x: 0, y: 0 },
      { colorID: "yellow", homeZone: 5, color: "#FFEC41", x: 0, y: 4 },
      { colorID: "blue", homeZone: 6, color: "#2597F3", x: 0, y: 9 },
      { colorID: "green", homeZone: 1, color: "#45FF41", x: 0, y: 13 },
      { colorID: "black", homeZone: 2, color: "#505457", x: 0, y: 9 },
      { colorID: "white", homeZone: 3, color: "#F5F5F5", x: 0, y: 4 },
    ]

    if (this.config.nPlayers === 2) turnOrder = [1, 4]
    else if (this.config.nPlayers === 3) turnOrder = [6, 2, 4]
    else if (this.config.nPlayers === 4) turnOrder = [6, 2, 3, 5]
    else if (this.config.nPlayers === 6) turnOrder = [1, 2, 3, 4, 5, 6]
    else return false

    turnOrder.forEach((pos, index) => {
      this.players.push({ name: `Player ${index + 1}`, pos: pos })
      let player = this.players[index]
      if (player.pos % 2 !== 0) {
        nNodes = [1, 2, 3, 4]
      } else {
        nNodes = [4, 3, 2, 1]
      }
      nNodes.forEach((nx, y) => {
        if (player.pos === 1 || player.pos === 4) {
          Object.assign(player, playerConfig[pos - 1])

          this.calcPlayerXYpos(nx, y + player.y, 1, (x, y) => {
            let id = this.getNodeID(x, y)

            this.state.playablePos[id].player = player // add player piece to playable position
            this.state.zones[player.pos - 1]++ // increment player zone value
            this.state.playablePos[id].zone = player.pos //assign this area a zone #
            new Piece(
              player.name,
              this.ctx,
              this.state.playablePos[id].x,
              this.state.playablePos[id].y,
              this.config.radius,
              player.color
            )
          })
        } else if (player.pos === 5 || player.pos === 6) {
          Object.assign(player, playerConfig[pos - 1])

          this.calcPlayerXYpos(nx, y + player.y, 0, (x, y) => {
            let id = this.getNodeID(x, y)

            this.state.playablePos[id].player = player
            this.state.playablePos[id].player = player // add player piece to playable position
            this.state.zones[player.pos - 1]++ // increment player zone value
            this.state.playablePos[id].zone = player.pos //assign this area a zone #
            new Piece(
              player.name,
              this.ctx,
              this.state.playablePos[id].x,
              this.state.playablePos[id].y,
              this.config.radius,
              player.color
            )
          })
        } else if (player.pos === 2 || player.pos === 3) {
          Object.assign(player, playerConfig[pos - 1])
          this.calcPlayerXYpos(nx, y + player.y, 2, (x, y) => {
            let id = this.getNodeID(x, y)

            this.state.playablePos[id].player = player
            this.state.playablePos[id].player = player // add player piece to playable position
            this.state.zones[player.pos - 1]++ // increment player zone value
            this.state.playablePos[id].zone = player.pos //assign this area a zone #
            new Piece(
              player.name,
              this.ctx,
              this.state.playablePos[id].x,
              this.state.playablePos[id].y,
              this.config.radius,
              player.color
            )
          })
        }
      })
      if (index === 0) {
        this.state.currentPlayerTurn = player
      }
      this.state.turnOrder.push(player)
    })
  }
  // TO BE DELETED
  initHomeZones() {
    let nNodes = []
    let players = this.config.players

    for (let ID in players) {
      let player = players[ID]
      if (player.pos % 2 !== 0) nNodes = [1, 2, 3, 4]
      else nNodes = [4, 3, 2, 1]
      nNodes.forEach((nx, y) => {
        if (player.pos === 1 || player.pos === 4) {
          this.calcPlayerXYpos(nx, y + player.area.y, 1, (x, y, _x, _y) => {
            let id = this.getNodeID(_x, _y)
            //sets number of pieces within the zone that a player occupies
            if (this.state.playablePos[id].player) {
              this.gameState.zones[player.pos - 1] += 1
            }

            this.state.playablePos[id].zone = player.pos //assign a zone number to the current position in order to set rules for winning an piece entry
          })
        } else if (player.pos === 5 || player.pos === 6) {
          this.calcPlayerXYpos(nx, y + player.area.y, 0, (x, y, _x, _y) => {
            let id = this.getNodeID(_x, _y)
            //sets number of pieces within the zone that a player occupies
            if (this.state.playablePos[id].player) {
              this.gameState.zones[player.pos - 1] += 1
            }
            this.state.playablePos[id].zone = player.pos
          })
        } else if (player.pos === 2 || player.pos === 3) {
          this.calcPlayerXYpos(nx, y + player.area.y, 2, (x, y, _x, _y) => {
            let id = this.getNodeID(_x, _y)
            //sets number of pieces within the zone that a player occupies
            if (this.state.playablePos[id].player) {
              this.gameState.zones[player.pos - 1] += 1
            }
            this.state.playablePos[id].zone = player.pos
          })
        }
      })
    }
    console.log(this.gameState.zones)
  }

  /**
   * initGameEvents() initialises all game event listeners in order to handle all player interaction with board and it's other connecting functions
   */
  initGameEvents() {
    let onBoardClick = this.onBoardClick.bind(this)
    this.canvas.addEventListener("click", onBoardClick, false)
  }
  /**
   * The onBoardClick handles a user clicking or touching an area on the board in order to check if they are allowed to perform a particular interaction such has move a piece.
   * @param {object} event - The document event object for the canvas
   */
  onBoardClick(event) {
    const currentPlayer = this.state.currentPlayerTurn
    const pos = { x: event.offsetX, y: event.offsetY }
    const selectedPos = this.isPlayable(pos) //checks if the location clicked is a playable position
    const playerMoved = this.state.currentPlayerMoved
    const selectedPiece = this.state.selectedPiece

    if (selectedPos) {
      if (selectedPos.player) {
        if (selectedPos.player.name === currentPlayer.name && !playerMoved) {
          this.config.audio.move.play()
          this.setSelected(selectedPos)
        }
      } else if (selectedPiece) {
        this.move(selectedPiece, selectedPos)
      }
    }
  }
  //Moves the current piece back to the previous position and re-renders board
  undoMove() {
    if (this.state.history.length < 1) return
    const id = this.state.history.pop()
    const prevPos = this.state.playablePos[id]
    const selectedPiece = this.state.selectedPiece
    this.state.currentPlayerMoved = false
    this.state.playablePos[prevPos.id].player = selectedPiece.player
    delete this.state.playablePos[selectedPiece.id].player // removed the previous position
    this.updateBoard(prevPos)
    this.config.audio.clicked.pause()
    this.config.audio.clicked.currentTime = 0
    this.config.audio.clicked.play()
  }
  endTurn() {
    this.state.history = []
    this.state.currentPlayerMoved = false
    this.nextPlayer()
    return this.state.currentPlayerTurn
  }
  /**
   * Checks if clicked area is the current player piece, empty gameboard area or another players piece. If it's an area outside the board playable area it returns null.
   * @param {object} - the pos object contains the x and y position of the area a user clicked
   */

  isPlayable(pos) {
    let radius = this.config.radius

    for (let ID in this.state.playablePos) {
      let piece = this.state.playablePos[ID]
      let result = Math.sqrt((pos.x - piece.x) ** 2 + (pos.y - piece.y) ** 2)
      if (result < radius) return piece
    }
    return null
  }
  /**
   * Sets the clicked player piece to an active state by drawing a stroke around it.
   * @param {Piece} piece - The player's currently selected  game piece
   */
  setSelected(piece) {
    this.clearSelectedPiece()
    this.state.selectedPiece = piece

    this.drawStroke(piece.x, piece.y)
  }
  /**
   * Moves the user game piece to the new location and then updates the game board, it also checks to see if the move is valid.
   * @param {object} moveTo - The players selected area to move selected piece.
   * @param {object} moveFrom -  The players currently selected game piece area.
   */
  move(moveFrom, moveTo) {
    if (!moveTo) return false
    let xMoveBy = Math.abs(moveTo._x - moveFrom._x)
    let yMoveBy = Math.abs(moveTo._y - moveFrom._y)

    //chain move allowed
    if (this.state.currentPlayerMoved) {
      //prevents use from moving backwards without triggering the undo action or going around in circles 😆
      if (
        this.state.history[this.state.history.length - 1] === moveTo.id ||
        this.state.history[0] === moveTo.id
      )
        return false
      let moveX = moveFrom._x + (moveTo._x - moveFrom._x) / 2
      let moveY = moveFrom._y + (moveTo._y - moveFrom._y) / 2
      let id = this.getNodeID(moveX, moveY)

      //Double move left/right acceptable
      if (
        (xMoveBy === 4 && yMoveBy === 0) ||
        (xMoveBy === 2 && yMoveBy === 2)
      ) {
        if (!this.state.playablePos[id]) return false
        if (this.state.playablePos[id].player) {
          this.config.audio.clicked.pause()
          this.config.audio.clicked.currentTime = 0
          this.config.audio.clicked.play()
          this.state.playablePos[moveTo.id].player = moveFrom.player
          this.winningMove(moveFrom, moveTo)

          this.state.history.push(moveFrom.id) // adds player previous location to history move history
          delete this.state.playablePos[moveFrom.id].player // removed the previous position
          this.updateBoard(moveTo)
          return true
        }
      }

      return false
    }
    // single moves allowed
    if (
      (xMoveBy === 1 && yMoveBy === 1) ||
      (xMoveBy === 1 && yMoveBy === 0) ||
      (xMoveBy === 2 && yMoveBy === 0)
    ) {
      this.config.audio.clicked.pause()
      this.config.audio.clicked.currentTime = 0
      this.config.audio.clicked.play()
      this.state.playablePos[moveTo.id].player = moveFrom.player
      this.winningMove(moveFrom, moveTo)

      this.state.history.push(moveFrom.id) // adds player previous location to history move history
      this.state.currentPlayerMoved = true // the current player moved
      delete this.state.playablePos[moveFrom.id].player
      this.updateBoard(moveTo)
      return true
    }
    //hop moves allowed
    else if (
      (xMoveBy === 2 && yMoveBy === 2) ||
      (xMoveBy === 4 && yMoveBy === 0)
    ) {
      let moveX = moveFrom._x + (moveTo._x - moveFrom._x) / 2
      let moveY = moveFrom._y + (moveTo._y - moveFrom._y) / 2
      let id = this.getNodeID(moveX, moveY)

      if (this.state.playablePos[id].player) {
        this.config.audio.clicked.pause()
        this.config.audio.clicked.currentTime = 0
        this.config.audio.clicked.play()
        this.state.playablePos[moveTo.id].player = moveFrom.player
        this.winningMove(moveFrom, moveTo)

        this.state.history.push(moveFrom.id) // adds player previous location to history move history
        this.state.currentPlayerMoved = true // the current player moved
        delete this.state.playablePos[moveFrom.id].player // removed the previous position
        this.updateBoard(moveTo)
        return true
      }
    }
  }
  /**
   * Clears the selected player piece when they click the cancel selection button and updates the game board
   */
  clearSelectedPiece() {
    const selectedPiece = this.state.selectedPiece
    if (selectedPiece) this.state.selectedPiece = null
    this.updateBoard()
  }
  /**
   * Ends the current players, turn, clear any previous player selection and moves to the next player
   */
  nextPlayer() {
    let currentPlayer = this.state.currentPlayerTurn
    let turnOrder = this.state.turnOrder

    for (let index = 0; index < turnOrder.length; index++) {
      if (currentPlayer === turnOrder[index]) {
        if (turnOrder[index + 1]) {
          this.state.currentPlayerTurn = turnOrder[index + 1]
        } else {
          this.state.currentPlayerTurn = this.state.turnOrder[0]
        }
        break
      }
    }

    this.clearSelectedPiece()
  }
  /**
   * Checks to see if the player piece reached the destination home if it has, check to see if all home positions are filled and if filled player wins the game!
   *
   * @param {object} moveFrom - The position the player piece was moved from
   * @param {object} moveTo  - The position the player piece was moved to
   */
  winningMove(moveFrom, moveTo) {
    if (
      moveFrom.player.homeZone === moveTo.zone &&
      moveFrom.zone !== moveTo.zone
    ) {
      this.state.zones[moveFrom.player.homeZone - 1] += 1
      if (this.state.zones[moveFrom.player.homeZone - 1] === 10)
        alert(`${moveTo.player.id} player wins!`)
    } else if (
      moveFrom.zone === moveFrom.player.homeZone &&
      moveFrom.zone !== moveTo.zone
    ) {
      this.state.zones[moveFrom.player.homeZone - 1] -= 1
    } else if (
      moveFrom.zone === moveFrom.player.pos &&
      moveFrom.zone !== moveTo.zone
    ) {
      this.state.zones[moveFrom.player.pos - 1] -= 1
    } else if (
      moveFrom.player.pos === moveTo.zone &&
      moveFrom.zone !== moveTo.zone
    ) {
      this.state.zones[moveFrom.player.pos - 1] += 1
    }
  }
  /**
   * Draws a circle with a fill color.
   * @param {number} x - x position
   * @param {number} y - y poistion
   * @param {string} color - circle fill color
   */
  drawCircle(x, y, color = "#D0A984") {
    const radius = this.config.radius
    this.ctx.save()
    this.ctx.strokeStyle = color
    this.ctx.fillStyle = color
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI)
    this.ctx.clip()
    this.ctx.fill()

    this.ctx.shadowColor = "rgba(0,0,0,.25)"
    this.ctx.shadowBlur = 4
    this.ctx.shadowOffsetY = 4
    this.ctx.stroke()
    this.ctx.restore()
  }
  /**
   * Draws a circular stroke.
   * @param {number} x - x position
   * @param {number} y - y poistion
   * @param {string} color - stroke color
   */
  drawStroke(x, y, color) {
    const radius = this.config.radius
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI)
    this.ctx.strokeStyle = color ? color : this.config.activeColor
    this.ctx.stroke()
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
    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y1)
    this.ctx.lineTo(x3, y2)
    this.ctx.closePath()
    // the fill color
    this.ctx.fillStyle = color
    this.ctx.fill()
  }
  /**
   * Performs a calculation to position the triangle on the game board while maintaining its size.
   * @param {number} moveX - Moves the triangle x amount of spaces on the x-axis
   * @param {number} moveY - Moves the triangle y amount of spaces on the y-axis
   * @param {number} width  - the lenght for the base of the triangle
   * @param {boolean} inverted - Whether the triangle is reverse or not
   */
  calcTrianglePos(moveX, moveY, width, inverted = false, callback) {
    const height = width * Math.cos(Math.PI / 6)
    let x1 = moveX
    let x2 = width + moveX
    let x3 = moveX + width / 2
    let y1 = moveY
    let y2 = moveY - height * (inverted ? -1 : 1)
    if (typeof callback === "function") callback([x1, x2, x3, y1, y2])
  }

  /**
   * Calculates the X,Y position based on the number of points(nodes) on the X-axis(n),
   * Y-axis(ny). The _x and _y are whole number points that will be used to calculate movement.
   * @param {number} n  - Number of nodes on the x-axis
   * @param {number} ny - Where on on the y-axis the nodes a present
   * @param {Function} callback  - callback function to return the actual x, y coordinates on the board as well as the grid x, y positions such as x=1, y=2 instead of x=273.57363, y=374.384
   */
  calcXYpos(n, ny, cb) {
    const space = this.config.space
    const radius = this.config.radius
    const pad = Math.round(this.config.width / 13)

    for (let i = 1; i < n + 1; i++) {
      let adj = (-n + 13) / 2
      let x = radius * (2 * i - 1) + space * (i - 1) + pad * adj
      let y = radius * (2 * (ny + 1) - 1) + space * ny
      let _x = 12 - n + (i + i)

      if (typeof cb === "function") cb(x, y, _x, ny)
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
    for (let i = 1; i < nn + 1; i++) {
      let x = 0
      if (sp === 0) {
        x = 4 - nn + (i + i) - 1
      } else if (sp === 1) {
        x = 12 - nn + (i + i)
      } else if (sp === 2) {
        x = 20 - nn + (i + i) + 1
      }
      if (typeof callback === "function") callback(x, ny)
    }
  }

  /**
   * Creates a position ID for each playable area by combining the x and y and rounded to a whole number. this enables queryable positions on the canvas
   * @param {number} x - x position
   * @param {number} y - y position
   */
  getNodeID(x, y) {
    return `${x.toFixed(0)}:${y.toFixed(0)}`
  }
}

export default Board
