import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { ClientSelector } from "./client";
const { socketID } = ClientSelector;

const names = (state: RootState) => state.game.player.names;
const socketIDs = (state: RootState) => state.game.player.socketIDs;
const roles = (state: RootState) => state.game.player.roles;
const chatMessages = (state: RootState) => state.game.chat;
const gamePhase = (state: RootState) => state.game.game;
const statusMessage = (state: RootState) => state.game.statusMessage;

const playerIndex = createSelector(
  socketID,
  socketIDs,
  (socketID, gameSocketIDs) => gameSocketIDs.indexOf(socketID)
);
const youInGame = createSelector(
  playerIndex,
  (playerIndex) => playerIndex !== -1
);

export const GameSelector = {
  names,
  socketIDs,
  roles,
  youInGame,
  chatMessages,
  playerIndex,
  gamePhase,
  statusMessage,
};
