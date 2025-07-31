import { useSocket } from "../context/socket";
import { usePeer } from "../context/peer";
import { useEffect, useRef } from "react";

const SocketEventListener = () => {
  const socket = useSocket();
  const {
    peer,
    localStream,
    setLocalStream,
    setRemoteStream,
    setInCall,
    chatId,
    setChatId,
  } = usePeer();

  // ✅ Buffer ICE candidates that arrive before remote description is set
  const pendingCandidatesRef = useRef([]);

  const getLocalMedia = async () => {
    if (!localStream) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);

      // Add local stream tracks to peer connection
      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
      });
    }
  };
  const sendAnswer = async ({ chat_id }) => {
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    console.log("Sending answer:", answer);
    socket.emit("video_call", {
      offer: answer,
      chat_id,
      type: "answer",
    });
  };

  const sendCandidate = ({ chat_id, candidate }) => {
    socket.emit("ice_candidate", {
      candidate,
      chat_id,
      type: "candidate",
    });
  };

  // ✅ Set up ICE and track listeners
  useEffect(() => {
    if (!peer || !socket) return;

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate:", event.candidate);
        sendCandidate({
          chat_id: chatId,
          candidate: event.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
      console.log("Received remote track", event.streams[0]);
      setRemoteStream(event.streams[0]);
      setInCall(true);
    };

    return () => {
      peer.onicecandidate = null;
      peer.ontrack = null;
    };
  }, [peer, socket, chatId]);

  // ✅ Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("video_call", async (data) => {
      const { type, offer, chat_id } = data;
      console.log("Received video call event:", data);
      if (type === "offer" && !peer.currentRemoteDescription) {
        setChatId(chat_id);
        await getLocalMedia();
        await peer.setRemoteDescription(new RTCSessionDescription(offer));

        // ✅ Flush any buffered ICE candidates
        while (pendingCandidatesRef.current.length) {
          const cand = pendingCandidatesRef.current.shift();
          try {
            await peer.addIceCandidate(new RTCIceCandidate(cand));
            console.log("Flushed buffered ICE candidate");
          } catch (e) {
            console.error("Error flushing ICE candidate", e);
          }
        }

        await sendAnswer({ chat_id });
      }
      console.log("Received call type:", type);
      if (type === "answer") {
        setChatId(chat_id, "answer");
        await peer.setRemoteDescription(new RTCSessionDescription(offer));

        // ✅ Flush any buffered ICE candidates
        while (pendingCandidatesRef.current.length) {
          const cand = pendingCandidatesRef.current.shift();
          try {
            await peer.addIceCandidate(new RTCIceCandidate(cand));
            console.log("Flushed buffered ICE candidate");
          } catch (e) {
            console.error("Error flushing ICE candidate", e);
          }
        }
      }
    });

    socket.on("ice_candidate", async ({ candidate }) => {
      console.log("Received ICE candidate:", candidate);

      if (!peer.remoteDescription || !peer.remoteDescription.type) {
        console.log("Remote description not ready. Buffering candidate.");
        pendingCandidatesRef.current.push(candidate);
        return;
      }

      try {
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("Added ICE candidate");
      } catch (e) {
        console.error("Error adding ICE candidate", e);
      }
    });

    return () => {
      socket.off("video_call");
      socket.off("ice_candidate");
    };
  }, [socket, peer, setChatId, setRemoteStream, setInCall, localStream]);

  return null;
};

export default SocketEventListener;
