import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { ClientSelector } from "./client";
const { socketID } = ClientSelector;

const names = (state: RootState) => state.game.player.names;
const socketIDs = (state: RootState) => state.game.player.socketIDs;
const roles = (state: RootState) => state.game.player.roles;
const chatMessages = (state: RootState) => state.game.chat;
const gamePhase = (state: RootState) => state.game.game.phase;
const gamePhaseCountdown = (state: RootState) => state.game.game.phaseCountdown;
const missionNum = (state: RootState) => state.game.game.mission;
const statusMessage = (state: RootState) => state.game.statusMessage;
const team = (state: RootState) => state.game.team;
const teamHistory = (state: RootState) => state.game.teamHistory;
const mission = (state: RootState) => state.game.mission;
const missionHistory = (state: RootState) => state.game.missionHistory;
const assassinChoice = (state: RootState) => state.game.assassinChoice;
const winner = (state: RootState) => state.game.winner;

const numPlayers = createSelector(socketIDs, (socketIDs) => socketIDs.length);
const playerIndex = createSelector(
  socketID,
  socketIDs,
  (socketID, gameSocketIDs) => gameSocketIDs.indexOf(socketID)
);
const youInGame = createSelector(
  playerIndex,
  (playerIndex) => playerIndex !== -1
);
const playerRole = createSelector(
  playerIndex,
  roles,
  (playerIndex, roles) => roles[playerIndex]
);

export const GameSelector = {
  assassinChoice,
  chatMessages,
  gamePhase,
  gamePhaseCountdown,
  mission,
  missionHistory,
  missionNum,
  names,
  numPlayers,
  playerIndex,
  playerRole,
  roles,
  socketIDs,
  statusMessage,
  team,
  teamHistory,
  winner,
  youInGame,
};
