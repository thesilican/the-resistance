import React from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import styles from "../../styles/lobby/LobbyView.module.scss";
import MembersList from "./MembersList";
import LobbyRoomCode from "./LobbyRoomCode";
import GameOptions from "./GameOptions";

export default function LobbyView() {
  return (
    <div className={styles.LobbyView}>
      <h1>The Resistance</h1>
      <Container>
        <Row>
          <Col xs={0} md={2}></Col>
          <Col xs={6} md={4}>
            <LobbyRoomCode />
            <MembersList />
          </Col>
          <Col xs={6} md={4}>
            <GameOptions />
          </Col>
          <Col xs={0} md={2}></Col>
        </Row>
      </Container>
    </div>
  );
}
