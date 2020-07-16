import {
  ClientAppState as AppState,
  Action,
  LobbyAction,
  GameAction,
} from "common-types";

export function reducer(state: AppState, action: Action): AppState {
  switch (action.category) {
    case "lobby":
      return lobbyReducer(state, action);
    case "error":
      return state;
    case "game":
      return gameReducer(state, action);
    default:
      throw "up";
  }
}

function lobbyReducer(state: AppState, action: LobbyAction): AppState {
  switch (action.type) {
    case "join-lobby":
      return {
        roomID: action.roomID,
        roomIndex: action.roomIndex,
        roomMembers: action.roomMembers,
        inGame: false,
        game: action.game,
      };
    case "player-join":
      return {
        ...state,
        roomMembers: [...state.roomMembers, action.name],
      };
    case "player-leave":
      return {
        ...state,
        roomMembers: state.roomMembers.filter((_, i) => i !== action.index),
        roomIndex:
          action.index < state.roomIndex
            ? state.roomIndex - 1
            : state.roomIndex,
      };
    default:
      throw "up";
  }
}

function gameReducer(state: AppState, action: GameAction): AppState {
  switch (action.type) {
    case "join-game":
      return {
        ...state,
        inGame: true,
        game: action.state,
      };
    case "leave-game":
      return {
        ...state,
        inGame: false,
      };
    case "update-game-state":
      return {
        ...state,
        game: action.state,
      };
    case "player-leave-game":
      if (!state.game) return state;
      return {
        ...state,
        game: {
          ...state.game,
          playerDisconnected: state.game.playerDisconnected.map((v, i) =>
            i === action.index ? true : v
          ),
        },
      };
    case "player-rejoin-game":
      if (!state.game) return state;
      return {
        ...state,
        game: {
          ...state.game,
          playerDisconnected: state.game.playerDisconnected.map((v, i) =>
            i === action.index ? false : v
          ),
        },
      };
    case "update-game-phase":
      if (!state.game) return state;
      return {
        ...state,
        game: {
          ...state.game,
          gamePhaseCountdown: action.countdown,
          gamePhase: action.gamePhase ?? state.game.gamePhase,
          missionNumber: action.missionNum ?? state.game.missionNumber,
        },
      };
    case "new-team-building":
      if (!state.game) return state;
      return {
        ...state,
        game: {
          ...state.game,
          teamLeader: action.leader,
          teamMembers: [],
        },
      };
    case "update-team-members":
      if (!state.game) return state;
      return {
        ...state,
        game: {
          ...state.game,
          teamMembers: action.members,
        },
      };
    case "new-voting-phase":
      if (!state.game) return state;
      return {
        ...state,
        game: {
          ...state.game,
          teamProposalVote: null,
        },
      };
    case "set-vote":
      if (!state.game) return state;
      return {
        ...state,
        game: {
          ...state.game,
          teamProposalVote: action.vote,
        },
      };
    case "new-mission-action":
      if (!state.game) return state;
      return {
        ...state,
        game: {
          ...state.game,
          missionAction: null,
        },
      };
    case "set-mission-action":
      if (!state.game) return state;
      return {
        ...state,
        game: {
          ...state.game,
          missionAction: action.missionAction,
        },
      };
    case "update-team-history":
      if (!state.game) return state;
      return {
        ...state,
        game: {
          ...state.game,
          teamHistory: [...state.game.teamHistory, action.newHistory],
        },
      };
    case "update-mission-history":
      if (!state.game) return state;
      return {
        ...state,
        game: {
          ...state.game,
          missionHistory: action.newMission
            ? [...state.game.missionHistory, action.newMission]
            : action.updateMission
            ? [...state.game.missionHistory.splice(-1, 1), action.updateMission]
            : state.game.missionHistory,
        },
      };
    case "new-chat-message":
      if (!state.game) return state;
      return {
        ...state,
        game: {
          ...state.game,
          chatHistory: [...state.game.chatHistory, action.chatMessage],
        },
      };
    case "update-status-message":
      if (!state.game) return state;
      return {
        ...state,
        game: {
          ...state.game,
          statusMessage: action.message,
        },
      };
    case "finish-game":
      if (!state.game) return state;
      return {
        ...state,
        game: {
          ...state.game,
          winners: action.winners,
          spies: action.spies,
        },
      };
    default:
      throw "up";
  }
}