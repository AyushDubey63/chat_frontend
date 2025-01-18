import React, { useEffect, useState } from "react";
import { freinds } from "../json/api";
import { IoIosSearch } from "react-icons/io";
function LeftSideBar() {
  return (
    <div className="max-h-screen h-full w-full ">
      <div className=" bg-gray-300">
        <div className=" justify-start p-2 flex  items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src="https://www.balancenutrition.in/images/aboutUs/SumedhPawar.png"
              alt=""
            />
          </div>
          <h2 className="text-center text-lg font-semibold">Sumedh Pawar</h2>
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
        {freinds.map((contact) => (
          <li
            className="p-2 h-14 flex gap-2 items-center border-black border"
            key={contact.id}
          >
            <div className="gap-2 flex h-10 w-10 items-center  rounded-full bg-white">
              <img
                src="https://www.balancenutrition.in/images/aboutUs/pravin_singh.png"
                alt={contact.name}
                className="rounded-full h-10 w-10 object-cover"
              />
            </div>
            <span>{contact.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LeftSideBar;
