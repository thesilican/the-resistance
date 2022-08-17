import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LobbySelector } from "../../store";
import GameOptions from "./GameOptions";
import InGameList from "./InGameList";
import LobbyRoomCode from "./LobbyRoomCode";
import s from "./LobbyView.module.scss";
import MembersList from "./MembersList";

export default function LobbyView() {
  const inGame = useSelector(LobbySelector.lobbyInGame);
  return (
    <div className={s.LobbyView}>
      <h1 className={s.header}>The Resistance</h1>
      <Container>
        <Row>
          <Col xs={0} md={2}></Col>
          <Col xs={6} md={4}>
            <MembersList />
          </Col>
          <Col xs={6} md={4}>
            {inGame ? <InGameList /> : <GameOptions />}
          </Col>
          <Col xs={0} md={2}></Col>
        </Row>
      </Container>
      <LobbyRoomCode />
      <Link
        className={s.back}
        to="/"
        onClick={() => {
          // TODO: implement
        }}
      >
        Leave Lobby
      </Link>
    </div>
  );
}
