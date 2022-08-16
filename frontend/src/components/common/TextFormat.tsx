import {
  GameAgentRoles,
  GameFunc,
  GameRolesDisplay,
  Role,
} from "common-modules";
import { useSelector } from "react-redux";
import { GameSelector } from "../../store";
import s from "./TextFormat.module.scss";
import cn from "classnames";

export default function TF(props: { children: string }) {
  return <></>;
}

type RoleProps = {
  className?: string;
  role: Role;
};

export function TRole(props: RoleProps) {
  const agent = GameAgentRoles.includes(props.role);
  return (
    <span className={cn(agent ? s.success : s.fail, props.className)}>
      {GameRolesDisplay.get(props.role)}
    </span>
  );
}

type NameProps = {
  idx: number;
};

export function TName(props: NameProps) {
  const names = useSelector(GameSelector.names);
  const colors = GameFunc.util.getColorOrder(names);
  const name = names[props.idx];
  const color = colors[props.idx];
  if (!name || !color) {
    throw new Error("error retrieving name with index: " + props.idx);
  }
  return <span className={s[color]}>{name}</span>;
}

type TFFailProps = {
  children: string;
};

export function TFail(props: TFFailProps) {
  return <span className={s.fail}>{props.children}</span>;
}

type TFSuccessProps = {
  children: string;
};

export function TSuccess(props: TFSuccessProps) {
  return <span className={s.success}>{props.children}</span>;
}
