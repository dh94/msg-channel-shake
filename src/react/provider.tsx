import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { PortMessenger } from "../port-messenger";

const msgChannelShakeContext = createContext<{
  channelByPortMessenger: Record<string, PortMessenger>;
  addPortMessenger(channelId: string, messenger: PortMessenger): void;
  removePortMessenger(channelId: string): void;
}>({
  channelByPortMessenger: {},
  addPortMessenger: () => {},
  removePortMessenger: () => {},
});

export const MsgChannelShakeProvider = ({ children }: PropsWithChildren) => {
  const [channelByPortMessenger, setChannelByPortMessenger] = useState<
    Record<string, PortMessenger>
  >({});

  const addPortMessenger = useCallback(
    (channelId: string, messenger: PortMessenger) => {
      setChannelByPortMessenger({
        ...channelByPortMessenger,
        [channelId]: messenger,
      });
    },
    [setChannelByPortMessenger, channelByPortMessenger]
  );
  const removePortMessenger = useCallback(
    (channelId: string) => {
      delete channelByPortMessenger[channelId];
      setChannelByPortMessenger({
        ...channelByPortMessenger,
      });
    },
    [setChannelByPortMessenger, channelByPortMessenger]
  );
  return (
    <msgChannelShakeContext.Provider
      value={{
        channelByPortMessenger,
        addPortMessenger,
        removePortMessenger,
      }}
    >
      {children}
    </msgChannelShakeContext.Provider>
  );
};

export const usePortMessenger = (channelId: string) => {
  const { channelByPortMessenger } = useContext(msgChannelShakeContext);
  return channelByPortMessenger[channelId];
};

export const useAddPortMessenger = () => {
  const { addPortMessenger } = useContext(msgChannelShakeContext);
  return addPortMessenger;
};
export const useRemovePortMessenger = () => {
  const { removePortMessenger } = useContext(msgChannelShakeContext);
  return removePortMessenger;
};
