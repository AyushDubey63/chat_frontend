import React, { useEffect, useRef } from "react";
import chat_bg from "../assets/chat_bg.jpg";
import { useSocket } from "../context/socket";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { fetchChatsByChatId } from "../services/api";

function MessageBox({ user }) {
  const scrollContainerRef = useRef(null); // Ref for the scroll container
  const scrollMessageRef = useRef(null); // Ref for auto-scroll to the bottom
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
      // Trigger API call when scrolled to the top
      fetchNextPage();
    }
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
      className="h-full w-full"
    >
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll} // Attach scroll handler
        className="max-h-[90%] overflow-y-scroll scrollbar-hidden"
      >
        {data?.pages
          ?.slice()
          .reverse() // Reverse the pages to maintain correct order
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
              </div>
            ))
          )}
        {isFetchingNextPage && <div>Loading older messages...</div>}
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
