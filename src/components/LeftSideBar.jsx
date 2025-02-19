import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { RiChatSmileAiFill } from "react-icons/ri";
import { IoMdAddCircle } from "react-icons/io";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchUnreadNotificationsCount,
  fetchUserAllChats,
  logoutUser,
} from "../services/api";
import NotificationBox from "./NotificationBox";
import FloatingActionButton from "../ui/FloatingActionButton";
import { useSocket } from "../context/socket";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import ProfilePage from "./ProfilePage";
import TextStory from "./TextStory";
import ViewStatus from "./ViewStatus";
import Loader from "../ui/Loader";

function LeftSideBar({ setUser }) {
  const [openNotification, setOpenNotification] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [viewStatusTab, setViewStatusTab] = useState(false);
  const queryClient = useQueryClient();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["freinds"],
    queryFn: fetchUserAllChats,
  });
  const { data: unreadNotificationData, isError: unreadNotificationError } =
    useQuery({
      queryKey: ["unread_notifications"],
      queryFn: fetchUnreadNotificationsCount,
    });
  const userData = data?.data?.data.user || {};
  const contacts = data?.data?.data?.chats || [];
  console.log(userData);
  // Socket handling remains unchanged
  const socket = useSocket();
  useEffect(() => {
    const handleNotification = (data) => {
      console.log(data, 4);
      if (data.type === "chat_request") {
        toast.success("You have a new chat request");
      }
      if (data.type === "chat_accept") {
        toast.success("Chat request accepted successfully");
      }
      queryClient.invalidateQueries([
        "notifications",
        "chatRequests",
        "requestsSent",
      ]);
    };

    socket.on("notification", handleNotification);
    return () => socket.off("notification", handleNotification);
  }, [socket, queryClient]);
  if (isLoading)
    return (
      <div className="justify-center items-center flex h-full">
        <Loader status="loading"></Loader>
      </div>
    );
  if (isError) return <div>Error fetching data</div>;
  console.log(unreadNotificationData?.data?.data?.unread_count, 4);
  const style = {
    width: "50%",
    maxWidth: "max-w-xl",
  };

  return (
    <div className="max-h-screen h-full w-full relative">
      {viewStatusTab && (
        <ViewStatus
          viewStatusTab={viewStatusTab}
          setViewStatusTab={setViewStatusTab}
        />
      )}
      {openProfile && (
        <Modal
          style={style}
          isOpen={openProfile}
          onClose={() => setOpenProfile(false)}
        >
          <ProfilePage />
        </Modal>
      )}
      <div className=" bg-gray-300">
        <div className=" justify-between lg:justify-start p-2 flex  items-center gap-2">
          <div
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
            onClick={() => setOpenProfile(true)}
          >
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={userData.profile_pic?.file?.path}
              alt=""
            />
          </div>
          <h2 className="text-center hidden lg:block text-lg font-semibold">
            {userData.user_name}
          </h2>
          <button onClick={() => setViewStatusTab(true)}>
            <RiChatSmileAiFill size={25} />
          </button>
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
                  src={contact.profile_pic?.file?.path}
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
      <FloatingActionButton
        setOpenNotification={setOpenNotification}
        newNotification={
          unreadNotificationData?.data?.data?.unread_count == 0 ? false : true
        }
      />
    </div>
  );
}

export default LeftSideBar;
