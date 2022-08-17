import cn from "classnames";
import {
  GameAgentRoles,
  GameFunc,
  GameRolesDisplay,
  GameRolesOrder,
  Role,
} from "common-modules";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { GameSelector } from "../../store";
import s from "./TextFormat.module.scss";

const splitPattern = /({{(?:success|fail|role|name):.*?}})/;
const matchPattern = /{{(success|fail|role|name):(.*?)}}/;
type TFProps = {
  className?: string;
  children: string;
};
export default function TF(props: TFProps) {
  const splits = props.children.split(splitPattern);
  const results: ReactNode[] = [];
  for (let i = 0; i < splits.length; i++) {
    if (i % 2 === 0) {
      results.push(splits[i]);
      continue;
    }
    const match = splits[i].match(matchPattern);
    if (!match) throw new Error("expected match");
    if (match[1] === "success") {
      results.push(<TSuccess key={i}>{match[2]}</TSuccess>);
    } else if (match[1] === "fail") {
      results.push(<TFail key={i}>{match[2]}</TFail>);
    } else if (match[1] === "name") {
      const idx = parseInt(match[2], 10);
      results.push(<TName key={i} idx={idx} />);
    } else if (match[1] === "role") {
      if (GameRolesOrder.includes(match[2] as Role)) {
        results.push(<TRole key={i} role={match[2] as Role} />);
      } else {
        results.push(<span>(unknown role)</span>);
      }
    }
  }
  return <span className={props.className}>{results}</span>;
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
    return <span>(unknown name)</span>;
  }
  return <span className={s[color]}>{name}</span>;
}

type TFFailProps = {
  children: ReactNode;
};

export function TFail(props: TFFailProps) {
  return <span className={s.fail}>{props.children}</span>;
}

type TFSuccessProps = {
  children: ReactNode;
};

export function TSuccess(props: TFSuccessProps) {
  return <span className={s.success}>{props.children}</span>;
}
