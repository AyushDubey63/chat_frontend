// components/ContactList.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserAllChats } from "../services/api";
import Loader from "../ui/Loader";

function ContactList({ setUser, searchTerm }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["contacts", searchTerm],
    queryFn: () => fetchUserAllChats({ query: searchTerm }),
    enabled: searchTerm.length >= 0,
  });

  const contacts = data?.data?.data?.chats || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader status="loading" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-4 text-red-500">
        Failed to load contacts
      </div>
    );
  }

  if (!contacts.length) {
    return <div className="text-center p-4">No contacts found</div>;
  }

  return (
    <ul className="max-h-[84%] overflow-y-scroll scrollbar-hidden">
      {contacts.map((contact) => (
        <li
          onClick={() => setUser(contact)}
          className="p-2 h-14 cursor-pointer flex gap-2 items-center shadow"
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
      ))}
    </ul>
  );
}

export default ContactList;
