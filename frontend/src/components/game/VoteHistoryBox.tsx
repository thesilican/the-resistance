import cn from "classnames";
import { GameFunc } from "common-modules";
import React, { Fragment, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { GameSelector } from "../../store";
import styles from "../../styles/game/VoteHistoryBox.module.scss";
import TextTransformer from "../common/TextTransformer";

const iconURL = `${process.env.PUBLIC_URL}/assets/iconsheet.png`;

export default function VoteHistoryBox() {
  const scrollDivRef = useRef<HTMLDivElement | null>(null);
  const numPlayers = useSelector(GameSelector.numPlayers);
  const teamHistory = useSelector(GameSelector.teamHistory);

  useEffect(() => {
    const scrollDiv = scrollDivRef.current!;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      // Assume 1rem is 16px
      const left = scrollDiv.scrollLeft + Math.sign(e.deltaY) * (2 * 16);
      scrollDiv.scrollTo({
        left,
      });
    };
    scrollDiv.addEventListener("wheel", handler);
    return () => scrollDiv.removeEventListener("wheel", handler);
  }, []);

  return (
    <div className={styles.VoteHistoryBox}>
      <div
        ref={scrollDivRef}
        className={styles.grid}
        style={{
          gridTemplateRows: `repeat(${numPlayers + 1}, min-content)`,
          gridTemplateColumns: `repeat(${teamHistory.length + 1}, min-content)`,
        }}
      >
        {/* Header */}
        <div className={cn(styles.cell, styles.empty)}>
          <span>Mission</span>
        </div>
        {teamHistory.map((t, i) => (
          <div
            key={i}
            className={cn(styles.cell, styles.mission, {
              [styles.accepted]:
                GameFunc.util.getProposalVoteResult(t.votes) === "accept",
              [styles.rejected]:
                GameFunc.util.getProposalVoteResult(t.votes) === "reject",
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
            {teamHistory.map((t, i) => (
              <div
                key={i}
                className={cn(styles.cell, styles.vote, {
                  [styles.leader]: t.leader === p,
                  [styles.team]: t.members.includes(p),
                  [styles.reject]: t.votes[p] === "reject",
                })}
                style={{
                  backgroundImage:
                    t.votes[p] === "none" ? undefined : `url("${iconURL}")`,
                }}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
