import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Figure from "react-bootstrap/esm/Figure";
import Row from "react-bootstrap/esm/Row";
import { Link } from "react-router-dom";
import RolesModal from "../common/RolesModal";
import { TFail, TSuccess } from "../common/TextFormat";
import s from "./HowToPlayView.module.scss";

export default function HowToPlayView() {
  const [rolesShown, setRolesShown] = useState(false);
  return (
    <div className={s.HowToPlayView}>
      <Link className={s.back} to="/">
        Return to homepage
      </Link>
      <RolesModal
        show={rolesShown}
        onClose={() => setRolesShown(false)}
        hideFullRulesLink
      />
      <Container>
        <Row>
          <Col xs={0} lg={1} />
          <Col xs={12} lg={10} className={s.body}>
            <h1>How to Play</h1>
            <p>
              In the Resistance, players are in one of two opposing teams - the{" "}
              <TSuccess>Agents</TSuccess> or the <TFail>Spies</TFail>.
            </p>
            <ul>
              <li>
                The <TFail>Spies</TFail> know the roles of all the other spies,
                but the <TSuccess>Agents</TSuccess> only know their own role
              </li>
              <li>
                The goal of all <TSuccess>Agents</TSuccess> is to complete{" "}
                <Italics>3 successful missions</Italics>
              </li>
              <li>
                The goal of all <TFail>Spies</TFail> is to{" "}
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
                the team is <TSuccess>accepted</TSuccess> and the players on the
                team go on a mission
              </li>
              <li>
                Otherwise, the team is <TFail>rejected</TFail>. The player to
                the left of the Team Leader becomes the new leader and picks
                another team
              </li>
              <li>
                If 5 consecutive team proposals are <TFail>rejected</TFail>, the
                the <TFail>Spies</TFail> automatically win (see the number of
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
              mission. A mission can either be <TSuccess>successful</TSuccess>{" "}
              or <TFail>failed</TFail>.
            </p>
            <ul>
              <li>
                Agents may only <TSuccess>succeed</TSuccess> a mission, while
                spies may choose to <TSuccess>succeed</TSuccess> or{" "}
                <TFail>fail</TFail> a mission
              </li>
              <li>
                If <Italics>at least one player</Italics> on the mission fails
                the mission, then the mission is <TFail>failed</TFail>.
                Otherwise, the mission is <TSuccess>successful</TSuccess>
                <ul>
                  <li>
                    For games with more than 6 people, some missions may require{" "}
                    <TFail>2 fails</TFail> for the mission to be failed. These
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
              The game ends once there are 3 <TSuccess>successful</TSuccess>{" "}
              missions or 3 <TFail>failed</TFail> missions. The{" "}
              <TSuccess>Agents</TSuccess> win if there are 3 successful
              missions, and the <TFail>Spies</TFail> win if there are 3 failed
              missions.
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
              title="Explaination video"
              className={s.video}
              width="560"
              height="315"
              src="https://www.youtube.com/embed/DUENzjE9Jwg"
            ></iframe>
            <h2>Assassins mode</h2>
            <div className={s.centerButton}>
              <Button
                size="sm"
                variant="info"
                onClick={() => setRolesShown(true)}
              >
                View a list of all new roles
              </Button>
            </div>
            <p>
              A new gamemode called <TFail>Assassins mode</TFail> was recently
              added. Based on the{" "}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://en.wikipedia.org/wiki/The_Resistance_(game)#Avalon_variant"
              >
                Avalon
              </a>{" "}
              variation of The Resistance card game, the Assassins gamemode adds
              the following new roles and rules:
            </p>
            <ul>
              <li>
                There is a <TSuccess>Captain</TSuccess> on the agent team, who
                knows who all the spies are. With his powerful knowedge, he can
                help lead the agent team to victory
              </li>
              <li>
                However, the <TSuccess>Captain</TSuccess> cannot make himself
                too obvious, for the spy team has <TFail>Assassin</TFail> who
                can strike him down
              </li>
              <li>
                At the end of the game, if the agents win, the{" "}
                <TFail>Assassin</TFail> may choose an agent to assassinate. If
                that player is the <TSuccess>Captain</TSuccess>, then the spies
                win instead!
              </li>
              <li>
                In games with 7 or more people, the spies will have the{" "}
                <TFail>Intern</TFail> on the team. New to the spy collective,
                the identity of the <TFail>Intern</TFail> is not known to other
                spies, nor does the <TFail>Intern</TFail> know who the other
                spies are. However knowledgeable <TSuccess>Captain</TSuccess>{" "}
                still knows that the <TFail>Intern</TFail> is part of the spy
                team.
                <br />
                As an <TFail>Intern</TFail>, work hard to fail as many missions
                as possible without stepping on the toes of fellow spies.
              </li>
            </ul>
            <Figure>
              <Figure.Image
                src={`${process.env.PUBLIC_URL}/doc/how-to-play-5.png`}
                alt="Game finished"
              ></Figure.Image>
              <Figure.Caption>
                As the captain, Black Hat knows that Megan, Ponytail, and Sarah
                are the spies. However, Ponytail is the Intern and so does not
                know that Megan and Sarah are also spies, nor do they know that
                Ponytail is an Intern.
              </Figure.Caption>
            </Figure>
            <Figure>
              <Figure.Image
                src={`${process.env.PUBLIC_URL}/doc/how-to-play-6.png`}
                alt="Game finished"
              ></Figure.Image>
              <Figure.Caption>
                The agents have successfully completed 3 missions. Megan the
                assassin has one chance to assassinate an agent. If she picks
                Black Hat (the Captain), the spies will win instead!
              </Figure.Caption>
            </Figure>
          </Col>
          <Col xs={0} lg={1} />
        </Row>
      </Container>
    </div>
  );
}

const Italics = ({ children }: { children: React.ReactNode }) => (
  <span className={s.italics}>{children}</span>
);
