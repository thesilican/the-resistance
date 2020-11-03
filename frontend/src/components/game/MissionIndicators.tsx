import cn from "classnames";
import React from "react";
import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Tooltip from "react-bootstrap/esm/Tooltip";
import styles from "../../styles/game/MissionIndicators.module.scss";
import TextTransformer from "../common/TextTransformer";

export default function MissionIndicators() {
  const missions = Array.from(Array(5)).fill(null);
  return (
    <div className={styles.MissionIndicators}>
      <span className={styles.title}>
        Mission
        <br />
        Progress
      </span>
      {missions.map((_, i) => (
        <MissionIndicator key={i} index={i + 1} />
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
  const { index } = props;
  const fail = index === 1;
  const success = index === 2;
  const active = index === 3;
  const double = index === 4;

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
              {/* For N4 double only */}
              <TextTransformer>{`1 fail detected`}</TextTransformer>
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
              {/* For N4 double only */}
              <TextTransformer>{`2 spies needed to fail`}</TextTransformer>
            </span>
            <span>
              <TextTransformer>{`5 player team`}</TextTransformer>
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
          [styles.double]: double,
        })}
      >
        <span className={styles.label1}>2</span>
        <span className={styles.label2}>players</span>
      </div>
    </OverlayTrigger>
  );
}
