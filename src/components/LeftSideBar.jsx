import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { RiChatSmileAiFill } from "react-icons/ri";
import { IoMdAddCircle } from "react-icons/io";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchUnreadNotificationsCount,
  fetchUserDetails,
} from "../services/api";
import NotificationBox from "./NotificationBox";
import FloatingActionButton from "../ui/FloatingActionButton";
import { useSocket } from "../context/socket";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import ViewStatus from "./ViewStatus";
import MyProfile from "./MyProfile";
import useDebounce from "../utils/useDebounce";
import ContactList from "./ContactList";

function LeftSideBar({ setUser }) {
  const [openNotification, setOpenNotification] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { debouncedValue } = useDebounce(searchTerm, 500);
  const [openProfile, setOpenProfile] = useState(false);
  const [viewStatusTab, setViewStatusTab] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: userDetails,
    isError: userDataError,
    isLoading: userDataLoding,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUserDetails,
  });

  const { data: unreadNotificationData, isError: unreadNotificationError } =
    useQuery({
      queryKey: ["unread_notifications"],
      queryFn: fetchUnreadNotificationsCount,
    });
  const userData = userDetails?.data?.data || {};

  console.log(userData);

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

  const style = {
    width: "50%",
    maxWidth: "max-w-xl",
  };

  return (
    <div className="max-h-screen bg-gray-100 h-full w-full relative">
      {viewStatusTab && (
        <ViewStatus
          viewStatusTab={viewStatusTab}
          setViewStatusTab={setViewStatusTab}
          userData={userData}
        />
      )}
      {openProfile && (
        <Modal
          style={style}
          isOpen={openProfile}
          onClose={() => setOpenProfile(false)}
        >
          <MyProfile />
        </Modal>
      )}
      {}
      <div className=" bg-gray-100">
        <div className=" justify-between lg:justify-start p-2 flex  items-center gap-2">
          <div
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
            onClick={() => {
              setOpenProfile(true);
            }}
          >
            <button type="button">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={userData.profile_pic?.file?.path}
                alt=""
              />
            </button>
          </div>
          <h2 className="text-center hidden lg:block text-lg font-semibold">
            {userData?.user_name}
          </h2>
          <button
            onClick={() => {
              setViewStatusTab(true);
              setUser(null);
            }}
          >
            <svg
              fill="none"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                d="M12 3.75a8.25 8.25 0 0 0-6.972 12.663c.121.19.15.425.079.64l-.921 2.761 2.762-.92a.75.75 0 0 1 .639.078A8.2 8.2 0 0 0 12 20.25a8.2 8.2 0 0 0 3.666-.857.75.75 0 0 1 .668 1.343A9.7 9.7 0 0 1 12 21.75a9.7 9.7 0 0 1-4.908-1.323l-3.855 1.285a.75.75 0 0 1-.948-.95l1.285-3.854A9.7 9.7 0 0 1 2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75a9.7 9.7 0 0 1-1.014 4.334.75.75 0 1 1-1.343-.668A8.2 8.2 0 0 0 20.25 12 8.25 8.25 0 0 0 12 3.75"
                fill="#000"
                fill-rule="evenodd"
              />
              <path
                clip-rule="evenodd"
                d="M6.445 10.512a5.7 5.7 0 0 1 1.489-2.578 5.7 5.7 0 0 1 2.578-1.489.75.75 0 1 1 .387 1.45 4.2 4.2 0 0 0-1.904 1.1 4.2 4.2 0 0 0-1.1 1.904.75.75 0 0 1-1.45-.387m6.125-3.536a.75.75 0 0 1 .918-.531c.945.252 1.838.75 2.578 1.49a5.7 5.7 0 0 1 1.489 2.577.75.75 0 1 1-1.45.387 4.2 4.2 0 0 0-1.1-1.904 4.2 4.2 0 0 0-1.904-1.1.75.75 0 0 1-.531-.919M6.976 12.57a.75.75 0 0 1 .918.53 4.2 4.2 0 0 0 1.1 1.905 4.2 4.2 0 0 0 1.905 1.1.75.75 0 0 1-.387 1.45 5.7 5.7 0 0 1-2.578-1.49 5.7 5.7 0 0 1-1.49-2.577.75.75 0 0 1 .532-.918m5.594 4.454a.75.75 0 0 1 .53-.918 4.2 4.2 0 0 0 1.905-1.1 4.2 4.2 0 0 0 1.1-1.905.75.75 0 0 1 1.45.387 5.7 5.7 0 0 1-1.49 2.578 5.73 5.73 0 0 1-2.577 1.49.75.75 0 0 1-.918-.532"
                fill="#000"
                fill-rule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="border p-2 flex gap-2 items-center">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
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
        ) : (
          <ContactList searchTerm={debouncedValue} setUser={setUser} />
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
