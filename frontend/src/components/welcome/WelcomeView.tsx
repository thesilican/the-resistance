import React from "react";
import styles from "../../styles/welcome/WelcomeView.module.scss";
import JoinLobbyBox from "./JoinLobbyBox";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import HowToPlayView from "./HowToPlayView";
import AboutView from "./AboutView";

export default function WelcomeView() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <WelcomeViewContents />
        </Route>
        <Route path="/about">
          <AboutView />
        </Route>
        <Route path="/how-to-play">
          <HowToPlayView />
        </Route>
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

function WelcomeViewContents() {
  return (
    <div className={styles.WelcomeView}>
      <h1>The Resistance</h1>
      <p>A party game of lying, logical deduction, and deception</p>
      <JoinLobbyBox />
      {/* Links */}
      <div className={styles.linksBox}>
        <a href="/about">About</a>
        {" · "}
        <a target="_blank" href="/how-to-play">
          How to play
        </a>
        {" · "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/thesilican/the-resistance"
        >
          GitHub
        </a>
        {" · "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://thesilican.com"
        >
          More projects
        </a>
      </div>
    </div>
  );
}