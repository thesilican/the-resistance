import {
  ServerGameState,
  PHASE_LENGTHS,
  NUM_AGENTS_SPIES,
  GameRequest,
  ClientGameState,
  Role,
  Action,
  GAME_PHASE_ORDER,
  MissionHistory,
  MISSIONS,
  SystemChatMessage,
  ChatMessage,
  MissionAction,
  ColorOrder,
} from "common-types";
import { ISocket, ISocketIO } from "./ISocket";
import { Util } from "./Util";
import { LobbyMember } from "./Lobby";
import { stat } from "fs";

const defaultGameState: ServerGameState = {
  players: [],
  roles: [],
  playerDisconnected: [],
  gamePhase: "role-reveal",
  gamePhaseCountdown: PHASE_LENGTHS["role-reveal"],
  missionNumber: 1,
  teamLeader: -1,
  teamMembers: [],
  teamProposalVote: [],
  missionActions: {},
  teamHistory: [],
  missionHistory: [],
  chatHistory: [],
  statusMessage: "Welcome to The Resistance!",
  colorOrder: [],
};

export type GameOptions = {
  players: LobbyMember[];
  io: ISocketIO;
  roomID: string;
};

export class Game {
  roomID: string;
  io: ISocketIO;
  socketIDs: (string | null)[];
  state: ServerGameState;
  interval: NodeJS.Timeout | null;

  constructor(options: GameOptions) {
    this.state = Util.deepCopy(defaultGameState);
    this.socketIDs = [];
    this.io = options.io;
    this.roomID = options.roomID;
    this.interval = null;

    this.initialize(options);
  }

  private initialize(options: GameOptions) {
    let playerAndColors = options.players.map((v, i) => ({
      player: v,
      color: ColorOrder[i],
    }));
    playerAndColors = Util.shuffle(playerAndColors);
    const players = playerAndColors.map((x) => x.player);
    const colors = playerAndColors.map((x) => x.color);
    this.state.players = players.map((p) => p.name);
    this.socketIDs = players.map((p) => p.id);
    this.state.colorOrder = colors;

    const numPlayers = this.state.players.length;
    const roleNums = NUM_AGENTS_SPIES[numPlayers];
    if (roleNums === undefined) {
      throw "Invalid number of players";
    }
    let roles = [
      ...(Array(roleNums[0]).fill("agent") as "agent"[]),
      ...(Array(roleNums[1]).fill("spy") as "spy"[]),
    ];
    roles = Util.shuffle(roles);
    this.state.roles = roles;
    this.state.playerDisconnected = this.state.players.map((_) => false);
  }

  start() {
    for (const socketID of this.socketIDs) {
      if (!socketID) {
        throw "up";
      }
      const state = this.getClientState(socketID);
      this.io.to(socketID).emit("message", {
        category: "game",
        type: "join-game",
        state,
      });
    }

    // Start the clock
    this.interval = setInterval(this.tick.bind(this), 1000);
  }

  onLeave(socket: ISocket) {
    const index = this.socketIDs.indexOf(socket.id);
    this.socketIDs[index] = null;
    this.state.playerDisconnected[index] = true;

    socket.emit("message", {
      category: "game",
      type: "leave-game",
    });
    this.io.to(this.roomID).emit("message", {
      category: "game",
      type: "player-leave-game",
      index,
    });
  }
  onRejoin(socket: ISocket, index: number) {
    if (this.socketIDs[index] !== null) {
      return;
    }
    this.socketIDs[index] = socket.id;
    this.state.playerDisconnected[index] = false;

    const state = this.getClientState(socket.id);
    socket.emit("message", {
      category: "game",
      type: "join-game",
      state,
    });
    this.io.to(this.roomID).emit("message", {
      category: "game",
      type: "player-rejoin-game",
      index,
    });
  }
  onMessage(socket: ISocket, message: GameRequest) {
    let index: number;
    switch (message.type) {
      case "update-team-proposal":
        if (this.state.gamePhase !== "team-building") break;
        this.state.teamMembers = message.teamMembers;
        this.io.to(this.roomID).emit("message", {
          category: "game",
          type: "update-team-members",
          members: message.teamMembers,
        });
        let statusMessage = "";
        if (this.state.teamMembers.length === 0) {
          const required = this.getMissionNumPlayers();
          statusMessage = `[[${this.state.teamLeader}]] is picking ${required} players to go on a mission`;
        } else {
          const teamMembers = Util.joinGrammatically(
            this.state.teamMembers.map((m) => `[[${m}]]`)
          );
          statusMessage = `[[${this.state.teamLeader}]] has picked ${teamMembers} to go on the mission`;
        }

        this.updateStatus(statusMessage, true);
        break;
      case "done-team-proposal":
        if (this.state.gamePhase !== "team-building") break;
        this.state.gamePhaseCountdown = 0;
        break;
      case "skip-team-proposal":
        if (this.state.gamePhase !== "team-building") break;
        this.state.teamMembers = [];
        socket.in(this.roomID).emit("message", {
          category: "game",
          type: "update-team-members",
          members: [],
        });
        this.state.gamePhaseCountdown = 0;
        break;
      case "send-vote":
        if (this.state.gamePhase !== "voting") break;
        index = this.socketIDs.indexOf(socket.id);
        if (index !== -1) {
          this.state.teamProposalVote[index] = message.vote;
        }
        if (this.state.teamProposalVote.indexOf("none") === -1) {
          this.state.gamePhaseCountdown = 0;
        }
        socket.emit("message", {
          category: "game",
          type: "set-vote",
          vote: message.vote,
        });
        break;
      case "send-mission-action":
        if (this.state.gamePhase !== "mission") break;
        index = this.socketIDs.indexOf(socket.id);
        if (index !== -1) {
          this.state.missionActions[index] = message.action;
          socket.emit("message", {
            category: "game",
            type: "set-mission-action",
            missionAction: message.action,
          });
          let found = false;
          for (const k in this.state.missionActions) {
            if (this.state.missionActions[k] === null) {
              found = true;
              break;
            }
          }
          if (!found) {
            this.state.gamePhaseCountdown = 0;
          }
        }
        break;
      case "send-chat-message":
        index = this.socketIDs.indexOf(socket.id);
        this.sendChatMessage(message.content, index === -1 ? undefined : index);
        break;
    }
  }

