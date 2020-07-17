import React from "react";
import { Container } from "react-bootstrap";
import img1 from "../../../assets/howtoplay1.png";
import img2 from "../../../assets/howtoplay2.png";
import img3 from "../../../assets/howtoplay3.png";

const HowToPlayPage = React.memo(function () {
  return (
    <Container className="HowToPlay">
      <h1>How To Play</h1>
      <p>
        In the Resistance, players are in one of two opposing teams - the{" "}
        <SuccessColor>Agents</SuccessColor> or the <FailColor>Spies</FailColor>.
      </p>
      <ul>
        <li>
          The <FailColor>Spies</FailColor> know the roles of all the other
          spies, but the <SuccessColor>Agents</SuccessColor> only know their own
          role
        </li>
        <li>
          The goal of all <SuccessColor>Agents</SuccessColor> is to complete{" "}
          <Italics>3 successful missions</Italics>
        </li>
        <li>
          The goal of all <FailColor>Spies</FailColor> is to{" "}
          <Italics>fail 3 missions</Italics>
        </li>
      </ul>
      <p>There are 3 main phases of the game:</p>
      <h2>Team Building</h2>
      <p>
        During this phase, one player will become the <Bold>Team Leader</Bold>,
        indicated by the stick figure wearing a hat.
      </p>
      <ul>
        <li>
          The <Bold>Team Leader</Bold> gets to propose a team of people to go on
          a mission
        </li>
        <li>
          The number of players in the mission is indicated by the{" "}
          <Bold>Mission Counter</Bold> at the right of the screen
        </li>
      </ul>
      <img src={img1} alt="Team Building phase"></img>
      <h2>Voting</h2>
      <p>
        During this phase, every player will vote to decide whether or not the
        proposed team will go on the mission.
      </p>
      <ul>
        <li>
          If a majority of players vote to accept the proposed team, then the
          team is <SuccessColor>ACCEPTED</SuccessColor> and the players on the
          team go on a mission
        </li>
        <li>
          Otherwise, the team is <FailColor>REJECTED</FailColor>, and a new team
          leader picks a new team
        </li>
        <li>
          If 5 consecutive team proposals are <FailColor>REJECTED</FailColor>,
          the the <FailColor>Spies</FailColor> automatically win one mission
        </li>
      </ul>
      <img src={img2} alt="Voting phase"></img>
      <h2>Mission</h2>
      <p>
        During this phase, the players selected on the team will go on a
        mission. A mission can either be <SuccessColor>successful</SuccessColor>{" "}
        or <FailColor>failed</FailColor>.
      </p>
      <ul>
        <li>
          Players choose to either <SuccessColor>succeed</SuccessColor> or{" "}
          <FailColor>fail</FailColor> a mission
        </li>
        <li>
          If <Italics>at least one player</Italics> on the mission fails the
          mission, then the mission is <FailColor>failed</FailColor>. Otherwise,
          the mission is <SuccessColor>successful</SuccessColor>
          <ul>
            <li>
              For games with more than 6 people, some missions may require{" "}
              <FailColor>2 fails</FailColor> for the mission to be failed. These
              missions have a square-shaped icon in the misisons counter on the
              right of the screen
            </li>
          </ul>
        </li>
      </ul>
      <img src={img3} alt="Voting phase"></img>
      <h2>Game Ending</h2>
      <p>
        The game ends once there are 3 <SuccessColor>successful</SuccessColor>{" "}
        missions or 3 <FailColor>failed</FailColor> missions. The{" "}
        <SuccessColor>Agents</SuccessColor> win if there are 3 successful
        missions, and the <FailColor>Spies</FailColor> win if there are 3 failed
        missions.
      </p>
      <h2>Video Version</h2>
      <p>
        Below is a video explaining the rules of original board game. Rules for
        this online version are roughly the same as the original board game.
      </p>
      <iframe
        className="mb-3"
        width="560"
        height="315"
        src="https://www.youtube.com/embed/DUENzjE9Jwg"
      ></iframe>
    </Container>
  );
});

function SuccessColor({ children }: { children: React.ReactNode }) {
  return <span className="c-success font-weight-bold">{children}</span>;
}

function FailColor({ children }: { children: React.ReactNode }) {
  return <span className="c-fail font-weight-bold">{children}</span>;
}
function Bold({ children }: { children: React.ReactNode }) {
  return <span className="font-weight-bold">{children}</span>;
}
function Italics({ children }: { children: React.ReactNode }) {
  return <span className="font-italics">{children}</span>;
}

export default HowToPlayPage;
