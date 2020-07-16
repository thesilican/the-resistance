import React from "react";
import { Form, Button } from "react-bootstrap";
import CreateJoinLobbyForm from "./CreateJoinLobbyForm";
import CookieBanner from "./CookieBanner";

type WelcomeViewProps = {};

export default function WelcomeView({}: WelcomeViewProps) {
  return (
    <div className="WelcomeView">
      <h1>Welcome View</h1>
      <CreateJoinLobbyForm />
      <CookieBanner />
    </div>
  );
}
