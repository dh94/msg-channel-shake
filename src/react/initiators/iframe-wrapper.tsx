import React, { useEffect, useRef, IframeHTMLAttributes } from "react";
import {
  IframeMessageChannelInitiator,
  MessageChannelInitiatorOptions,
} from "../../initiators";
import { useAddPortMessenger, useRemovePortMessenger } from "../provider";

interface IframeChannelWrapperProps
  extends IframeHTMLAttributes<HTMLIFrameElement>,
    MessageChannelInitiatorOptions {}

export const IframeChannelWrapper = ({
  channelId,
  asyncMessageCallback,
  messageCallback,
  ...props
}: IframeChannelWrapperProps) => {
  const addPortMessenger = useAddPortMessenger();
  const removePortMessenger = useRemovePortMessenger();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let initiator: IframeMessageChannelInitiator | undefined;
    if (iframeRef.current) {
      const iframe = iframeRef.current;

      iframe.addEventListener("load", async () => {
        const initiator = new IframeMessageChannelInitiator(
          {
            channelId,
            asyncMessageCallback,
            messageCallback,
          },
          iframe.contentWindow!
        );
        await initiator.initiateHandshake();
        addPortMessenger(channelId, initiator.messaging);
      });
    }

    return () => {
      if (initiator) {
        initiator.close();
        removePortMessenger(channelId);
      }
    };
  }, [iframeRef]);

  return <iframe ref={iframeRef} {...props} />;
};
