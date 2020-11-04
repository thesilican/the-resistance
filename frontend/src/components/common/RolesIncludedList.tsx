import { GameAgentRoles, Role, GameRolesOrder } from "common-modules";
import React from "react";
import TextTransformer from "./TextTransformer";

type RolesIncludedListProps = {
  rolesList: Role[];
};

export default function RolesIncludedList(props: RolesIncludedListProps) {
  const { rolesList } = props;
  console.log(rolesList);
  const rolesListMap = rolesList
    .slice()
    .sort((a, b) => GameRolesOrder.indexOf(a) - GameRolesOrder.indexOf(b))
    .reduce((a, v) => {
      if (a.has(v)) {
        a.set(v, a.get(v)! + 1);
      } else {
        a.set(v, 1);
      }
      return a;
    }, new Map<Role, number>());
  const rolesListMapArr = Array.from(rolesListMap.entries());
  return (
    <>
      Roles:
      <br />
      <TextTransformer>
        {rolesListMapArr
          .filter((x) => GameAgentRoles.includes(x[0]))
          .map((x) => `${x[1]} {{success:${x[0]}}}`)
          .join(" ")}
      </TextTransformer>
      <br />
      <TextTransformer>
        {rolesListMapArr
          .filter((x) => !GameAgentRoles.includes(x[0]))
          .map((x) => `${x[1]} {{fail:${x[0]}}}`)
          .join(" ")}
      </TextTransformer>
    </>
  );
}
