import { useMutation } from "@tanstack/react-query";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { registerUserMutation } from "../services/api";
import toast from "react-hot-toast";

function SignUpPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const password = useRef({});
  password.current = watch("password", "");
  const mutation = useMutation({
    mutationFn: registerUserMutation,
    onSuccess: () => {
      navigate("/login");
      toast.success(
        "Account account registered successfully.An email has been sent to you for verification"
      );
    },
    onError: (error) => console.error(error),
  });
  const onSubmit = (data) => {
    delete data.confirm_password;
    mutation.mutate(data);
  };
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen bg-gray-200 py-20 p-4 md:p-20 lg:p-32">
      <div className="max-w-sm bg-white rounded-lg overflow-hidden shadow-lg mx-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome Back!
          </h2>
          <p className="text-gray-700 mb-6">Please sign in to your account</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                {...register("user_name", { required: "Username is required" })}
                placeholder="Username"
              />
              {errors.user_name && (
                <p className="text-red-500">{errors.user_name.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                  pattern: {
                    value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                    message:
                      "Password must contain at least one number, one lowercase letter, one uppercase letter, and be at least 8 characters long",
                  },
                })}
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="confirm_password"
              >
                Confirm Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="confirm_password"
                type="password"
                {...register("confirm_password", {
                  validate: (value) =>
                    value === password.current || "Passwords do not match",
                })}
                placeholder="Confirm Password"
              />
              {errors.confirm_password && (
                <p className="text-red-500">
                  {errors.confirm_password.message}
                </p>
              )}
              <div>
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 hover:text-blue-800">
                  Login
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
