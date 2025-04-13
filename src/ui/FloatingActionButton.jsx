import React from "react";
import { AiOutlineAppstore } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import { RxExit } from "react-icons/rx";
import { TiGroupOutline } from "react-icons/ti";

import "./fab.css";
import { logoutUser } from "../services/api";
import { useQueryClient } from "@tanstack/react-query";
import DialogBox from "./DialogBox";
import SearchNewUser from "../components/SearchNewUser";
import Modal from "./Modal";
import CreateNewGroup from "../components/CreateNewGroup";
import { useNavigate } from "react-router-dom";
function FloatingActionButton({ setOpenNotification, newNotification }) {
  console.log(newNotification, 14);
  const navigate = useNavigate();
  const [openLogout, setOpenLogout] = React.useState(false);
  const [searchBox, setSearchBox] = React.useState(false);
  const [newGroup, setNewGroup] = React.useState(false);
  const queryClient = useQueryClient();
  const handleLogoutUser = async () => {
    await logoutUser();
    queryClient.clear();
    navigate("/login", { replace: true });
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
      {newGroup && (
        <Modal
          style={{ height: "h-full" }}
          isOpen={newGroup}
          onClose={() => setNewGroup(false)}
        >
          <CreateNewGroup />
        </Modal>
      )}
      <div id="button-container">
        <button
          onClick={() => setNewGroup(true)}
          className="button faq-button"
          id="group"
        >
          <TiGroupOutline size={25} />
          <span className="tooltip text-xs text-nowrap">New Group</span>
        </button>
        <button className="button faq-button" id="dribbble">
          <FiPlus onClick={() => setSearchBox(true)} size={25} />
          <span className="tooltip text-xs text-nowrap">New Contact</span>
        </button>
        <button
          onClick={() => setOpenNotification((prev) => !prev)}
          className="button faq-button"
          id="instagram"
        >
          <IoNotificationsOutline size={25} />
          <span className="tooltip text-xs">Notifications</span>
          {newNotification && (
            <span className="absolute h-3 w-3 bottom-6 right-[-0.3rem] rounded-full bg-blue-500 text-center text-xs"></span>
          )}
        </button>
        <button
          onClick={() => setOpenLogout(true)}
          className="button faq-button"
          id="logout"
        >
          <RxExit size={25} />
          <span className="tooltip text-xs">Logout</span>
        </button>
        <button className="button shadow-md relative" id="share">
          <AiOutlineAppstore size={25} />
          {newNotification && (
            <span className="absolute h-3 w-3 bottom-6 right-[-0.3rem] rounded-full bg-blue-500 text-center text-xs"></span>
          )}
        </button>
      </div>
    </div>
  );
}

export default FloatingActionButton;
