import { createContext, useContext, useState, useRef } from "react";
import { useSocket } from "./socket";
import { getLocalMedia } from "../helper/getLocalStream";
import setUpPeerConnection from "./peer";

const StreamContext = createContext();

const StreamProvider = ({ children }) => {
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [chatId, setChatId] = useState();
  const peerConnectionRef = useRef(null);
  const socket = useSocket();
  setUpPeerConnection({ peerConnectionRef, socket, setRemoteStream });

  const callUser = async (user) => {
    const { stream } = await getLocalMedia();
    setMyStream(stream);
    const peer = peerConnectionRef.current;
    stream.getTracks().forEach((track) => {
      peer.addTrack(track, stream);
    });
    const offer = await peer.getOffer();
    setChatId(user.chat_id);
    socket.emit("user:call", { offer, chat_id: user.chat_id });
  };

  const acceptCall = async (chat_id, offer) => {
    const { stream } = await getLocalMedia();
    setMyStream(stream);
    const peer = peerConnectionRef.current;
    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    const answer = await peer.createAnswer(offer);
    await peer.setLocalDescription(answer);
    socket.emit("call:accepted", { answer, chat_id });
    setChatId(chat_id);
  };

  const handleIncomingCall = async ({ chat_id, offer }) => {};
  return (
    <StreamContext.Provider
      value={{
        myStream,
        setMyStream,
        remoteStream,
        setRemoteStream,
        chatId,
        setChatId,
        getFreshStream, // <-- expose this
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
