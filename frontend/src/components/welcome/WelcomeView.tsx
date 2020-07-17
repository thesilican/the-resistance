import { createBrowserHistory } from "history";
import React, { useEffect } from "react";
import { Route, Router, Switch, useHistory, useParams } from "react-router-dom";
import { useStore } from "../../store";
import CookieBanner from "./CookieBanner";
import CreateJoinLobbyForm from "./CreateJoinLobbyForm";

type WelcomeViewProps = {};

const history = createBrowserHistory();

export default function WelcomeView({}: WelcomeViewProps) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/join/:id">
          <InviteLinkRedirect />
        </Route>
        <Route path="/">
          <div className="WelcomeView">
            <CreateJoinLobbyForm />
            <CookieBanner />
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
