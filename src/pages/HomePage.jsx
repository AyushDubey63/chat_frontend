import React from "react";
import LeftSideBar from "../components/LeftSideBar";
import Chat from "../components/Chat";

function HomePage() {
  const [user, setUser] = React.useState(null);
  // const set
  return (
    <div className="grid max-h-screen overflow-hidden h-screen w-full grid-cols-9">
      <div className="scrollbar-hidden col-span-2 bg-white ">
        <LeftSideBar setUser={setUser} />
      </div>
      <div className="col-span-7 ">
        {user ? (
          <Chat user={user} />
        ) : (
          <div className="h-full w-full bg-gray-300"></div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
