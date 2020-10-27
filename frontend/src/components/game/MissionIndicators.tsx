import cn from "classnames";
import React, { useState } from "react";
import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Tooltip from "react-bootstrap/esm/Tooltip";
import styles from "../../styles/game/MissionIndicators.module.scss";
import TextTransformer from "./TextTransformer";

type MissionIndicatorsProps = {};

export default function MissionIndicators(props: MissionIndicatorsProps) {
  const missions = Array.from(Array(5)).fill(null);
  return (
    <div className={styles.MissionIndicators}>
      <span className={styles.title}>
        Mission
        <br />
        Progress
      </span>
      {missions.map((_, i) => (
        <MissionIndicator key={i} index={i} />
      ))}
      <div className={styles.proposals}>
        <span className={styles.label1}>5</span>
        <span className={styles.label2}>
          proposals
          <br />
          remaining
        </span>
      </div>
    </div>
  );
}

type MissionIndicatorProps = {
  index: number;
};

function MissionIndicator(props: MissionIndicatorProps) {
  const [state, setState] = useState(0);
  const fail = state === 1;
  const success = state === 2;
  const active = state === 3;

  const popover = (
    <Tooltip id="mission-indicator-tooltip">
      <div className={styles.tooltip}>
        {fail ? (
          <>
            <span className={styles.title}>
              <TextTransformer>{`{{fail:Mission 1 Failed}}`}</TextTransformer>
            </span>
            <span>
              <TextTransformer>{`{{fail:2 fails detected}}`}</TextTransformer>
            </span>
            <span>
              <TextTransformer>{`{{name:0}}, {{name:1}}, {{name:2}} by {{name:0}}`}</TextTransformer>
            </span>
          </>
        ) : success ? (
          <>
            <span className={styles.title}>
              <TextTransformer>{`{{success:Mission 1 Success}}`}</TextTransformer>
            </span>
            <span>
              <TextTransformer>{`{{name:0}}, {{name:1}}, {{name:2}} by {{name:0}}`}</TextTransformer>
            </span>
          </>
        ) : (
          <>
            <span className={styles.title}>
              <TextTransformer>{`Mission 5`}</TextTransformer>
            </span>
            <span>
              <TextTransformer>{`5 players required`}</TextTransformer>
            </span>
          </>
        )}
      </div>
    </Tooltip>
  );

  return (
    <OverlayTrigger
      trigger={["hover", "focus"]}
      delay={400}
      placement="left"
      overlay={popover}
    >
      <div
        className={cn(styles.indicator, {
          [styles.fail]: fail,
          [styles.success]: success,
          [styles.active]: active,
        })}
        onClick={() => setState((x) => (x + 1) % 4)}
      >
        <span className={styles.label1}>2</span>
        <span className={styles.label2}>players</span>
      </div>
    </OverlayTrigger>
  );
}
