import React, { useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { authenticateUser, loginUserMutation } from "../services/api";
import Loader from "../ui/Loader";

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState("password");
  const { data, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: authenticateUser,
    retry: false,
  });
  useEffect(() => {
    // If user is already authenticated, redirect to homepage
    if (data) {
      navigate("/");
    }
  }, [data, navigate]);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm();
  const mutation = useMutation({
    mutationFn: loginUserMutation,
    onSuccess: (data) => {
      console.log(data);
      navigate("/");
    },
    onError: (error) => {
      console.error(error.message);
      if (error.message === "User not verified") {
        setError("password", {
          type: "manual",
          message:
            "User not verified, Please check your email for otp verification",
        });
      } else {
        setError("password", {
          type: "manual",
          message: "Invalid email or password",
        });
      }
    },
  });
  const onSubmit = (data) => {
    mutation.mutate(data);
  };
  const toggeleVisibilty = () => {
    if (showPassword === "password") {
      setShowPassword("text");
    } else {
      setShowPassword("password");
    }
  };
  if (isLoading) {
    return (
      <div className="justify-center items-center flex h-full">
        <Loader status="loading"></Loader>
      </div>
    );
  }
  if (mutation.isPending) {
    return (
      <div className="justify-center items-center flex h-full">
        <Loader status="authenticating"></Loader>
      </div>
    );
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
              <label className="block text-gray-700 font-bold mb-2" for="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="text"
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 font-bold mb-2"
                for="password"
              >
                Password
              </label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:shadow-outline gap-2 flex justify-between">
                <input
                  className="w-full focus:outline-none  leading-tight"
                  id="password"
                  type={showPassword}
                  placeholder="Password"
                  {...register("password")}
                />
                <button type="button" onClick={() => toggeleVisibilty()}>
                  {showPassword === "password" ? (
                    <FaEye size={20} />
                  ) : (
                    <FaEyeSlash size={20} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
              <div>
                Don't have an account?{" "}
                <Link to="/sign-up" className="text-blue-500">
                  Sign Up
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign In
              </button>
              <Link
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                to="/forgot-password"
              >
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
