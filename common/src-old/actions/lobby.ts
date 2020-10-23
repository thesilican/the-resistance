import { LobbyState } from "../types";

export type LobbyAction =
  | PlayerJoinedLobbyAction
  | PlayerLeftLobbyAction
  | HydrateLobbyAction
  | InitializeLobbyAction;

export type PlayerJoinedLobbyAction = {
  type: "lobby/player-join";
  payload: {
    memberID: string;
    name: string;
  };
};

export type PlayerLeftLobbyAction = {
  type: "lobby/player-leave";
  payload: {
    index: number;
  };
};

export type HydrateLobbyAction = {
  type: "lobby/hydrate";
  payload: LobbyState;
};

export type InitializeLobbyAction = {
  type: "lobby/initialize";
  payload: {
    id: string;
  };
};