  // #region Tick
  tick() {
    if (this.state.gamePhaseCountdown > 0) {
      this.state.gamePhaseCountdown--;
      this.io.to(this.roomID).emit("message", {
        category: "game",
        type: "update-game-phase",
        countdown: this.state.gamePhaseCountdown,
      });
      return;
    }
    switch (this.state.gamePhase) {
      case "role-reveal":
        this.state.gamePhase = "team-building";
        this.state.gamePhaseCountdown = PHASE_LENGTHS[this.state.gamePhase];
        this.tick_team_building();
        break;
      case "team-building":
        this.state.gamePhase = "team-building-review";
        this.state.gamePhaseCountdown = PHASE_LENGTHS[this.state.gamePhase];
        this.tick_team_building_review();
        break;
      case "team-building-review":
        const required = this.getMissionNumPlayers();
        if (this.state.teamMembers.length !== required) {
          this.state.gamePhase = "team-building";
          this.state.gamePhaseCountdown = PHASE_LENGTHS[this.state.gamePhase];
          this.tick_team_building();
        } else {
          this.state.gamePhase = "voting";
          this.state.gamePhaseCountdown = PHASE_LENGTHS[this.state.gamePhase];
          this.tick_voting();
        }
        break;
      case "voting":
        this.state.gamePhase = "voting-review";
        this.state.gamePhaseCountdown = PHASE_LENGTHS[this.state.gamePhase];
        this.tick_voting_review();
        break;
      case "voting-review":
        const hist = this.state.teamHistory[this.state.teamHistory.length - 1];
        const accept = hist.votes.filter((v) => v === "accept").length;
        const reject = hist.votes.filter((v) => v === "reject").length;
        if (this.getHammer()) {
          if (this.tick_check_win()) {
            break;
          }
          this.state.gamePhase = "team-building";
          this.state.gamePhaseCountdown = PHASE_LENGTHS[this.state.gamePhase];
          this.tick_team_building();
        } else if (accept <= reject) {
          this.state.gamePhase = "team-building";
          this.state.gamePhaseCountdown = PHASE_LENGTHS[this.state.gamePhase];
          this.tick_team_building();
        } else {
          this.state.gamePhase = "mission";
          this.state.gamePhaseCountdown = PHASE_LENGTHS[this.state.gamePhase];
          this.tick_mission();
        }
        break;
      case "mission":
        this.state.gamePhase = "mission-review";
        this.state.gamePhaseCountdown = PHASE_LENGTHS[this.state.gamePhase];
        this.tick_mission_review();
        break;
      case "mission-review":
        if (this.tick_check_win()) {
          break;
        }
        this.state.gamePhase = "team-building";
        this.state.gamePhaseCountdown = PHASE_LENGTHS[this.state.gamePhase];
        this.tick_team_building();
        break;
      case "finished":
        // Should never happen
        // As the timer is cleared once the game reaches a finished state
        throw "up";
    }
    this.io.to(this.roomID).emit("message", {
      category: "game",
      type: "update-game-phase",
      countdown: this.state.gamePhaseCountdown,
      gamePhase: this.state.gamePhase,
      missionNum: this.state.missionNumber,
    });
  }

