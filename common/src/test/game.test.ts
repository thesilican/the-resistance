import { configureStore } from "@reduxjs/toolkit";
import { GameAction, GameReducer } from "..";
import { finishTeamBuilding, tick } from "../game/actions";
import {
  addTeamMembers,
  getInitializedGame,
  missionAll,
  SampleIDs,
  SampleNames,
  tickUntil,
  voteAll,
} from "./util";

describe("game initialization", () => {
  describe("game initialization", () => {
    it("should initialize (normal 5 players)", () => {
      const store = configureStore({
        reducer: GameReducer,
      });
      store.dispatch(
        GameAction.initialize({
          gamemode: "normal",
          names: SampleNames.slice(0, 5),
          seed: 0,
          socketIDs: SampleIDs.slice(0, 5),
        })
      );

      expect(store.getState()).toEqual({
        assasinChoice: null,
        chat: [],
        game: {
          mission: 0,
          phase: "role-reveal",
          phaseCountdown: 10,
        },
        mission: null,
        missionHistory: [],
        player: {
          names: ["bob", "alice", "charlie", "david", "edward"],
          roles: ["agent", "agent", "spy", "spy", "agent"],
          socketIDs: ["1", "0", "2", "3", "4"],
        },
        statusMessage: "Welcome to the Resistance",
        team: null,
        teamHistory: [],
        winner: null,
      });
    });
    it("should initialize (assasins 5 players)", () => {
      const store = configureStore({
        reducer: GameReducer,
      });
      store.dispatch(
        GameAction.initialize({
          gamemode: "assasins",
          names: SampleNames.slice(0, 5),
          seed: 0,
          socketIDs: SampleIDs.slice(0, 5),
        })
      );

      expect(store.getState()).toEqual({
        assasinChoice: null,
        chat: [],
        game: {
          mission: 0,
          phase: "role-reveal",
          phaseCountdown: 10,
        },
        mission: null,
        missionHistory: [],
        player: {
          names: ["bob", "alice", "charlie", "david", "edward"],
          roles: ["agent", "captain", "assasin", "spy", "agent"],
          socketIDs: ["1", "0", "2", "3", "4"],
        },
        statusMessage: "Welcome to the Resistance",
        team: null,
        teamHistory: [],
        winner: null,
      });
    });
    it("should initialize (custom 5 players)", () => {
      const store = configureStore({
        reducer: GameReducer,
      });
      store.dispatch(
        GameAction.initialize({
          gamemode: {
            assasin: true,
            captain: true,
            deputy: true,
            imposter: true,
            intern: true,
            mole: true,
          },
          names: SampleNames.slice(0, 5),
          seed: 0,
          socketIDs: SampleIDs.slice(0, 5),
        })
      );

      expect(store.getState()).toEqual({
        assasinChoice: null,
        chat: [],
        game: {
          mission: 0,
          phase: "role-reveal",
          phaseCountdown: 10,
        },
        mission: null,
        missionHistory: [],
        player: {
          names: ["bob", "alice", "charlie", "david", "edward"],
          roles: ["deputy", "agent", "imposter", "assasin", "captain"],
          socketIDs: ["1", "0", "2", "3", "4"],
        },
        statusMessage: "Welcome to the Resistance",
        team: null,
        teamHistory: [],
        winner: null,
      });
    });
    it("should initialize (normal 8 players)", () => {
      const store = configureStore({
        reducer: GameReducer,
      });
      store.dispatch(
        GameAction.initialize({
          gamemode: "normal",
          names: SampleNames.slice(0, 8),
          seed: 0,
          socketIDs: SampleIDs.slice(0, 8),
        })
      );

      expect(store.getState()).toEqual({
        assasinChoice: null,
        chat: [],
        game: {
          mission: 0,
          phase: "role-reveal",
          phaseCountdown: 10,
        },
        mission: null,
        missionHistory: [],
        player: {
          names: [
            "charlie",
            "bob",
            "harry",
            "george",
            "alice",
            "fred",
            "david",
            "edward",
          ],
          roles: [
            "spy",
            "agent",
            "agent",
            "agent",
            "spy",
            "agent",
            "agent",
            "spy",
          ],
          socketIDs: ["2", "1", "7", "6", "0", "5", "3", "4"],
        },
        statusMessage: "Welcome to the Resistance",
        team: null,
        teamHistory: [],
        winner: null,
      });
    });
    it("should initialize (assasins 8 players)", () => {
      const store = configureStore({
        reducer: GameReducer,
      });
      store.dispatch(
        GameAction.initialize({
          gamemode: "normal",
          names: SampleNames.slice(0, 8),
          seed: 0,
          socketIDs: SampleIDs.slice(0, 8),
        })
      );

      expect(store.getState()).toEqual({
        assasinChoice: null,
        chat: [],
        game: {
          mission: 0,
          phase: "role-reveal",
          phaseCountdown: 10,
        },
        mission: null,
        missionHistory: [],
        player: {
          names: [
            "charlie",
            "bob",
            "harry",
            "george",
            "alice",
            "fred",
            "david",
            "edward",
          ],
          roles: [
            "spy",
            "agent",
            "agent",
            "agent",
            "spy",
            "agent",
            "agent",
            "spy",
          ],
          socketIDs: ["2", "1", "7", "6", "0", "5", "3", "4"],
        },
        statusMessage: "Welcome to the Resistance",
        team: null,
        teamHistory: [],
        winner: null,
      });
    });
    it("should initialize (custom 8 players)", () => {
      const store = configureStore({
        reducer: GameReducer,
      });
      store.dispatch(
        GameAction.initialize({
          gamemode: {
            assasin: true,
            captain: true,
            deputy: true,
            imposter: true,
            intern: true,
            mole: true,
          },
          names: SampleNames.slice(0, 8),
          seed: 0,
          socketIDs: SampleIDs.slice(0, 8),
        })
      );

      expect(store.getState()).toEqual({
        assasinChoice: null,
        chat: [],
        game: {
          mission: 0,
          phase: "role-reveal",
          phaseCountdown: 10,
        },
        mission: null,
        missionHistory: [],
        player: {
          names: [
            "charlie",
            "bob",
            "harry",
            "george",
            "alice",
            "fred",
            "david",
            "edward",
          ],
          roles: [
            "intern",
            "agent",
            "deputy",
            "agent",
            "imposter",
            "captain",
            "agent",
            "assasin",
          ],
          socketIDs: ["2", "1", "7", "6", "0", "5", "3", "4"],
        },
        statusMessage: "Welcome to the Resistance",
        team: null,
        teamHistory: [],
        winner: null,
      });
    });
  });

  it("should be able to tick", () => {
    const store = getInitializedGame("normal");
    store.dispatch(GameAction.tick());
    expect(store.getState().game.phaseCountdown).toEqual(9);
  });

  it("should have the first person as the leader", () => {
    const store = getInitializedGame("normal");
    for (let i = 0; i < 11; i++) {
      store.dispatch(GameAction.tick());
    }
    expect(store.getState().team!.leader).toEqual(0);
  });
});

