import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BsSendPlusFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";

import { searchNewContact } from "../services/api";
import Modal from "../ui/Modal";
import Loader from "../ui/Loader";
import useDebounce from "../utils/useDebounce";
import { useSocket } from "../context/socket";

function SearchNewUser({ open, setOpen }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const { debouncedValue } = useDebounce(searchTerm, 500);
  const socket = useSocket();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["search", debouncedValue],
    queryFn: () => searchNewContact({ searchTerm: debouncedValue }),
    enabled: debouncedValue.length > 0, // only fetch when searchTerm is not empty
  });

  if (isLoading) {
    return (
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
          <Loader status="searching" />
        </div>
      </Modal>
    );
  }

  if (isError) {
    return (
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
          <div>Error occurred while fetching data</div>
        </div>
      </Modal>
    );
  }
  const handleSendRequest = (userId) => {
    socket.emit("notification", {
      receiver_id: userId,
      type: "chat_request",
    });
  };
  return (
    <div>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
          <div className="mb-4">
            <input
              type="text"
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search for new contact"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            {/* Uncomment this part to render dynamic user data */}
            {data?.data?.data?.length > 0 ? (
              data.data.data.map((contact) => (
                <div
                  key={contact.user_id}
                  className="flex items-center justify-between space-x-4 p-3 border-b border-gray-300 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    {contact.profile_pic ? (
                      <img
                        src={contact.profile_pic}
                        alt={contact.user_name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <CgProfile size={50} />
                    )}
                    <h3 className="text-base font-semibold text-gray-700">
                      <b> {contact.user_name}</b>
                    </h3>
                  </div>
                  <button title="send chat request ">
                    <BsSendPlusFill
                      onClick={() => handleSendRequest(contact.user_id)}
                      size={25}
                    />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-4">
                No users found for your search.
              </p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default SearchNewUser;
