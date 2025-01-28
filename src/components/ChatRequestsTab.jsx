import React from "react";

function ChatRequestsTab({ chatRequests }) {
  console.log(chatRequests, 4);
  return (
    <>
      {chatRequests.length === 0 ? (
        <div className="text-center w-full">No Chat Requests Available</div>
      ) : (
        chatRequests.map((request) => (
          <div
            key={request.id}
            className="flex flex-col items-center gap-4 w-full"
          >
            <div className="flex items-center gap-2">
              <div className="gap-2 flex h-10 w-10 items-center rounded-full bg-white">
                <img
                  src={request.profile_pic}
                  alt={request.sender_name}
                  className="rounded-full h-10 w-10 object-cover"
                />
              </div>
              <span>
                <b> {request.sender_name} </b> requested you to follow{" "}
              </span>
            </div>
            <div className="flex gap-2">
              <button className="bg-green-500 text-white p-2 rounded-full">
                start chatting
              </button>
              <button className="bg-red-500 text-white p-2 rounded-full">
                Decline
              </button>
            </div>
          </div>
        ))
      )}
    </>
  );
}

export default ChatRequestsTab;
