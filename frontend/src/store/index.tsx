import { createStore } from "its-not-redux";
import { reducer } from "./reducers";
import { defaultAppState } from "./types";

const appState = defaultAppState;

// const appState: AppState = {
//   roomIndex: 0,
//   roomID: "1234",
//   roomNames: ["Kevin", "Bob", "Charlie"],
//   game: null,
// };

const { StateProvider, useStore } = createStore(reducer, appState);

export { StateProvider, useStore };