  tick_check_win() {
    let history = this.state.missionHistory.map((v, i) => v.success);
    const agentWin = history.filter((x) => x).length >= 3;
    const spyWin = history.filter((x) => !x).length >= 3;
    if (spyWin || agentWin) {
      this.state.gamePhase = "finished";
      this.state.gamePhaseCountdown = PHASE_LENGTHS["finished"];
      this.state.winners = spyWin ? "spy" : "agent";
      this.io.to(this.roomID).emit("message", {
        category: "game",
        type: "finish-game",
        spies: this.state.roles
          .map((v, i) => (v === "spy" ? i : null))
          .filter((v) => v !== null) as number[],
        winners: this.state.winners,
      });
      const winnerNames = (this.state.roles
        .map((r, i) =>
          (r === "spy" && spyWin) || (r === "agent" && agentWin) ? i : null
        )
        .filter((x) => x !== null) as number[]).map((r) => `[[${r}]]`);
      const message = Util.joinGrammatically(winnerNames) + " have won!";
      this.updateStatus(message, true);
      if (this.interval) {
        clearInterval(this.interval);
      }
      return true;
    }
    return false;
  }
  tick_team_building() {
    this.state.teamLeader =
      (this.state.teamLeader + 1) % this.state.players.length;
    this.state.teamMembers = [];
    this.io.to(this.roomID).emit("message", {
      category: "game",
      type: "new-team-building",
      leader: this.state.teamLeader,
    });
    const required = this.getMissionNumPlayers();
    const statusMessage = `[[${this.state.teamLeader}]] is picking ${required} players to go on a mission`;
    this.updateStatus(statusMessage, true);
  }
  tick_team_building_review() {
    const required = this.getMissionNumPlayers();
    let statusMessage = "";
    if (this.state.teamMembers.length !== required) {
      statusMessage = `[[${this.state.teamLeader}]] ran out of time to pick a team`;
    } else {
      const teamMembers = Util.joinGrammatically(
        this.state.teamMembers.map((m) => `[[${m}]]`)
      );
      statusMessage = `[[${this.state.teamLeader}]] has picked ${teamMembers} to go on the mission`;
    }
    this.updateStatus(statusMessage);
  }
  tick_voting() {
    this.state.teamProposalVote = this.state.players.map((_) => "none");
    this.io.to(this.roomID).emit("message", {
      category: "game",
      type: "new-voting-phase",
    });
    const teamMembers = Util.joinGrammatically(
      this.state.teamMembers.map((m) => `[[${m}]]`)
    );
    const statusMessage = `[[${this.state.teamLeader}]] has picked ${teamMembers} to go on the mission`;
    this.updateStatus(statusMessage, true);
  }
  tick_voting_review() {
    const newTeamHistory = {
      missionNum: this.state.missionNumber,
      leader: this.state.teamLeader,
      members: this.state.teamMembers,
      votes: this.state.teamProposalVote,
    };
    this.state.teamHistory.push(newTeamHistory);
    this.io.to(this.roomID).emit("message", {
      category: "game",
      type: "update-team-history",
      newHistory: newTeamHistory,
    });

    const acceptVotes = newTeamHistory.votes.filter((v) => v === "accept")
      .length;
    const rejectVotes = newTeamHistory.votes.filter((v) => v === "reject")
      .length;
    let statusMessage = "";
    if (acceptVotes <= rejectVotes) {
      statusMessage =
        `[[${this.state.teamLeader}]]'s team was REJECTED ` +
        `with a vote of [[success:${acceptVotes}]] to [[fail:${rejectVotes}]]`;
      if (this.getHammer()) {
        statusMessage +=
          ". The spies win the mission, because 5 team proposals were rejected consecutively";
        const newMission = {
          actions: "hammer" as "hammer",
          success: false,
        };
        this.state.missionHistory.push(newMission);
        this.state.missionNumber += 1;
        this.io.to(this.roomID).emit("message", {
          category: "game",
          type: "update-mission-history",
          newMission,
        });
      }
    } else {
      statusMessage =
        `[[${this.state.teamLeader}]]'s team was ACCEPTED ` +
        `with a vote of [[success:${acceptVotes}]] to [[fail:${rejectVotes}]]`;
    }
    this.updateStatus(statusMessage);

    const votesFor = this.state.teamProposalVote
      .map((v, i) => (v === "accept" ? `[[${i}]]` : null))
      .filter((v) => v !== null);
    const votesAgainst = this.state.teamProposalVote
      .map((v, i) => (v === "reject" ? `[[${i}]]` : null))
      .filter((v) => v !== null);
    this.sendChatMessage(`Accept Votes: ${votesFor.join(" ")}`);
    this.sendChatMessage(`Reject Votes: ${votesAgainst.join(" ")}`);
  }
  tick_mission() {
    this.state.missionActions = {};
    for (const index of this.state.teamMembers) {
      this.state.missionActions[index] = null;
    }
    this.io.to(this.roomID).emit("message", {
      category: "game",
      type: "new-mission-action",
    });
    const teamMembers = Util.joinGrammatically(
      this.state.teamMembers.map((m) => `[[${m}]]`)
    );
    const statusMessage = `${teamMembers} are going on a mission`;
    this.updateStatus(statusMessage, true);
  }
  tick_mission_review() {
    let numFails = 0;
    for (const k in this.state.missionActions) {
      if (this.state.missionActions[k] === null)
        this.state.missionActions[k] = "succeed";
      if (this.state.missionActions[k] === "fail") numFails++;
    }
    const result: MissionHistory = {
      actions: this.state.missionActions as { [id: number]: MissionAction },
      success: numFails < (this.getMissionRequiresTwo() ? 2 : 1),
    };
    this.state.missionHistory.push(result);
    this.state.missionNumber += 1;
    this.io.to(this.roomID).emit("message", {
      category: "game",
      type: "update-mission-history",
      newMission: result,
    });

    let numFail = 0;
    for (const k in this.state.missionActions) {
      if (this.state.missionActions[k] === "fail") numFail++;
    }
    let statusMessage = "";
    if (result.success) {
      statusMessage = `The mission was [[success:SUCCESSFUL]]. (${Util.plural(
        numFail,
        "fail"
      )} detected)`;
    } else {
      statusMessage = `The mission [[fail:FAILED]]. (${Util.plural(
        numFail,
        "fail"
      )} detected)`;
    }
    this.updateStatus(statusMessage);
  }
  // #endregion

