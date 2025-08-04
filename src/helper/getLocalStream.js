import toast from "react-hot-toast";

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

export const stopMedia = (stream) => {
  if (stream instanceof MediaStream) {
    stream.getTracks().forEach((track) => {
      console.log(`Stopping track ${track.kind}:`, {
        enabled: track.enabled,
        readyState: track.readyState,
      });
      track.stop();
      track.enabled = false;
    });
    console.log("All tracks stopped for stream:", stream.id);
  } else {
    console.warn("No valid stream to stop");
  }
};
