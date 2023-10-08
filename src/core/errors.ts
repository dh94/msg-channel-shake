export class HandshakeError extends Error {}

export class MessageTimeoutError extends Error {
  constructor(timeout: number) {
    super(`Timeout of ${timeout}ms exceeded`);
  }
}
