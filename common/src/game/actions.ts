import { createAction } from "@reduxjs/toolkit";
import {
  GameInitOptions,
  GameState,
  MissionAction,
  ProposalVote,
} from "./types";

// Basic
export const hydrate = createAction<GameState>("game/hydrate");

export const initialize = createAction<GameInitOptions>("game/initialize");

export const playerDisconnect = createAction<{
  socketID: string;
}>("game/player-disconnect");

export const playerReconnect = createAction<{
  index: number;
  socketID: string;
}>("game/player-reconnect");

export const tick = createAction("game/tick");

// Team Building
export const updateTeamMembers = createAction<{
  members: number[];
}>("game/update-team-members");

export const finishTeamBuilding = createAction("game/finish-team-building");

export const passTeamBuilding = createAction("game/pass-team-building");

// Team Voting
export const sendProposalVote = createAction<{
  player: number;
  vote: ProposalVote;
}>("game/send-proposal-vote");

// Mission
export const sendMissionAction = createAction<{
  player: number;
  action: MissionAction;
}>("game/send-mission-action");

// Assasin
export const updateAssasinChoice = createAction<{
  player: number;
}>("game/update-assasin-choice");
export const finishAssasinChoice = createAction("game/finish-assasin-choice");

// Chat
export const newPlayerChatMessage = createAction<{
  player: number;
  message: string;
}>("game/new-player-chat-message");

// export const newSystemChatMessage = createAction<{
//   message: string;
// }>("game/new-system-chat-message");

// export const updateStatusMessage = createAction<{
//   message: string | null;
// }>("game/update-status-message");
