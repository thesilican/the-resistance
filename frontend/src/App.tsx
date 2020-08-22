import React, { Suspense } from "react";
const LobbyView = React.lazy(() => import("./components/lobby/LobbyView"));
import WelcomeView from "./components/welcome/WelcomeView";
import { useStore } from "./store";

type AppProps = {};

const fallback = (
  <div style={{ padding: "1rem" }}>
    <p>Loading...</p>
  </div>
);

export default function App({}: AppProps) {
  const [state, dispatch] = useStore();
  return state.roomID === "" ? (
    <WelcomeView />
  ) : (
    <Suspense fallback={fallback}>
      <LobbyView />
    </Suspense>
  );
}
