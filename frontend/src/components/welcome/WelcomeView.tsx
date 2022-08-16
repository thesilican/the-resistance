import { Link } from "react-router-dom";
import JoinLobbyBox from "./JoinLobbyBox";
import s from "./WelcomeView.module.scss";

export default function WelcomeView() {
  return (
    <div className={s.WelcomeView}>
      <h1>The Resistance</h1>
      <p>A party game of lying, logical deduction, and deception</p>
      <JoinLobbyBox />
      {/* Links */}
      <div className={s.linksBox}>
        <Link to="/about">About</Link>
        {" · "}
        <Link to="/how-to-play">How to play</Link>
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
