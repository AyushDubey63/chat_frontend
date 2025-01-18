import React from "react";
import ReceiversName from "./ReceiversName";
import MessageBox from "./MessageBox";

function Chat() {
  return (
    <div className="h-full w-full bg-gray-300 ">
      <div className="h-[8%]">
        <ReceiversName name="Ayush" />
      </div>
      <div className="w-full h-[92%] flex flex-col">
        <MessageBox />
      </div>
    </div>
  );
}

export default Chat;
