import { configureStore } from "@reduxjs/toolkit";
import { GameAction, GameReducer } from "../game";

function getInitializedGame() {
  const store = configureStore({
    reducer: GameReducer,
  });
  store.dispatch(
    GameAction.initialize({
      gamemode: "normal",
      names: ["alice", "bob", "charlie", "david", "edward"],
      seed: 0,
      socketIDs: ["a", "b", "c", "d", "e"],
    })
  );
  return store;
}
console.log(JSON.stringify(getInitializedGame().getState()));
