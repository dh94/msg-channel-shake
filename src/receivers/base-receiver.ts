import { HandshakeError } from "../errors";
import {
  HANDSHAKE_MESSAGE_REPLY_TYPE,
  HANDSHAKE_MESSAGE_TYPE,
} from "../events";
import { MessengerOptions, PortMessenger } from "../port-messenger";

const AWAIT_CALLBACK_CHANNEL_TIMEOUT = 10_000;

export interface MessageChannelReceiverOptions extends MessengerOptions {
  channelId: string;
}

export abstract class BaseMessageChannelReceiver {
  private port?: MessagePort;
  private onHandshakeMessage?: (message: MessageEvent) => void;
  #portMessenger?: PortMessenger;

  constructor(private options: MessageChannelReceiverOptions) {}

  public get messaging(): PortMessenger {
    if (!this.port || !this.#portMessenger) {
      throw new Error(
        "MessageChannelReceiver must be after handshake before use."
      );
    }
    return this.#portMessenger;
  }

  public async waitForHandshake(
    timeout = AWAIT_CALLBACK_CHANNEL_TIMEOUT
  ): Promise<void> {
    return await new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(
          new HandshakeError(
            `Message channel handshake timed out. ${AWAIT_CALLBACK_CHANNEL_TIMEOUT}`
          )
        );
        this.removeHandshakeListener(this.onHandshakeMessage!);
      }, timeout);

      this.onHandshakeMessage = (message: MessageEvent) => {
        if (
          message.data.type === HANDSHAKE_MESSAGE_TYPE(this.options.channelId)
        ) {
          clearTimeout(timeoutId);
          if (this.port) {
            throw new HandshakeError("Port already exists");
          }
          const port = message.ports[0];
          this.port = port;
          port.postMessage({
            type: HANDSHAKE_MESSAGE_REPLY_TYPE(this.options.channelId),
          });
          this.#portMessenger = new PortMessenger(port, this.options);
          port.addEventListener(
            "message",
            this.#portMessenger.handleIncomingMessage.bind(this.#portMessenger)
          );
          port.start();
          resolve();
        } else {
          this.#portMessenger!.handleIncomingMessage(message);
        }
      };
      this.listenToHandshake(this.onHandshakeMessage);
    });
  }

  protected abstract listenToHandshake(
    cb: (message: MessageEvent) => void
  ): void;

  protected abstract removeHandshakeListener(
    cb: (message: MessageEvent) => void
  ): void;

  public close(): void {
    this.removeHandshakeListener(this.onHandshakeMessage!);
    this.port?.close();
    this.port = undefined;
    this.#portMessenger = undefined;
  }
}
