import { NUM_AGENTS_SPIES } from "common-types";
import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useStore } from "../../store";
import ChatBox from "./ChatBox";
import NameTransformer from "./NameTransformer";
import VoteHistoryBox from "./VoteHistoryBox";

export default function ChatHistoryTabs() {
  const [state] = useStore();
  if (!state.game) return null;
  const isSpy = state.game.role === "spy";
  const isAgent = state.game.role === "agent";
  const numSpies = NUM_AGENTS_SPIES[state.game.players.length][1];
  const otherSpies = state.game.spies?.map((s) => `[[${s}]]`).join(", ");

  return (
    <div className="ChatHistoryTabs">
      <div>
        <h4>
          <NameTransformer
            names={state.game.players}
            colors={state.game.colorOrder}
          >{`[[${state.game.playerIndex}]]`}</NameTransformer>
        </h4>
        {isAgent && (
          <h4>
            You are an <span className="c-success font-weight-bold">AGENT</span>
          </h4>
        )}
        {isAgent && <h4>There are {numSpies} spies</h4>}
        {isSpy && (
          <h4>
            You are a <span className="c-fail font-weight-bold">SPY</span>
          </h4>
        )}
        {isSpy && (
          <h4>
            <NameTransformer
              names={state.game.players}
              colors={state.game.colorOrder}
            >
              {`Spies: ${otherSpies}`}
            </NameTransformer>
          </h4>
        )}
      </div>
      <Tabs defaultActiveKey="chat" id="chat-history-tabs">
        <Tab eventKey="chat" title="Chat">
          <ChatBox />
        </Tab>
        <Tab eventKey="history" title="Vote Log">
          <VoteHistoryBox
            players={state.game.players}
            colors={state.game.colorOrder}
            hist={state.game.teamHistory}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
