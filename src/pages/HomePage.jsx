import React from "react";
import LeftSideBar from "../components/LeftSideBar";
import Chat from "../components/Chat";

function HomePage() {
  const [user, setUser] = React.useState(null);

  return (
    <div className="grid max-h-screen overflow-hidden h-screen w-full grid-cols-1 md:grid-cols-9">
      <div
        className={`scrollbar-hidden col-span-1 ${
          user ? "hidden md:block" : ""
        } md:col-span-2 bg-white`}
      >
        <LeftSideBar setUser={setUser} />
      </div>
      <div className={`col-span-1 ${!user ? "hidden" : ""} md:col-span-7`}>
        {user ? (
          <Chat user={user} setUser={setUser} />
        ) : (
          <div className={`w-full  bg-gray-300 h-full`}></div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
