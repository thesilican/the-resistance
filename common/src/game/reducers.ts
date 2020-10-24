import { createReducer } from "@reduxjs/toolkit";
import {
  finishTeamBuilding,
  hydrate,
  initialize,
  newPlayerChatMessage,
  newSystemChatMessage,
  passTeamBuilding,
  playerDisconnect,
  playerReconnect,
  sendAssasinChoice,
  sendMissionAction,
  sendProposalVote,
  tick,
  updateStatusMessage,
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
  missions: [],
  statusMessage: null,
  teams: [],
  winner: null,
  chat: [],
};

export const GameReducer = createReducer(initialState, (builder) => {
  // Basic
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
      state.player.socketIDs[action.payload.index] = null;
      return state;
    })
    .addCase(playerReconnect, (state, action) => {
      state.player.socketIDs[action.payload.index] = action.payload.socketID;
      return state;
    })
    .addCase(tick, (state) => {
      return GameFunc.tick(state);
    })
    .addCase(updateTeamMembers, (state, action) => {
      return GameFunc.updateTeamMembers(state, action.payload.members);
    })
    .addCase(finishTeamBuilding, (state) => {
      return GameFunc.finishTeamBuilding(state);
    })
    .addCase(passTeamBuilding, (state) => {
      return GameFunc.passTeamBuilding(state);
    })
    .addCase(sendProposalVote, (state, action) => {
      return GameFunc.sendProposalVote(
        state,
        action.payload.player,
        action.payload.vote
      );
    })
    .addCase(sendMissionAction, (state, action) => {
      return GameFunc.sendMissionAction(
        state,
        action.payload.player,
        action.payload.action
      );
    })
    .addCase(sendAssasinChoice, (state, action) => {
      return GameFunc.sendAssasinChoice(state, action.payload.player);
    })
    // Chat message
    .addCase(newPlayerChatMessage, (state, action) => {
      GameFunc.newChatMessage(state, {
        type: "player",
        player: action.payload.player,
        content: action.payload.message,
      });
    })
    .addCase(newSystemChatMessage, (state, action) => {
      GameFunc.newChatMessage(state, {
        type: "system",
        content: action.payload.message,
      });
    })
    .addCase(updateStatusMessage, (state, action) => {
      GameFunc.setStatusMessage(state, action.payload.message);
    });
});
