import cn from "classnames";
import {
  count,
  GameFunc,
  Mission,
  MissionNeedDouble,
  MissionPlayerCount,
  range,
} from "common-modules";
import { Fragment } from "react";
import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Tooltip from "react-bootstrap/esm/Tooltip";
import { useSelector } from "react-redux";
import { GameSelector } from "../../store";
import { plural } from "../../util";
import { TFail, TName, TSuccess } from "../common/TextFormat";
import s from "./MissionIndicators.module.scss";

export default function MissionIndicators() {
  const missionNum = useSelector(GameSelector.missionNum);
  const teamHistory = useSelector(GameSelector.teamHistory);
  const proposalsRemaining = GameFunc.util.getProposalsRemaining(
    teamHistory,
    missionNum
  );
  const isHammer = proposalsRemaining === 1;

  return (
    <div className={s.MissionIndicators}>
      <span className={s.title}>
        Mission
        <br />
        Progress
      </span>
      {range(5).map((_, i) => (
        <MissionIndicator key={i} index={i} />
      ))}
      <div className={cn(s.proposals, { [s.hammer]: isHammer })}>
        <span className={s.label1}>{proposalsRemaining}/5</span>
        <span className={s.label2}>
          proposals
          <br />
          remaining
        </span>
      </div>
    </div>
  );
}

type MissionIndicatorProps = {
  index: number;
};

function MissionIndicator(props: MissionIndicatorProps) {
  const { index } = props;
  const teamHistory = useSelector(GameSelector.teamHistory);
  const numPlayers = useSelector(GameSelector.numPlayers);
  const missionHistory = useSelector(GameSelector.missionHistory);
  const missionNum = useSelector(GameSelector.missionNum);
  const mission = missionHistory[index] as Mission | undefined;

  const missionResult =
    mission && GameFunc.util.getMissionResult(mission, numPlayers);
  const active = missionNum === index + 1 && !missionResult;
  const success = missionResult === "success";
  const fail = missionResult === "fail";
  const double = MissionNeedDouble[numPlayers][index];

  const playersRequired = MissionPlayerCount[numPlayers][index];
  const numFails = mission && count(mission.actions, "fail");

  let teamLeader: number = -1;
  let teamMembers: number[] = [];
  for (let i = teamHistory.length - 1; i >= 0; i--) {
    if (teamHistory[i].mission === index + 1) {
      teamMembers = teamHistory[i].members;
      teamLeader = teamHistory[i].leader;
      break;
    }
  }

  const popover = (props: any) => (
    <Tooltip id="mission-indicator-tooltip" {...props}>
      <div className={s.tooltip}>
        {fail || success ? (
          <>
            <span className={s.header}>
              {fail ? (
                <TFail>Mission {index + 1} Failed</TFail>
              ) : (
                <TSuccess>Mission {index + 1} Success</TSuccess>
              )}
            </span>
            <span>{plural(numFails ?? 0, "fail")} detected</span>
            <span>
              {teamMembers.map((x, i) => (
                <Fragment key={i}>
                  {i !== 0 && ", "}
                  <TName idx={x} />
                </Fragment>
              ))}
              {" by "}
              <TName idx={teamLeader} />
            </span>
          </>
        ) : (
          <>
            <span className={s.title}>Mission {index + 1}</span>
            {active && <span>Current Mission</span>}
            {double && <span>2 fails required</span>}
          </>
        )}
      </div>
    </Tooltip>
  );

  return (
    <OverlayTrigger delay={0} placement="left" overlay={popover}>
      <div className={s.wrapper}>
        <div
          className={cn(s.indicator, {
            [s.fail]: fail,
            [s.success]: success,
            [s.active]: active,
            [s.double]: double,
          })}
        >
          <span className={s.label1}>{playersRequired}</span>
          <span className={s.label2}>players</span>
        </div>
      </div>
    </OverlayTrigger>
  );
}
