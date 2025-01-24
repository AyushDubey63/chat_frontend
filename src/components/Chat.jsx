import React from "react";
import ReceiversName from "./ReceiversName";
import MessageBox from "./MessageBox";

function Chat({ user }) {
  const [status, setStatus] = React.useState("offline");
  return (
    <div className="h-screen w-full bg-gray-300">
      {" "}
      {/* Full height of the viewport */}
      <div className="h-[10vh]">
        {" "}
        {/* Adjust to 10% of the viewport height */}
        <ReceiversName name={user.user_name} status={status} />
      </div>
      <div className="w-full h-[90vh] flex flex-col ">
        {" "}
        <MessageBox user={user} setStatus={setStatus} />
      </div>
    </div>
  );
}

export default Chat;
