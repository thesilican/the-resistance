import { configureStore } from "@reduxjs/toolkit";
import {
  GameAction,
  GameAgentRoles,
  GameCustomRoleOptions,
  GameFunc,
  GameMode,
  GamePhase,
  GameReducer,
  MissionPlayerCount,
  range,
} from "..";

let _store = configureStore({ reducer: GameReducer });
export type GameStore = typeof _store;
export type GameState = ReturnType<typeof _store.getState>;

export const SampleNames = [
  "alice",
  "bob",
  "charlie",
  "david",
  "edward",
  "fred",
  "george",
  "harry",
  "ivan",
  "jamie",
];
export const SampleIDs = range(10).map((x) => x + "");

export function tickUntil(store: GameStore, phase: GamePhase) {
  while (store.getState().game.phase !== phase) {
    store.dispatch(GameAction.tick());
  }
}

export function getInitializedGame(
  options: GameMode | GameCustomRoleOptions,
  numPlayers = 5
) {
  const initialState: GameState = {
    player: {
      names: SampleNames.slice(0, numPlayers),
      roles: GameFunc.util.getRoleList(numPlayers, options)!,
      socketIDs: SampleIDs.slice(0, numPlayers),
    },
    winner: null,
    game: { mission: 0, phase: "role-reveal", phaseCountdown: 10 },
    mission: null,
    missionHistory: [],
    team: null,
    teamHistory: [],
    chat: [],
    statusMessage: "Welcome to the Resistance",
    assassinChoice: null,
  };
  const store = configureStore({
    reducer: GameReducer,
  });
  store.dispatch(GameAction.hydrate(initialState));
  return store;
}

export function addTeamMembers(store: GameStore, requireSpy = false) {
  const state = store.getState();
  const playersReq = MissionPlayerCount[5][store.getState().game.mission - 1];
  if (!requireSpy) {
    store.dispatch(
      GameAction.updateTeamMembers({ members: range(playersReq) })
    );
  } else {
    let roles = state.player.roles
      .map((_, i) => i)
      .filter((x) => !GameAgentRoles.includes(state.player.roles[x]));
    let i = 0;
    while (roles.length < playersReq) {
      if (!roles.includes(i)) {
        roles.push(i);
      }
      i++;
    }
    if (roles.length > playersReq) {
      roles = roles.slice(0, playersReq);
    }
    store.dispatch(GameAction.updateTeamMembers({ members: roles }));
  }
}

export function voteAll(store: GameStore, vote: "accept" | "reject" | number) {
  const players = store.getState().player.names;
  for (let i = 0; i < players.length; i++) {
    let action: "accept" | "reject";
    if (typeof vote === "number") {
      action = i < vote ? "accept" : "reject";
    } else {
      action = vote;
    }
    store.dispatch(
      GameAction.sendProposalVote({
        player: i,
        vote: action,
      })
    );
  }
}

export function missionAll(store: GameStore, action: "success" | "fail") {
  const state = store.getState();
  const roles = state.player.roles;
  const members = state.mission!.members;
  members.forEach((i) => {
    if (GameAgentRoles.includes(roles[i])) {
      store.dispatch(
        GameAction.sendMissionAction({
          player: i,
          action: "success",
        })
      );
    } else {
      store.dispatch(
        GameAction.sendMissionAction({
          player: i,
          action,
        })
      );
    }
  });
}
