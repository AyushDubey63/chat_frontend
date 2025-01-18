import React from "react";
import LeftSideBar from "../components/LeftSideBar";
import Chat from "../components/Chat";

function HomePage() {
  return (
    <div className="grid max-h-screen overflow-hidden h-screen w-full grid-cols-6">
      <div className="scrollbar-hidden col-span-1 bg-white ">
        <LeftSideBar />
      </div>
      <div className="col-span-5 ">
        <Chat />
      </div>
    </div>
  );
}

export default HomePage;
