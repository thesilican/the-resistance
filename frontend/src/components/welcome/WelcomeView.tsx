import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import styles from "../../styles/welcome/WelcomeView.module.scss";
import AboutView from "./AboutView";
import HowToPlayView from "./HowToPlayView";
import JoinLobbyBox from "./JoinLobbyBox";

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
        <a href="/how-to-play">How to play</a>
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
