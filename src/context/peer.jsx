import { createContext, useContext, useEffect, useState } from "react";

const PeerContext = createContext(null);
// hi
// ✅ Custom hook to use the Peer instance
const usePeer = () => {
  const context = useContext(PeerContext);
  if (!context) {
    throw new Error("usePeer must be used within a PeerProvider");
  }
  return context;
};
const PeerProvider = ({ children }) => {
  const [peer, setPeer] = useState(null);

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
    <PeerContext.Provider value={{ peer }}>{children}</PeerContext.Provider>
  );
};

export { PeerProvider, usePeer };
