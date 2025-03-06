import React from "react";
import ReceiversName from "./ReceiversName";
import MessageBox from "./MessageBox";

function Chat({ user, setUser }) {
  const [status, setStatus] = React.useState("offline");

  // React.useEffect(() => {
  //   // Handle the 'beforeunload' event for warning user about leaving the page
  //   const handleBeforeUnload = (event) => {
  //     event.preventDefault();
  //     event.returnValue = "Are you sure you want to leave?";
  //   };

  //   // Handle the 'popstate' event (when back button is pressed)
  //   const handlePopState = () => {
  //     // Prevent route change and just set the user to null
  //     setUser(null);

  //     // Optionally, we can reset history state without navigating away
  //     // Push a new state to prevent the back button from navigating further back
  //     window.history.pushState(null, "", window.location.href);
  //   };

  //   // Add event listeners for 'beforeunload' and 'popstate'
  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   window.addEventListener("popstate", handlePopState);

  //   // Push a new state to prevent history from going back
  //   window.history.pushState(null, "", window.location.href);

  //   // Cleanup event listeners on component unmount
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //     window.removeEventListener("popstate", handlePopState);
  //   };
  // }, [setUser]);

  return (
    <div className="h-screen w-full bg-gray-300 flex flex-col">
      {/* Full height of the viewport */}
      <div className="flex-shrink-0 ">
        {/* ReceiversName takes up 10% of the viewport height */}
        <ReceiversName setUser={setUser} user={user} status={status} />
      </div>
      <div className="flex-grow overflow-y-auto h-full">
        {/* MessageBox takes up the remaining space */}
        <MessageBox user={user} setStatus={setStatus} />
      </div>
    </div>
  );
}

export default Chat;
