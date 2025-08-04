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
  if (!stream) return;

  stream.getTracks().forEach((track) => {
    track.stop();
  });
};
