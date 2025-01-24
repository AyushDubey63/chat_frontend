import React, { useState } from "react";
import Notification from "../ui/Notification";
import { IoIosCloseCircleOutline } from "react-icons/io";

function NotificationBox({ setOpenNotification }) {
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
      <button
        onClick={() => {
          setOpenNotification((prev) => !prev);
        }}
        className="text-gray-500 hover:text-gray-700"
      >
        <IoIosCloseCircleOutline size={24} />
      </button>
      {notifications.length === 0 && (
        <div className="text-center w-full">No Notifications Avaialable</div>
      )}
      {notifications.map((notification) => {
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
      })}
    </div>
  );
}

export default NotificationBox;
