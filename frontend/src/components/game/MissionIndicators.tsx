import React from "react";
import styles from "../../styles/game/MissionIndicators.module.scss";
import cn from "classnames";

type MissionIndicatorsProps = {};

export default function MissionIndicators(props: MissionIndicatorsProps) {
  const missions = Array.from(Array(5)).fill(null);
  return (
    <div className={styles.MissionIndicators}>
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
  const fail = props.index === 0;
  const success = props.index === 1;
  const active = props.index === 2;
  return (
    <div
      className={cn(styles.indicator, {
        [styles.fail]: fail,
        [styles.success]: success,
        [styles.active]: active,
      })}
    >
      <span className={styles.label1}>2</span>
      <span className={styles.label2}>players</span>
    </div>
  );
}
