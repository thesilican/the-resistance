import { createAction, createReducer } from "@reduxjs/toolkit";

export type ClientState = {
  socketID: string;
};

const setSocketID = createAction<string>("client/set-socket-id");

export const ClientAction = {
  setSocketID,
};

const initialState: ClientState = { socketID: "" };

export const ClientReducer = createReducer(initialState, (builder) =>
  builder.addCase(setSocketID, (state, action) => {
    state.socketID = action.payload;
  })
);
