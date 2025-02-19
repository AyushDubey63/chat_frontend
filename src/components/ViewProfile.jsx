import React from "react";

function ViewProfile() {
  return (
    <div className="min-h-screen w-[30%] bg-gray-100 py-6 px-4">
      {/* Profile Banner and Profile Picture */}
      <div className="bg-gray-800 h-48 rounded-t-lg relative">
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4"></div>
        <div className="absolute left-5 bottom-5 text-white text-lg">
          @UserName
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white shadow-lg rounded-b-lg mt-6 p-6 max-w-4xl mx-auto">
        {/* Username and Full Name */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800">John Doe</h1>
        </div>

        {/* About Section */}
        <div className="mt-4">
          <p className="text-lg text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
            sed, exercitationem eligendi perferendis illo est cum! Quod nulla
            sapiente accusamus earum.
          </p>
        </div>

        {/* Contact Info */}
        <div className="mt-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-blue-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5h18M3 10h18M3 15h18M3 20h18"
                ></path>
              </svg>
              <p className="ml-2">john.doe@example.com</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-green-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5h18M3 10h18M3 15h18M3 20h18"
                ></path>
              </svg>
              <p className="ml-2">+1 234 567 890</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-red-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5h18M3 10h18M3 15h18M3 20h18"
                ></path>
              </svg>
              <p className="ml-2">WhatsApp: +1 234 567 890</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProfile;
