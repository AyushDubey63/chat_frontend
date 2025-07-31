import { useRef, useEffect } from "react";
import { usePeer } from "../context/peer";

function Call() {
  const { localStream, remoteStream } = usePeer();
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  console.log(localStream, remoteStream);
  useEffect(() => {
    if (localRef.current && localStream) {
      localRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteRef.current && remoteStream) {
      remoteRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div>
      <video ref={localRef} autoPlay playsInline muted />
      <video ref={remoteRef} autoPlay playsInline />
    </div>
  );
}

export default Call;
