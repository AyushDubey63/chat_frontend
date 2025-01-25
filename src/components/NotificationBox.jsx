import React, { act, useState } from "react";
import Notification from "../ui/Notification";
import { IoIosCloseCircleOutline } from "react-icons/io";

function NotificationBox({ setOpenNotification }) {
  const [activeTab, setActiveTab] = useState("notifications");
  const notificationsArray = [
    {
      id: 1, // Add unique ID for each notification
      title: "Notification 1",
      description: "This is the content of the notification",
      buttons: ["accept", "decline", "close"],
    },
    {
      id: 2,
      title: "Notification 2",
      description: "This is the content of the notification",
      buttons: ["accept", "decline", "close"],
    },
    {
      id: 3,
      title: "Notification 2",
      description: "This is the content of the notification",
      buttons: ["accept", "decline", "close"],
    },
    {
      id: 4,
      title: "Notification 2",
      description: "This is the content of the notification",
      buttons: ["accept", "decline", "close"],
    },
    {
      id: 5,
      title: "Notification 2",
      description: "This is the content of the notification",
      buttons: ["accept", "decline", "close"],
    },
  ];
  const [notifications, setNotifications] = useState(notificationsArray);
  return (
    <div className=" h-full flex flex-col items-end justify-end space-y-4 p-4 z-50">
      <div className="flex justify-between w-full ">
        <ul className="flex gap-4">
          <li
            className={`shadow-md ${
              activeTab === "notifications" ? "bg-blue-400" : ""
            } border-1  border-black rounded-md`}
          >
            <button onClick={() => setActiveTab("notifications")}>
              all notifications
            </button>
          </li>
          <li
            className={`shadow-md ${
              activeTab === "chat_request" ? "bg-blue-400" : ""
            } border-1 border-black rounded-md`}
          >
            <button onClick={() => setActiveTab("chat_request")}>
              chat requests
            </button>
          </li>
          <li
            className={`shadow-md ${
              activeTab === "request_sent" ? "bg-blue-400" : ""
            } border-1 border-black rounded-md`}
          >
            <button onClick={() => setActiveTab("request_sent")}>
              request sent
            </button>
          </li>
        </ul>
      </div>
      <button
        onClick={() => {
          setOpenNotification((prev) => !prev);
        }}
        className="text-gray-500 hover:text-gray-700"
      >
        <IoIosCloseCircleOutline size={24} />
      </button>
      {activeTab === "notifications" && (
        <>
          {notifications.length === 0 ? (
            <div className="text-center w-full">No Notifications Available</div>
          ) : (
            notifications.map((notification) => {
              const { id, title, description, buttons } = notification;
              return (
                <Notification
                  id={id}
                  setNotifications={setNotifications}
                  key={id} // Add unique key for each notification
                  title={title}
                  description={description}
                  buttons={buttons}
                />
              );
            })
          )}
        </>
      )}
      {activeTab === "chat_request" && (
        <div className="text-center w-full">No Chat Requests Available</div>
      )}
      {activeTab === "request_sent" && (
        <div className="text-center w-full">No Requests Sent</div>
      )}
    </div>
  );
}

export default NotificationBox;
