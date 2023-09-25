import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
import { EventsFromIframe, EventsFromMain, channelId } from "./config.ts";
import { setupCounter } from "./counter.ts";
import { IframeMessageChannelInitiator } from "../../../src/initiators";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Main Page</h1>
    <div class="card">
      <button id="counter" type="button"></button>
      <p id="iframe-output"> </p>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
    <iframe src="page2.html" width="480" height="320"></iframe>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);

const iframe = document.querySelector("iframe")!;

iframe.addEventListener("load", async () => {
  const messageChannelInitiator = new IframeMessageChannelInitiator(
    {
      channelId,
      async messageCallback({ type, payload }) {
        switch (type) {
          case EventsFromIframe.IframeButtonClicked: {
            const newClickAmount = payload as string;

            document.querySelector(
              "#iframe-output"
            )!.innerHTML = `Iframe reported ${newClickAmount}`;
            break;
          }
        }
      },
    },
    iframe.contentWindow!
  );

  await messageChannelInitiator.initiateHandshake(10_000);

  const iframeClickAmounts =
    await messageChannelInitiator.messaging.sendMessage({
      type: EventsFromMain.GetClickAmounts,
      payload: undefined,
    });

  document.querySelector(
    "#iframe-output"
  )!.innerHTML = `Iframe reported ${iframeClickAmounts}`;
});
