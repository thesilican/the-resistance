import { shuffle } from "../util";
import {
  GameMaxPlayers,
  GameMinPlayers,
  GamePhaseLengths,
  GameRolePools,
  MissionNeedDouble,
  MissionPlayerCount,
} from "./constants";
import {
  ChatMessage,
  GameInitOptions,
  GameState,
  MissionAction,
  MissionHistory,
  ProposalVote,
  Role,
  Team,
  TeamHistory,
} from "./types";

export const GameFunc = {
  init(options: GameInitOptions): GameState | null {
    let seed = options.seed;
    const numPlayers = options.names.length;
    if (numPlayers !== options.socketIDs.length) {
      return null;
    }
    if (numPlayers < GameMinPlayers || numPlayers > GameMaxPlayers) {
      return null;
    }

    const roles: Role[] = [];
    const pool = GameRolePools[options.gamemode][numPlayers];
    for (const role in pool) {
      for (let i = 0; i < pool[role as Role]; i++) {
        roles.push(role as Role);
      }
    }
    shuffle(roles, seed++);

    // Shuffle names and sockeIDs together
    const mixed: [string, string][] = options.names.map((x, i) => [
      x,
      options.socketIDs[i],
    ]);
    shuffle(mixed, seed++);
    const names = mixed.map((x) => x[0]);
    const socketIDs = mixed.map((x) => x[1]);

    return {
      player: {
        names,
        socketIDs,
        roles,
      },
      winner: null,
      game: {
        mission: 0,
        phase: "role-reveal",
        phaseCountdown: GamePhaseLengths["role-reveal"],
      },
      missions: [],
      teams: [],
      chat: [],
      statusMessage: null,
      // statusMessage: "Welcome to the Resistance",
    };
  },
  tick(state: GameState): GameState {
    if (state.game.phaseCountdown > 1) {
      if (state.game.phase !== "finished") {
        state.game.phaseCountdown--;
      }
      return state;
    }
    // Go to next phase
    switch (state.game.phase) {
      case "role-reveal":
        return GameFunc.beginTeamBuilding(state);
      case "team-building":
        return GameFunc.beginTeamBuildingReview(state);
      case "team-building-review":
        return GameFunc.beginVoting(state);
      case "voting":
        return this.beginVotingReview(state);
      case "voting-review":
        const lastTeam = state.teams[state.teams.length - 1];
        let accept = 0,
          reject = 0;
        for (const vote of lastTeam.votes) {
          if (vote === "accept") accept++;
          if (vote === "reject") reject++;
        }
        if (accept > reject) {
          return GameFunc.beginMission(state);
        } else {
          if (GameFunc.util.isHammer(state)) {
            return GameFunc.beginFinished(state);
          } else {
            return GameFunc.beginTeamBuilding(state);
          }
        }
      case "mission":
        return GameFunc.beginMissionReview(state);
      case "mission-review":
        return GameFunc.beginTeamBuilding(state);
      case "finished-assasinate":
        return GameFunc.beginFinished(state);
      case "finished":
        // Don't do anything
        return state;
    }
  },
  beginTeamBuilding(state: GameState): GameState {
    // Begin new state
    state.game.mission += 1;
    state.game.phase = "team-building";
    state.game.phaseCountdown = GamePhaseLengths["team-building"];

    // Begin new team
    const prev = state.teams[state.teams.length - 1];
    let nextLeader: number;
    if (prev === undefined) {
      nextLeader = 0;
    } else {
      nextLeader = (prev.leader + 1) % state.player.names.length;
    }
    const team: TeamHistory = {
      mission: state.game.mission,
      leader: nextLeader,
      members: [],
      votes: [],
    };
    state.teams.push(team);

    return state;
  },
  beginTeamBuildingReview(state: GameState): GameState {
    state.game.phase = "team-building-review";
    state.game.phaseCountdown = GamePhaseLengths["team-building-review"];
    return state;
  },
  beginVoting(state: GameState): GameState {
    // Just in case
    const team = state.teams[state.teams.length - 1];
    team.votes = state.player.names.map((_) => "none");

    state.game.phase = "voting";
    state.game.phaseCountdown = GamePhaseLengths["voting"];
    return state;
  },
  beginVotingReview(state: GameState): GameState {
    state.game.phase = "voting-review";
    state.game.phaseCountdown = GamePhaseLengths["voting-review"];
    return state;
  },
  beginMission(state: GameState): GameState {
    state.game.phase = "mission";
    state.game.phaseCountdown = GamePhaseLengths["mission"];

    // Create new mission
    const prevTeam = state.teams[state.teams.length - 1];
    const members = prevTeam.members.sort((a, b) => a - b);
    const actions = members.map((_) => null);
    const mission = { mission: state.game.mission, members, actions };
    state.missions.push(mission);

    return state;
  },
  beginMissionReview(state: GameState): GameState {
    state.game.phase = "mission-review";
    state.game.phaseCountdown = GamePhaseLengths["mission-review"];
    return state;
  },
  beginFinishedAssasinate(state: GameState): GameState {
    state.game.phase = "finished-assasinate";
    state.game.phaseCountdown = GamePhaseLengths["finished-assasinate"];
    return state;
  },
  beginFinished(state: GameState): GameState {
    state.game.phase = "finished";
    state.game.phaseCountdown = GamePhaseLengths["finished"];

    // Set winner (if not set by assasinate)
    if (!state.winner) {
      const missionWin = GameFunc.util.getWinnerFromMissions(state);
      const hammer = GameFunc.util.isHammer(state);
      const winner = hammer ? "spy" : missionWin;
      state.winner = winner;
    }
    return state;
  },
  updateTeamMembers(state: GameState, members: number[]): GameState {
    if (state.game.phase !== "team-building") {
      return state;
    }
    const team = state.teams[state.teams.length - 1];
    team.members = members;
    return state;
  },
  finishTeamBuilding(state: GameState) {
    const team = state.teams[state.teams.length - 1];
    const reqPlayers =
      MissionPlayerCount[state.player.names.length][team.mission - 1];
    if (team.members.length !== reqPlayers) {
      // This really should never happen, because the UI should prevent
      // people from submitting non-full teams
      return state;
    } else {
      return GameFunc.beginTeamBuildingReview(state);
    }
  },
  passTeamBuilding(state: GameState) {
    const team = state.teams[state.teams.length - 1];
    team.leader = (team.leader + 1) % state.player.names.length;
    team.members = [];
    // Extend time
    state.game.phaseCountdown = GamePhaseLengths["team-building"];
    return state;
  },
  sendProposalVote(state: GameState, player: number, vote: ProposalVote) {
    if (state.game.phase !== "voting") {
      return state;
    }
    const team = state.teams[state.teams.length - 1];
    team.votes[player] = vote;
    if (team.votes.includes("none")) {
      return state;
    } else {
      // Once everyone's decided, move to next phase
      return GameFunc.beginVotingReview(state);
    }
  },
  sendMissionAction(state: GameState, player: number, action: MissionAction) {
    if (state.game.phase !== "mission") {
      return state;
    }
    const mission = state.missions[state.missions.length - 1];
    const index = mission.members.indexOf(player);
    if (index === -1) {
      return state;
    }
    mission.actions[index] = action;

    for (const action of mission.actions) {
      if (action === null) {
        return state;
      }
    }
    // If all actions are sent
    return GameFunc.beginMissionReview(state);
  },
  sendAssasinChoice(state: GameState, player: number) {
    // Set win or lose if it was admin
    if (state.game.phase !== "finished-assasinate") {
      return state;
    }
    if (state.player.roles[player] === "captain") {
      state.winner = "spy";
    } else {
      state.winner = "agent";
    }
    return GameFunc.beginFinished(state);
  },
  newChatMessage(state: GameState, message: ChatMessage) {
    state.chat.push(message);
    return state;
  },
  setStatusMessage(state: GameState, message: string | null) {
    state.statusMessage = message;
    return state;
  },
  util: {
    // Returns whether or not the last 5 team proposals were failed
    isHammer(state: GameState): boolean {
      let mission = 0,
        count = 0;
      for (const team of state.teams) {
        if (mission !== team.mission) {
          mission = team.mission;
          count = 1;
        } else {
          count++;
          if (count === 5) {
            return true;
          }
        }
      }
      return false;
    },
    // Returns the winner
    getWinnerFromMissions(state: GameState): Team | null {
      let fail = 0,
        success = 0;
      for (const mission of state.missions) {
        const requiresTwo = MissionNeedDouble[mission.mission];
        const failCount = mission.actions.reduce(
          (a, v) => (v === "fail" ? a + 1 : a),
          0
        );
        if (failCount >= 2 || (!requiresTwo && failCount >= 1)) {
          fail++;
        } else {
          success++;
        }
      }
      if (fail === 3) return "spy";
      if (success === 3) return "agent";
      return null;
    },
  },
};
