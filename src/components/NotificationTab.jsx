import React, { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNotifications } from "../services/api";
import Loader from "../ui/Loader";
import Notification from "../ui/Notification";
import { useSocket } from "../context/socket";
import toast from "react-hot-toast";

function NotificationsTab() {
  const queryClient = useQueryClient();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  if (isLoading) return <Loader status="loading" />;
  if (isError) return <div>Error fetching data</div>;
  const socket = useSocket();

  useEffect(() => {
    socket.on("notification", (data) => {
      console.log(data, 27);
      if (data.type === "chat_request") {
        toast.success("You have a new chat request");
      }
      if (data.type === "chat_accept") {
        toast.success("Chat request accepted successfully");
      }
      queryClient.invalidateQueries({
        queryKey: ["notifications", "chatRequests", "requestsSent"],
      });
    });
  }, [socket]);
  return (
    <>
      {data.data.data.notifications.length === 0 ? (
        <div className="text-center w-full">No Notifications Available</div>
      ) : (
        data?.data?.data?.notifications.map((notification) => {
          const { notification_id, notification: title, type } = notification;
          const buttons = [];
          if (type === "chat_request") {
            buttons.push("accept", "decline", "close");
          }
          return (
            <Notification
              id={notification_id}
              key={notification_id}
              title={title}
              buttons={buttons}
            />
          );
        })
      )}
    </>
  );
}

export default NotificationsTab;
