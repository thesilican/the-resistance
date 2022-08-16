import { useSelector } from "react-redux";
import { GameSelector } from "../../store";
import TextTransformer from "../common/TextFormat";
import s from "./StatusMessage.module.scss";

export default function StatusMessage() {
  const statusMessage = useSelector(GameSelector.statusMessage);
  return (
    <div className={s.StatusMessage}>
      <span className={s.text}>
        <TextTransformer>{statusMessage ?? ""}</TextTransformer>
      </span>
    </div>
  );
}
