export const HANDSHAKE_MESSAGE_TYPE = (channelId: string) =>
  `message_channel_handshake_${channelId}`;
export const HANDSHAKE_MESSAGE_REPLY_TYPE = (channelId: string) =>
  `message_channel_handshake_reply_${channelId}`;
