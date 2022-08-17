import { shuffle, nameStr, count, plural, last } from "../util";
import {
  ColorOrderDefault,
  GameAgentRoles,
  GameMaxPlayers,
  GameMinPlayers,
  GamePhaseLengths,
  MissionNeedDouble,
  MissionPlayerCount,
  TeamPoolsAssassins,
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
  Alligance,
  Team,
  Mission,
  Color,
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

    const roles = GameFunc.util.getRoleList(numPlayers, options.gamemode);
    if (roles === null) return null;
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
      mission: null,
      missionHistory: [],
      team: null,
      teamHistory: [],
      chat: [],
      statusMessage: "Welcome to the Resistance",
      assassinChoice: null,
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
        return GameFunc.begin.teamBuilding(state);
      case "team-building":
        // Inactivity
        return GameFunc.action.passTeamBuilding(state);
      case "team-building-review":
        return GameFunc.begin.voting(state);
      case "voting":
        return this.begin.votingReview(state);
      case "voting-review":
        const team = last(state.teamHistory)!;
        const res = GameFunc.util.getProposalVoteResult(team.votes);
        if (res === "accept") {
          return GameFunc.begin.mission(state);
        } else {
          if (GameFunc.util.getIsHammer(state)) {
            return GameFunc.begin.finished(state);
          } else {
            return this.begin.teamBuilding(state, true);
          }
        }
      case "mission":
        return GameFunc.begin.missionReview(state);
      case "mission-review":
        const winner = GameFunc.util.getWinnerFromMissions(state);
        if (winner === null) {
          return GameFunc.begin.teamBuilding(state);
        } else {
          if (state.player.roles.includes("assassin") && winner === "agent") {
            return GameFunc.begin.finishedAssassinate(state);
          } else {
            return GameFunc.begin.finished(state);
          }
        }
      case "finished-assassinate":
        return GameFunc.begin.finished(state);
      case "finished":
        // Should never happen
        return state;
    }
  },
  begin: {
    teamBuilding(
      state: GameState,
      noMissionIncrement = false,
      pass = false
    ): GameState {
      state.game.phase = "team-building";
      state.game.phaseCountdown = GamePhaseLengths["team-building"];
      if (!noMissionIncrement) {
        state.game.mission += 1;
      }

      const prev = last(state.teamHistory);
      let nextLeader: number;
      if (pass) {
        nextLeader = (state.team!.leader + 1) % state.player.names.length;
      } else if (prev === null) {
        nextLeader = 0;
      } else {
        nextLeader = (prev.leader + 1) % state.player.names.length;
      }
      state.team = {
        mission: state.game.mission,
        leader: nextLeader,
        members: [],
        votes: [],
      };

      // Status
      state.statusMessage = `{{name:${nextLeader}}} is proposing a team`;
      return state;
    },
    teamBuildingReview(state: GameState): GameState {
      state.game.phase = "team-building-review";
      state.game.phaseCountdown = GamePhaseLengths["team-building-review"];

      // Chat
      const leader = state.team!.leader;
      const members = state.team!.members;
      state.statusMessage = `{{name:${leader}}} has proposed ${members
        .map(nameStr)
        .join(", ")}`;
      state.chat.push({
        type: "system",
        content: `{{name:${leader}}} has proposed ${members
          .map(nameStr)
          .join(", ")}`,
      });
      return state;
    },
    voting(state: GameState): GameState {
      state.game.phase = "voting";
      state.game.phaseCountdown = GamePhaseLengths["voting"];

      state.team!.votes = state.player.names.map(() => "none");
      return state;
    },
    votingReview(state: GameState): GameState {
      state.game.phase = "voting-review";
      state.game.phaseCountdown = GamePhaseLengths["voting-review"];

      // Archive team
      const team = state.team!;
      state.teamHistory.push(team);
      state.team = null;

      // Chat/status
      let msg = "";
      const res = GameFunc.util.getProposalVoteResult(team.votes);
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
    mission(state: GameState): GameState {
      state.game.phase = "mission";
      state.game.phaseCountdown = GamePhaseLengths["mission"];

      // Archive team
      const team = last(state.teamHistory)!;

      const members = team.members.sort((a, b) => a - b);
      const actions = members.map(() => null);
      const mission = {
        mission: state.game.mission,
        members,
        actions,
      };
      state.mission = mission;

      // Status
      const membersStr = members.map(nameStr);
      state.statusMessage = `${membersStr.join(", ")} are going on a mission`;

      return state;
    },
    missionReview(state: GameState): GameState {
      state.game.phase = "mission-review";
      state.game.phaseCountdown = GamePhaseLengths["mission-review"];
      // Archive mission
      const mission = state.mission!;
      state.missionHistory.push(mission);
      state.mission = null;

      // Chat/status
      let msg = "";
      const res = GameFunc.util.getMissionResult(
        mission,
        state.player.socketIDs.length
      );
      if (res === "success") {
        msg += `Mission ${mission.mission} {{success:SUCCESSFUL}} `;
      } else if (res === "fail") {
        msg += `Mission ${mission.mission} {{fail:FAILED}} `;
      }
      const numFails = count(mission.actions, "fail");
      msg += `(${plural(numFails, "fail")} detected)`;
      state.statusMessage = msg;
      state.chat.push({
        type: "system",
        content: msg,
      });

      return state;
    },
    finishedAssassinate(state: GameState): GameState {
      state.game.phase = "finished-assassinate";
      state.game.phaseCountdown = GamePhaseLengths["finished-assassinate"];

      const assassin = state.player.roles.indexOf("assassin");
      let msg = `${nameStr(assassin)} is picking a player to assassinate`;
      state.statusMessage = msg;
      state.chat.push({
        type: "system",
        content: msg,
      });

      return state;
    },
    finished(state: GameState): GameState {
      state.game.phase = "finished";
      state.game.phaseCountdown = GamePhaseLengths["finished"];

      state.winner = GameFunc.util.getWinner(state);

      // Chat/status
      let msg = "";
      if (GameFunc.util.getIsHammer(state)) {
        msg += "The agents have ran out of proposals. ";
      }
      if (state.assassinChoice !== null) {
        const choice = state.assassinChoice;
        const wasCaptain = state.player.roles[choice] === "captain";
        msg += `${nameStr(choice)} was ${
          wasCaptain ? "" : "not "
        }the {{success:Captain}}. `;
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
  },
  action: {
    updateTeamMembers(state: GameState, members: number[]): GameState {
      if (state.game.phase !== "team-building") {
        return state;
      }
      const team = state.team!;
      team.members = members;

      // Status
      const leader = team.leader;
      if (members.length === 0) {
        state.statusMessage = `{{name:${leader}}} is proposing a team`;
      } else {
        state.statusMessage = `{{name:${leader}}} is proposing ${members
          .map(nameStr)
          .join(", ")}`;
      }
      return state;
    },
    finishTeamBuilding(state: GameState): GameState {
      if (state.game.phase !== "team-building") {
        return state;
      }
      const team = state.team!;
      const reqPlayers =
        MissionPlayerCount[state.player.names.length][team?.mission - 1];
      if (team?.members.length !== reqPlayers) {
        // This really should never happen, because the UI should prevent
        // people from submitting non-full teams
        return state;
      } else {
        return GameFunc.begin.teamBuildingReview(state);
      }
    },
    passTeamBuilding(state: GameState): GameState {
      if (state.game.phase !== "team-building") {
        return state;
      }
      // Chat
      const leader = state.team!.leader;
      state.chat.push({
        type: "system",
        content: `${nameStr(leader)} passed the proposal`,
      });

      return GameFunc.begin.teamBuilding(state, true, true);
    },
    sendProposalVote(
      state: GameState,
      player: number,
      vote: ProposalVote
    ): GameState {
      if (state.game.phase !== "voting") {
        return state;
      }
      const team = state.team!;
      team.votes[player] = vote;
      if (team.votes.includes("none")) {
        return state;
      } else {
        return GameFunc.begin.votingReview(state);
      }
    },
    sendMissionAction(
      state: GameState,
      player: number,
      action: MissionAction
    ): GameState {
      if (state.game.phase !== "mission") {
        return state;
      }
      const mission = state.mission!;
      const index = mission.members.indexOf(player);
      if (index === -1) {
        return state;
      }
      mission.actions[index] = action;

      if (mission.actions.indexOf(null) !== -1) {
        return state;
      }
      return GameFunc.begin.missionReview(state);
    },
    updateAssassinChoice(state: GameState, player: number): GameState {
      if (state.game.phase !== "finished-assassinate") {
        return state;
      }
      state.assassinChoice = player;
      return state;
    },
    finishAssassinChoice(state: GameState): GameState {
      if (state.game.phase !== "finished-assassinate") {
        return state;
      }
      return GameFunc.begin.finished(state);
    },
    newChatMessage(state: GameState, message: ChatMessage): GameState {
      if (message.type === "player" && message.content.length > 200) {
        return state;
      }
      state.chat.push(message);
      return state;
    },
  },
  util: {
    // Return the result of a role list
    getRoleList(
      numPlayers: number,
      options: "normal" | "assassins" | GameCustomRoleOptions
    ): Role[] | null {
      if (options === "normal") {
        return TeamPoolsNormal[numPlayers].slice();
      } else if (options === "assassins") {
        return TeamPoolsAssassins[numPlayers].slice();
      } else {
        return this.getCustomRoleList(numPlayers, options);
      }
    },

    // Return the result of a custom role list
    getCustomRoleList(
      numPlayers: number,
      roleOptions: GameCustomRoleOptions
    ): Role[] | null {
      if (numPlayers < GameMinPlayers || numPlayers > GameMaxPlayers)
        return null;
      const pool = TeamPoolsNormal[numPlayers].slice();
      const numAgents = pool.reduce((a, v) => (v === "agent" ? a + 1 : a), 0);
      const numSpies = pool.reduce((a, v) => (v === "spy" ? a + 1 : a), 0);

      const roleList: Role[] = [];
      // Agents
      const agentRoles: Role[] = [];
      const spyRoles: Role[] = [];
      if (roleOptions.captain) agentRoles.push("captain");
      if (roleOptions.deputy) agentRoles.push("deputy");
      if (roleOptions.assassin) spyRoles.push("assassin");
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
      } else if (["spy", "assassin", "imposter", "mole"].includes(playerRole)) {
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
    getProposalsRemaining(teams: Team[], mission: number) {
      let count = 0;
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
    getMissionResult(mission: Mission, numPlayers: number): MissionAction {
      const requiresTwo = MissionNeedDouble[numPlayers][mission.mission - 1];
      const failCount = count(mission.actions, "fail");
      if (failCount >= 2 || (!requiresTwo && failCount >= 1)) {
        return "fail";
      } else {
        return "success";
      }
    },
    // Return the winner of a game,
    // Based on winner, hammer, and assassin result
    getWinner(state: GameState): Alligance | null {
      if (GameFunc.util.getIsHammer(state)) {
        return "spy";
      }
      const winner = GameFunc.util.getWinnerFromMissions(state);
      if (winner === null || winner === "spy") {
        return winner;
      } else if (winner === "agent") {
        if (!state.player.roles.includes("assassin")) return "agent";
        if (state.assassinChoice === null) return "agent";
        const assassinated = state.player.roles[state.assassinChoice];
        if (assassinated === "captain") {
          return "spy";
        } else {
          return "agent";
        }
      }
      throw "up"; // How did you even get here
    },
    // Returns whether or not the last 5 team proposals were failed
    getIsHammer(state: GameState): boolean {
      return (
        GameFunc.util.getProposalsRemaining(
          state.teamHistory,
          state.game.mission
        ) === 0
      );
    },
    // Returns the winner, based on missions only
    getWinnerFromMissions(state: GameState): Alligance | null {
      let fail = 0,
        success = 0;
      for (const mission of state.missionHistory) {
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
    getColorOrder(names: string[]): Color[] {
      if (names.length > GameMaxPlayers) {
        return ColorOrderDefault;
      }
      // Basically makes it so that
      // colors are assigned alphabetically
      const mixed = names
        .map((x, i) => [x, ColorOrderDefault[i]] as [string, Color])
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map((x) => x[1]);
      return mixed;
    },
  },
};
