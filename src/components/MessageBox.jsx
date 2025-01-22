import React, { useEffect, useRef } from "react";
import chat_bg from "../assets/chat_bg.jpg";
import { useSocket } from "../context/socket";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchChatsByChatId } from "../services/api";
import { useInView } from "react-intersection-observer";
function MessageBox({ user }) {
  const { ref, inView } = useInView();
  const scrollMessageRef = useRef(null);
  const [message, setMessage] = React.useState("");
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
      queryClient.invalidateQueries(["messages", user.chat_id]);
    });
  }, [socket]);
  useEffect(() => {
    if (scrollMessageRef.current) {
      scrollMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);
  useEffect(() => {
    console.log("inView");
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetchingNextPage]);
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching messages.</div>;
  console.log(data.pages[0], 52);
  return (
    <div
      style={{
        backgroundImage: `url(${chat_bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="h-full w-full "
    >
      <div className="max-h-[90%] overflow-y-scroll scrollbar-hidden">
        <div ref={ref}></div>
        {data &&
          data?.pages[0]?.data?.data?.messages?.map((msg) => (
            <div
              key={msg.id}
              className={`flex p-2 ${
                parseInt(msg.sender_id) === parseInt(user.user_id)
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  msg.sender_id === user.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300"
                }`}
              >
                <p>{msg.message}</p>
                <p className="text-xs text-gray-500">
                  {new Date(msg.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        <div ref={scrollMessageRef}></div>
      </div>
      <div className="border-2 h-[10%] w-full bg-gray-200 flex justify-between items-center p-2">
        <input
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          className="w-4/5 p-2 rounded-full border border-gray-400"
          value={message}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageBox;
