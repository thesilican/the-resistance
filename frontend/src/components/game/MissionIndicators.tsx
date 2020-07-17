import { MISSIONS } from "common-types";
import React, { Fragment } from "react";
import { useStore } from "../../store";

export default function MissionIndicators() {
  const [state] = useStore();
  if (!state.game) return null;
  const numRejectedMissions = state.game.teamHistory.filter((h) => {
    const accept = h.votes.filter((v) => v === "accept").length;
    const reject = h.votes.filter((v) => v === "reject").length;
    return h.missionNum === state.game!.missionNumber && accept <= reject;
  }).length;
  const missions = MISSIONS[state.game.players.length];
  const missionHistory: string[] = state.game?.missionHistory.map((v, i) =>
    v.success ? "success" : "fail"
  );
  if (missionHistory.length < 5) {
    missionHistory.push("next");
  }
  while (missionHistory.length < 5) {
    missionHistory.push("");
  }

  return (
    <div className="MissionIndicators">
      <div />
      <h3>Missions</h3>
      {missionHistory.map((t, i) => (
        <Fragment key={i}>
          {t === "next" ? (
            <svg
              key={i + "-1"}
              className="arrow"
              width="100%"
              height="100%"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <path d="M21.205,5.007c-0.429-0.444-1.143-0.444-1.587,0c-0.429,0.429-0.429,1.143,0,1.571l8.047,8.047H1.111  C0.492,14.626,0,15.118,0,15.737c0,0.619,0.492,1.127,1.111,1.127h26.554l-8.047,8.032c-0.429,0.444-0.429,1.159,0,1.587  c0.444,0.444,1.159,0.444,1.587,0l9.952-9.952c0.444-0.429,0.444-1.143,0-1.571L21.205,5.007z" />
            </svg>
          ) : (
            <div key={i + "-1"} />
          )}
          <MissionIcon
            key={i + "-2"}
            type={t as ""}
            square={missions[i] < 0}
            numPlayers={Math.abs(missions[i])}
          />
        </Fragment>
      ))}
      <div />
      <span className="hammer">
        <span className="hammer-num">{numRejectedMissions}/5</span>
        <br />
        rejected
      </span>
    </div>
  );
}

type MissionIconProps = {
  numPlayers: number;
  type: "" | "fail" | "success";
  square: boolean;
};

function MissionIcon({ type, square, numPlayers }: MissionIconProps) {
  return (
    <div className={"MissionIcon " + type + (square ? " square" : "")}>
      <span className="num-players">{numPlayers}</span>
      <span className="players">players</span>
    </div>
  );
}
