import { createAction } from "@reduxjs/toolkit";
import { LobbyState } from "./types";
import { GameCustomRoleOptions, GameMode } from "../game";

export const hydrate = createAction<LobbyState>("lobby/hydrate");

export const initialize = createAction<{ id: string }>("lobby/initialize");

// Tell the server that you'd like to create a lobby
export const clientCreateLobby = createAction<{ name: string }>(
  "lobby/client-create"
);

// Tell the server that you'd like to join a room
export const clientJoinLobby = createAction<{ name: string; roomID: string }>(
  "lobby/client-join"
);

// Tell the server that you'd like to start the game (host only)
export const clientStartGame = createAction("lobby/client-start-game");

// Tell the server if you want to rejoin the game at a particular index
// Only for people rejoining the game after disconnecting
export const clientRejoinGame = createAction<{ index: number }>(
  "lobby/client-rejoin-game"
);

// Tell the server you want to leave the game
// Only for when the game is over
export const clientLeaveGame = createAction("lobby/client-leave-game");

export const memberJoin = createAction<{
  memberID: string;
  name: string;
}>("lobby/member-join");

export const memberLeave = createAction<{
  memberID: string;
}>("lobby/member-leave");

export const updateGameOptions = createAction<{
  options: GameMode | GameCustomRoleOptions;
}>("lobby/update-game-options");

export const updateGameState = createAction<{ inGame: boolean }>(
  "lobby/update-game-state"
);
