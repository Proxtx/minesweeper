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
    "#0C99A6",
    "#424242",
    "#808080",
  ],
};

const flag = new Image();
flag.src = "./flag.png";
await new Promise((resolve) => (flag.onload = resolve));

export class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.type = 0;
    this.numberVisible = false;
    this.flag = false;
    this.highlight = false;
    this.number = 0;
    this.mine = false;
    this.showMine = false;
  }

  render(ctx, cellSize) {
    this.ctx = ctx;
    this.cellSize = cellSize;
    this.renderCell();
    if (this.highlight) this.renderHighlight();
    if (this.flag) this.renderFlag();
    if (this.numberVisible) this.renderNumber();
    if (this.showMine) this.renderMine();
  }

  renderNumber() {
    if (!this.number) return;
    this.ctx.fillStyle = colors.numbers[this.number];
    this.ctx.font = (this.cellSize / 5) * 4 + "px sans";
    let offset = this.cellSize / 5 + 2;
    this.ctx.fillText(
      this.number,
      this.cellSize * this.x + offset + 2,
      this.cellSize * this.y + this.cellSize - offset + 1,
      this.cellSize
    );
  }
  renderCell() {
    if (this.y % 2) this.x++;
    if (this.type == 0)
      this.ctx.fillStyle = this.x % 2 ? colors.grass[0] : colors.grass[1];
    else this.ctx.fillStyle = this.x % 2 ? colors.dirt[0] : colors.dirt[1];
    if (this.y % 2) this.x--;
    this.ctx.fillRect(
      this.x * this.cellSize,
      this.y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }
  renderFlag() {
    this.ctx.drawImage(
      flag,
      this.x * this.cellSize,
      this.y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }
  renderHighlight() {
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    this.ctx.fillRect(
      this.x * this.cellSize,
      this.y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }
  renderMine() {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(
      this.x * this.cellSize,
      this.y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }

  toggleFlag() {
    if (!this.numberVisible) this.flag = !this.flag;
  }

  reveal() {
    if (this.numberVisible || this.flag) return;
    this.numberVisible = true;
    this.type = 1;
    if (this.mine) {
      this.showMine = true;
      console.log("You lose");
    }
  }

  isEmpty() {
    return this.number == 0 && !this.mine;
  }
}
