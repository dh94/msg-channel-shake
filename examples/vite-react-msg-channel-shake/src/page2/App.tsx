import { useState } from "react";
import "./App.css";
import {
  ReceiverProvider,
  usePortMessenger,
} from "msg-channel-shake/react/receivers";
import { EventsFromIframe, EventsFromMain, channelId } from "../config";

function App() {
  const [count, setCount] = useState(0);
  const [ack, setAck] = useState(false);
  const portMessenger = usePortMessenger(channelId);

  return (
    <>
      <div className="card">
        <button
          onClick={() => {
            setCount((count) => count + 1);
            setAck(false);
            portMessenger
              .sendMessage({
                type: EventsFromIframe.IframeButtonClicked,
                payload: count + 1,
              })
              .then(() => {
                setAck(true);
              });
          }}
        >
          count is {count}
        </button>
      </div>
      <p>main ack? {ack ? "true" : "false"}</p>
    </>
  );
}

function Providers() {
  return (
    <>
      <ReceiverProvider
        channelId={channelId}
        messageCallback={async ({ type }) => {
          switch (type) {
            case EventsFromMain.GetClickAmounts: {
              await new Promise((res) => setTimeout(res, 2000));
              return 0;
            }
          }
        }}
      >
        <App />
      </ReceiverProvider>
    </>
  );
}
export default Providers;
