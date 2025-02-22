import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaCamera } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { updateUserDetails, fetchUserDetails } from "../services/api";

function MyProfile() {
  const inputRef = useRef();
  const [isEditing, setIsEditing] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getUserDetails"],
    queryFn: fetchUserDetails,
    retry: false,
  });

  const queryClient = useQueryClient();
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  const updateUserMutation = useMutation({
    mutationFn: updateUserDetails,
    onSuccess: (updatedData) => {
      console.log("User details updated:", updatedData);
      queryClient.invalidateQueries(["getUserDetails"]);
    },
    onError: (error) => {
      console.error("Error updating user details:", error);
    },
  });

  // Handle profile image change
  const handleImageChange = () => {
    const file = inputRef.current.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("files", file);
      updateUserMutation.mutate(formData);
    }
  };

  // Handle form submission to save text details (name, email, etc.)
  const onSubmit = (data) => {
    updateUserMutation.mutate(data);
  };

  useEffect(() => {
    if (data) {
      setValue("first_name", data?.data?.data?.first_name);
      setValue("last_name", data?.data?.data?.last_name);
      setValue("email", data?.data?.data?.email);
      setValue("bio", data?.data?.data?.bio);
    }
  }, [data, setValue]);

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (isError)
    return <div className="text-center py-10">Error loading user details</div>;

  return (
    <div className="min-h-screen w-full bg-gray-50 py-8 px-6">
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden relative">
        <div className="flex absolute top-2 right-2 justify-between items-center p-6">
          <button
            className="text-blue-600 font-semibold"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        {/* Profile Image and Edit Button */}
        <div className="flex flex-col items-center py-6 border-t border-gray-200">
          <div className="relative mb-4">
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-blue-600">
              <img
                className="w-full h-full object-cover"
                src={
                  data?.data?.data?.profile_pic?.file?.path ||
                  "https://via.placeholder.com/150"
                }
                alt="Profile"
              />
            </div>
            <input
              ref={inputRef}
              className="hidden"
              type="file"
              onChange={handleImageChange}
            />
            <div className="absolute bottom-2 right-2 bg-white p-2 rounded-full border-2 border-blue-600">
              <button
                className="flex items-center justify-center"
                onClick={() => inputRef.current.click()}
              >
                <FaCamera className="text-blue-600" />
              </button>
            </div>
          </div>
          <span className="text-xl font-semibold text-blue-600">
            {data?.data?.data?.user_name}
          </span>
        </div>

        {/* Profile Info */}
        <div className="p-6 ">
          <div className="space-y-2">
            <div className="flex gap-2 justify-between">
              <div className="w-full">
                <label
                  htmlFor="first_name"
                  className="text-sm text-gray-600 block text-start"
                >
                  First Name
                </label>
                <input
                  {...register("first_name", {
                    required: "First name cannot be empty",
                  })}
                  type="text"
                  defaultValue={data?.data?.data?.first_name}
                  disabled={!isEditing}
                  className={`border p-3 rounded-lg text-lg w-full mt-2 ${
                    isEditing ? "border-blue-500" : "bg-gray-100"
                  }`}
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="last_name"
                  className="text-sm text-gray-600 block text-start"
                >
                  Last Name
                </label>
                <input
                  {...register("last_name", {
                    required: "Last name cannot be empty",
                  })}
                  type="text"
                  defaultValue={data?.data?.data?.last_name}
                  disabled={!isEditing}
                  className={`border p-3 rounded-lg text-lg w-full mt-2 ${
                    isEditing ? "border-blue-500" : "bg-gray-100"
                  }`}
                />
              </div>
            </div>
            <div className="w-full flex flex-col">
              <label
                htmlFor="email"
                className="text-sm text-gray-600 block text-start"
              >
                Email
              </label>
              <input
                {...register("email")}
                defaultValue={data?.data?.data.email}
                disabled={true}
                className={`border p-3 rounded-lg text-lg w-full mt-2 ${
                  isEditing ? "border-blue-500" : "bg-gray-100"
                }`}
              />
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-2">
            <label
              htmlFor="bio"
              className="text-sm text-gray-600 block text-start"
            >
              Bio
            </label>
            <textarea
              {...register("bio")}
              defaultValue={data?.data?.data?.bio}
              disabled={!isEditing}
              className={`border p-3 rounded-lg w-full h-24 text-lg resize-none mt-2 ${
                isEditing ? "border-blue-500" : "bg-gray-100"
              }`}
            ></textarea>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end ">
              <button
                type="button"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                onClick={handleSubmit(onSubmit)}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default MyProfile;
