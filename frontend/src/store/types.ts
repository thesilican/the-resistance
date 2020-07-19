import { ClientAppState } from "common-types";

export const defaultAppState: ClientAppState = {
  online: {
    games: -1,
    lobbies: -1,
    users: -1,
  },
  urlRoomID: "",
  roomIndex: -1,
  roomID: "",
  inGame: false,
  roomMembers: [],
  game: null,
};
