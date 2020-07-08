import React from "react"
import css from "./css.module.scss"
import Board from "./Board"
class GameBoard extends React.Component {
  constructor() {
    super()
    this.canvasRef = React.createRef()
    this.state = {
      board: null,
    }
  }
  componentDidMount() {
    const canvas = this.canvasRef.current
    const container = document.querySelector(`.container main`)
    canvas.width = container.clientWidth
    canvas.height = container.clientWidth

    let board = new Board(canvas, 2)
    window.addEventListener("resize", e => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientWidth;
      board.resize(container.clientWidth);
    })
    this.setState({
      currentPlayer: board?.state.currentPlayerTurn,
      board: board,
    })
  }
  endTurn() {
    this.setState({
      currentPlayer: this.state.board.endTurn(),
    })
  }
  undoMove() {
    this.state.board.undoMove()
  }
  render() {
    console.log(this.state.currentPlayer?.colorID);
    
    return (
      <>
        <h1>Player Turn: {this.state.currentPlayer?.colorID}</h1>
        <canvas ref={this.canvasRef} className={css.canvas}></canvas>
        <div>
          <button className="endTurn" onClick={() => this.endTurn()}>
            END TURN
          </button>
          <button className="undo" onClick={() => this.undoMove()}>
            UNDO
          </button>
        </div>
      </>
    )
  }
}

export default GameBoard
