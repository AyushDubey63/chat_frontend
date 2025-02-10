import React, { useEffect, useRef, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import ReactPlayer from "react-player";
import { FaCamera } from "react-icons/fa";
import { MdPermMedia } from "react-icons/md";
import { RiEmojiStickerFill } from "react-icons/ri";
import chat_bg from "../assets/chat_bg.jpg";
import { useSocket } from "../context/socket";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchChatsByChatId, sendMediaInChat } from "../services/api";
import axios from "axios";
import Carousel from "./MediaCarousel";
import Modal from "../ui/Modal";

function MessageBox({ user }) {
  console.log(user, 18);
  const inputRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const scrollMessageRef = useRef(null);
  const [message, setMessage] = useState("");
  const [selectMedia, setSelectMedia] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [showMediaCarousel, setShowMediaCarousel] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["messages", user.chat_id],
      queryFn: ({ pageParam = 1 }) =>
        fetchChatsByChatId({ page: pageParam, chat_id: user.chat_id }),
      getNextPageParam: (lastPage) => {
        const totalPage = lastPage?.data?.data?.total_pages;
        const currentPage = parseInt(lastPage?.data?.data?.current_page);
        if (currentPage < totalPage) {
          return currentPage + 1;
        }
        return null;
      },
    });

  const socket = useSocket();

  const sendMessage = () => {
    socket.emit("message_event", { message, chat_data: user });
    setMessage("");
    queryClient.invalidateQueries(["messages", user.chat_id]);
  };

  useEffect(() => {
    socket.on("message_event", (data) => {
      console.log(data, 52);
      queryClient.invalidateQueries(["messages", user.chat_id]);
    });

    return () => {
      socket.off("message_event");
    };
  }, [socket, queryClient, user.chat_id]);

  useEffect(() => {
    if (scrollMessageRef.current) {
      scrollMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  const handleScroll = () => {
    if (!scrollContainerRef.current || isFetchingNextPage) return;

    const { scrollTop } = scrollContainerRef.current;
    if (scrollTop === 0) {
      fetchNextPage();
    }
  };

  const handleUploadMedia = async () => {
    inputRef.current.click();
  };

  const mutation = useMutation({
    mutationFn: sendMediaInChat,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", user.chat_id],
      });
    },
  });

  const handleSendMediaFile = async () => {
    const file = inputRef.current.files[0];
    console.log(file, 91);
    // return;
    if (file) {
      const formData = new FormData();
      if (file.type.includes("video")) {
        formData.append("video", file);
      } else if (file.type.includes("image")) {
        formData.append("image", file);
      }
      formData.append("chat_id", user.chat_id);
      formData.append("receiver_id", user.user_id);
      mutation.mutate(formData);
      setSelectMedia(false);
      setPreviewMedia(false);
      inputRef.current.value = null;
    } else {
      console.log("Please select a file");
    }
  };

  const handleMediaPreview = () => {
    const files = inputRef.current.files[0];
    if (files) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files);
      fileReader.onload = () => {
        setPreviewMedia(fileReader.result);
      };
    }
  };

  const handleCloseMediaPreview = () => {
    inputRef.current.value = null;
    setPreviewMedia(null);
    setSelectMedia(false);
  };

  const handleSend = () => {
    if (previewMedia !== null) return handleSendMediaFile();
    else sendMessage();
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching messages.</div>;

  return (
    <div
      style={{
        backgroundImage: `url(${chat_bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="h-full w-full relative"
    >
      <div
        onClick={() => setSelectMedia(false)}
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="max-h-[90%] h-full overflow-y-scroll scrollbar-hidden"
      >
        {showMediaCarousel && (
          <Modal
            style={{ width: "w-[90%]", maxWidth: "max-w-2xl" }}
            isOpen={showMediaCarousel}
            onClose={() => setShowMediaCarousel(false)}
          >
            <Carousel data={data} />
          </Modal>
        )}
        {data?.pages[0]?.data?.data?.messages.length === 0 && (
          <div className="text-center w-full">No messages available</div>
        )}
        {data?.pages
          ?.slice()
          .reverse()
          .map((page) =>
            page.data.data.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex p-2 ${
                  parseInt(msg.sender_id) === parseInt(user.user_id)
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                {msg.message_type == "text" && (
                  <div
                    className={`p-2 rounded-lg ${
                      parseInt(msg.sender_id) === parseInt(user.user_id)
                        ? "bg-gray-300"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    <p>{msg.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                )}
                {msg.message_type == "image" && (
                  <div
                    className={`w-[40%]  rounded-md p-2  ${
                      parseInt(msg.sender_id) === parseInt(user.user_id)
                        ? "bg-gray-300"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    <img
                      className="w-full h-full rounded-lg"
                      src={JSON.parse(msg.message)?.file?.path}
                      alt=""
                    />
                  </div>
                )}
                {msg.message_type === "video" && (
                  <div
                    className={`w-[40%]  rounded-md p-2  ${
                      parseInt(msg.sender_id) === parseInt(user.user_id)
                        ? "bg-gray-300"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    <ReactPlayer
                      controls
                      width={"100%"}
                      url={JSON.parse(msg.message)?.file?.path}
                    />
                  </div>
                )}
              </div>
            ))
          )}
        {isFetchingNextPage && <div>Loading older messages...</div>}
        <div ref={scrollMessageRef}></div>
      </div>
      {selectMedia && (
        <div className="bg-white shadow-2xl right-10 bottom-16 media_box absolute rounded-md flex justify-end mr-5">
          <ul className=" p-1    flex gap-1 flex-col justify-center rounded-lg">
            <li className=" ">
              <button className="flex items-center gap-2">
                <span className="w-8 h-8 flex items-center bg-white justify-center rounded-lg">
                  <FaCamera color="red" size={20} />
                </span>
                Open camera
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
      {inputRef.current?.files?.length > 0 && (
        <div className="bg-slate-600 p-2 w-full flex justify-center  absolute bottom-[10%] ">
          <div className="bg-white h-52 rounded-lg relative">
            <button
              onClick={handleCloseMediaPreview}
              className="absolute top-2 right-2 z-10"
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
            {previewMedia && previewMedia.startsWith("data:image") && (
              <img
                src={previewMedia}
                alt="Image Preview"
                className="object-cover h-full w-full"
              />
            )}
            {previewMedia && previewMedia.startsWith("data:video") && (
              <ReactPlayer
                url={previewMedia}
                playing
                controls
                width="100%"
                height="100%"
              />
            )}
          </div>
        </div>
      )}
      <div className="border-2 h-[10%] w-full bg-gray-200 flex justify-between items-center p-2 ">
        <div className="w-full px-2 rounded-full items-center flex border bg-white">
          <button onClick={() => setShowMediaCarousel((prev) => !prev)}>
            <RiEmojiStickerFill color="gray" size={30} />
          </button>
          <input
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            className="w-full p-2 bg-white rounded-full outline-none"
            value={message}
          />
          <input
            name="media"
            id="media"
            className="hidden "
            type="file"
            onChange={handleMediaPreview}
            ref={inputRef}
          />
          <button onClick={() => setSelectMedia((prev) => !prev)}>
            <FaCamera color="gray" size={25} />
          </button>
        </div>
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white p-2 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageBox;
