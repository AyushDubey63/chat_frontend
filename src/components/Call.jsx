import { useRef, useEffect } from "react";
import { useStream } from "../context/StreamContext";
import peer from "../context/peer";
import { useSocket } from "../context/socket";

function Call({ user }) {
  const { myStream, remoteStream, getFreshStream, setChatId, chatId } =
    useStream();
  const socket = useSocket();
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  console.log(myStream, remoteStream);

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
  const handleCallUser = async () => {
    try {
      // const stream = await getFreshStream();
      const offer = await peer.getOffer(handleIceCandidate);
      setChatId(user.chat_id);
      socket.emit("user:call", { offer, chat_id: user.chat_id });
    } catch (err) {
      console.error("Call error:", err);
    }
  };
  useEffect(() => {
    handleCallUser();
  }, []);

  useEffect(() => {
    if (localRef.current && myStream) {
      localRef.current.srcObject = myStream;
    }
  }, [myStream]);

  useEffect(() => {
    if (remoteRef.current && remoteStream) {
      remoteRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white rounded-md shadow-md p-4">
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Call with {user.user_name}
        </h2>
      </div>
      <div>
        <video ref={localRef} autoPlay playsInline muted />
        <video ref={remoteRef} autoPlay playsInline />
      </div>
    </div>
  );
}

export default Call;
