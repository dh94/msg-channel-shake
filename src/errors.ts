export class HandshakeError extends Error {}

export class MessageTimeoutError extends Error {
  constructor(type: string, timeout: number) {
    super(`Timeout of ${timeout}ms exceeded for message of type ${type}`);
  }
}
