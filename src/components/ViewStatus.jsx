import React, { useEffect, useRef, useState } from "react";
import { IoCreate } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import { MdPermMedia } from "react-icons/md";
import Modal from "../ui/Modal";
import TextStory from "./TextStory";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addStatus, fetchStatus } from "../services/api"; // Assuming addStatus is the mutation function
import { MdOutlineLooks5 } from "react-icons/md";
import ViewStory from "./ViewStory";

function ViewStatus() {
  const [openTextStory, setOpenTextStory] = useState(false);
  const [selectStatus, setSelectStatus] = useState(false);
  const [selectStatusData, setSelectStatusData] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [openStory, setOpenStory] = useState(false);
  const { data, isError, isFetched } = useQuery({
    queryKey: ["status"],
    queryFn: fetchStatus,
  });
  useEffect(() => {
    console.log(data);
  }, [data, isFetched]);
  const inputRef = useRef(null);

  const mutation = useMutation({
    mutationFn: addStatus,
    onSuccess: () => {
      console.log("Status added successfully");
      handleCloseMediaPreview();
      setOpenTextStory(false);
      setSelectStatus(false);
      setMediaPreview(null);
    },
    onError: (error) => {
      console.error("Error adding status:", error);
    },
  });

  const handleUploadMedia = () => {
    inputRef.current.click();
  };

  const handleMediaPreview = () => {
    const file = inputRef.current.files[0];
    if (file) {
      const fileReader = new FileReader();
      const type = file.type.split("/")[0];
      fileReader.readAsDataURL(file);
      console.log(type);
      fileReader.onload = () => {
        setMediaPreview(fileReader.result);
        setSelectStatusData({ type: type, file }); // Store media file for sending
      };
    }
  };

  const handleSendStatus = async () => {
    try {
      const formData = new FormData();

      if (selectStatusData) {
        console.log("Sending:", selectStatusData);

        if (selectStatusData.type === "raw") {
          formData.append("data", selectStatusData.data);
          formData.append("type", selectStatusData.type);
        } else if (
          selectStatusData.type === "image" ||
          selectStatusData.type === "video"
        ) {
          console.log(selectStatusData);
          formData.append("data", selectStatusData.file);
          formData.append("type", selectStatusData.type);
        }

        mutation.mutate(formData);
      }
    } catch (error) {
      console.error("Error sending status:", error);
    }
  };

  const handleCloseMediaPreview = () => {
    inputRef.current.value = null;
    setMediaPreview(null);
    setSelectStatusData(null);
  };

  return (
    <div className="h-full w-full bg-gray-500 z-10">
      {/* Text Story Modal */}
      {openStory && (
        <Modal isOpen={openStory} onClose={() => setOpenStory(false)}>
          <ViewStory data={data?.data?.data} />
        </Modal>
      )}
      {/* Text Story Modal */}

      {openTextStory && (
        <Modal isOpen={openTextStory} onClose={() => setOpenTextStory(false)}>
          <TextStory
            setSelectStatusData={setSelectStatusData}
            handleSendStatus={handleSendStatus}
            onClose={() => setOpenTextStory(false)}
          />
        </Modal>
      )}

      {/* Media Preview Modal */}
      {mediaPreview && (
        <Modal isOpen={!!mediaPreview} onClose={handleCloseMediaPreview}>
          <div className="bg-slate-600 p-2 w-full flex flex-col items-center justify-center h-full">
            <div className="bg-white h-5/6 w-full rounded-lg relative">
              {mediaPreview.startsWith("data:image") && (
                <img
                  src={mediaPreview}
                  alt="Media preview"
                  className="object-contain h-full w-full"
                />
              )}
              {mediaPreview.startsWith("data:video") && (
                <video
                  src={mediaPreview}
                  controls
                  className="object-contain h-full w-full"
                />
              )}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={handleCloseMediaPreview}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendStatus}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Header Section */}
      <div className="w-full p-4 flex items-center h-16 border-b-2">
        <div className="flex gap-2 items-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <div className="h-9 w-9 rounded-full object-cover bg-red-300 relative">
              {selectStatus && (
                <div className="bg-white shadow-2xl top-0 left-10 w-40 media_box_2 absolute rounded-md flex justify-end mr-5">
                  <ul className="p-1 flex gap-1 flex-col justify-center rounded-lg">
                    <li>
                      <button
                        onClick={() => setOpenTextStory(true)}
                        className="flex items-center gap-2"
                      >
                        <span className="w-8 h-8 flex items-center bg-white justify-center rounded-lg">
                          <IoCreate color="red" size={25} />
                        </span>
                        Create Status
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleUploadMedia}
                        className="flex items-center gap-2"
                      >
                        <span className="w-8 h-8 flex items-center bg-white justify-center rounded-lg">
                          <MdPermMedia color="orange" size={20} />
                        </span>
                        Upload media
                      </button>
                    </li>
                  </ul>
                </div>
              )}
              <button
                onClick={() => setSelectStatus(true)}
                className="absolute -right-1 bg-white rounded-full top-0"
              >
                <IoMdAddCircle size={15} />
              </button>
            </div>
          </div>
          <div>My Status</div>
          <button onClick={() => setOpenStory(true)}>
            <MdOutlineLooks5 />
          </button>
          <input
            name="media"
            id="media"
            className="hidden"
            type="file"
            accept="image/*, video/*"
            onChange={handleMediaPreview}
            ref={inputRef}
          />
        </div>
      </div>

      {/* Status List */}
      <div onClick={() => setSelectStatus(false)} className="h-full p-2">
        <ul className="gap-2 flex flex-col">
          {[1, 2, 3].map((item) => (
            <li key={item}>
              <div className="p-2 flex border-b-2 border-black items-center gap-3 justify-start">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <div className="h-9 w-9 rounded-full object-cover bg-red-300"></div>
                </div>
                <div>Kundan</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ViewStatus;
