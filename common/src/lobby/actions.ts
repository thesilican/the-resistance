import { createAction } from "@reduxjs/toolkit";
import { LobbyState } from "./types";
import { GameCustomRoleOptions, GameMode } from "../game";

export const hydrate = createAction<LobbyState>("lobby/hydrate");

export const initialize = createAction<{ id: string }>("lobby/initialize");

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
