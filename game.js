import { config } from "./config.js";

let lobbies = {};

export const createLobby = (grid) => {
  let lobbyId = random(0, 10000000);
  lobbies[lobbyId] = { gridTemplate: grid, players: {} };

  return { success: true, lobbyId };
};

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const playLobby = (lobbyId) => {
  let lobby = lobbies[lobbyId];
  let playerId = random(0, 10000000);
  lobby.players[playerId] = { grid: [...lobby.gridTemplate] };

  return { success: true, playerId, grid: lobby.players[playerId].grid };
};

export const getPlayerGrid = (lobbyId, playerId) => {
  let lobby = lobbies[lobbyId];
  let player = lobby.players[playerId];

  return { success: true, grid: player.grid };
};

export const updatePlayerGrid = (lobbyId, playerId, grid) => {
  let lobby = lobbies[lobbyId];
  let player = lobby.players[playerId];
  player.grid = grid;

  return { success: true };
};

export const getPlayerGrids = (lobbyId) => {
  let lobby = lobbies[lobbyId];

  return { success: true, players: lobby.players };
};

export const grid = config.grid;
