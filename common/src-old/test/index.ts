import {
  applyMiddleware,
  combineReducers,
  configureStore,
  createStore,
  Middleware,
} from "@reduxjs/toolkit";
import reduxThunk, { ThunkAction } from "redux-thunk";
import { LobbyAction } from "../actions";
import { lobbyReducer } from "../reducers";
import { LobbyState } from "../types";

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  LobbyState,
  unknown,
  LobbyAction
>;

const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  console.log("Dispatching", action);
  const res = next(action);
  console.log("Next state:", store.getState());
  return res;
};

const store = configureStore({
  reducer: combineReducers({ lobby: lobbyReducer }),
});

store.dispatch({
  type: "lobby/initialize",
  payload: {
    id: "myid",
  },
});

store.dispatch({
  type: "lobby/player-join",
  payload: {
    name: "Kevin",
    memberID: "kevin",
  },
});
