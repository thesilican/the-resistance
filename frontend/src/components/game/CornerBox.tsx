import { LobbyAction } from "common-modules";
import { useDispatch } from "react-redux";
import { ButtonLink } from "../common/ButtonLink";
import s from "./CornerBox.module.scss";

export default function CornerBox() {
  const dispatch = useDispatch();
  return (
    <div className={s.CornerBox}>
      <ButtonLink onClick={() => dispatch(LobbyAction.clientLeaveGame())}>
        Leave Game
      </ButtonLink>
    </div>
  );
}
