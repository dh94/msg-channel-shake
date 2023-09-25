import {
  BaseMessageChannelInitiator,
  MessageChannelInitiatorOptions,
} from "./base-initiator";

export class WorkerMessageChannelInitiator extends BaseMessageChannelInitiator {
  constructor(options: MessageChannelInitiatorOptions, private worker: Worker) {
    super(options);
  }

  public postHandshakeInitialization(payload: any, port: MessagePort): void {
    this.worker.postMessage(payload, [port]);
  }
}
