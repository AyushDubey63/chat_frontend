import React, { useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";
import { fetchUserAllChats, logoutUser } from "../services/api";
import NotificationBox from "./NotificationBox";
import FloatingActionButton from "../ui/FloatingActionButton";
function LeftSideBar({ setUser }) {
  const [openNotification, setOpenNotification] = useState(false);
  const { data, isError, isLoading } = useQuery({
    queryKey: ["freinds"],
    queryFn: fetchUserAllChats,
  });
  const userData = data?.data?.data || {};
  const contacts = data?.data?.data?.chats || [];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
    <div className="max-h-screen h-full w-full relative">
      <div className=" bg-gray-300">
        <div className=" justify-start p-2 flex  items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={userData.profile_pic}
              alt=""
            />
          </div>
          <h2 className="text-center text-lg font-semibold">
            {userData.user_name}
          </h2>
        </div>
        <div className="border p-2 border-black flex gap-2 items-center">
          <input
            type="text"
            className="w-full outline-none p-2 bg-white rounded-xl"
          />
          <button className="bg-blue-500 text-white p-2 rounded-full">
            <IoIosSearch size={20} />
          </button>
        </div>
      </div>
      <ul className="max-h-[84%] overflow-y-scroll scrollbar-hidden">
        {openNotification ? (
          <NotificationBox setOpenNotification={setOpenNotification} />
        ) : contacts.length > 0 ? (
          contacts.map((contact) => (
            <li
              onClick={() => setUser(contact)}
              className="p-2 h-14 cursor-pointer flex gap-2 items-center border-black border"
              key={contact.user_id}
            >
              <div className="gap-2 flex h-10 w-10 items-center rounded-full bg-white">
                <img
                  src={contact.profile_pic}
                  alt={contact.user_name}
                  className="rounded-full h-10 w-10 object-cover"
                />
              </div>
              <span>{contact.user_name}</span>
            </li>
          ))
        ) : (
          <div>No contacts available</div>
        )}
      </ul>
      <FloatingActionButton setOpenNotification={setOpenNotification} />
    </div>
  );
}

export default LeftSideBar;
