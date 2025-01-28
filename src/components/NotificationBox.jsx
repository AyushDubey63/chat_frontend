import React, { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";
import {
  fetchNotifications,
  fetchChatRequests,
  fetchRequestsSent,
} from "../services/api";
import Loader from "../ui/Loader";
import NotificationsTab from "./NotificationTab";
import ChatRequestsTab from "./ChatRequestsTab";
import RequestSentTab from "./RequestSentTab";

function NotificationBox({ setOpenNotification }) {
  const [activeTab, setActiveTab] = useState("notifications");

  // Fetch all data in the parent component
  const {
    data: notificationsData,
    isError: notificationsError,
    isLoading: notificationsLoading,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    staleTime: 1000 * 60 * 1,
  });

  const {
    data: chatRequestsData,
    isError: chatRequestsError,
    isLoading: chatRequestsLoading,
  } = useQuery({
    queryKey: ["chatRequests"],
    queryFn: fetchChatRequests,
    staleTime: 1000 * 60 * 1,
  });

  const {
    data: requestsSentData,
    isError: requestsSentError,
    isLoading: requestsSentLoading,
  } = useQuery({
    queryKey: ["requestsSent"],
    queryFn: fetchRequestsSent,
    staleTime: 1000 * 60 * 1,
  });

  if (notificationsLoading || chatRequestsLoading || requestsSentLoading) {
    return <Loader status="loading" />;
  }

  if (notificationsError || chatRequestsError || requestsSentError) {
    return <div>Error fetching data</div>;
  }

  return (
    <div className="h-full flex flex-col items-end justify-end space-y-4 p-4 z-50">
      <div className="flex justify-between w-full">
        <ul className="flex gap-4">
          <li
            className={`shadow-md ${
              activeTab === "notifications" ? "bg-blue-400" : ""
            } border-1 border-black rounded-md`}
          >
            <button onClick={() => setActiveTab("notifications")}>
              All Notifications
            </button>
          </li>
          <li
            className={`shadow-md ${
              activeTab === "chat_request" ? "bg-blue-400" : ""
            } border-1 border-black rounded-md`}
          >
            <button onClick={() => setActiveTab("chat_request")}>
              Chat Requests
            </button>
          </li>
          <li
            className={`shadow-md ${
              activeTab === "request_sent" ? "bg-blue-400" : ""
            } border-1 border-black rounded-md`}
          >
            <button onClick={() => setActiveTab("request_sent")}>
              Request Sent
            </button>
          </li>
        </ul>
        <button
          onClick={() => setOpenNotification((prev) => !prev)}
          className="text-gray-500 hover:text-gray-700"
        >
          <IoIosCloseCircleOutline size={24} />
        </button>
      </div>

      {activeTab === "notifications" && (
        <NotificationsTab
          notifications={notificationsData?.data?.data?.notifications}
        />
      )}
      {activeTab === "chat_request" && (
        <ChatRequestsTab
          chatRequests={chatRequestsData?.data?.data?.connection_requests}
        />
      )}
      {activeTab === "request_sent" && (
        <RequestSentTab
          requestsSent={requestsSentData?.data?.data?.connection_requests}
        />
      )}
    </div>
  );
}

export default NotificationBox;
