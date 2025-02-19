import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FaCamera } from "react-icons/fa";
import { useForm } from "react-hook-form";
import {
  getUserDetails,
  updateUserDetails,
  updateProfileImage,
} from "../services/api"; // Assuming you have these functions

function MyProfile() {
  const inputRef = useRef();
  const [isEditing, setIsEditing] = useState(false); // To toggle the edit mode for text fields
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getUserDetails"],
    queryFn: getUserDetails,
    retry: false,
  });

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  // UseMutation for updating user profile details
  const updateUserMutation = useMutation(updateUserDetails, {
    onSuccess: (updatedData) => {
      console.log("User details updated:", updatedData);
      // You can also trigger a refetch here if you need to show updated data
    },
    onError: (error) => {
      console.error("Error updating user details:", error);
    },
  });

  // UseMutation for updating profile image
  const updateImageMutation = useMutation(updateProfileImage, {
    onSuccess: (updatedImage) => {
      console.log("Profile image updated:", updatedImage);
    },
    onError: (error) => {
      console.error("Error updating profile image:", error);
    },
  });

  // Handle profile image change
  const handleImageChange = () => {
    const file = inputRef.current.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      updateImageMutation.mutate(formData);
    }
  };

  // Handle form submission to save text details (name, email, etc.)
  const onSubmit = (data) => {
    updateUserMutation.mutate(data);
  };

  // Set default values from the fetched data when available
  useEffect(() => {
    if (data) {
      setValue("first_name", data.first_name);
      setValue("last_name", data.last_name);
      setValue("email", data.email);
      setValue("about", data.about);
    }
  }, [data, setValue]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading user details</div>;

  return (
    <div className="min-h-screen shadow-lg w-[30%] bg-white py-6 px-4">
      {/* Profile Image and Edit Button */}
      <div className="flex flex-col items-center">
        <div className="rounded-full h-28 w-28 relative border-2 border-blue-500">
          <img
            className="rounded-full h-full w-full"
            src={data.profile_image || "https://via.placeholder.com/150"}
            alt="Profile"
          />
          <input
            ref={inputRef}
            className="hidden"
            type="file"
            onChange={handleImageChange}
          />
          <div className="bg-gray-300 rounded-full w-6 h-6 absolute bottom-3 -right-0">
            <button
              className="rounded-full border-2 border-blue-500 h-full w-full flex items-center justify-center"
              onClick={() => inputRef.current.click()}
            >
              <FaCamera fill="red" />
            </button>
          </div>
        </div>
        <span>{data.username}</span>
      </div>

      {/* Profile Info */}
      <div className="rounded-b-lg mt-6 p-6 max-w-4xl mx-auto">
        {/* Full Name */}
        <div className="flex justify-between items-center">
          <div>
            <input
              {...register("first_name", {
                required: "First name cannot be empty",
              })}
              type="text"
              defaultValue={data.first_name}
              disabled={!isEditing}
              className={`border p-2 rounded ${
                isEditing ? "border-blue-500" : "bg-gray-100"
              }`}
            />
            <input
              {...register("last_name", {
                required: "Last name cannot be empty",
              })}
              type="text"
              defaultValue={data.last_name}
              disabled={!isEditing}
              className={`border p-2 rounded ${
                isEditing ? "border-blue-500" : "bg-gray-100"
              }`}
            />
          </div>
          <button
            className="text-blue-500"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        {/* About Section */}
        <div className="mt-4">
          <textarea
            {...register("about")}
            defaultValue={data.about}
            disabled={!isEditing}
            className={`border p-2 rounded w-full ${
              isEditing ? "border-blue-500" : "bg-gray-100"
            }`}
          ></textarea>
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
              <input
                {...register("email")}
                defaultValue={data.email}
                disabled={!isEditing}
                className={`border p-2 rounded ${
                  isEditing ? "border-blue-500" : "bg-gray-100"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="bg-blue-500 text-white p-2 rounded"
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProfile;
