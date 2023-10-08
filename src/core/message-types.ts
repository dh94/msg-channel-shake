export interface ResponseMessagePayload {
  response: unknown;
  error: boolean;
}

export interface MessagePayload {
  type: string;
  payload: unknown;
}

export interface InternalMessagePayload extends MessagePayload {
  asyncMessage?: boolean;
}
