import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { IframeChannelWrapper } from "msg-channel-shake/react/initiators";
import { EventsFromIframe, channelId } from "./config";

function App() {
  const [count, setCount] = useState(0);
  const [iframeCount, setIframeCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>Iframe count is {iframeCount}</p>
      </div>
      <IframeChannelWrapper
        src="page2.html"
        width="480"
        height="320"
        channelId={channelId}
        messageCallback={async ({ type, payload }) => {
          switch (type) {
            case EventsFromIframe.IframeButtonClicked: {
              const newClickAmount = payload as number;
              setIframeCount(newClickAmount);
              break;
            }
          }
        }}
      />
    </>
  );
}

export default App;
