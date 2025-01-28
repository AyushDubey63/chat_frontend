import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotifications } from "../services/api";
import Loader from "../ui/Loader";
import Notification from "../ui/Notification";

function NotificationsTab() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  if (isLoading) return <Loader status="loading" />;
  if (isError) return <div>Error fetching data</div>;

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
