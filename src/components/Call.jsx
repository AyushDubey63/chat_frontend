import { useRef, useEffect } from "react";
import { useStream } from "../context/StreamContext";

function Call() {
  const { myStream, remoteStream } = useStream();
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  console.log(myStream, remoteStream);
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
    <div>
      <video ref={localRef} autoPlay playsInline muted />
      <video ref={remoteRef} autoPlay playsInline />
    </div>
  );
}

export default Call;
