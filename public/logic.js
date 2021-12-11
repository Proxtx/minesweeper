export class Logic {
  mousemoveHighlight = false;

  constructor(render) {
    this.render = render;
    this.grid = this.render.grid;
    this.canvas = this.render.canvas;
    this.canvas.addEventListener("click", this.click.bind(this));
    this.canvas.addEventListener("mousemove", this.mousemove.bind(this));
    this.canvas.addEventListener("contextmenu", this.rightClick.bind(this));
    this.renderLoop();
  }

  click(e) {
    let x = Math.floor(e.offsetX / this.render.cellSize);
    let y = Math.floor(e.offsetY / this.render.cellSize);
    if (this.grid[x][y].mine) {
      console.log("You lose");
      return;
    }
    this.grid[x][y].numberVisible = true;
    this.grid[x][y].type = 1;
  }
  mousemove(e) {
    if (this.mousemoveHighlight) {
      this.grid[this.mousemoveHighlight.x][
        this.mousemoveHighlight.y
      ].highlight = false;
    }
    let x = Math.floor(e.offsetX / this.render.cellSize);
    let y = Math.floor(e.offsetY / this.render.cellSize);
    if (x < this.grid.length && y < this.grid[0].length) {
      this.grid[x][y].highlight = true;
      this.mousemoveHighlight = { x, y };
    }
  }
  rightClick(e) {
    e.preventDefault();
    let x = Math.floor(e.offsetX / this.render.cellSize);
    let y = Math.floor(e.offsetY / this.render.cellSize);
    if (this.grid[x][y].flag) {
      this.grid[x][y].flag = false;
    } else if (!this.grid[x][y].numberVisible) {
      this.grid[x][y].flag = true;
    }
  }

  renderLoop() {
    this.render.render();
    requestAnimationFrame(this.renderLoop.bind(this));
  }
}
