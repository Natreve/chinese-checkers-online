import React from "react"
import css from "./css.module.scss"
import Layout from "../layout"
import Game from "./Game"
class GameBoard extends React.Component {
  constructor() {
    super()
    this.canvasRef = React.createRef()
    this.state = {
      game: null,
    }
  }
  componentDidMount() {
    const canvas = this.canvasRef.current
    const container = document.querySelector(`.container main`)
    canvas.width = container.clientWidth
    canvas.height = container.clientWidth
    const game = new Game(canvas, this.props.game)

    window.addEventListener("resize", e => {
      canvas.width = container.clientWidth
      canvas.height = container.clientWidth
      game.resize(container.clientWidth)
    })
    this.setState({
      currentPlayer: game?.state.currentPlayerTurn,
      game: game,
    })
  }
  endTurn() {
    this.setState({
      currentPlayer: this.state.game.endTurn(),
    })
  }
  undoMove() {
    this.state.game.undoMove()
  }
  render() {
    return (
      <Layout>
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
      </Layout>
    )
  }
}

export default GameBoard
