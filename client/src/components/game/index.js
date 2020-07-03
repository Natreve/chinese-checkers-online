import React from "react";
import css from "./css.module.scss";
import Board from "./Board";
class GameBoard extends React.Component {
  constructor() {
    super();
    this.width = 399;
    this.height = 523;
    this.canvasRef = React.createRef();
    this.state = {
      gameBoard: null,
    };
  }
  componentDidMount() {
    const canvas = this.canvasRef.current;
    const gameBoard = new Board(canvas, 2);
    this.setState({
      currentPlayer: gameBoard?.gameState.currentPlayerID,
      gameBoard: gameBoard,
    });
  }
  endTurn() {
    this.setState({
      currentPlayer: this.state.gameBoard.endTurn(),
    });
  }
  undoMove() {
    this.state.gameBoard.undoMove();
  }
  render() {
    return (
      <>
        <h1>Player Turn: {this.state.currentPlayer}</h1>
        <canvas
          ref={this.canvasRef}
          className={css.canvas}
          width={this.width}
          height={this.height}
        ></canvas>
        <div>
          <button className="endTurn" onClick={() => this.endTurn()}>
            END TURN
          </button>
          <button className="undo" onClick={() => this.undoMove()}>
            UNDO
          </button>
        </div>
      </>
    );
  }
}

export default GameBoard;
