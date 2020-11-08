import React from "react";
import { Figure } from "react-bootstrap";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import styles from "../../styles/welcome/HowToPlayView.module.scss";

export default function HowToPlayView() {
  return (
    <div className={styles.HowToPlayView}>
      <Container>
        <Row>
          <Col xs={0} lg={1} />
          <Col xs={12} lg={10} className={styles.body}>
            <h1>How to Play</h1>
            <p>
              In the Resistance, players are in one of two opposing teams - the{" "}
              <Success>Agents</Success> or the <Fail>Spies</Fail>.
            </p>
            <ul>
              <li>
                The <Fail>Spies</Fail> know the roles of all the other spies,
                but the <Success>Agents</Success> only know their own role
              </li>
              <li>
                The goal of all <Success>Agents</Success> is to complete{" "}
                <Italics>3 successful missions</Italics>
              </li>
              <li>
                The goal of all <Fail>Spies</Fail> is to{" "}
                <Italics>fail 3 missions</Italics>
              </li>
            </ul>
            <p>There are 3 main phases of the game:</p>
            <h2>Team Building</h2>
            <p>
              During this phase, one player will become the Team Leader,
              indicated by the stick figure wearing a hat.
            </p>
            <ul>
              <li>
                The Team Leader gets to propose a team of people to go on a
                mission
              </li>
              <li>
                The number of players in the mission is indicated by the mission
                indicator at the right of the screen
              </li>
            </ul>
            <Figure>
              <Figure.Image
                src={`${process.env.PUBLIC_URL}/doc/how-to-play-1.png`}
                alt="Team Building phase"
              ></Figure.Image>
              <Figure.Caption>
                Megan is the Team Leader. She is suggesting herself and Cueball
                to go on a mission.
              </Figure.Caption>
            </Figure>
            <h2>Voting</h2>
            <p>
              During this phase, every player will vote to decide whether or not
              the proposed team will go on the mission.
            </p>
            <ul>
              <li>
                If a majority of players vote to accept the proposed team, then
                the team is <Success>accepted</Success> and the players on the
                team go on a mission
              </li>
              <li>
                Otherwise, the team is <Fail>rejected</Fail>. The player to the
                left of the Team Leader becomes the new leader and picks another
                team
              </li>
              <li>
                If 5 consecutive team proposals are <Fail>rejected</Fail>, the
                the <Fail>Spies</Fail> automatically win (see the number of
                proposals remaining in the bottom right)
              </li>
            </ul>
            <Figure>
              <Figure.Image
                src={`${process.env.PUBLIC_URL}/doc/how-to-play-2.png`}
                alt="Voting phase"
              ></Figure.Image>
              <Figure.Caption>
                Everyone here has voted. Everyone except Cueball and Hairy have
                accepted the team. Because the majority of people accept the
                team, Cueball and Megan will go on a mission
              </Figure.Caption>
            </Figure>
            <h2>Mission</h2>
            <p>
              During this phase, the players selected on the team will go on a
              mission. A mission can either be <Success>successful</Success> or{" "}
              <Fail>failed</Fail>.
            </p>
            <ul>
              <li>
                Agents may only <Success>succeed</Success> a mission, while
                spies may choose to <Success>succeed</Success> or{" "}
                <Fail>fail</Fail> a mission
              </li>
              <li>
                If <Italics>at least one player</Italics> on the mission fails
                the mission, then the mission is <Fail>failed</Fail>. Otherwise,
                the mission is <Success>successful</Success>
                <ul>
                  <li>
                    For games with more than 6 people, some missions may require{" "}
                    <Fail>2 fails</Fail> for the mission to be failed. These
                    missions have a square-shaped icon in the misisons indicator
                    on the right of the screen
                  </li>
                </ul>
              </li>
            </ul>
            <Figure>
              <Figure.Image
                src={`${process.env.PUBLIC_URL}/doc/how-to-play-3.png`}
                alt="Mission phase"
              ></Figure.Image>
              <Figure.Caption>
                As an agent, Megan can only succeed a mission. If Cueball is a
                spy and fails the mission, the mission will fail. Otherwise, the
                misssion will succeed.
              </Figure.Caption>
            </Figure>
            <h2>Game Ending</h2>
            <p>
              The game ends once there are 3 <Success>successful</Success>{" "}
              missions or 3 <Fail>failed</Fail> missions. The{" "}
              <Success>Agents</Success> win if there are 3 successful missions,
              and the <Fail>Spies</Fail> win if there are 3 failed missions.
            </p>
            <Figure>
              <Figure.Image
                src={`${process.env.PUBLIC_URL}/doc/how-to-play-4.png`}
                alt="Game finished"
              ></Figure.Image>
              <Figure.Caption>
                The spies have successfully failed 3 missions. Cueball,
                Ponytail, and Beret (the spies) have won!
              </Figure.Caption>
            </Figure>
            <h2>Video Version</h2>
            <p>
              Below is a video explaining the rules of original board game.
              Rules for this online version are roughly the same as the original
              board game.
            </p>
            <iframe
              className={styles.video}
              width="560"
              height="315"
              src="https://www.youtube.com/embed/DUENzjE9Jwg"
            ></iframe>
          </Col>
          <Col xs={0} lg={1} />
        </Row>
      </Container>
    </div>
  );
}

const Success = ({ children }: { children: React.ReactNode }) => (
  <span className={styles.success}>{children}</span>
);

const Fail = ({ children }: { children: React.ReactNode }) => (
  <span className={styles.fail}>{children}</span>
);

const Bold = ({ children }: { children: React.ReactNode }) => (
  <span className={styles.bold}>{children}</span>
);

const Italics = ({ children }: { children: React.ReactNode }) => (
  <span className={styles.italics}>{children}</span>
);
