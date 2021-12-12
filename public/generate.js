import { Cell } from "./cell.js";

export const generate = (mines, gridX, gridY) => {
  let grid = [];
  for (let x = 0; x < gridX; x++) {
    grid.push([]);
    for (let y = 0; y < gridY; y++) {
      grid[x].push(new Cell(x, y));
    }
  }
  for (let i = 0; i < mines; i++) {
    let locX = random(0, gridX - 1);
    let locY = random(0, gridY - 1);
    while (grid[locX][locY].mine) {
      locX = random(0, gridX - 1);
      locY = random(0, gridY - 1);
    }
    grid[locX][locY].mine = true;
  }
  for (let x = 0; x < gridX; x++) {
    for (let y = 0; y < gridY; y++) {
      if (!grid[x][y].mine) {
        let mineCount = 0;
        for (let xNear = -1; xNear < 2; xNear++) {
          for (let yNear = -1; yNear < 2; yNear++) {
            if (
              grid[x + xNear] &&
              grid[x + xNear][y + yNear] &&
              grid[x + xNear][y + yNear].mine
            ) {
              mineCount++;
            }
          }
        }
        grid[x][y].number = mineCount;
      }
    }
  }
  return grid;
};

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
