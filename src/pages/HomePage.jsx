import React from "react";
import LeftSideBar from "../components/LeftSideBar";
import Chat from "../components/Chat";
import chats_spehere from "../assets/chats_sphere.png";

function HomePage() {
  const [user, setUser] = React.useState(null);

  return (
    <div className="grid max-h-dvh overflow-hidden h-dvh w-full grid-cols-1 md:grid-cols-9">
      <div
        className={`scrollbar-hidden col-span-1 ${
          user ? "hidden md:block" : ""
        } md:col-span-2 bg-white`}
      >
        <LeftSideBar setUser={setUser} />
      </div>
      <div className={`col-span-1  md:col-span-7`}>
        {user ? (
          <Chat user={user} setUser={setUser} />
        ) : (
          <div className={`w-full h-full`}>
            <div className="flex flex-col justify-center items-center h-full">
              <img
                src={chats_spehere}
                height={500}
                width={500}
                alt=""
                srcset=""
              />
              <span className="text-3xl text-blue-600">
                Chat with your freinds & family
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
