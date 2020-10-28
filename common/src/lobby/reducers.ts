import { createReducer } from "@reduxjs/toolkit";
import { LobbyState } from "./types";
import {
  hydrate,
  initialize,
  memberJoin,
  memberLeave,
  updateGameOptions,
} from "./actions";

const initialState: LobbyState = {
  id: "",
  inGame: false,
  memberIDs: [],
  names: [],
  gameInitOptions: "normal",
};

export const LobbyReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(memberJoin, (state, action) => {
      state.memberIDs.push(action.payload.memberID);
      state.names.push(action.payload.name);
    })
    .addCase(memberLeave, (state, action) => {
      const index = state.memberIDs.findIndex(
        (x) => x === action.payload.memberID
      );
      if (index === -1) return state;
      state.memberIDs.splice(index, 1);
      state.names.splice(index, 1);
    })
    .addCase(hydrate, (state, action) => {
      return action.payload;
    })
    .addCase(initialize, (state, action) => {
      return {
        id: action.payload.id,
        inGame: false,
        memberIDs: [],
        names: [],
        gameInitOptions: "normal",
      };
    })
    .addCase(updateGameOptions, (state, action) => {
      state.gameInitOptions = action.payload.options;
      return state;
    });
});
