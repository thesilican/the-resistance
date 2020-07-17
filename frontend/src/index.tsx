import React from "react";
import { render } from "react-dom";
import App from "./App";
import "./index.scss";
import { SocketProvider } from "./socket";
import { StateProvider } from "./store";

render(
  <StateProvider>
    <SocketProvider>
      <App />
    </SocketProvider>
  </StateProvider>,
  document.getElementById("root")
);

// @ts-ignore
// if (module.hot) module.hot.accept();
