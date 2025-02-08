import React, { useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotifications, updateNotificationStatus } from "../services/api";
import Loader from "../ui/Loader";
import Notification from "../ui/Notification";
import toast from "react-hot-toast";

function NotificationsTab() {
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data, isError, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  // Memoize unread notification IDs
  const notificationIds = useMemo(() => {
    if (!data) return [];
    return data.data.data.notifications
      .filter((notification) => !notification.is_read)
      .map((notification) => notification.notification_id);
  }, [data]);

  // Update notification status mutation
  const { mutate } = useMutation({
    mutationFn: (ids) => updateNotificationStatus({ notification_ids: ids }),
    onSuccess: () => {
      queryClient.invalidateQueries(["unread_notifications"]);
      queryClient.invalidateQueries(["notifications"]);
    },
    onError: () => {
      toast.error("Error updating notification status");
    },
  });

  // Trigger update when unread notifications exist
  useEffect(() => {
    return () => {
      if (notificationIds.length > 0) {
        mutate(notificationIds);
      }
    };
  }, [mutate, notificationIds]);

  // Render logic
  if (isLoading) return <Loader status="loading" />;
  if (isError) return <div>Error fetching data</div>;

  return (
    <>
      {data.data.data.notifications.length === 0 ? (
        <div className="text-center w-full">No Notifications Available</div>
      ) : (
        data.data.data.notifications.map((notification) => (
          <Notification
            id={notification.notification_id}
            key={notification.notification_id}
            title={notification.notification}
            // buttons={
            //   notification.type === "chat_request"
            //     ? ["accept", "decline", "close"]
            //     : []
            // }
            isRead={notification.is_read}
          />
        ))
      )}
    </>
  );
}

export default NotificationsTab;
