import toast from "react-hot-toast";
import { FiPhone, FiPhoneOff, FiUser } from "react-icons/fi";
import { createContext, useContext, useState, useRef, useEffect } from "react";
import { useSocket } from "./socket";
import { getLocalMedia, stopMedia } from "../helper/getLocalStream";
import setUpPeerConnection from "./peer";

const StreamContext = createContext();

const StreamProvider = ({ children }) => {
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [chatId, setChatId] = useState();
  const [showCall, setShowCall] = useState(false);
  const [userInCall, setUserInCall] = useState();
  const peerConnectionRef = useRef(null);
  const socket = useSocket();

  const callUser = async (user) => {
    console.log("Calling user:", user);
    const currentChatId = chatId || user.chat_id;
    setChatId(currentChatId);

    setUpPeerConnection({
      peerConnectionRef,
      socket,
      setRemoteStream,
      chatId: currentChatId,
      setChatId,
    });

    const peer = peerConnectionRef.current;
    if (!peer) {
      console.error("Peer connection not initialized");
      toast.error("Failed to start call. Please try again.");
      return;
    }

    const { stream } = await getLocalMedia();
    if (!stream) {
      console.error("No media stream available");
      toast.error(
        "Failed to access camera/microphone. Please check permissions."
      );
      return;
    }
    setMyStream(stream);

    try {
      stream.getTracks().forEach((track) => {
        console.log("Adding track to peer connection:", track);
        peer.addTrack(track, stream);
      });

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      console.log("Sending offer", offer);
      socket.emit("user:call", { offer, chat_id: currentChatId });
    } catch (error) {
      console.error("Error creating offer:", error);
      toast.error("Failed to initiate call. Please try again.");
    }
  };

  const acceptCall = async (chat_id, offer) => {
    const { stream } = await getLocalMedia();
    setMyStream(stream);
    const currentChatId = chatId || chat_id;
    setUpPeerConnection({
      peerConnectionRef,
      socket,
      setRemoteStream,
      chatId: currentChatId,
      setChatId,
    });
    const peer = peerConnectionRef.current;
    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    const answer = await peer.createAnswer(offer);
    console.log("Answer created:", answer);
    await peer.setLocalDescription(answer);
    socket.emit("call:accepted", { answer, chat_id });
    setChatId(chat_id);
    setShowCall(true);
  };

  const declineCall = ({ chat_id }) => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    socket.emit("call:declined", { chat_id });
  };

  const handleIncomingCall = async ({ chat_id, offer, user }) => {
    setUserInCall(user);
    return toast(
      (t) => (
        <div className="w-[250px] h-28 flex flex-col space-y-5">
          <div className="w-full flex gap-3 items-center">
            <div className="w-11 h-11 flex items-center justify-center bg-gray-200 rounded-full ring-2">
              <FiUser size={24} className="text-gray-600" />
            </div>
            <p className="font-medium text-sm text-black">
              {user?.user_name} is calling...
            </p>
          </div>
          <div className="w-full flex justify-around">
            <div
              className="w-28 flex items-center justify-center bg-green-600 p-2 rounded"
              onClick={() => {
                setChatId(chat_id);
                acceptCall(chat_id, offer);
                toast.dismiss(t.id);
              }}
            >
              <FiPhone size={25} className="text-white cursor-pointer" />
            </div>
            <div
              className="w-28 flex items-center justify-center bg-red-600 p-2 rounded"
              onClick={() => {
                declineCall({ chat_id });
                toast.dismiss(t.id);
              }}
            >
              <FiPhoneOff size={25} className="text-white cursor-pointer" />
            </div>
          </div>
        </div>
      ),
      { duration: 30000, onDismiss: () => {} }
    );
  };

  const handleCallAccepted = async ({ answer, chat_id }) => {
    console.log("Call accepted, setting remote description", answer);
    const currentChatId = chatId || chat_id;
    setChatId(currentChatId);

    const peer = peerConnectionRef.current;
    if (!peer) {
      console.error("Peer connection not initialized");
      toast.error("Call setup failed. Please try again.");
      setUpPeerConnection({
        peerConnectionRef,
        socket,
        setRemoteStream,
        chatId: currentChatId,
        setChatId,
      });
      return;
    }
    console.log(144);
    if (peer.signalingState !== "have-local-offer") {
      console.error(
        `Expected signaling state 'have-local-offer', but got '${peer.signalingState}'`
      );
      toast.error(
        "Call setup failed due to signaling error. Please try again."
      );
      return;
    }
    console.log(154);
    try {
      await peer.setRemoteDescription(new RTCSessionDescription(answer));
      console.log("Remote description set successfully");
    } catch (error) {
      console.error("Error setting remote description:", error);
      toast.error("Failed to set up call. Please try again.");
    }
    console.log(162);
  };

  const handleCallDeclined = ({ chat_id }) => {
    if (chat_id === chatId) {
      console.log("Cleaning up call state for chatId:", chatId);
      console.log("Current myStream:", myStream);
      console.log("Current remoteStream:", remoteStream);

      // Stop local stream
      if (myStream instanceof MediaStream) {
        stopMedia(myStream);
        setMyStream(null);
      }

      // Remote stream is managed by the remote peer, just clear it
      setRemoteStream(null);

      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
        console.log("Peer connection closed");
      }

      // Update UI states
      setShowCall(false);
      setUserInCall(null);
      setChatId(null);

      toast.error("Call declined by the other user.");
    }
  };

  const handleIceCandidate = async ({ candidate, chat_id }) => {
    console.log("ICE candidate received", candidate, chat_id);
    const currentChatId = chatId || chat_id;
    if (!peerConnectionRef.current) {
      setUpPeerConnection({
        peerConnectionRef,
        socket,
        setRemoteStream,
        chatId: currentChatId,
        setChatId,
      });
    }
    const peer = peerConnectionRef.current;

    if (!peer) {
      console.error("Peer connection not initialized");
      return;
    }
    if (candidate) {
      if (peer.remoteDescription && peer.remoteDescription.type) {
        await peer
          .addIceCandidate(new RTCIceCandidate(candidate))
          .catch((error) =>
            console.error("Error adding ICE candidate:", error)
          );
      } else {
        console.warn(" remote description not set");
      }
    } else {
      console.warn("Received empty ICE candidate, skipping");
    }
  };

  useEffect(() => {
    if (!socket) return;
    console.log("Setting up socket listeners for chatId:", chatId);
    socket.on("ice:candidate", (data) => {
      console.log("Received ice:candidate for chatId:", data.chat_id);
      handleIceCandidate(data);
    });
    socket.on("call:incoming", (data) => {
      console.log("Received call:incoming for chatId:", data.chat_id);
      handleIncomingCall(data);
    });
    socket.on("call:accepted", (data) => {
      console.log("Received call:accepted for chatId:", data.chat_id);
      handleCallAccepted(data);
    });
    socket.on("call:declined", (data) => {
      handleCallDeclined(data);
    });
    return () => {
      console.log("Cleaning up socket listeners for chatId:", chatId);
      socket.off("ice:candidate");
      socket.off("call:incoming");
      socket.off("call:accepted");
    };
  }, [socket, chatId]);

  return (
    <StreamContext.Provider
      value={{
        myStream,
        setMyStream,
        remoteStream,
        setRemoteStream,
        chatId,
        setChatId,
        callUser,
        acceptCall,
        showCall,
        setShowCall,
        userInCall,
        setUserInCall,
        localRef,
        remoteRef,
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
