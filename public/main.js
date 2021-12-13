import { MinesweeperRender } from "./render.js";
import { generate } from "./generate.js";
import { Logic } from "./logic.js";
import { genModule } from "./combine.js";
import { Cell } from "./cell.js";
import { componentObj } from "./f_xHtml/xHtml.js";

let lobbyId;
let playerId;

const server = await genModule(location.href + "api/");

console.log(await server.grid);

const gridSettings = await server.grid;

const createLobby = async () => {
  lobbyId = (
    await server.createLobby(
      generate(gridSettings.bombs, gridSettings.width, gridSettings.height)
    )
  ).lobbyId;
};

window.playLobby = async (pLobbyId) => {
  componentObj.status = "player";
  lobbyId = pLobbyId;
  const result = await server.playLobby(lobbyId);
  playerId = result.playerId;
  let grid = parseGridFromServer(result.grid);
  let logic = createLogicCanvas(grid);
  logic.changeListeners.push(
    async (logic) =>
      await server.updatePlayerGrid(lobbyId, playerId, logic.grid)
  );
  componentObj.lobbyId = lobbyId;
  slide();
  startCountdown();
};

const parseGridFromServer = (grid) => {
  for (let x in grid) {
    for (let y in grid[x]) {
      grid[x][y] = Object.assign(new Cell(x, y), grid[x][y]);
    }
  }
  return grid;
};

window.createAndPlayLobby = async () => {
  await createLobby();
  await playLobby(lobbyId);
  componentObj.lobbyId = lobbyId;
};

window.watchLobby = async (pLobbyId) => {
  componentObj.status = "spectator";
  lobbyId = pLobbyId;
  componentObj.lobbyId = lobbyId;
  slide();
  startCountdown();
  let playerCanvas = {};
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const { players } = await server.getPlayerGrids(lobbyId);
    for (let i in players) {
      if (!playerCanvas[i]) {
        playerCanvas[i] = createLogicCanvas(
          parseGridFromServer(players[i].grid)
        );
        let width = getComputedStyle(
          document.getElementById("canvasWrap")
        ).width;
        for (let i in playerCanvas) {
          playerCanvas[i].render.canvas.style.width =
            width.split("px")[0] / (Object.keys(playerCanvas).length * 2) +
            "px";
        }
      } else {
        playerCanvas[i].render.setGrid(parseGridFromServer(players[i].grid));
      }
    }
  }
};

const createLogicCanvas = (grid) => {
  let canvas = document.createElement("canvas");
  canvas.classList.add("canvas");
  canvas.width = 800;
  canvas.height = 800;
  document.getElementById("canvasWrap").appendChild(canvas);
  const render = new MinesweeperRender(canvas);
  render.setGrid(grid);
  const logic = new Logic(render);
  return logic;
};

const slide = () => {
  for (let i of document.getElementsByClassName("background"))
    i.style.left = "-100%";
};

let distance = 0;

const startCountdown = () => {
  distance = 0;
  setInterval(countDown, 1000);
};

const countDown = () => {
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (days < 10) {
    days = "0" + days;
  }

  componentObj.timer = minutes + ":" + seconds;

  distance += 1000;
};
