import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import ChatBox from "./ChatBox";
import VoteHistoryBox from "./VoteHistoryBox";
import { useStore } from "../../store";
import { NUM_AGENTS_SPIES } from "common-types";
import NameTransformer from "./NameTransformer";
import { ColorOrder } from "../../resources";

type ChatHistoryTabsProps = {};

export default function ChatHistoryTabs({}: ChatHistoryTabsProps) {
  const [state] = useStore();
  if (!state.game) return null;
  const isSpy = state.game.role === "spy";
  const isAgent = state.game.role === "agent";
  const numSpies = NUM_AGENTS_SPIES[state.game.players.length][1];
  const otherSpies = state.game.spies?.map((s) => `[[${s}]]`).join(", ");

  return (
    <div className="ChatHistoryTabs">
      <div>
        {isAgent && (
          <h4>
            You are an <span className="c-success">AGENT</span>
          </h4>
        )}
        {isAgent && <h4>There are {numSpies} spies</h4>}
        {isSpy && (
          <h4>
            You are a <span className="c-fail">SPY</span>
          </h4>
        )}
        {isSpy && (
          <h4>
            <NameTransformer names={state.game.players} colors={ColorOrder}>
              {`Other spies: ${otherSpies}`}
            </NameTransformer>
          </h4>
        )}
      </div>
      <Tabs defaultActiveKey="chat" id="chat-history-tabs">
        <Tab eventKey="chat" title="Chat">
          <ChatBox />
        </Tab>
        <Tab eventKey="history" title="Vote Log">
          <VoteHistoryBox />
        </Tab>
      </Tabs>
    </div>
  );
}
