import React, { Fragment } from "react";
import NameTransformer from "./NameTransformer";
import { TeamHistory, Color } from "common-types";

type VoteHistoryBoxProps = {
  hist: TeamHistory[];
  colors: Color[];
  players: string[];
};

const VoteHistoryBox = React.memo(function ({
  hist,
  colors,
  players,
}: VoteHistoryBoxProps) {
  const firsts = hist.reduce((a, v, i) => {
    if (v.missionNum > a.length) {
      return [...a, i];
    }
    return a;
  }, [] as number[]);
  return (
    <div className="VoteHistoryBox">
      <div className="inner-wrapper">
        {hist.map((h, i) => (
          <Fragment key={i}>
            {firsts.includes(i) ? (
              <span className="mission-header">Mission {h.missionNum}</span>
            ) : (
              <hr></hr>
            )}
            <History key={i} hist={h} players={players} colors={colors} />
          </Fragment>
        ))}
      </div>
    </div>
  );
});

type HistoryProps = {
  hist: TeamHistory;
  colors: Color[];
  players: string[];
};

function History({ hist, colors, players }: HistoryProps) {
  const acceptVotes = hist.votes
    .map((v, i) => (v === "accept" ? i : null))
    .filter((x) => x !== null)
    .map((x) => `[[${x}]]`);
  const rejectVotes = hist.votes
    .map((v, i) => (v === "reject" ? i : null))
    .filter((x) => x !== null)
    .map((x) => `[[${x}]]`);
  const zipped =
    acceptVotes.length >= rejectVotes.length
      ? acceptVotes.map((v, i) => [v, rejectVotes[i]])
      : rejectVotes.map((v, i) => [acceptVotes[i], v]);
  return (
    <div className="History">
      <span>
        <NameTransformer names={players} colors={colors}>
          {`[[${hist.leader}]]'s team proposal:`}
        </NameTransformer>
        <br />
        <NameTransformer names={players} colors={colors}>
          {hist.members.map((m) => `[[${m}]]`).join(", ")}
        </NameTransformer>
      </span>
      <table>
        <tr>
          <th>Accepted:</th>
          <th>Rejected:</th>
        </tr>
        {zipped.map((z, i) => (
          <tr key={i}>
            <td>
              <NameTransformer names={players} colors={colors}>
                {z[0] === undefined ? "" : z[0]}
              </NameTransformer>
            </td>
            <td>
              <NameTransformer names={players} colors={colors}>
                {z[1] === undefined ? "" : z[1]}
              </NameTransformer>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default VoteHistoryBox;
