import React, { useEffect, useRef, useState } from "react";
import { IoCreate } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import { MdPermMedia } from "react-icons/md";
import Modal from "../ui/Modal";
import TextStory from "./TextStory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addStatus, fetchAllChatsStatus, fetchStatus } from "../services/api"; // Assuming addStatus is the mutation function
import { MdOutlineLooks5 } from "react-icons/md";
import ViewStory from "./ViewStory";
import toast from "react-hot-toast";

function ViewStatus({ setViewStatusTab, viewStatusTab, userData }) {
  const [openTextStory, setOpenTextStory] = useState(false);
  const [selectStatus, setSelectStatus] = useState(false);
  const [selectStatusData, setSelectStatusData] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [openStory, setOpenStory] = useState(false);
  const [storyData, setStoryData] = useState([]);
  const queryClient = useQueryClient();
  const { data, isError, isFetched } = useQuery({
    queryKey: ["status"],
    queryFn: fetchStatus,
  });
  const { data: chatsStatus, isError: chatsStatusError } = useQuery({
    queryKey: ["chats_status"],
    queryFn: fetchAllChatsStatus,
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
      setSelectStatusData(null);
      setMediaPreview(null);
      queryClient.invalidateQueries(["status"]);
    },
    onError: (error) => {
      console.error("Error adding status:", error);
    },
  });
  if (chatsStatusError) {
    toast.error("Error fetching chats status");
  }
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
      setSelectStatus(false);
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
  const handleStory = (data) => {
    setOpenStory(true);
    setStoryData(data);
  };
  return (
    <div className="h-full w-full bg-gray-300 z-10">
      {/* Text Story Modal */}
      {openStory && storyData.length > 0 && (
        <Modal isOpen={openStory} onClose={() => setOpenStory(false)}>
          <div className="rounded-md">
            <ViewStory setOpenStory={setOpenStory} data={storyData} />
          </div>
        </Modal>
      )}
      {/* Text Story Modal */}

      {openTextStory && (
        <Modal isOpen={openTextStory} onClose={() => setOpenTextStory(false)}>
          <TextStory
            setSelectStatusData={setSelectStatusData}
            handleSendStatus={handleSendStatus}
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
      <div className="w-full shadow bg-white p-4 flex items-center h-16 border-b-2">
        <button
          type="button"
          className="absolute top-3 right-3 text-black bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center  "
          onClick={() => setViewStatusTab(false)}
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
        <div className="flex gap-4 items-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center relative">
            {userData?.profile_pic?.file?.path && (
              <img
                src={userData?.profile_pic?.file?.path}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover"
              />
            )}
            {!userData?.profile_pic?.file?.path && (
              <div className="h-9 w-9 rounded-full object-cover bg-red-300 relative">
                {" "}
              </div>
            )}
            {selectStatus && (
              <div className="bg-white shadow-2xl top-0 left-10 w-40 media_box_2 absolute rounded-md flex justify-start mr-10">
                <ul className="p-1 flex gap-1 flex-col justify-center rounded-lg">
                  <li>
                    <button
                      onClick={() => {
                        setOpenTextStory(true);
                        setSelectStatus(false);
                      }}
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
              {/* <div className="relative group">
                <span className="text-xs absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Add
                </span>
              </div> */}
            </button>
          </div>
          <div>
            {data?.data?.data.length > 0 ? (
              <div>
                <button onClick={() => handleStory(data?.data?.data)}>
                  View Status
                </button>
              </div>
            ) : (
              <div className="flex flex-col">
                <span>My Status</span>
                <span className="text-sm">click to add status</span>
              </div>
            )}
          </div>
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
      <div
        onClick={() => setSelectStatus(false)}
        className="h-full bg-gray-100 py-2"
      >
        <ul className="gap-2 bg-white flex flex-col">
          {chatsStatus?.data.data?.map((item) => (
            <li key={item.user_id}>
              <div className="p-2 flex shadow items-center gap-3 justify-start">
                <div className="w-10 h-10  rounded-full flex items-center justify-center">
                  {item?.profile_pic?.file?.path && (
                    <img
                      src={item?.profile_pic?.file?.path}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  )}
                  {!item.profile_pic?.file?.path && (
                    <div className="h-9 w-9 rounded-full object-cover bg-red-300"></div>
                  )}
                </div>
                <div>
                  <button onClick={() => handleStory(item.status_data)}>
                    {" "}
                    {item.user_name}
                  </button>{" "}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ViewStatus;
