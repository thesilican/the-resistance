import Tab from "react-bootstrap/esm/Tab";
import Tabs from "react-bootstrap/esm/Tabs";
import ChatBox from "./ChatBox";
import s from "./ChatHistoryTabs.module.scss";
import VoteHistoryBox from "./VoteHistoryBox";

export default function ChatHistoryTabs() {
  return (
    <div className={s.ChatHistoryTabs}>
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
