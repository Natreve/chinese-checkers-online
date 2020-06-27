/**
 * jshint esversion: 8
 * 
 * @author Andrew Gray <contact@andrewgray.dev>
 * @version 1.0
 * @copyright 2020 ©
 * 
 * Represents a chinese checkers board
 */
class Piece {
  constructor(id, ctx, x, y, radius, color) {
    this.id = id;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.draw();
  }
  /**
   * Draws the players game piece on the board
   */
  draw() {
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 4;
    this.ctx.shadowBlur = 4;
    this.ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.ctx.fill();
  }
}
export default Piece;
