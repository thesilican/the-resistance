import { shuffle, nameStr, count, plural, last } from "../util";
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

    const roles: Role[] = GameFunc.util.getRoleList(
      numPlayers,
      options.gamemode
    );
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
        const team = last(state.teams);
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
        const lastTeam = last(state.teams);
        const res = GameFunc.util.getProposalVoteResult(lastTeam.votes);
        if (res === "accept") {
          return GameFunc.beginMission(state);
        } else {
          if (GameFunc.util.getIsHammer(state)) {
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
    const prev = last(state.teams);
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

    // Status
    state.statusMessage = `{{name:${nextLeader}}} is proposing a team`;
    return state;
  },
  beginTeamBuildingReview(state: GameState): GameState {
    state.game.phase = "team-building-review";
    state.game.phaseCountdown = GamePhaseLengths["team-building-review"];

    // Chat
    const lastTeam = last(state.teams);
    const leader = lastTeam.leader;
    const members = lastTeam.members;
    state.chat.push({
      type: "system",
      content: `{{name:${leader}}} has proposed ${members
        .map(nameStr)
        .join(", ")}`,
    });
    return state;
  },
  beginVoting(state: GameState): GameState {
    // Just in case
    const team = last(state.teams);
    team.votes = state.player.names.map((_) => "none");

    state.game.phase = "voting";
    state.game.phaseCountdown = GamePhaseLengths["voting"];
    return state;
  },
  beginVotingReview(state: GameState): GameState {
    state.game.phase = "voting-review";
    state.game.phaseCountdown = GamePhaseLengths["voting-review"];

    // Chat/status
    let msg = "";
    const lastTeam = last(state.teams);
    const res = GameFunc.util.getProposalVoteResult(lastTeam.votes);
    if (res === "accept") {
      msg += "The proposal was {{success:ACCEPTED}}";
    } else if (res === "reject") {
      msg += "The proposal was {{fail:REJECTED}}";
    }
    state.chat.push({
      type: "system",
      content: msg,
    });
    state.statusMessage = msg;

    return state;
  },
  beginMission(state: GameState): GameState {
    state.game.phase = "mission";
    state.game.phaseCountdown = GamePhaseLengths["mission"];

    // Create new mission
    const prevTeam = last(state.teams);
    const members = prevTeam.members.sort((a, b) => a - b);
    const actions = members.map((_) => null);
    const mission = { mission: state.game.mission, members, actions };
    state.missions.push(mission);

    // Status
    const membersStr = members.map(nameStr);
    state.statusMessage = `${membersStr.join(", ")} are going on a mission`;

    return state;
  },
  beginMissionReview(state: GameState): GameState {
    state.game.phase = "mission-review";
    state.game.phaseCountdown = GamePhaseLengths["mission-review"];

    const lastMission = last(state.missions);

    // Chat/status
    let msg = "";
    const res = GameFunc.util.getMissionResult(
      lastMission,
      state.player.socketIDs.length
    );
    if (res === "success") {
      msg += `Mission ${lastMission.mission} {{success:SUCCESSFUL}} `;
    } else if (res === "fail") {
      msg += `Mission ${lastMission.mission} {{fail:FAILED}} `;
    }
    const numFails = count(lastMission.actions, "fail");
    msg += `(${plural(numFails, "fail")} detected)`;
    state.statusMessage = msg;
    state.chat.push({
      type: "system",
      content: msg,
    });

    return state;
  },
  beginFinishedAssasinate(state: GameState): GameState {
    state.game.phase = "finished-assasinate";
    state.game.phaseCountdown = GamePhaseLengths["finished-assasinate"];

    // Chat/status
    const assasin = state.player.roles.indexOf("assasin");
    let msg = `${nameStr(assasin)} is picking a player to assasinate`;
    state.statusMessage = msg;
    state.chat.push({
      type: "system",
      content: msg,
    });

    return state;
  },
  beginFinished(state: GameState): GameState {
    state.game.phase = "finished";
    state.game.phaseCountdown = GamePhaseLengths["finished"];

    // Set the winner
    state.winner = GameFunc.util.getWinner(state);

    // Chat/status
    let msg = "";
    if (GameFunc.util.getIsHammer(state)) {
      msg += "The agents have ran out of proposals. ";
    }
    if (state.assasinChoice !== null) {
      const choice = state.assasinChoice;
      const wasCaptain = state.player.roles[choice] === "assasin";
      msg += `${nameStr(choice)} was ${
        wasCaptain ? "not " : ""
      }the {{success:Captain}} `;
    }
    const winners = state.player.roles
      .map((x, i) => i)
      .filter((x) =>
        state.winner === "agent"
          ? GameAgentRoles.includes(state.player.roles[x])
          : !GameAgentRoles.includes(state.player.roles[x])
      )
      .map(nameStr);
    msg += `${winners.join(", ")} have won!`;
    state.statusMessage = msg;
    state.chat.push({
      type: "system",
      content: `${winners.join(", ")} have won.`,
    });
    return state;
  },
  //#endregion

  //#region Actions
  updateTeamMembers(state: GameState, members: number[]): GameState {
    if (state.game.phase !== "team-building") {
      return state;
    }
    const team = last(state.teams);
    team.members = members;

    // Status
    const leader = team.leader;
    if (members.length === 0) {
      state.statusMessage = `{{name:${leader}}} is proposing a team`;
    } else {
      state.statusMessage = `{{name:${leader}}} has proposed ${members
        .map(nameStr)
        .join(", ")}`;
    }
    return state;
  },
  finishTeamBuilding(state: GameState) {
    const team = last(state.teams);
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
    // Chat
    const leader = last(state.teams).leader;
    state.chat.push({
      type: "system",
      content: `${nameStr(leader)} passed the proposal`,
    });

    return this.beginTeamBuilding(state, true, true);
  },
  sendProposalVote(state: GameState, player: number, vote: ProposalVote) {
    if (state.game.phase !== "voting") {
      return state;
    }
    const team = last(state.teams);
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
    const mission = last(state.missions);
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

    return state;
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
    // Return the result of a role list
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

    // Return the result of a custom role list
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

    // Get the roles that are known to a player
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
          if (
            !GameAgentRoles.includes(roleList[i]) &&
            roleList[i] !== "intern"
          ) {
            known.set(i, [roleList[i]]);
          }
        }
      }
      return known;
    },

    // Get the number of team proposals remaining
    getProposalsRemaining(teams: TeamHistory[]) {
      if (teams.length === 0) return 5;

      let count = 0;
      const mission = last(teams).mission;
      for (let i = teams.length - 1; i >= 0; i--) {
        if (teams[i].mission === mission) {
          count++;
        } else {
          break;
        }
      }
      return 5 - count;
    },

    // Return the result of a proposal votes
    getProposalVoteResult(votes: ProposalVote[]): "accept" | "reject" {
      let accept = 0;
      let reject = 0;
      for (const vote of votes) {
        if (vote === "accept") accept++;
        if (vote === "reject") reject++;
      }
      return accept > reject ? "accept" : "reject";
    },

    // Get the result of a mission (success/fail)
    getMissionResult(
      mission: MissionHistory,
      numPlayers: number
    ): MissionAction {
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
    // Return the winner of a game,
    // Based on winner, hammer, and assasin result
    getWinner(state: GameState): Team | null {
      if (GameFunc.util.getIsHammer(state)) {
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
    getIsHammer(state: GameState): boolean {
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
          GameFunc.util.getMissionResult(mission, state.player.names.length) ===
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
  },
};
