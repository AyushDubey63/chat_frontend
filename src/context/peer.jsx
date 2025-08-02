const setUpPeerConnection = ({
  peerConnectionRef,
  socket,
  setRemoteStream,
  chatId,
  setChatId,
}) => {
  if (peerConnectionRef.current) {
    console.warn("Peer connection already exists, reusing it");
    peerConnectionRef.current.close();
  }
  const peer = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
    ],
  });
  peer.onicecandidate = (event) => {
    console.log("ICE candidate event", event, chatId);
    if (event.candidate) {
      console.log(
        "ICE Candidate:",
        event.candidate.candidate,
        event.candidate.type
      );
      console.log(chatId, "chatId in ICE candidate");
      socket.emit("ice:candidate", {
        candidate: event.candidate,
        chat_id: chatId,
      });
    } else {
      console.log("All ICE candidates have been sent");
    }
  };
  peer.onicecandidateerror = (event) => {
    console.error("ICE Candidate Error:", event.errorText, event);
  };
  peer.ontrack = (event) => {
    if (event.streams && event.streams.length > 0) {
      console.log("Remote track received:", event.streams[0]);
      setRemoteStream(new MediaStream(event.streams[0].getTracks()));
    } else {
      console.warn("No remote streams found in track event", event);
    }
  };
  peer.onconnectionstatechange = () => {
    console.log("Connection state ", peer.connectionState);
  };

  peer.oniceconnectionstatechange = () => {
    console.log("ICE connection state changed:", peer.iceConnectionState);
    if (peer.iceConnectionState === "failed") {
      console.error("ICE connection failed, restarting ICE");
      peer.restartIce();
    }
  };
  peerConnectionRef.current = peer;
  console.log("Peer connection set up successfully");
};
export default setUpPeerConnection;
