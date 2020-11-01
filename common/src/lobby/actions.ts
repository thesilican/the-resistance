import { createAction } from "@reduxjs/toolkit";
import { LobbyState } from "./types";
import { GameCustomRoleOptions, GameMode } from "../game";

export const hydrate = createAction<LobbyState>("lobby/hydrate");

export const initialize = createAction<{ id: string }>("lobby/initialize");

export const clientCreateLobby = createAction<{ name: string }>(
  "lobby/client-create"
);

export const clientJoinLobby = createAction<{ name: string; roomID: string }>(
  "lobby/client-join"
);

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

// Tell the lobby that you'd like to start the game (host only)
export const clientStartGame = createAction("lobby/client-start-game");

// Tell the lobby if you want to rejoin the game
export const clientRejoinGame = createAction<{ index: number }>(
  "lobby/client-rejoin-game"
);
