import { createContext, useContext, useEffect, useState } from "react";

const PeerContext = createContext(null);

export const usePeer = () => {
  const context = useContext(PeerContext);
  if (!context) {
    throw new Error("usePeer must be used within a PeerProvider");
  }
  return context;
};

export const PeerProvider = ({ children }) => {
  const [peer, setPeer] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [chatId, setChatId] = useState(null); // optional: for ICE signaling

  useEffect(() => {
    const peerInstance = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    setPeer(peerInstance);

    return () => {
      peerInstance.close();
    };
  }, []);

  return (
    <PeerContext.Provider
      value={{
        peer,
        setPeer,
        localStream,
        setLocalStream,
        remoteStream,
        setRemoteStream,
        inCall,
        setInCall,
        chatId,
        setChatId,
      }}
    >
      {children}
    </PeerContext.Provider>
  );
};
