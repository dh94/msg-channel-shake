import { MessageTimeoutError } from "./errors";

export const MESSAGE_RESPONSE_TIMEOUT = 30_000;

type PortToForward = MessagePort;

export const createPromisedChannel = <T = unknown>(
  timeout = MESSAGE_RESPONSE_TIMEOUT
): [PortToForward, Promise<T>] => {
  const messageChannel = new MessageChannel();

  return [
    messageChannel.port2,
    new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new MessageTimeoutError(timeout));
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
    }),
  ];
};
