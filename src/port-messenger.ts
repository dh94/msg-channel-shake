import { MessageTimeoutError } from "./errors";
import {
  InternalMessagePayload,
  MessagePayload,
  ResponseMessagePayload,
} from "./message-types";

export const MESSAGE_RESPONSE_TIMEOUT = 30_000;

export interface MessengerOptions {
  messageCallback?: (payload: MessagePayload) => Promise<unknown>;
  asyncMessageCallback?: (payload: MessagePayload) => void;
}

export class PortMessenger {
  constructor(private port: MessagePort, private options: MessengerOptions) {}

  public async handleIncomingMessage({
    data,
    ports,
  }: MessageEvent<InternalMessagePayload>): Promise<void> {
    if (data.asyncMessage) {
      if (this.options.asyncMessageCallback) {
        this.options.asyncMessageCallback(data);
      }
    } else if (this.options.messageCallback) {
      try {
        const result = await this.options.messageCallback(data);
        ports[0].postMessage({
          response: result,
          error: false,
        } satisfies ResponseMessagePayload);
      } catch (e) {
        ports[0].postMessage({
          response: e instanceof Error ? e.message : e,
          error: true,
        } satisfies ResponseMessagePayload);
      }
    }
  }

  public sendMessage<T = unknown>(
    message: MessagePayload,
    timeout = MESSAGE_RESPONSE_TIMEOUT
  ): Promise<T> {
    const messageChannel = new MessageChannel();

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new MessageTimeoutError(message.type, timeout));
      }, timeout);

      messageChannel.port1.addEventListener("message", (event) => {
        clearTimeout(timeoutId);
        const { response, error } = event.data ?? {};
        if (error) {
          reject(response);
        } else {
          resolve(response);
        }
        messageChannel.port1.close();
      });
      messageChannel.port1.start();

      this.port!.postMessage(message satisfies InternalMessagePayload, [
        messageChannel.port2,
      ]);
    });
  }

  public sendAsyncMessage(message: MessagePayload) {
    this.port!.postMessage({
      ...message,
      asyncMessage: true,
    } satisfies InternalMessagePayload);
  }
}
