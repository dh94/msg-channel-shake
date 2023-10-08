import { createPromisedChannel } from "./channel-promise-wrapper";
import {
  InternalMessagePayload,
  MessagePayload,
  ResponseMessagePayload,
} from "./message-types";

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
    timeout?: number
  ): Promise<T> {
    const [portToForward, promise] = createPromisedChannel<T>(timeout);

    this.port!.postMessage(message satisfies InternalMessagePayload, [
      portToForward,
    ]);
    return promise;
  }

  public sendAsyncMessage(message: MessagePayload) {
    this.port!.postMessage({
      ...message,
      asyncMessage: true,
    } satisfies InternalMessagePayload);
  }
}