describe("basic game cases", () => {
  it("should fail missions", () => {
    const store = getInitializedGame("normal");
    for (let i = 0; i < 3; i++) {
      tickUntil(store, "team-building");
      addTeamMembers(store, true);
      store.dispatch(GameAction.finishTeamBuilding());
      tickUntil(store, "voting");
      voteAll(store, "accept");
      tickUntil(store, "mission");
      missionAll(store, "fail");
    }
    tickUntil(store, "finished");
    expect(store.getState().missionHistory.length).toEqual(3);
    expect(store.getState().winner).toEqual("spy");
  });
  it("should succeed missions", () => {
    const store = getInitializedGame("normal");
    for (let i = 0; i < 3; i++) {
      tickUntil(store, "team-building");
      addTeamMembers(store, false);
      store.dispatch(GameAction.finishTeamBuilding());
      tickUntil(store, "voting");
      voteAll(store, "accept");
      tickUntil(store, "mission");
      missionAll(store, "success");
    }
    tickUntil(store, "finished");
    expect(store.getState().missionHistory.length).toEqual(3);
    expect(store.getState().winner).toEqual("agent");
  });
});

describe("advanced game cases", () => {
  it("should reject vote on ties", () => {
    const store = getInitializedGame("normal", 6);
    tickUntil(store, "team-building");
    addTeamMembers(store);
    store.dispatch(GameAction.finishTeamBuilding());
  });
  it("should fail on hammer", () => {
    const store = getInitializedGame("normal");
    for (let i = 0; i < 5; i++) {
      tickUntil(store, "team-building");
      addTeamMembers(store);
      store.dispatch(GameAction.finishTeamBuilding());
    }
    tickUntil(store, "finished");
    expect(store.getState().winner).toEqual("spy");
  });
});
