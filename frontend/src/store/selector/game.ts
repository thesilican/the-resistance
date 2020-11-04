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
const teams = (state: RootState) => state.game.teams;
const missions = (state: RootState) => state.game.missions;

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
const lastTeam = createSelector(teams, (teams) =>
  teams.length === 0 ? null : teams[teams.length - 1]
);
const lastMission = createSelector(missions, (missions) =>
  missions.length === 0 ? null : missions[missions.length - 1]
);
const playerRole = createSelector(
  playerIndex,
  roles,
  (playerIndex, roles) => roles[playerIndex]
);

export const GameSelector = {
  names,
  socketIDs,
  roles,
  youInGame,
  chatMessages,
  playerIndex,
  gamePhase,
  gamePhaseCountdown,
  statusMessage,
  missions,
  teams,
  missionNum,
  lastTeam,
  lastMission,
  playerRole,
  numPlayers,
};
