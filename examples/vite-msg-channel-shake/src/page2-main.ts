import "./style.css";
import { setupCounter } from "./counter.ts";
import { WindowMessageChannelReceiver } from "../../../src/receivers";
import { EventsFromIframe, EventsFromMain, channelId } from "./config.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Sub Page</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p id="main-output"> </p>
  </div>
`;

const counter = document.querySelector<HTMLButtonElement>("#counter")!;

const messageChannelReceiver = new WindowMessageChannelReceiver({
  channelId,
  async messageCallback(payload) {
    switch (payload.type) {
      case EventsFromMain.GetClickAmounts: {
        await new Promise((res) => setTimeout(res, 2000));
        return counter.innerHTML.split(" ")!.at(-1);
      }
    }
  },
});

console.info("Waiting for handshake...");
await messageChannelReceiver.waitForHandshake(10_000);
console.info("handshake finished");

setupCounter(counter, (newClickAmount) => {
  messageChannelReceiver.messaging.sendMessage({
    type: EventsFromIframe.IframeButtonClicked,
    payload: newClickAmount,
  });
});
