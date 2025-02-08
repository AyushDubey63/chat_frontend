import React, { useState } from "react";
import { useForm } from "react-hook-form";

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "John_Doe_63",
      firstName: "John",
      lastName: "Doe",
      bio: "I am John, an unemployed but very famous man. You can see my name everywhere in developer's code.",
    },
  });

  const onSubmit = (data) => {
    console.log("Updated Data:", data);
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  return (
    <div className="bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 rounded-full border-4 border-blue-100 overflow-hidden mb-4">
            <img
              className="w-full h-full object-cover"
              src={profilePic}
              alt="Profile"
            />
          </div>

          {isEditing ? (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 text-sm text-gray-500"
            />
          ) : (
            <p className="text-gray-600 text-lg">john.doe@example.com</p>
          )}
        </div>

        {/* Profile Details */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="text-center">
            {isEditing ? (
              <input
                {...register("username", { required: "Username is required" })}
                className="text-3xl font-bold text-blue-600 bg-gray-100 rounded-md px-2 py-1 text-center"
              />
            ) : (
              <h1 className="text-3xl font-bold text-blue-600 mb-2">
                {watch("username")}
              </h1>
            )}
            {errors.username && (
              <p className="text-red-500">{errors.username.message}</p>
            )}

            <div className="flex justify-center gap-4 text-gray-700">
              {isEditing ? (
                <>
                  <input
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                    className="text-xl bg-gray-100 rounded-md px-2 py-1"
                  />
                  <input
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                    className="text-xl bg-gray-100 rounded-md px-2 py-1"
                  />
                </>
              ) : (
                <>
                  <h2 className="text-xl">{watch("firstName")}</h2>
                  <h2 className="text-xl">{watch("lastName")}</h2>
                </>
              )}
            </div>
            {errors.firstName && (
              <p className="text-red-500">{errors.firstName.message}</p>
            )}
            {errors.lastName && (
              <p className="text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            {isEditing ? (
              <textarea
                {...register("bio")}
                className="text-gray-700 bg-gray-100 rounded-md px-3 py-2 w-full"
                rows="4"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{watch("bio")}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
