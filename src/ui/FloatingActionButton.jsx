import React from "react";
import { AiOutlineAppstore } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import { RxExit } from "react-icons/rx";

import "./fab.css";
import { logoutUser } from "../services/api";
import { useQueryClient } from "@tanstack/react-query";
import DialogBox from "./DialogBox";
import SearchNewUser from "../components/SearchNewUser";

function FloatingActionButton({ setOpenNotification }) {
  const [openLogout, setOpenLogout] = React.useState(false);
  const [searchBox, setSearchBox] = React.useState(false);
  const queryClient = useQueryClient();
  const handleLogoutUser = async () => {
    await logoutUser();
    queryClient.invalidateQueries("auth");
  };
  return (
    <div className="absolute bottom-24 right-10">
      <DialogBox
        message="Are you sure you want to logout"
        onConfirm={handleLogoutUser}
        isOpen={openLogout}
        onClose={() => setOpenLogout(false)}
      />
      <SearchNewUser open={searchBox} setOpen={setSearchBox} />
      <div id="button-container">
        <button className="button faq-button" id="dribbble">
          <FiPlus onClick={() => setSearchBox(true)} size={25} />
          <span class="tooltip text-xs text-nowrap">New Contact</span>
        </button>
        <button
          onClick={() => setOpenNotification((prev) => !prev)}
          className="button faq-button"
          id="instagram"
        >
          <IoNotificationsOutline size={25} />
          <span class="tooltip text-xs">Notifications</span>
        </button>
        <button
          onClick={() => setOpenLogout(true)}
          className="button faq-button"
          id="logout"
        >
          <RxExit size={25} />
          <span class="tooltip text-xs">Logout</span>
        </button>
        <button className="button shadow-md" id="share">
          <AiOutlineAppstore size={25} />
        </button>
      </div>
    </div>
  );
}

export default FloatingActionButton;
