import { configureStore } from "@reduxjs/toolkit";
import { GameAction, GameFunc, GameReducer, Role } from "../game";
import { inspect } from "util";

const roleList: Role[] = [
  "agent",
  "captain",
  "deputy",
  "spy",
  "assasin",
  "imposter",
  "intern",
  "mole",
];

for (let i = 0; i < roleList.length; i++) {
  console.log(roleList[i], GameFunc.getKnownRoles(i, roleList));
}

// const store = configureStore({
//   reducer: GameReducer,
// });

// store.dispatch(
//   GameAction.initialize({
//     names: ["alice", "bob", "charlie", "david", "edward"],
//     socketIDs: ["a", "b", "c", "d", "e"],
//     seed: 0,
//     gamemode: {
//       captain: true,
//       assasin: true,
//       deputy: true,
//       imposter: true,
//       intern: true,
//       mole: true,
//     },
//   })
// );

// while (store.getState().game.phase !== "team-building")
//   store.dispatch(GameAction.tick());

// store.dispatch(GameAction.passTeamBuilding());
// store.dispatch(GameAction.updateTeamMembers({ members: [0, 1] }));
// store.dispatch(GameAction.finishTeamBuilding());
// while (store.getState().game.phase !== "voting")
//   store.dispatch(GameAction.tick());

// // Accept votes
// for (let i = 0; i < 5; i++) {
//   store.dispatch(
//     GameAction.sendProposalVote({
//       player: i,
//       vote: "accept",
//     })
//   );
// }
// while (store.getState().game.phase !== "mission")
//   store.dispatch(GameAction.tick());

// // Player 1 and 2 are going on mission
// store.dispatch(
//   GameAction.sendMissionAction({
//     player: 0,
//     action: "fail",
//   })
// );
// store.dispatch(
//   GameAction.sendMissionAction({
//     player: 2,
//     action: "fail",
//   })
// );
// store.dispatch(
//   GameAction.sendMissionAction({
//     player: 1,
//     action: "fail",
//   })
// );
// while (store.getState().game.phase !== "team-building")
//   store.dispatch(GameAction.tick());

// logStore();

// function logStore() {
//   console.log(
//     inspect(store.getState(), { showHidden: false, depth: null, colors: true })
//   );
// }
