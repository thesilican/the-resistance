import React from "react";
import { Container } from "react-bootstrap";
import { useStore } from "../../store";
import imgDemo from "../../../assets/demo.png";

export default function AboutPage() {
  const [state] = useStore();
  const usersOnline = state.online.users;
  const lobbiesOnline = state.online.lobbies;
  const gamesOnline = state.online.games;
  return (
    <Container className="AboutPage">
      <a className="back" href="/">
        Back to home page
      </a>
      <h1>The Resistance</h1>
      <p>
        This website is a free, open source, online version of the classic board
        game{" "}
        <a
          target="_blank"
          href="https://en.wikipedia.org/wiki/The_Resistance_(game)"
        >
          The Resistance
        </a>
      </p>
      <p>
        Similar to party games like Mafia and Werewolf, the Resistance
        challenges players' skills of deception, lying, and social deduction to
        determine who to trust. Anywhere between 5 to 10 players can play the
        Resistance.
      </p>
      <div>
        <img src={imgDemo} alt="The resistance game in progress"></img>
      </div>
      <p>
        This online version is based on the original card game by by Don
        Eskridge. You can buy the original game{" "}
        <a
          target="_blank"
          href="https://www.amazon.com/The-Resistance-Dystopian-Universe/dp/B008A2BA8G"
        >
          here
        </a>
        . If you like this game, I highly suggest you try out the board game
        version!
      </p>
      <p>
        The user interface/layout of the game was greatly inspired by the{" "}
        <a target="_blank" href="http://www.mindnightgame.com/">
          MINDNIGHT
        </a>
        , a free-to-play steam game with similar gameplay to The Resistance. If
        you liked this game, try it out! It has better graphics, audio, and lets
        you save your progress. You can buy skins and compete in tournaments
        there.
      </p>
      <p>
        The Resistance was programmed by{" "}
        <a target="_blank" href="https://github.com/thesilican/">
          thesilican
        </a>
        , using React.js and Socket.IO. Source code is available on{" "}
        <a target="blank" href="https://github.com/thesilican/the-resistance">
          GitHub.
        </a>
      </p>
      <p className="text-secondary">
        Users Connected: {usersOnline} | Lobbies: {lobbiesOnline} | Games:{" "}
        {gamesOnline}
      </p>
    </Container>
  );
}
