import React, { Fragment } from "react";
import { Button } from "react-bootstrap";

type UserListProps = {
  title: string;
  names: string[];
  index: number;
  host: number;
  showReconnect: boolean;
  reconnect?: boolean[];
  onReconnect?: (id: number) => void;
};

export default function UserList({
  names,
  title,
  index,
  host,
  showReconnect,
  reconnect,
  onReconnect = () => {},
}: UserListProps) {
  return (
    <>
      <h2>{title}</h2>
      <div className="UserList">
        {names.map((name, i) => {
          if (showReconnect && reconnect && reconnect[i]) {
            return (
              <Fragment key={i}>
                <span key={i + "-1"}>
                  {name + (i === host ? " (Host)" : "")}
                </span>
                <Button onClick={() => onReconnect(i)} key={i + "-2"}>
                  Rejoin
                </Button>
              </Fragment>
            );
          } else {
            return (
              <Fragment key={i}>
                <span key={i + "-1"}>
                  {name + (i === host ? " (Host)" : "")}
                </span>
                <div key={i + "-2"} />
              </Fragment>
            );
          }
        })}
      </div>
    </>
  );
}
