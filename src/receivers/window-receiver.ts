import { BaseMessageChannelReceiver } from "./base-receiver";

export class WindowMessageChannelReceiver extends BaseMessageChannelReceiver {
  protected listenToHandshake(cb: (message: MessageEvent<any>) => void): void {
    window.addEventListener("message", cb);
  }

  protected removeHandshakeListener(
    cb: (message: MessageEvent<any>) => void
  ): void {
    window.removeEventListener("message", cb);
  }
}
