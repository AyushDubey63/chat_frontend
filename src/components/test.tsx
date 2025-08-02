import { useRef, useState } from "react";
import { useSocket } from "../context/socket";

export const getLocalMedia = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    return { stream };
  } catch (error) {
    toast.error("Camera/Microphone access is Required!");
    throw error;
  }
};
export const setupConnection = ({
  peerConnectionRef,
  socket,
  recipientId,
  setRemoteStream,
}: SetupConnectionProps) => {
  if (peerConnectionRef.current) {
    console.warn("⚠️ Closing existing peer connection...");
    peerConnectionRef.current.close();
  }

  const pc = new RTCPeerConnection(ICE_SERVERS);

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      console.log(
        "ICE Candidate Generated:",
        event.candidate.candidate,
        event.candidate.type
      );
      socket?.emit(socketEvents.ICE_CANDIDATE, {
        recipientId,
        candidate: event.candidate,
      });
    } else {
      console.log("ICE Gathering Complete");
    }
  };

  pc.onicecandidateerror = (event) => {
    console.error("ICE Candidate Error:", event.errorText, event);
  };

  pc.ontrack = (event) => {
    if (event.streams && event.streams.length > 0) {
      console.log("🎥 Remote stream received:", event.streams[0]);
      setRemoteStream(new MediaStream(event.streams[0].getTracks()));
    } else {
      console.warn("⚠️ No remote stream found in event.");
    }
  };

  pc.onconnectionstatechange = () => {
    console.log("Connection State:", pc.connectionState);
  };

  pc.oniceconnectionstatechange = () => {
    console.log("ICE Connection State:", pc.iceConnectionState);
    if (pc.iceConnectionState === "failed") {
      console.error("❌ ICE Connection Failed! Retrying...");
      pc.restartIce();
    }
  };

  socket.on(socketEvents.ICE_CANDIDATE, (data) => {
    if (data.candidate) {
      console.log(
        "ICE Candidate Received:",
        data.candidate.candidate,
        data.candidate.type
      );
      pc.addIceCandidate(new RTCIceCandidate(data.candidate)).catch((err) =>
        console.error("Error adding candidate:", err)
      );
    }
  });

  peerConnectionRef.current = pc;
  console.log("✅ Peer connection setup complete!");
};
export const VideoChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isInCall, setIsInCall] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socket = useSocket();
  const [recipientId, setRecipientId] = useState<number | null>(null);
  const [recipentUserDetails, setRecipentUserDetails] = useState<{
    avatarUrl: string;
    id: number;
    username: string;
  } | null>(null);
  const [streamKey, setStreamKey] = useState(Date.now());

  /** ✅ Call another user */
  const callUser = async (userId: number) => {
    const { stream } = await getLocalMedia();
    setLocalStream(stream);

    setupConnection({
      peerConnectionRef,
      recipientId: userId,
      setRemoteStream,
      socket,
    });

    const pc = peerConnectionRef.current!;
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit(socketEvents.CALL_USER, { recipientId: userId, offer });

    setOpenDrawer(false);
    setOpenDialog(true);
    setIsInCall(true);
    setRecipientId(userId);
  };

  /** ✅ Accept an incoming call */
  const acceptCall = async (id: number, offer: RTCSessionDescriptionInit) => {
    const { stream } = await getLocalMedia();
    setLocalStream(stream);

    setupConnection({
      peerConnectionRef,
      setRemoteStream,
      socket,
      recipientId: id,
    });

    const pc = peerConnectionRef.current!;
    await pc.setRemoteDescription(new RTCSessionDescription(offer));

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit(socketEvents.ANSWER_CALL, {
      recipientId: id,
      answer,
    });
    setRecipientId(id);
    setOpenDrawer(false);
    setOpenDialog(true);
    setIsInCall(true);
  };

  /** ✅ Decline an incoming call */
  const declineCall = (id: number) => {
    socket.emit(socketEvents.END_CALL, { recipientId: id });
    toast.dismiss();
    setRecipentUserDetails(null);
  };

  /** ✅ End an active call */
  const endCall = () => {
    socket.emit(socketEvents.END_CALL, { recipientId: recipientId });

    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;

    localStream?.getTracks().forEach((track) => track.stop());
    remoteStream?.getTracks().forEach((track) => track.stop());
    setTimeout(() => {
      setLocalStream(null);
      setRemoteStream(null);
      setStreamKey(Date.now());
    }, 300);
    setIsInCall(false);
    setOpenDialog(false);
    setOpenDrawer(false);
    setRecipientId(null);
    setRecipentUserDetails(null);

    toast.success("Call Ended");
  };

  /** ✅ Handle incoming call */
  const handleIncomingCall = ({
    from,
    offer,
  }: {
    from: { avatarUrl: string; id: number; username: string };
    offer: RTCSessionDescriptionInit;
  }) => {
    toast(
      (t) => (
        <div className="w-[250px] h-28 flex flex-col space-y-5">
          <div className="w-full flex gap-3 items-center">
            <Avatar className="w-11 h-11 ring-2">
              <AvatarImage
                src={
                  from.avatarUrl ??
                  "https://avatars.githubusercontent.com/u/124599?v=4"
                }
                alt="User Avatar"
              />
            </Avatar>
            <p className="font-medium text-sm text-black">
              {from.username} is calling...
            </p>
          </div>
          <div className="w-full flex justify-around">
            <div
              className="w-28 flex items-center justify-center bg-green-600 p-2 rounded"
              onClick={() => {
                acceptCall(from.id, offer);
                setRecipentUserDetails(from);
                toast.dismiss(t.id);
              }}
            >
              <Phone size={25} className="text-white cursor-pointer" />
            </div>
            <div
              className="w-28 flex items-center justify-center bg-red-600 p-2 rounded"
              onClick={() => {
                declineCall(from.id);
                toast.dismiss(t.id);
              }}
            >
              <PhoneOff size={25} className="text-white cursor-pointer" />
            </div>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  /** ✅ Handle call accepted */
  const handleCallAccepted = async ({
    answer,
  }: {
    answer: RTCSessionDescriptionInit;
  }) => {
    const pc = peerConnectionRef.current;
    console.log(pc);

    if (!pc) return;
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
    console.log(pc);
  };

  /** ✅ Handle ICE candidates */
  const handleIceCandidates = async ({
    candidate,
  }: {
    candidate: RTCIceCandidateInit;
  }) => {
    const pc = peerConnectionRef.current;
    if (!pc) return;
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
  };

  /** ✅ Event Handlers */
  const eventHandler = {
    [socketEvents.INCOMING_CALL]: handleIncomingCall,
    [socketEvents.CALL_ACCEPTED]: handleCallAccepted,
    [socketEvents.ICE_CANDIDATE]: handleIceCandidates,
    [socketEvents.CALL_ENDED]: endCall,
  };

  /** ✅ Listen for socket events */
  useSocketEvents(socket, eventHandler);

  return (
    <VideoChatContext.Provider
      value={{
        callUser,
        endCall,
        isInCall,
        localStream,
        remoteStream,
        openDrawer,
        setOpenDrawer,
        openDialog,
        setOpenDialog,
        recipentUserDetails,
        streamKey,
      }}
    >
      {children}
    </VideoChatContext.Provider>
  );
};
