import { configureStore } from "@reduxjs/toolkit";
import { GameAction, GameReducer, GamePhaseLengths } from "..";

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
const initialState = {
  player: {
    names: ["bob", "alice", "charlie", "david", "edward"],
    socketIDs: ["b", "a", "c", "d", "e"],
    roles: ["agent", "agent", "spy", "spy", "agent"],
  },
  winner: null,
  game: { mission: 0, phase: "role-reveal", phaseCountdown: 10 },
  missions: [],
  teams: [],
  chat: [],
  statusMessage: null,
};

describe("game", () => {
  it("should initialize", () => {
    const store = getInitializedGame();

    expect(store.getState()).toEqual(initialState);
  });

  it("should be able to tick", () => {
    const store = getInitializedGame();
    store.dispatch(GameAction.tick());
    const newState = {
      ...initialState,
      game: {
        ...initialState.game,
        phaseCountdown: 9,
      },
    };
    expect(store.getState()).toEqual(newState);
  });

  it("should have the first person as the leader", () => {
    const store = getInitializedGame();
    for (let i = 0; i < 11; i++) {
      store.dispatch(GameAction.tick());
    }
    expect(store.getState().teams[0].leader).toEqual(0);
  });

  it("should play a full game", () => {
    const store = getInitializedGame();
    while (store.getState().game.phase !== "team-building")
      store.dispatch(GameAction.tick());
    store.dispatch(
      GameAction.updateTeamMembers({
        members: [0, 1],
      })
    );
    store.dispatch(GameAction.finishTeamBuilding());
    while (store.getState().game.phase !== "voting")
      store.dispatch(GameAction.tick());
    for (let i = 0; i < 5; i++) {
      store.dispatch(
        GameAction.sendProposalVote({
          player: i,
          vote: "accept",
        })
      );
    }
    for (let i = 0; i < 20; i++) {
      store.dispatch(GameAction.tick());
    }
    expect(store.getState().game.phase).toEqual("mission");
  });

  it("should pass after a number of ticks", () => {
    const store = getInitializedGame();
    while (store.getState().game.phase !== "team-building")
      store.dispatch(GameAction.tick());
    expect(store.getState().teams[0].leader).toEqual(0);
    for (let i = 0; i < GamePhaseLengths["team-building"] + 10; i++) {
      store.dispatch(GameAction.tick());
    }
    expect(store.getState().teams[0].leader).toEqual(1);
  });
});
