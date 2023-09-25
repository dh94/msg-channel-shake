import { BaseMessageChannelReceiver } from "../base-receiver";

export class WorkerMessageChannelReceiver extends BaseMessageChannelReceiver {
  protected listenToHandshake(cb: (message: MessageEvent<any>) => void): void {
    self.addEventListener("message", cb);
  }

  protected removeHandshakeListener(
    cb: (message: MessageEvent<any>) => void
  ): void {
    self.removeEventListener("message", cb);
  }
}
