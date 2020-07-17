import React from "react";
import LobbyView from "./components/lobby/LobbyView";
import WelcomeView from "./components/welcome/WelcomeView";
import { useStore } from "./store";

type AppProps = {};

export default function App({}: AppProps) {
  const [state, dispatch] = useStore();
  return state.roomID === "" ? <WelcomeView /> : <LobbyView />;
}
