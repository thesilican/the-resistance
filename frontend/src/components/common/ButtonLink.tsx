import { ReactNode } from "react";
import s from "./ButtonLink.module.scss";

type ButtonLinkProps = {
  children: ReactNode;
  onClick?: () => void;
};
export function ButtonLink(props: ButtonLinkProps) {
  return (
    <button className={s.ButtonLink} onClick={props.onClick}>
      {props.children}
    </button>
  );
}
