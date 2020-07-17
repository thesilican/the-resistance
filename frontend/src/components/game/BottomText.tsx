import React from "react";
import { useStore } from "../../store";
import NameTransformer from "./NameTransformer";

export default function BottomText() {
  const [state] = useStore();
  if (!state.game) return null;

  return (
    <div className="BottomText">
      <span className="text">
        <NameTransformer
          names={state.game.players}
          colors={state.game.colorOrder}
        >
          {state.game.statusMessage}
        </NameTransformer>
      </span>
    </div>
  );
}
