export class MinesweeperRender {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
  }
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  setGrid(grid) {
    this.grid = grid;
    this.cellSize = this.width / grid.length;
  }
  render() {
    this.clear();
    for (let x in this.grid) {
      for (let y in this.grid[x]) {
        this.grid[x][y].render(this.ctx, this.cellSize);
      }
    }
  }
}
