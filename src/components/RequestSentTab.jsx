import React from "react";

function RequestSentTab({ requestsSent }) {
  console.log(requestsSent, 3);
  return (
    <>
      {requestsSent.length === 0 ? (
        <div className="text-center w-full">No Requests Sent</div>
      ) : (
        requestsSent.map((request) => (
          <div
            key={request.id}
            className="flex flex-col items-center gap-4 w-full"
          >
            <div className="flex items-center gap-2">
              <div className="gap-2 flex h-10 w-10 items-center rounded-full bg-white">
                <img
                  src={request.profile_pic}
                  alt={request.sender_to}
                  className="rounded-full h-10 w-10 object-cover"
                />
              </div>
              <span>
                A chat request sent to<b> {request.sent_to} </b>
              </span>
            </div>
            <div className="flex gap-2">
              <button className="bg-red-500 text-white p-2 rounded-full">
                cancel
              </button>
            </div>
          </div>
        ))
      )}
    </>
  );
}

export default RequestSentTab;
