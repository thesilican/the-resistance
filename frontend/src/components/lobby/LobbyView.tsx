import React from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { useSelector } from "react-redux";
import { LobbySelector } from "../../store";
import styles from "../../styles/lobby/LobbyView.module.scss";
import GameOptions from "./GameOptions";
import InGameList from "./InGameList";
import LobbyRoomCode from "./LobbyRoomCode";
import MembersList from "./MembersList";

export default function LobbyView() {
  const inGame = useSelector(LobbySelector.lobbyInGame);
  return (
    <div className={styles.LobbyView}>
      <h1>The Resistance</h1>
      <LobbyRoomCode />
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
    </div>
  );
}
