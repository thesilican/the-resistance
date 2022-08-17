import { GamePhaseLengths } from "common-modules";
import ProgressBar from "react-bootstrap/esm/ProgressBar";
import { useSelector } from "react-redux";
import { GameSelector } from "../../store";
import s from "./TopInfoBar.module.scss";

export default function TopInfoBar() {
  const mission = useSelector(GameSelector.missionNum);
  const phase = useSelector(GameSelector.gamePhase);
  const phaseCountdown = useSelector(GameSelector.gamePhaseCountdown);

  let text: string;
  const max = GamePhaseLengths[phase];
  switch (phase) {
    case "role-reveal":
      text = `Role Reveal`;
      break;
    case "team-building":
    case "team-building-review":
      text = `Mission ${mission} – Team Building`;
      break;
    case "voting":
    case "voting-review":
      text = `Mission ${mission} – Voting`;
      break;
    case "mission":
    case "mission-review":
      text = `Mission ${mission}`;
      break;
    case "finished-assassinate":
      text = `Assassination`;
      break;
    case "finished":
      text = `Game Finished`;
      break;
  }
  return (
    <div className={s.TopInfoBar}>
      <span className={s.title}>{text}</span>
      <ProgressBar
        className={s.progress}
        variant="primary"
        min={0}
        max={max}
        now={phaseCountdown}
      />
    </div>
  );
}
