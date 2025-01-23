import React from "react";

function Loader({ status = "Loading" }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
      <p className="text-sm text-gray-500">{status}</p>
    </div>
  );
}

export default Loader;
