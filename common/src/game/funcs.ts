import { shuffle } from "../util";
import {
  GameAgentRoles,
  GameMaxPlayers,
  GameMinPlayers,
  GamePhaseLengths,
  MissionNeedDouble,
  MissionPlayerCount,
  TeamPoolsAssasins,
  TeamPoolsNormal,
} from "./constants";
import {
  ChatMessage,
  GameInitOptions,
  GameCustomRoleOptions,
  GameState,
  MissionAction,
  ProposalVote,
  Role,
  Team,
  TeamHistory,
  MissionHistory,
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

    // Shuffle names and socketIDs together
    const mixed: [string, string][] = options.names.map((x, i) => [
      x,
      options.socketIDs[i],
    ]);
    shuffle(mixed, seed++);
    const names = mixed.map((x) => x[0]);
    const socketIDs = mixed.map((x) => x[1]);

    const roles: Role[] = GameFunc.getRoleList(numPlayers, options.gamemode);
    shuffle(roles, seed++);

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
      // statusMessage: null,
      statusMessage: "Welcome to the Resistance",
      assasinChoice: null,
    };
  },
  tick(state: GameState): GameState {
    if (state.game.phaseCountdown > 0) {
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
        const team = state.teams[state.teams.length - 1];
        const reqPlayers =
          MissionPlayerCount[state.player.names.length][team.mission - 1];
        if (team.members.length === reqPlayers) {
          return GameFunc.beginTeamBuildingReview(state);
        } else {
          return GameFunc.passTeamBuilding(state);
        }
      case "team-building-review":
        return GameFunc.beginVoting(state);
      case "voting":
        return this.beginVotingReview(state);
      case "voting-review":
        const lastTeam = state.teams[state.teams.length - 1];
        const res = GameFunc.util.getMissionVoteResult(lastTeam.votes);
        if (res === "accept") {
          return GameFunc.beginMission(state);
        } else {
          if (GameFunc.util.isHammer(state)) {
            return GameFunc.beginFinished(state);
          } else {
            return this.beginTeamBuilding(state, true);
          }
        }
      case "mission":
        return GameFunc.beginMissionReview(state);
      case "mission-review":
        const winner = GameFunc.util.getWinnerFromMissions(state);
        if (winner === null) {
          return GameFunc.beginTeamBuilding(state);
        } else {
          if (state.player.roles.includes("assasin") && winner === "agent") {
            return GameFunc.beginFinishedAssasinate(state);
          } else {
            return GameFunc.beginFinished(state);
          }
        }
      case "finished-assasinate":
        return GameFunc.beginFinished(state);
      case "finished":
        // Don't do anything
        return state;
    }
  },
  //#region Phase beginnings
  beginTeamBuilding(
    state: GameState,
    noMissionIncrement = false,
    pass = false
  ): GameState {
    // Begin new state
    state.game.phase = "team-building";
    state.game.phaseCountdown = GamePhaseLengths["team-building"];
    if (!noMissionIncrement) {
      state.game.mission += 1;
    }

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
    if (pass) {
      state.teams.pop();
    }
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

    // Set the winner
    state.winner = GameFunc.util.getWinner(state);
    return state;
  },
  //#endregion

  //#region Actions
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
      MissionPlayerCount[state.player.names.length][team?.mission - 1];
    if (team?.members.length !== reqPlayers) {
      // This really should never happen, because the UI should prevent
      // people from submitting non-full teams
      return state;
    } else {
      return GameFunc.beginTeamBuildingReview(state);
    }
  },
  passTeamBuilding(state: GameState) {
    return this.beginTeamBuilding(state, true, true);
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
  updateAssasinChoice(state: GameState, player: number) {
    state.assasinChoice = player;
  },
  finishAssasinChoice(state: GameState) {
    if (state.game.phase !== "finished-assasinate") {
      return state;
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
  //#endregion

  util: {
    // Return the winner of a game
    getWinner(state: GameState): Team | null {
      if (GameFunc.util.isHammer(state)) {
        return "spy";
      }
      const winner = GameFunc.util.getWinnerFromMissions(state);
      if (winner === null || winner === "spy") {
        return winner;
      } else if (winner === "agent") {
        if (!state.player.roles.includes("assasin")) return "agent";
        if (state.assasinChoice === null) return null;
        const assasinated = state.player.roles[state.assasinChoice];
        if (assasinated === "captain") {
          return "spy";
        } else {
          return "agent";
        }
      }
      throw "up"; // How did you even get here
    },
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
    // Returns the winner, based on missions only
    getWinnerFromMissions(state: GameState): Team | null {
      let fail = 0,
        success = 0;
      for (const mission of state.missions) {
        if (
          GameFunc.util.missionResult(mission, state.player.names.length) ===
          "success"
        ) {
          success++;
        } else {
          fail++;
        }
      }
      if (fail === 3) return "spy";
      if (success === 3) return "agent";
      return null;
    },
    missionResult(mission: MissionHistory, numPlayers: number): MissionAction {
      const requiresTwo = MissionNeedDouble[numPlayers][mission.mission - 1];
      const failCount = mission.actions.reduce(
        (a, v) => (v === "fail" ? a + 1 : a),
        0
      );
      if (failCount >= 2 || (!requiresTwo && failCount >= 1)) {
        return "fail";
      } else {
        return "success";
      }
    },
    getProposalsRemaining(teams: TeamHistory[]) {
      if (teams.length === 0) return 5;

      let count = 0;
      const mission = teams[teams.length - 1].mission;
      for (let i = teams.length - 1; i >= 0; i--) {
        if (teams[i].mission === mission) {
          count++;
        } else {
          break;
        }
      }
      return 5 - count;
    },
    getMissionVoteResult(votes: ProposalVote[]): ProposalVote {
      let accept = 0;
      let reject = 0;
      for (const vote of votes) {
        if (vote === "accept") accept++;
        if (vote === "reject") reject++;
      }
      return accept > reject ? "accept" : "reject";
    },
  },
  getKnownRoles(playerIndex: number, roleList: Role[]): Map<number, Role[]> {
    const playerRole = roleList[playerIndex];
    let known = new Map<number, Role[]>();
    known.set(playerIndex, [roleList[playerIndex]]);

    if (playerRole === "captain") {
      for (let i = 0; i < roleList.length; i++) {
        if (i === playerIndex) continue;
        if (!GameAgentRoles.includes(roleList[i]) && roleList[i] !== "mole") {
          known.set(i, ["spy"]);
        }
      }
    } else if (playerRole === "deputy") {
      const roles: Role[] = [];
      if (roleList.includes("captain")) {
        roles.push("captain");
      }
      if (roleList.includes("imposter")) {
        roles.push("imposter");
      }
      for (let i = 0; i < roleList.length; i++) {
        if (i === playerIndex) continue;
        if (roleList[i] === "captain" || roleList[i] === "imposter") {
          known.set(i, roles.slice());
        }
      }
    } else if (["spy", "assasin", "imposter", "mole"].includes(playerRole)) {
      for (let i = 0; i < roleList.length; i++) {
        if (i === playerIndex) continue;
        if (!GameAgentRoles.includes(roleList[i]) && roleList[i] !== "intern") {
          known.set(i, [roleList[i]]);
        }
      }
    }
    return known;
  },
  getRoleList(
    numPlayers: number,
    options: "normal" | "assasins" | GameCustomRoleOptions
  ) {
    if (options === "normal") {
      return TeamPoolsNormal[numPlayers].slice();
    } else if (options === "assasins") {
      return TeamPoolsAssasins[numPlayers].slice();
    } else {
      return this.getCustomRoleList(numPlayers, options);
    }
  },
  getCustomRoleList(numPlayers: number, roleOptions: GameCustomRoleOptions) {
    const pool = TeamPoolsNormal[numPlayers].slice();
    const numAgents = pool.reduce((a, v) => (v === "agent" ? a + 1 : a), 0);
    const numSpies = pool.reduce((a, v) => (v === "spy" ? a + 1 : a), 0);

    const roleList: Role[] = [];
    // Agents
    const agentRoles: Role[] = [];
    const spyRoles: Role[] = [];
    if (roleOptions.captain) agentRoles.push("captain");
    if (roleOptions.deputy) agentRoles.push("deputy");
    if (roleOptions.assasin) spyRoles.push("assasin");
    if (roleOptions.imposter) spyRoles.push("imposter");
    if (roleOptions.intern) spyRoles.push("intern");
    if (roleOptions.mole) spyRoles.push("mole");

    for (let i = 0; i < numAgents; i++) {
      const newRole = agentRoles.splice(0, 1)[0];
      if (newRole) roleList.push(newRole);
      else roleList.push("agent");
    }
    for (let i = 0; i < numSpies; i++) {
      const newRole = spyRoles.splice(0, 1)[0];
      if (newRole) roleList.push(newRole);
      else roleList.push("spy");
    }

    return roleList;
  },
};
