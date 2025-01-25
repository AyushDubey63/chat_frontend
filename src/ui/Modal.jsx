// DynamicModal.js
import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center bg-gray-500 bg-opacity-50"
      onClick={onClose} // Close the modal when clicking outside
    >
      <div
        className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow-lg "
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside the modal
      >
        <button
          type="button"
          className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center  "
          onClick={onClose}
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close modal</span>
        </button>
        <div className="p-6 text-center">
          {children} {/* Render the passed dynamic content here */}
        </div>
      </div>
    </div>
  );
};

export default Modal;
