import React, { Fragment } from "react";
import styles from "../../styles/game/VoteHistoryBox.module.scss";
import TextTransformer from "../common/TextTransformer";
import cn from "classnames";

const iconURL = `${process.env.PUBLIC_URL}/assets/iconsheet.png`;

type VoteHistoryBoxProps = {};

export default function VoteHistoryBox(props: VoteHistoryBoxProps) {
  const numPlayers = 10;
  const numMissions = 10;
  return (
    <div className={styles.VoteHistoryBox}>
      <div
        className={styles.grid}
        style={{
          gridTemplateRows: `repeat(${numPlayers + 1}, min-content)`,
          gridTemplateColumns: `repeat(${numMissions + 1}, min-content)`,
        }}
      >
        {/* Header */}
        <div className={cn(styles.cell, styles.empty)}>
          <span>Mission</span>
        </div>
        {Array.from(Array(numMissions)).map((_, i) => (
          <div key={i} className={cn(styles.cell, styles.mission)}>
            <span>{i}</span>
          </div>
        ))}
        {/* People */}
        {Array.from(Array(numPlayers)).map((_, p) => (
          <Fragment key={p}>
            <div className={cn(styles.cell, styles.name)}>
              <span>
                <TextTransformer>{`{{name:${p}}}`}</TextTransformer>
              </span>
            </div>
            {Array.from(Array(numMissions)).map((_, m) => (
              <div
                key={m}
                className={cn(styles.cell, styles.vote, {
                  [styles.leader]: m === p,
                  [styles.team]: (m + p) % 4 === 2,
                  [styles.reject]: m % p === 0,
                })}
                style={{
                  backgroundImage: `url("${iconURL}")`,
                }}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
