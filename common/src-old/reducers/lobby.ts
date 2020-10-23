import { LobbyAction } from "../actions/lobby";
import { LobbyState } from "../types";

const initalState: LobbyState = {
  id: "",
  inGame: false,
  memberIDs: [],
  names: [],
};

export function lobbyReducer(
  state = initalState,
  action: LobbyAction
): LobbyState {
  switch (action.type) {
    case "lobby/hydrate":
      return action.payload;
    case "lobby/player-join":
      return {
        ...state,
        memberIDs: [...state.memberIDs, action.payload.memberID],
        names: [...state.names, action.payload.name],
      };
    case "lobby/player-leave":
      return {
        ...state,
        memberIDs: state.memberIDs.filter((_, i) => i !== action.payload.index),
        names: state.names.filter((_, i) => i !== action.payload.index),
      };
    case "lobby/initialize":
      return {
        ...state,
        id: action.payload.id,
      };
  }
}
