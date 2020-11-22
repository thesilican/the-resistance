import { createReducer } from "@reduxjs/toolkit";
import {
  finishAssassinChoice,
  finishTeamBuilding,
  hydrate,
  initialize,
  newPlayerChatMessage,
  passTeamBuilding,
  playerDisconnect,
  playerReconnect,
  sendMissionAction,
  sendProposalVote,
  tick,
  updateAssassinChoice,
  updateTeamMembers,
} from "./actions";
import { GameFunc } from "./funcs";
import { GameState } from "./types";

const initialState: GameState = {
  player: {
    names: [],
    roles: [],
    socketIDs: [],
  },
  game: {
    mission: 0,
    phase: "role-reveal",
    phaseCountdown: 0,
  },
  statusMessage: null,
  team: null,
  teamHistory: [],
  mission: null,
  missionHistory: [],
  winner: null,
  chat: [],
  assassinChoice: null,
};

export const GameReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(hydrate, (state, action) => {
      return action.payload;
    })
    .addCase(initialize, (state, action) => {
      const res = GameFunc.init(action.payload);
      if (!res) return state;
      return res;
    })
    .addCase(playerDisconnect, (state, action) => {
      const index = state.player.socketIDs.indexOf(action.payload.socketID);
      if (index >= 0 && index < state.player.socketIDs.length) {
        state.player.socketIDs[index] = null;
      }
      return state;
    })
    .addCase(playerReconnect, (state, action) => {
      state.player.socketIDs[action.payload.index] = action.payload.socketID;
      state.player.names[action.payload.index] = action.payload.name;
      return state;
    })
    .addCase(tick, (state) => {
      return GameFunc.tick(state);
    })
    .addCase(updateTeamMembers, (state, action) => {
      return GameFunc.action.updateTeamMembers(state, action.payload.members);
    })
    .addCase(finishTeamBuilding, (state) => {
      return GameFunc.action.finishTeamBuilding(state);
    })
    .addCase(passTeamBuilding, (state) => {
      return GameFunc.action.passTeamBuilding(state);
    })
    .addCase(sendProposalVote, (state, action) => {
      return GameFunc.action.sendProposalVote(
        state,
        action.payload.player,
        action.payload.vote
      );
    })
    .addCase(sendMissionAction, (state, action) => {
      return GameFunc.action.sendMissionAction(
        state,
        action.payload.player,
        action.payload.action
      );
    })
    .addCase(updateAssassinChoice, (state, action) => {
      return GameFunc.action.updateAssassinChoice(state, action.payload.player);
    })
    .addCase(finishAssassinChoice, (state, action) => {
      return GameFunc.action.finishAssassinChoice(state);
    })
    .addCase(newPlayerChatMessage, (state, action) => {
      GameFunc.action.newChatMessage(state, {
        type: "player",
        player: action.payload.player,
        content: action.payload.message,
      });
    });
});
