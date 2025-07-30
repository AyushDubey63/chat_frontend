import { useEffect } from "react";
import { useSocket } from "../context/socket";
import { usePeer } from "../context/peer";

const SocketEventListener = () => {
  const socket = useSocket();
  const peer = usePeer();
  const sendAnswer = async ({ chat_id }) => {
    const answer = await peer.peer.createAnswer();
    await peer.peer.setLocalDescription(answer);
    socket.emit("video_call", {
      answer,
      chat_id,
      type: "answer",
    });
  };
  useEffect(() => {
    if (!socket) return;
    socket.on("video_call", async (data) => {
      const { type, offer, chat_id } = data;
      console.log("Video call request received:", data);
      if (type === "offer" && !peer.peer.currentRemoteDescription) {
        await peer.peer.setRemoteDescription(new RTCSessionDescription(offer));
        await sendAnswer({ chat_id });
      }
      if (type === "answer") {
        await peer.peer.setRemoteDescription(new RTCSessionDescription(offer));
      }
    });
    return () => {};
  }, [socket]);

  return null;
};

export default SocketEventListener;
