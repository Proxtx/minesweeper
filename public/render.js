const colors = {
  grass: ["#AAD751", "#A2D149"],
  dirt: ["#E5C29F", "#D7B899"],
  numbers: [
    "#000000",
    "#1976D2",
    "#388E3C",
    "#D32F2F",
    "#7B1FA2",
    "#FF8F00",
    "#000000",
    "#424242",
    "#000000",
  ],
};

const flag = new Image();
flag.src = "./flag.png";
await new Promise((resolve) => (flag.onload = resolve));

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
        this.renderCell(x, y, this.grid[x][y].type);
        if (this.grid[x][y].flag) this.renderFlag(x, y);
        if (this.grid[x][y].highlighted) this.renderHighlight(x, y);
        this.renderNumber(x, y, this.grid[x][y].number);
      }
    }
  }

  renderNumber(x, y, number) {
    if (!number) return;
    this.ctx.fillStyle = colors.numbers[number];
    this.ctx.font = (this.cellSize / 5) * 4 + "px sans";
    let offset = this.cellSize / 5 + 2;
    this.ctx.fillText(
      number,
      this.cellSize * x + offset + 2,
      this.cellSize * y + this.cellSize - offset + 1,
      this.cellSize
    );
  }
  renderCell(x, y, type) {
    if (y % 2) x++;
    if (type == 0)
      this.ctx.fillStyle = x % 2 ? colors.grass[0] : colors.grass[1];
    else this.ctx.fillStyle = x % 2 ? colors.dirt[0] : colors.dirt[1];
    if (y % 2) x--;
    this.ctx.fillRect(
      x * this.cellSize,
      y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }
  renderFlag(x, y) {
    this.ctx.drawImage(
      flag,
      x * this.cellSize,
      y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }
  renderHighlight(x, y) {
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    this.ctx.fillRect(
      x * this.cellSize,
      y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }
}
