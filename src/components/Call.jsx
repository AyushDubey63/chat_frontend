import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  IoVideocamOutline,
  IoVideocamOff,
  IoMicOutline,
  IoMicOffOutline,
  IoCallOutline,
} from "react-icons/io5";
import { useStream } from "../context/StreamContext";

function Call() {
  const { myStream, remoteStream, userInCall, localRef, remoteRef, endCall } =
    useStream();
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isMicOff, setIsMicOff] = useState(false);
  const containerRef = useRef(null);
  const toggleMic = () => {
    setIsMicOff((prev) => {
      const newState = !prev;
      if (myStream) {
        myStream.getAudioTracks().forEach((track) => {
          track.enabled = !newState;
        });
      }
      toast.success(newState ? "Mic muted" : "Mic unmuted");
      return newState;
    });
  };
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
    <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="w-full h-full relative bg-black" ref={containerRef}>
        {!remoteStream && (
          <div className="w-full h-full bg-gray-200 rounded-lg flex flex-col items-center justify-center gap-4">
            {/* Profile Placeholder */}
            <div className="w-56 h-56 shadow-md border-4 border-white rounded-full overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={user?.profile_pic?.file?.path}
                alt="User profile"
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-700">
              {user?.user_name || "Unknown"}
            </h2>
          </div>
        )}

        {remoteStream && (
          <video
            ref={remoteRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-lg"
          />
        )}

        {/* Controls */}
        <div className="absolute bottom-4 w-full flex justify-center items-center z-30">
          <div className="flex items-center gap-3 px-5 py-3 bg-white bg-opacity-70 backdrop-blur-md rounded-full shadow-md">
            <button
              onClick={toggleCamera}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition-all duration-200"
            >
              {isCameraOff ? (
                <IoVideocamOutline size={22} className="text-white" />
              ) : (
                <IoVideocamOff size={22} className="text-red-500" />
              )}
            </button>
            <button
              onClick={toggleMic}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-800 transition-all duration-200"
            >
              {isMicOff ? (
                <IoMicOffOutline size={22} className="text-white" />
              ) : (
                <IoMicOutline size={22} className="text-green-400" />
              )}
            </button>
            <button
              onClick={endCall}
              className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-200"
            >
              <IoCallOutline size={22} className="text-white rotate-[135deg]" />
            </button>
          </div>
        </div>

        {/* Draggable Local Video */}
        <motion.div
          drag
          dragConstraints={containerRef}
          // dragElastic={0.3}
          className="w-56 h-44 border-2 border-white shadow-md rounded-lg overflow-hidden absolute top-4 left-4 z-20 cursor-move"
        >
          <video
            ref={localRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </div>
  );
}

export default Call;
