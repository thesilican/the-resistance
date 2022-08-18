import { useState } from "react";
import { Link } from "react-router-dom";
import JoinLobbyBox from "./JoinLobbyBox";
import s from "./WelcomeView.module.scss";

function getInitialRoomCode() {
  const location = new URL(window.location.href);
  const code = location.searchParams.get("join");
  if (code?.match(/[A-Z]{4}/)) return code;
  return null;
}

export default function WelcomeView() {
  const [initialRoomCode] = useState(getInitialRoomCode);

  return (
    <div className={s.WelcomeView}>
      <h1>The Resistance</h1>
      <p>A party game of lying, logical deduction, and deception</p>
      <JoinLobbyBox initialRoomCode={initialRoomCode} />
      {/* Links */}
      <div className={s.linksBox}>
        <Link to="./about">About</Link>
        {" · "}
        <Link to="./how-to-play">How to play</Link>
        {" · "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/thesilican/the-resistance"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
