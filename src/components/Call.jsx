import { useRef, useEffect } from "react";
import { useStream } from "../context/StreamContext";
import toast from "react-hot-toast";

function Call({ user }) {
  const { myStream, remoteStream } = useStream();
  const localRef = useRef(null);
  const remoteRef = useRef(null);

  // Attach local stream
  useEffect(() => {
    if (localRef.current && myStream instanceof MediaStream) {
      localRef.current.srcObject = myStream;
      localRef.current.play().catch((error) => {
        console.error("Error playing local video:", error);
        toast.error("Failed to play local video.");
      });
    }
  }, [myStream]);

  // Attach remote stream
  useEffect(() => {
    if (remoteRef.current && remoteStream instanceof MediaStream) {
      remoteRef.current.srcObject = remoteStream;
      console.log("Remote stream assigned to video element");
      console.log("Remote stream tracks:", remoteStream.getTracks());
      console.log("Remote video tracks:", remoteStream.getVideoTracks());
      remoteStream.getTracks().forEach((track) => {
        console.log(`Track ${track.kind}:`, {
          enabled: track.enabled,
          readyState: track.readyState,
          muted: track.muted,
        });
      });
      remoteRef.current.play().catch((error) => {
        console.error("Error playing remote video:", error.name, error.message);
        toast.error(`Failed to play remote video: ${error.message}`);
      });
      // Listen for video element events
      remoteRef.current.onloadedmetadata = () => {
        console.log("Remote video metadata loaded:", {
          videoWidth: remoteRef.current.videoWidth,
          videoHeight: remoteRef.current.videoHeight,
        });
      };
      remoteRef.current.onplay = () => {
        console.log("Remote video is playing");
      };
      remoteRef.current.onpause = () => {
        console.warn("Remote video is paused");
      };
    } else {
      console.warn("Invalid remote stream or video ref", {
        remoteStream,
        remoteRef: !!remoteRef.current,
      });
    }
  }, [remoteStream]);

  // Handle manual play
  const handlePlayRemote = () => {
    if (remoteRef.current && remoteRef.current.srcObject) {
      remoteRef.current.play().catch((error) => {
        console.error("Error playing remote video:", error);
        toast.error("Failed to play remote video. Please try again.");
      });
      console.log("Playing remote video");
      console.log("Remote video element:", remoteRef.current);
    } else {
      console.warn("No remote stream to play");
      toast.error("No remote video stream available.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white rounded-md shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">
        Call with {user?.user_name || "Unknown"}
      </h2>
      <div className="grid grid-cols-2 gap-4 w-full">
        <video
          ref={localRef}
          autoPlay
          playsInline
          muted
          className="w-full h-64 border rounded object-cover"
        />
        <video
          ref={remoteRef}
          autoPlay
          playsInline
          className="w-full h-64 border rounded object-cover"
        />
        <button
          onClick={handlePlayRemote}
          className="col-span-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Play Remote Video
        </button>
      </div>
    </div>
  );
}

export default Call;
