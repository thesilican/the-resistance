import { LobbyAction } from "common-modules";
import { Button, Form, InputGroup } from "react-bootstrap";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LobbySelector } from "../../store";
import { ButtonLink } from "../common/ButtonLink";
import GameOptions from "./GameOptions";
import InGameList from "./InGameList";
import s from "./LobbyView.module.scss";
import MembersList from "./MembersList";

export default function LobbyView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inGame = useSelector(LobbySelector.lobbyInGame);
  return (
    <div className={s.LobbyView}>
      <h1 className={s.header}>The Resistance</h1>
      <Container>
        <Row className="mb-3">
          <Col xs={0} md={2} lg={3} />
          <Col xs={6} md={4} lg={3}>
            <MembersList />
          </Col>
          <Col xs={6} md={4} lg={3}>
            {inGame ? <InGameList /> : <GameOptions />}
          </Col>
          <Col xs={0} md={2} lg={3} />
        </Row>
        <Row>
          <Col xs={0} md={2} lg={3} />
          <Col xs={12} md={8} lg={6}>
            <LobbyCopyURL />
          </Col>
          <Col xs={0} md={2} lg={3} />
        </Row>
      </Container>

      <div className={s.back}>
        <ButtonLink
          onClick={() => {
            const url = new URL(window.location.href);
            url.searchParams.delete("join");
            navigate(url);
            dispatch(LobbyAction.clientLeaveLobby());
          }}
        >
          Leave Room
        </ButtonLink>
      </div>
    </div>
  );
}

function LobbyCopyURL() {
  const roomCode = useSelector(LobbySelector.lobbyID);
  const url = new URL(window.location.href);
  url.searchParams.set("join", roomCode);
  return (
    <InputGroup size="sm" className={s.LobyCopyURL}>
      <Form.Control
        readOnly
        value={url.toString()}
        onClick={(e) => (e.target as HTMLInputElement).select()}
      />
      <Button
        variant="outline-light"
        onClick={() => navigator.clipboard.writeText(url.toString())}
      >
        Copy
      </Button>
    </InputGroup>
  );
}
