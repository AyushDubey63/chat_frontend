import { useRef, useEffect, useState } from "react";
import { useStream } from "../context/StreamContext";
import toast from "react-hot-toast";

function Call() {
  const { myStream, remoteStream, userInCall, localRef, remoteRef } =
    useStream();
  const [isCameraOff, setIsCameraOff] = useState(false);
  const user = userInCall || {};
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
  const toggleCamera = () => {
    setIsCameraOff((prev) => {
      const newState = !prev;
      if (myStream) {
        myStream.getVideoTracks().forEach((track) => {
          track.enabled = !newState;
        });
      }
      toast.success(newState ? "Camera off" : "Camera on");
      return newState;
    });
  };
  console.log(myStream, remoteStream, 73);
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white rounded-md shadow-md p-4">
      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="flex flex-col items-center">
          {!remoteStream && (
            <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded">
              <div className="rounded-full flex flex-col h-full w-full items-center justify-center">
                <div className="w-56 h-56">
                  <img
                    className="w-full h-full rounded-full object-cover"
                    src={user?.profile_pic?.file?.path}
                  />
                </div>
                <h2 className="text-lg font-semibold">
                  {user?.user_name || "Unknown"}
                </h2>
              </div>
            </div>
          )}
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
        <video
          ref={localRef}
          autoPlay
          playsInline
          muted
          className="w-full h-64 border rounded object-cover"
        />
        <button
          onClick={toggleCamera}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
        </button>
      </div>
    </div>
  );
}

export default Call;
