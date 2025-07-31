import { useSocket } from "../context/socket";
import peer from "../context/peer";
import { useEffect, useRef } from "react";
import { useStream } from "../context/StreamContext";

const SocketEventListener = () => {
  const socket = useSocket();
  const {
    chatId,
    setChatId,
    myStream,
    setMyStream,
    remoteStream,
    setRemoteStream,
  } = useStream();

  const handleIncomingCall = async ({ chat_id, offer }) => {
    if (!chatId) {
      setChatId(chat_id);
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setMyStream(stream);
    const answer = await peer.getAnswer(offer);
    console.log("Sending answer", answer);
    socket.emit("call:accepted", { answer, chat_id });
  };

  const sendStreams = () => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  };

  const handleCallAccepted = async ({ answer }) => {
    console.log("Call accepted, setting local description", answer);
    await peer.setLocalDescription(answer);
    sendStreams();
  };

  const handleIceCandidate = (event) => {
    if (event.candidate) {
      console.log("Sending ICE candidate", event.candidate);
      socket.emit("ice:candidate", {
        candidate: event.candidate,
        chat_id: chatId,
      });
    }
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
    peer.peer.addEventListener("icecandidate", handleIceCandidate);
    peer.peer.addEventListener("track", handleRemoteTrack);
    return () => {
      peer.peer.removeEventListener("icecandidate", handleIceCandidate);
      peer.peer.removeEventListener("track", handleRemoteTrack);
    };
  }, [peer, socket]);

  useEffect(() => {
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("ice:candidate", handleRemoteIceCandidate);
    return () => {
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("ice:candidate", handleRemoteIceCandidate);
    };
  }, [
    socket,
    handleIncomingCall,
    handleCallAccepted,
    handleRemoteIceCandidate,
  ]);
  return null;
};

export default SocketEventListener;
