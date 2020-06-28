import React, { useEffect } from "react";
import css from "./css.module.scss";
import Board from "./Board";

const GameBoard = () => {
  // const canvasRef = React.createRef();

  useEffect(() => {
    const canvas = document.querySelector(`.${css.canvas}`);
    canvas.width = 399;
    canvas.height = 523;
    let board = new Board(canvas, 2);
    document
      .querySelector(".endTurn")
      .addEventListener("click", () => board.endTurn());
  });

  return (
    <>
    <h1>Player Turn: </h1>
      <canvas  className={css.canvas}></canvas>
      <div>
        <button className="endTurn">END TURN</button>
        <button className="undo">UNDO</button>
      </div>
    </>
  );
};

export default GameBoard;
