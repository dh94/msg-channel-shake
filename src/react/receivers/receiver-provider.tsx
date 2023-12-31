import React, { PropsWithChildren, useEffect } from "react";
import {
  MessageChannelReceiverOptions,
  WindowMessageChannelReceiver,
} from "../../receivers";
import {
  MsgChannelShakeProvider,
  useAddPortMessenger,
  useRemovePortMessenger,
} from "../provider";

const Receiver = ({
  channelId,
  asyncMessageCallback,
  messageCallback,
}: MessageChannelReceiverOptions) => {
  const addPortMessenger = useAddPortMessenger();
  const removePortMessenger = useRemovePortMessenger();

  useEffect(() => {
    let receiver: WindowMessageChannelReceiver;
    (async () => {
      receiver = new WindowMessageChannelReceiver({
        channelId,
        asyncMessageCallback,
        messageCallback,
      });

      await receiver.waitForHandshake();
      addPortMessenger(channelId, receiver.messaging);
    })();

    return () => {
      if (receiver) {
        receiver.close();
        removePortMessenger(channelId);
      }
    };
  }, [channelId]);

  return null;
};

export const ReceiverProvider = ({
  children,
  channelId,
  asyncMessageCallback,
  messageCallback,
}: PropsWithChildren<MessageChannelReceiverOptions>) => {
  return (
    <MsgChannelShakeProvider>
      <Receiver
        channelId={channelId}
        asyncMessageCallback={asyncMessageCallback}
        messageCallback={messageCallback}
      />
      {children}
    </MsgChannelShakeProvider>
  );
};
