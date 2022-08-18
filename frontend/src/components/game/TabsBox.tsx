import Tab from "react-bootstrap/esm/Tab";
import Tabs from "react-bootstrap/esm/Tabs";
import ChatBox from "./ChatBox";
import GameInfoBox from "./GameInfoBox";
import s from "./TabsBox.module.scss";
import VoteHistoryBox from "./VoteHistoryBox";

export default function TabsBox() {
  return (
    <div className={s.TabsBox}>
      <Tabs defaultActiveKey="chat" id="chat-history-tabs">
        <Tab eventKey="chat" title="Chat">
          <ChatBox />
        </Tab>
        <Tab eventKey="history" title="Vote Log">
          <VoteHistoryBox />
        </Tab>
        <Tab eventKey="info" title="Info">
          <GameInfoBox />
        </Tab>
      </Tabs>
    </div>
  );
}
