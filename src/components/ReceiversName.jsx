import React from "react";
import { FaVideo } from "react-icons/fa";
function ReceiversName({ user, status = "offline" }) {
  console.log(user);
  return (
    <div className="px-5 w-full h-full bg-blue-400 flex justify-between items-center p-2">
      <div className="gap-2 flex h-10 w-10 items-center  rounded-full bg-white">
        <img
          src={user?.profile_pic}
          alt=""
          className="h-full w-full object-cover rounded-full"
        />
        <div className=" items-center gap-2">
          <h1 className="text-white text-nowrap text-lg font-bold">
            {user.user_name}
          </h1>
          <div className="flex items-center gap-1">
            <p className="text-white text-xs">{status} </p>
            <span
              className={`mt-1 h-2 w-2 rounded-full ${
                status == "offline" ? "bg-red-500" : "bg-green-500"
              }`}
            ></span>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <button className="text-white text-xs bg-blue-500 p-1 rounded-md">
          <FaVideo size={20} />
        </button>
      </div>
    </div>
  );
}

export default ReceiversName;
