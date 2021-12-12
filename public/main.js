import { MinesweeperRender } from "./render.js";
import { generate } from "./generate.js";
import { Logic } from "./logic.js";
const canvas = document.getElementById("canvas");

canvas.width = 800;
canvas.height = 800;

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const genDemoGrid = (gridX, gridY) => {
  let grid = [];
  for (let x = 0; x < gridX; x++) {
    grid[x] = [];
    for (let y = 0; y < gridY; y++) {
      grid[x][y] = {
        number: random(1, 8),
        type: random(0, 1),
        flag: [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          true,
        ][random(0, 10)],
        highlight: [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          true,
        ][random(0, 10)],
      };
    }
  }
  return grid;
};

const demoGrid = generate(100, 30, 30);

const render = new MinesweeperRender(canvas);
render.setGrid(demoGrid);

render.render();
new Logic(render);
