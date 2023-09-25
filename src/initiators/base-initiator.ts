import {
  HANDSHAKE_MESSAGE_REPLY_TYPE,
  HANDSHAKE_MESSAGE_TYPE,
} from "../events";
import { MessengerOptions, PortMessenger } from "../port-messenger";

export interface MessageChannelInitiatorOptions extends MessengerOptions {
  channelId: string;
}

export abstract class BaseMessageChannelInitiator {
  protected port?: MessagePort;

  #portMessenger?: PortMessenger;

  constructor(protected options: MessageChannelInitiatorOptions) {}

  protected abstract postHandshakeInitialization(
    handshakePayload: unknown,
    port: MessagePort
  ): void;

  public get messaging(): PortMessenger {
    if (!this.port || !this.#portMessenger) {
      throw new Error(
        "MessageChannelInitiator must be initialized before use."
      );
    }
    return this.#portMessenger;
  }

  public async initiateHandshake(timeoutMs = 10_000): Promise<void> {
    return await new Promise<void>((resolve, reject) => {
      const channel = new MessageChannel();
      const timeoutId = setTimeout(() => {
        reject(new Error("MessageChannel handshake timed out"));
        channel.port1.close();
      }, timeoutMs);

      channel.port1.addEventListener("message", (msg) => {
        if (
          msg?.data?.type ===
          HANDSHAKE_MESSAGE_REPLY_TYPE(this.options.channelId)
        ) {
          clearTimeout(timeoutId);
          this.port = channel.port1;
          this.#portMessenger = new PortMessenger(channel.port1, this.options);
          resolve();
        } else {
          this.#portMessenger!.handleIncomingMessage(msg);
        }
      });
      channel.port1.start();
      this.postHandshakeInitialization(
        { type: HANDSHAKE_MESSAGE_TYPE(this.options.channelId) },
        channel.port2
      );
    });
  }

  public close(): void {
    this.port?.close();
    this.port = undefined;
    this.#portMessenger = undefined;
  }
}
