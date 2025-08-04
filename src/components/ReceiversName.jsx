import { useState } from "react";
import { FaVideo } from "react-icons/fa";
import { LuArrowLeft } from "react-icons/lu";
import ViewProfile from "./ViewProfile";
import Modal from "../ui/Modal";
import { useStream } from "../context/StreamContext";
function ReceiversName({ user, status, setUser }) {
  const [viewProfile, setViewProfile] = useState(false);
  const { callUser, setShowCall, setUserInCall } = useStream();

  return (
    <div className="px-5 w-full h-full bg-blue-400 flex justify-between items-center p-2">
      {viewProfile && (
        <Modal
          style={{ justify: "justify-end" }}
          isOpen={viewProfile}
          onClose={() => setViewProfile(false)}
        >
          <ViewProfile id={user.u_id} type={user.type} />
        </Modal>
      )}
      <div className="gap-2 flex h-10 items-center rounded-full">
        {
          <div className=" block md:hidden">
            <button onClick={() => setUser(null)}>
              <LuArrowLeft color="white" size={25} />
            </button>
          </div>
        }
        <div className="w-10 h-10 rounded-full ">
          <button onClick={() => setViewProfile(true)}>
            <img
              src={user?.profile_pic?.file?.path}
              alt=""
              className="h-full w-full object-cover rounded-full"
            />
          </button>
        </div>
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
          <FaVideo
            onClick={() => {
              setShowCall(true);
              setUserInCall(user);
              callUser(user);
            }}
            size={20}
          />
        </button>
      </div>
    </div>
  );
}

export default ReceiversName;
