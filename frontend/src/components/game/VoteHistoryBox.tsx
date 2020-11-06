import cn from "classnames";
import { GameAction, GameFunc } from "common-modules";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { GameSelector } from "../../store";
import styles from "../../styles/game/VoteHistoryBox.module.scss";
import TextTransformer from "../common/TextTransformer";

const iconURL = `${process.env.PUBLIC_URL}/assets/iconsheet.png`;

export default function VoteHistoryBox() {
  const gamePhase = useSelector(GameSelector.gamePhase);
  const numPlayers = useSelector(GameSelector.numPlayers);
  let teams = useSelector(GameSelector.teams);

  // Remove the last team if is current team
  if (
    [
      "team-building",
      "team-building-review",
      "voting",
      "voting-review",
    ].includes(gamePhase)
  ) {
    teams = teams.slice(0, -1);
  }
  const numMissions = teams.length;

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
        {teams.map((t, i) => (
          <div
            key={i}
            className={cn(styles.cell, styles.mission, {
              [styles.accepted]:
                GameFunc.util.getMissionVoteResult(t.votes) === "accept",
              [styles.rejected]:
                GameFunc.util.getMissionVoteResult(t.votes) === "reject",
            })}
          >
            <span>{t.mission}</span>
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
            {teams.map((t, i) => (
              <div
                key={i}
                className={cn(styles.cell, styles.vote, {
                  [styles.leader]: t.leader === p,
                  [styles.team]: t.members.includes(p),
                  [styles.none]: t.votes[p] === "none",
                  [styles.reject]: t.votes[p] === "reject",
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
