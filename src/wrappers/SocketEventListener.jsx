import { useSocket } from "../context/socket";
import peer from "../context/peer";
import { useEffect, useRef } from "react";
import { useStream } from "../context/StreamContext";

const SocketEventListener = () => {
  const socket = useSocket();
  const { chatId, setChatId, myStream, setRemoteStream, getFreshStream } =
    useStream();

  const handleIceCandidate = (event) => {
    console.log("ICE candidate event", event);
    if (event.candidate) {
      console.log("Sending ICE candidate", event.candidate);
      socket.emit("ice:candidate", {
        candidate: event.candidate,
        chat_id: chatId,
      });
    }
  };

  const handleIncomingCall = async ({ chat_id, offer } = {}) => {
    console.log("Incoming call received", chat_id, offer);
    try {
      if (!chatId) setChatId(chat_id);
      const stream = await getFreshStream();

      // ✅ Pass handleIceCandidate directly
      const answer = await peer.getAnswer(offer, handleIceCandidate);

      socket.emit("call:accepted", { answer, chat_id });
      console.log("Sending answer", answer);
    } catch (err) {
      console.error("Incoming call error:", err);
    }
  };

  const sendStreams = () => {
    if (!myStream) {
      console.error("No stream available to send.");
      return;
    }
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  };

  const handleCallAccepted = async ({ answer }) => {
    console.log("Call accepted, setting remote description", answer);

    await peer.setRemoteDescription(answer); // Set their answer
    sendStreams();

    // ICE will be triggered by caller’s `getOffer()`, not here.
    console.log("Remote description set, streams sent");
  };

  const handleRemoteIceCandidate = ({ candidate }) => {
    console.log("Received remote ICE candidate", candidate);
    peer.peer.addIceCandidate(candidate);
  };

  const handleRemoteTrack = (event) => {
    console.log("Remote track received", event);
    setRemoteStream(event.streams[0]);
  };

  useEffect(() => {
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("ice:candidate", handleRemoteIceCandidate);
    peer.peer.addEventListener("track", handleRemoteTrack);
    return () => {
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("ice:candidate", handleRemoteIceCandidate);
      peer.peer.removeEventListener("track", handleRemoteTrack);
    };
  }, [
    socket,
    handleIncomingCall,
    handleCallAccepted,
    handleRemoteIceCandidate,
    handleRemoteTrack,
  ]);
  return null;
};

export default SocketEventListener;
