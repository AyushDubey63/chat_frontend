import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

function Notification({ title, description, buttons, setNotifications, id }) {
  const buttonsMap = new Map();
  buttonsMap.set("accept", {
    text: "Accept",
    onClick: () => {
      console.log("Accepted");
    },
    color: "bg-green-500",
  });
  buttonsMap.set("decline", {
    text: "Decline",
    onClick: () => {
      console.log("Declined");
    },
    color: "bg-red-500",
  });
  buttonsMap.set("close", {
    text: "Close",
    onClick: () => {
      console.log("Closed");
    },
    color: "bg-gray-500",
  });

  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg p-6 relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
        <button
          onClick={
            () =>
              setNotifications((prev) => prev.filter((elem) => elem.id !== id)) // Corrected filter
          }
          className="text-gray-500 hover:text-gray-700"
        >
          <IoIosCloseCircleOutline size={24} />
        </button>
      </div>
      <div className="flex space-x-3">
        {buttons.map((button) => {
          const { text, onClick, color } = buttonsMap.get(button);
          return (
            <button
              onClick={onClick}
              className={`px-4 py-2 rounded-full text-white ${color} hover:opacity-90 transition`}
            >
              {text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Notification;
