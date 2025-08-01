const setUpPeerConnection = ({
  peerConnectionRef,
  socket,
  setRemoteStream,
}) => {
  if (peerConnectionRef.current) {
    console.warn("Peer connection already exists, reusing it");
    peerConnectionRef.current.close();
  }
  const peer = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:global.stun.twilio.com:3478",
        ],
      },
    ],
  });
  peer.onicecandidate = (event) => {
    if (event.candidate) {
      console.log(
        "ICE Candidate:",
        event.candidate.candidate,
        event.candidate.type
      );
      socket.emit("ice:candidate", {
        candidate: event.candidate,
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
  socket.on("ice:candidate", (data) => {
    if (data.candidate) {
      console.log(
        "ICE Candidate received:",
        data.candidate.candidate,
        data.candidate.type
      );
      peer
        .addIceCandidate(new RTCIceCandidate(data.candidate))
        .catch((error) => {
          console.error("Error adding ICE candidate:", error);
        });
    }
  });
  peerConnectionRef.current = peer;
  console.log("Peer connection set up successfully");
};
export default setUpPeerConnection;
