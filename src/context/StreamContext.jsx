import { createContext, useContext, useState } from "react";
const StreamContext = createContext();
const StreamProvider = ({ children }) => {
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [chatId, setChatId] = useState();
  return (
    <StreamContext.Provider
      value={{
        myStream,
        setMyStream,
        remoteStream,
        setRemoteStream,
        chatId,
        setChatId,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
};

const useStream = () => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error("useStream must be used within a StreamProvider");
  }
  return context;
};
export { StreamProvider, useStream };
