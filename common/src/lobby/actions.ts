import { createAction } from "@reduxjs/toolkit";
import { LobbyState } from "./types";

export const hydrate = createAction<LobbyState>("lobby/hydrate");

export const initialize = createAction<{ id: string }>("lobby/initialize");

export const memberJoin = createAction<{
  memberID: string;
  name: string;
}>("lobby/member-join");

export const memberLeave = createAction<{
  memberID: string;
}>("lobby/member-leave");
