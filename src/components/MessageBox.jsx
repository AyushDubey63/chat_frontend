import React from "react";
import chat_bg from "../assets/chat_bg.jpg";
function MessageBox() {
  return (
    <div
      style={{
        backgroundImage: `url(${chat_bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="h-full  w-full "
    >
      <div className="h-[90%] ">
        <div className="flex justify-end p-2">
          <div className="bg-gray-300 p-2 rounded-lg">
            <p>Hi</p>
            <p>How are you?</p>
          </div>
        </div>
        <div className="flex justify-start p-2">
          <div className="bg-white p-2 rounded-lg">
            <p>Hi</p>
            <p>How are you?</p>
          </div>
        </div>
      </div>
      <div className="border-2 h-[10%]  w-full  bg-gray-200 flex justify-between items-center p-2">
        <input
          type="text"
          className="w-4/5 p-2 rounded-full border border-gray-400"
        />
        <button className="bg-blue-500 text-white p-2 rounded-full">
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageBox;