  getClientState(id: string): ClientGameState {
    let playerIndex = this.socketIDs.indexOf(id);
    let role: Role = "agent";
    let spies: number[] | undefined = undefined;
    let winners: Role | undefined = undefined;
    if (playerIndex !== -1) {
      role = this.state.roles[playerIndex];
      if (role === "spy") {
        spies = this.state.roles.reduce((a, v, i) => {
          if (v === "spy") {
            return [...a, i];
          }
          return a;
        }, [] as number[]);
      }
    }

    return {
      players: this.state.players,
      playerIndex,
      role,
      spies,
      winners: this.state.winners,
      playerDisconnected: this.state.playerDisconnected,
      gamePhase: this.state.gamePhase,
      gamePhaseCountdown: this.state.gamePhaseCountdown,
      missionNumber: this.state.missionNumber,
      teamLeader: this.state.teamLeader,
      teamMembers: this.state.teamMembers,
      teamHistory: this.state.teamHistory,
      teamProposalVote: null,
      missionAction: null,
      missionHistory: this.state.missionHistory,
      chatHistory: this.state.chatHistory,
      statusMessage: this.state.statusMessage,
      colorOrder: this.state.colorOrder,
    };
  }
  sendChatMessage(message: string, playerIndex?: number) {
    let chatMessage: ChatMessage;
    if (playerIndex !== undefined) {
      chatMessage = {
        type: "player",
        content: message,
        player: playerIndex,
      };
    } else {
      chatMessage = {
        type: "system",
        content: message,
      };
    }
    this.state.chatHistory.push(chatMessage);
    this.io.to(this.roomID).emit("message", {
      category: "game",
      type: "new-chat-message",
      chatMessage,
    });
  }
  updateStatus(message: string, noChatMessage = false) {
    this.state.statusMessage = message;
    this.io.to(this.roomID).emit("message", {
      category: "game",
      type: "update-status-message",
      message: message,
    });
    if (!noChatMessage) this.sendChatMessage(message);
  }
  getMissionNumPlayers(missionNum?: number) {
    if (!missionNum) {
      missionNum = this.state.missionNumber;
    }
    return Math.abs(MISSIONS[this.state.players.length][missionNum - 1]);
  }
  getMissionRequiresTwo(missionNum?: number) {
    if (!missionNum) {
      missionNum = this.state.missionNumber;
    }
    return MISSIONS[this.state.players.length][missionNum - 1] < 0;
  }
  getHammer() {
    return (
      this.state.teamHistory.filter((h) => {
        const accept = h.votes.filter((v) => v === "accept").length;
        const reject = h.votes.filter((v) => v === "reject").length;
        return h.missionNum === this.state.missionNumber && accept <= reject;
      }).length === 5
    );
  }
}
