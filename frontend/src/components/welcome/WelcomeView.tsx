import { createBrowserHistory } from "history";
import React, { useEffect } from "react";
import { Route, Router, Switch, useHistory, useParams } from "react-router-dom";
import { useStore } from "../../store";
import AboutPage from "./AboutPage";
import CookieBanner from "./CookieBanner";
import CreateJoinLobbyForm from "./CreateJoinLobbyForm";
import HowToPlayPage from "./HowToPlayPage";
import SafariBanner from "./SafariBanner";

const history = createBrowserHistory();

export default function WelcomeView() {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/join/:id">
          <InviteLinkRedirect />
        </Route>
        <Route path="/about">
          <AboutPage />
        </Route>
        <Route path="/how-to-play">
          <HowToPlayPage />
        </Route>
        <Route path="/">
          <div className="WelcomeView">
            <h1>The Resistance</h1>
            <p>A party game of lying, logical deduction, and deception</p>
            <CreateJoinLobbyForm />
            <SafariBanner />
            <CookieBanner />
            <div className="links">
              <a href="/about">About</a>
              {" | "}
              <a target="_blank" href="/how-to-play">
                How to play
              </a>
              {" | "}
              <a
                target="_blank"
                href="https://github.com/thesilican/the-resistance"
              >
                GitHub
              </a>
              {" | "}
              <a target="_blank" href="https://thesilican.com">
                More projects
              </a>
            </div>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

type InviteLinkRedirectProps = {};

function InviteLinkRedirect({}: InviteLinkRedirectProps) {
  const { id } = useParams() as { id: string };
  const [, dispatch] = useStore();
  const history = useHistory();
  useEffect(() => {
    dispatch({
      category: "client",
      type: "change-url-id",
      urlRoomID: id,
    });
    history.push("/");
  }, []);
  return <p>Redirecting...</p>;
}
