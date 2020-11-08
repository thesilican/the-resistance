import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import styles from "../../styles/welcome/AboutView.module.scss";

type ConnectedStatistics = {
  players: number;
  lobbies: number;
  games: number;
};

export default function AboutView() {
  const [stats, setStats] = useState<ConnectedStatistics | null>(null);

  useEffect(() => {
    const fetch = () => {
      window
        .fetch("/api/statistics")
        .then((res) => res.json())
        .then((val: ConnectedStatistics) => setStats(val))
        .catch(console.error);
    };
    fetch();
    const interval = setInterval(fetch, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.AboutView}>
      <a className={styles.backToWelcome} href="/">
        Return to homepage
      </a>
      <Container>
        <Row>
          <Col xs={0} lg={1} />
          <Col xs={12} lg={10} className={styles.body}>
            <h1>The Resistance</h1>
            <p>
              This website is an open-source implementation of the classic board
              game{" "}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://en.wikipedia.org/wiki/The_Resistance_(game)"
              >
                The Resistance
              </a>
              .
            </p>
            <p>
              Similar to party games like Mafia and Werewolf, the Resistance
              challenges players' skills of deception, lying, and social
              deduction to determine who to trust. Anywhere between 5 to 10
              players can play the Resistance.
            </p>
            <img
              alt="An example of a resistance game in progress"
              className={styles.img}
              src={`${process.env.PUBLIC_URL}/doc/demo.png`}
            />
            <p>
              This online version is based on the original card game by by Don
              Eskridge. You can buy the original game{" "}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://www.amazon.com/The-Resistance-Dystopian-Universe/dp/B008A2BA8G"
              >
                here
              </a>
              . You can also check out the game{" "}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://en.wikipedia.org/wiki/The_Resistance_(game)#Avalon_variant"
              >
                Avalon
              </a>{" "}
              (like an expansion game to The Resistance with more roles), and
              buy it{" "}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://www.amazon.ca/Indie-Boards-Cards-AVA1IBC-Resistance/dp/B009SAAV0C"
              >
                here
              </a>
              . If you like this game, I highly suggest you try out the board
              game versions!
            </p>
            <p>
              The user interface/layout of the game was greatly inspired by{" "}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="http://www.mindnightgame.com/"
              >
                MINDNIGHT
              </a>
              , a free-to-play steam game with similar gameplay to The
              Resistance. If you liked this game, try it out! It has better
              graphics, audio, and lets you save your progress. You can buy
              skins and compete in tournaments there.
            </p>
            <p>
              The Resistance was programmed by thesilican using React.js, Redux
              Toolkit, and Socket.IO. Source code is available on{" "}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://github.com/thesilican/the-resistance"
              >
                GitHub
              </a>
              .
            </p>
            <p className={styles.light}>
              {stats && (
                <span>
                  Users Connected: {stats.players} | Lobbies: {stats.lobbies} |
                  Games: {stats.games}
                </span>
              )}
            </p>
          </Col>
          <Col xs={0} lg={1} />
        </Row>
      </Container>
    </div>
  );
}
