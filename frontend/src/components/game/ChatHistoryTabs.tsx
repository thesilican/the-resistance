import React from "react";
import Tab from "react-bootstrap/esm/Tab";
import Tabs from "react-bootstrap/esm/Tabs";
import styles from "../../styles/game/ChatHistoryTabs.module.scss";
import ChatBox from "./ChatBox";
import VoteHistoryBox from "./VoteHistoryBox";

export default function ChatHistoryTabs() {
  return (
    <div className={styles.ChatHistoryTabs}>
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
