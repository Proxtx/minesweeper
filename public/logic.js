export class Logic {
  lastMousemoveHighlight = false;
  lastLeftDown = 0;
  multiHighlight = [];
  currentlyMultiClick = false;

  constructor(render) {
    this.render = render;
    this.grid = this.render.grid;
    this.canvas = this.render.canvas;
    this.canvas.addEventListener("click", this.click.bind(this));
    this.canvas.addEventListener("mousemove", this.mousemove.bind(this));
    this.canvas.addEventListener("mouseup", this.mouseup.bind(this));
    this.canvas.addEventListener("mousedown", this.mousedown.bind(this));
    this.canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
    this.renderLoop();
    if (window.cheat) {
      this.tileClick(
        Math.round(this.grid.length / 2),
        Math.round(this.grid[0].length / 2)
      );
      this.cheat();
    }
  }

  async cheat() {
    let prevH = this.grid[0][0];
    while (true) {
      for (let x = 0; x < this.grid.length; x++) {
        for (let y = 0; y < this.grid[x].length; y++) {
          if (this.grid[x][y].type == 0 || !this.grid[x][y].number) continue;
          await new Promise((r) => setTimeout(r, 10));
          this.multiClick(x, y);
          prevH.highlight = false;
          prevH = this.grid[x][y];
          prevH.highlight = true;
        }
      }
    }
  }

  click(e) {
    if (e.buttons > 1) {
      return;
    }
    let x = Math.floor(e.offsetX / this.render.cellSize);
    let y = Math.floor(e.offsetY / this.render.cellSize);
    this.tileClick(x, y);
  }
  mousemove(e) {
    let x = Math.floor(e.offsetX / this.render.cellSize);
    let y = Math.floor(e.offsetY / this.render.cellSize);
    this.mousemoveHighlight(x, y);
    if (this.currentlyMultiClick) {
      this.multiClick(x, y);
    }
  }
  mouseup(e) {
    this.currentlyMultiClick = false;
    for (let i of this.multiHighlight) {
      i.highlight = false;
    }
    if (e.which == 1) this.lastLeftDown = Date.now();
    if (e.buttons > 0 || e.which != 3 || Date.now() - this.lastLeftDown < 100) {
      return;
    }
    let x = Math.floor(e.offsetX / this.render.cellSize);
    let y = Math.floor(e.offsetY / this.render.cellSize);
    this.placeFlag(x, y);
  }
  mousedown(e) {
    let x = Math.floor(e.offsetX / this.render.cellSize);
    let y = Math.floor(e.offsetY / this.render.cellSize);
    if (e.buttons > 2) {
      this.currentlyMultiClick = true;
      this.multiClick(x, y);
    }
  }

  renderLoop() {
    this.render.render();
    requestAnimationFrame(this.renderLoop.bind(this));
  }

  tileClick(x, y) {
    this.grid[x][y].reveal();
    if (this.grid[x][y].isEmpty()) {
      let reveal = this.genRevealField(x, y);
      for (let key in reveal) {
        let [x, y] = key.split(",");
        this.grid[x][y].reveal();
      }
    }
  }

  mousemoveHighlight(x, y) {
    if (this.lastMousemoveHighlight) {
      this.grid[this.lastMousemoveHighlight.x][
        this.lastMousemoveHighlight.y
      ].highlight = false;
    }
    if (x < this.grid.length && y < this.grid[0].length) {
      this.grid[x][y].highlight = true;
      this.lastMousemoveHighlight = { x, y };
    }
  }

  placeFlag(x, y) {
    this.grid[x][y].toggleFlag();
  }

  multiClick(x, y) {
    for (let i of this.multiHighlight) {
      i.highlight = false;
    }
    if (this.grid[x][y].type == 0) return;
    let revealCells = [];
    let flags = 0;
    for (let xNear = -1; xNear < 2; xNear++) {
      for (let yNear = -1; yNear < 2; yNear++) {
        if (this.grid[x + xNear] && this.grid[x + xNear][y + yNear]) {
          if (xNear == 0 && yNear == 0) continue;
          if (!this.grid[x + xNear][y + yNear].flag) {
            revealCells.push([
              this.tileClick.bind(this, x + xNear, y + yNear),
              this.grid[x + xNear][y + yNear],
            ]);
          } else {
            flags++;
          }
        } else {
          revealCells.push(null);
        }
      }
    }
    if (8 - revealCells.length == this.grid[x][y].number) {
      for (let cell of revealCells) {
        if (cell && cell[0]) cell[0]();
      }
    } else {
      this.multiHighlight = [];
      for (let cell of revealCells) {
        if (cell && cell[1] && cell[1].type == 0) {
          this.multiHighlight.push(cell[1]);
          cell[1].highlight = true;
        }
      }
      if (
        this.grid[x][y].number - flags == this.multiHighlight.length &&
        window.cheat
      ) {
        for (let cell of this.multiHighlight) {
          cell.flag = true;
        }
      }
    }
  }

  genRevealField(x, y, reveal = {}) {
    for (let xNear = -1; xNear < 2; xNear++) {
      for (let yNear = -1; yNear < 2; yNear++) {
        if (
          reveal[x + xNear + "," + (y + yNear)] ||
          !this.grid[x + xNear] ||
          !this.grid[x + xNear][y + yNear] ||
          this.grid[x + xNear][y + yNear].mine
        ) {
          continue;
        } else {
          reveal[x + xNear + "," + (y + yNear)] = true;
          if (this.grid[x + xNear][y + yNear].isEmpty()) {
            this.genRevealField(x + xNear, y + yNear, reveal);
          }
        }
      }
    }
    return reveal;
  }
}
