import { useEffect, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Figure from "react-bootstrap/esm/Figure";
import Row from "react-bootstrap/esm/Row";
import { Link } from "react-router-dom";
import s from "./AboutView.module.scss";

type ConnectedStatistics = {
  players: number;
  lobbies: number;
  games: number;
};

const URL_BASE = new URL(
  process.env.PUBLIC_URL.endsWith("/")
    ? process.env.PUBLIC_URL
    : process.env.PUBLIC_URL + "/",
  window.location.href
);
const STATS_URL = new URL("./api/statistics", URL_BASE);

export default function AboutView() {
  const [stats, setStats] = useState<ConnectedStatistics | null>(null);

  useEffect(() => {
    const fetch = () => {
      window
        .fetch(STATS_URL)
        .then((res) => res.json())
        .then((val: ConnectedStatistics) => setStats(val))
        .catch(console.error);
    };
    fetch();
    const interval = setInterval(fetch, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={s.AboutView}>
      <Link className={s.back} to="..">
        Back to homepage
      </Link>
      <Container>
        <Row>
          <Col xs={0} lg={1} />
          <Col xs={12} lg={10} className={s.container}>
            <h1 className={s.title}>The Resistance</h1>
            <p>
              This website is an open-source implementation of the classic board
              game{" "}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://en.wikipedia.org/wiki/The_Resistance_(game)"
              >
                The Resistance
              </a>{" "}
              /{" "}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://en.wikipedia.org/wiki/The_Resistance_(game)#Avalon_variant"
              >
                Avalon
              </a>
              .
            </p>
            <p>
              Similar to party games like Mafia and Werewolf, The Resistance
              challenges players' skills of deception, lying, and social
              deduction to determine who to trust. Anywhere between 5 to 10
              players can play the Resistance.
            </p>
            <Figure className={s.image}>
              <Figure.Image
                src={`${process.env.PUBLIC_URL}/doc/demo.png`}
                alt="Demo"
                width={800}
              ></Figure.Image>
            </Figure>
            {stats && (
              <p className={s.light}>
                <span>
                  Users Connected: {stats.players} | Lobbies: {stats.lobbies} |
                  Games: {stats.games}
                </span>
              </p>
            )}
          </Col>
          <Col xs={0} lg={1} />
        </Row>
      </Container>
    </div>
  );
}
