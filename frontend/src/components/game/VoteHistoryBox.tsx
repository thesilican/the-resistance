import cn from "classnames";
import { GameFunc } from "common-modules";
import { Fragment, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { GameSelector } from "../../store";
import TF from "../common/TextFormat";
import s from "./VoteHistoryBox.module.scss";

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
    <div className={s.VoteHistoryBox}>
      <div className={s.helpText}>
        <div className={s.item}>
          <div className={cn(s.box, s.leader)} /> Team Leader
        </div>
        <div className={s.item}>
          <div className={cn(s.box, s.member)} /> Team Member
        </div>
        <div className={s.item}>
          <div
            className={cn(s.box, s.approve)}
            style={{ backgroundImage: `url(${iconURL})` }}
          />{" "}
          Approve Vote
        </div>
        <div className={s.item}>
          <div
            className={cn(s.box, s.reject)}
            style={{ backgroundImage: `url(${iconURL})` }}
          />{" "}
          Reject Vote
        </div>
      </div>
      <div className={s.wrapper}>
        <div
          ref={scrollDivRef}
          className={s.grid}
          style={{
            gridTemplateRows: `repeat(${numPlayers + 1}, min-content)`,
            gridTemplateColumns: `repeat(${
              teamHistory.length + 1
            }, min-content)`,
          }}
        >
          {/* Header */}
          <div className={cn(s.cell, s.empty)}>
            <span>Mission</span>
          </div>
          {teamHistory.map((t, i) => (
            <div
              key={i}
              className={cn(s.cell, s.mission, {
                [s.accepted]:
                  GameFunc.util.getProposalVoteResult(t.votes) === "accept",
                [s.rejected]:
                  GameFunc.util.getProposalVoteResult(t.votes) === "reject",
              })}
            >
              <span>{t.mission}</span>
            </div>
          ))}
          {/* People */}
          {Array.from(Array(numPlayers)).map((_, p) => (
            <Fragment key={p}>
              <div className={cn(s.cell, s.name)}>
                <span>
                  <TF>{`{{name:${p}}}`}</TF>
                </span>
              </div>
              {teamHistory.map((t, i) => (
                <div
                  key={i}
                  className={cn(s.cell, s.vote, {
                    [s.leader]: t.leader === p,
                    [s.team]: t.members.includes(p),
                    [s.reject]: t.votes[p] === "reject",
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
    </div>
  );
}
