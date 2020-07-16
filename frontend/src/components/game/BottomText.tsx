import React from "react";
import NameTransformer from "./NameTransformer";
import { ColorOrder, ColorValues, newColorValues } from "../../resources";
import { useStore } from "../../store";

type BottomTextProps = {};

export default function BottomText({}: BottomTextProps) {
  const [state] = useStore();
  if (!state.game) return null;

  return (
    <div className="BottomText">
      <span className="text">
        <NameTransformer names={state.game.players} colors={ColorOrder}>
          {state.game.statusMessage}
        </NameTransformer>
      </span>
    </div>
  );
}
