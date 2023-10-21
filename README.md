# Overview

<div style="display: flex;">
<p style="">
"msg-channel-shake" is a library for reducing boilerplate when using the MessageChannel API in iframes and web workers.
<br/>
<br/>
It provides a simple and intuitive way to establish bidirectional communication between two contexts, and it takes care of handling all of the low-level details, such as handshaking, error handling.
</p>

<img src="./msg-channel-shake.png" width="150px" height="150px;">
</div>

# Installation

```
npm install msg-channel-shake
```

# Usage

The package exports a couple of entrypoints, we'll go over them and when to use each

## Initiators

Can be imported from `msg-channel-shake/initiators`.
The initiators are the context that initials the communication, it can either be an iframe or a WebWorker.

### IframeMessageChannelInitiator

- <b>Type</b>: `(
  options: MessageChannelInitiatorOptions,
  iframeReceiverWindow: Window
) => IframeMessageChannelInitiator`

```typescript
import { IframeMessageChannelInitiator } from "msg-channel-shake/initiators";

const messageChannelInitiator = new IframeMessageChannelInitiator(
  {
    channelId,
    async messageCallback({ type, payload }) {
      switch (type) {
        case "Event from receiver": {
          // Logic, can be async, can throw error as well
          break;
        }
      }
    },
  },
  iframe.contentWindow!
);
```

#### IframeMessageChannelInitiator.initiateHandshake

- <b>Type</b> `(timeout: number) => Promise<void>`

#### IframeMessageChannelInitiator.messaging.sendMessage

Send a message to the receiver waiting for `timeoutMs` until a response

- <b>Type</b> `<T = unknown>(
  message: { type: string;
payload: unknown; },
  timeout?: number
): Promise<T>`

```typescript
const responseFromReceiver = await;
messageChannelInitiator.messaging.sendMessage({
  type: "message from initiator",
  payload: {
    hello: "world",
  },
});
```

#### IframeMessageChannelInitiator.messaging.sendAsyncMessage

Send a message without expecting a response

- <b>Type</b> `<T = unknown>(
  message: { type: string;
payload: unknown; }
): void`

## Receivers

Can be imported from `msg-channel-shake/receivers`.
The receivers are the context that the initiator is a parent of, it can either be an iframe or a WebWorker.

### WindowMessageChannelReceiver

- <b>Type</b>: `(
  options: MessageChannelInitiatorOptions,
  iframeReceiverWindow: Window
) => IframeMessageChannelInitiator`

```typescript
import { WindowMessageChannelReceiver } from "msg-channel-shake/receivers";

const messageChannelReceiver = new WindowMessageChannelReceiver({
  channelId,
  async messageCallback(payload) {
    switch (payload.type) {
      case "Event from initiators": {
        let response;
        // do logic
        return response;
      }
    }
  },
});
```

#### WindowMessageChannelReceiver.waitForHandshake

- <b>Type</b> `(timeout: number) => Promise<void>`

#### WindowMessageChannelReceiver.messaging.sendMessage

Send a message to the initiator waiting for `timeoutMs` until a response

- <b>Type</b> `<T = unknown>(
  message: { type: string;
payload: unknown; },
  timeout?: number
): Promise<T>`

```typescript
await messageChannelReceiver.messaging.sendMessage({
  type: "message from receiver",
  payload: {
    hello: "world",
  },
});
```

#### WindowMessageChannelReceiver.messaging.sendAsyncMessage

Send a message without expecting a response

- <b>Type</b> `<T = unknown>(
  message: { type: string;
payload: unknown; }
): void`

# Examples

See the examples folder for usages

- [vanilla js example](./examples/vite-msg-channel-shake/)
- [react example](./examples/vite-react-msg-channel-shake/)
