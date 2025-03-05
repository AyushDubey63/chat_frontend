import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { forgotPassword } from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      console.log(data);
      toast.success("Password reset link sent to your email");
      navigate("/login");
    },
    onError: (error) => {
      console.log(error);
      if (
        error?.response?.data.message === "Enter a registered email address"
      ) {
        toast.error(error?.response?.data.message);
      } else {
        toast.error("Error occurred while sending password reset link");
      }
    },
  });
  const handleResetPassword = (e) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log("Password reset requested for:", email);
    mutation.mutate({ email });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 max-w-sm">
        <h2 className="text-3xl font-semibold mb-6">Reset Your Password</h2>
        <form onSubmit={handleResetPassword}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Enter your registered email"
            />
          </div>
          <div className="mb-6">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              Reset Password
            </button>
          </div>
          <p className=" text-sm text-gray-500">
            Remembered your password?{" "}
            <a href="/login" className="text-blue-600 hover:text-blue-700">
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
