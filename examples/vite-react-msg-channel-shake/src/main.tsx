import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MsgChannelShakeProvider } from "msg-channel-shake/react/initiators";

React.createElement("a");
ReactDOM.createRoot(document.getElementById("root")!).render(
  <MsgChannelShakeProvider>
    <App />
  </MsgChannelShakeProvider>
);
