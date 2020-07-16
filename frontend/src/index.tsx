import React from "react";
import { render } from "react-dom";
import "./index.scss";
import App from "./App";
import { StateProvider } from "./store";
import { SocketProvider } from "./socket";

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
