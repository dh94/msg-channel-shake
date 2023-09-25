import {
  BaseMessageChannelInitiator,
  MessageChannelInitiatorOptions,
} from "./base-initiator";

export class IframeMessageChannelInitiator extends BaseMessageChannelInitiator {
  constructor(
    options: MessageChannelInitiatorOptions,
    private iframeReceiverWindow: Window
  ) {
    super(options);
  }

  protected postHandshakeInitialization(
    handshakePayload: any,
    port: MessagePort
  ): void {
    this.iframeReceiverWindow.postMessage(handshakePayload, "*", [port]);
  }
}
