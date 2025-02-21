import React, { useEffect, useRef, useState } from "react";
import Modal from "../ui/Modal";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { CgProfile } from "react-icons/cg";
import { MdCancel } from "react-icons/md";
import { searchNewContact } from "../services/api";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "../utils/useDebounce";
function CreateNewGroup() {
  const {
    formState: { errors },
    register,
    setError,
    handleSubmit,
    clearErrors,
  } = useForm();
  const [open, setOpen] = React.useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const selectRef = useRef();
  const inputRef = useRef();
  const [searchTerm, setSearchTerm] = React.useState("");

  const { debouncedValue } = useDebounce(searchTerm, 500);
  const { data, isError, isLoading } = useQuery({
    queryKey: ["search", debouncedValue],
    queryFn: () => searchNewContact({ searchTerm: debouncedValue }),
    // enabled: debouncedValue.length , // only fetch when searchTerm is not empty
  });
  const handleChange = (data) => {
    setSelectedMembers(data);
    // Check if at least 3 members are selected
    if (data.length >= 2) {
      // Clear error when 3 or more members are selected
      clearErrors("members");
    } else {
      // Set error when fewer than 3 members are selected
      setError("members", {
        type: "manual",
        message: "Please select at least 3 members", // Custom error message
      });
    }
  };
  if (errors) {
    console.log(errors);
  }
  if (isLoading) {
    console.log("loading");
  }
  const options =
    data?.data?.data.map((elem) => {
      return {
        value: elem.user_id,
        label: (
          <div className="h-full w-full flex gap-2 items-center">
            <div className="h-8 w-8 rounded-full object-cover">
              <img
                className="h-full w-full rounded-full object-cover"
                src={elem.profile_pic?.file?.path}
                alt={elem.user_name}
              />
            </div>
            <div>
              <span>{elem.user_name}</span>
            </div>
          </div>
        ),
      };
    }) || [];
  // const options = [
  //   {
  //     value: "1",
  //     label: (
  //       <div className="h-full w-full flex gap-2 items-center">
  //         <div className="h-8 w-8 rounded-full object-cover">
  //           <img
  //             className="h-full w-full rounded-full object-cover"
  //             src="https://res.cloudinary.com/dg4wzx8c8/image/upload/v1739522416/app_images/qlukkimaeyxajqjx3cdt.jpg"
  //             alt=""
  //           />
  //         </div>
  //         <div>
  //           <span>kundan</span>
  //         </div>
  //       </div>
  //     ),
  //   },
  //   {
  //     value: "2",
  //     label: (
  //       <div className="h-full w-full flex gap-2 items-center">
  //         <div className="h-8 w-8 rounded-full object-cover">
  //           <img
  //             className="h-full w-full rounded-full object-cover"
  //             src="https://res.cloudinary.com/dg4wzx8c8/image/upload/v1739522416/app_images/qlukkimaeyxajqjx3cdt.jpg"
  //             alt=""
  //           />
  //         </div>
  //         <div>
  //           <span>Ayush</span>
  //         </div>
  //       </div>
  //     ),
  //   },
  //   {
  //     value: "3",
  //     label: (
  //       <div className="h-full w-full flex gap-2 items-center">
  //         <div className="h-8 w-8 rounded-full object-cover">
  //           <img
  //             className="h-full w-full rounded-full object-cover"
  //             src="https://res.cloudinary.com/dg4wzx8c8/image/upload/v1739522416/app_images/qlukkimaeyxajqjx3cdt.jpg"
  //             alt=""
  //           />
  //         </div>
  //         <div>
  //           <span>sumedh</span>
  //         </div>
  //       </div>
  //     ),
  //   },
  //   {
  //     value: "4",
  //     label: (
  //       <div className="h-full w-full flex gap-2 items-center">
  //         <div className="h-8 w-8 rounded-full object-cover">
  //           <img
  //             className="h-full w-full rounded-full object-cover"
  //             src="https://res.cloudinary.com/dg4wzx8c8/image/upload/v1739522416/app_images/qlukkimaeyxajqjx3cdt.jpg"
  //             alt=""
  //           />
  //         </div>
  //         <div>
  //           <span>Pawan</span>
  //         </div>
  //       </div>
  //     ),
  //   },
  //   {
  //     value: "5",
  //     label: (
  //       <div className="h-full w-full flex gap-2 items-center">
  //         <div className="h-8 w-8 rounded-full object-cover">
  //           <img
  //             className="h-full w-full rounded-full object-cover"
  //             src="https://res.cloudinary.com/dg4wzx8c8/image/upload/v1739522416/app_images/qlukkimaeyxajqjx3cdt.jpg"
  //             alt=""
  //           />
  //         </div>
  //         <div>
  //           <span>Manya</span>
  //         </div>
  //       </div>
  //     ),
  //   },
  //   {
  //     value: "6",
  //     label: (
  //       <div className="h-full w-full flex gap-2 items-center">
  //         <div className="h-8 w-8 rounded-full object-cover">
  //           <img
  //             className="h-full w-full rounded-full object-cover"
  //             src="https://res.cloudinary.com/dg4wzx8c8/image/upload/v1739522416/app_images/qlukkimaeyxajqjx3cdt.jpg"
  //             alt=""
  //           />
  //         </div>
  //         <div>
  //           <span>bhaskar</span>
  //         </div>
  //       </div>
  //     ),
  //   },
  //   {
  //     value: "7",
  //     label: (
  //       <div className="h-full w-full flex gap-2 items-center">
  //         <div className="h-8 w-8 rounded-full object-cover">
  //           <img
  //             className="h-full w-full rounded-full object-cover"
  //             src="https://res.cloudinary.com/dg4wzx8c8/image/upload/v1739522416/app_images/qlukkimaeyxajqjx3cdt.jpg"
  //             alt=""
  //           />
  //         </div>
  //         <div>
  //           <span>kundan</span>
  //         </div>
  //       </div>
  //     ),
  //   },
  // ];
  const handleMediaPreview = () => {
    const files = inputRef.current.files[0];
    if (files) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files);
      fileReader.onload = () => {
        setPreviewImage(fileReader.result);
      };
    }
  };
  const handleUploadMedia = async () => {
    console.log("upload media");
    inputRef.current.click();
  };
  const onSubmit = (data) => {
    // Check if there are at least 3 members
    if (selectedMembers.length < 2) {
      setError("members", {
        type: "manual",
        message: "Please select at least 2 members", // Custom error message
      });
    } else {
      clearErrors("members");
      const formData = new FormData();
      formData.append("group_name", data.group_name);
      formData.append("description", data.description);
      if (inputRef.current.files[0]) {
        formData.append("group_icon", inputRef.current.files[0]);
      }
      formData.append(
        "members",
        selectedMembers.map((member) => member.value)
      );
      console.log(formData);
    }
  };
  useEffect(() => {
    if (selectRef.current) {
      const valueContainer =
        selectRef.current.controlRef?.querySelector(".css-wda56c");
      if (valueContainer) {
        valueContainer.scrollLeft = valueContainer.scrollWidth;
      }
    }
  }, [selectedMembers]);
  return (
    <div className="p-4 bg-white rounded-lg  max-w-lg mx-auto ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 justify-between"
      >
        <div>
          <label
            htmlFor="group_icon"
            className="text-sm text-gray-600 block text-start"
          >
            Choose Group Icon:
          </label>
          <div className="flex justify-center">
            {previewImage && (
              <div className="w-32 h-32 border border-black rounded-full  relative">
                <button
                  className="absolute rounded-full bg-white top-3 right-1"
                  onClick={() => setPreviewImage(null)}
                >
                  <MdCancel size={20} />
                </button>
                <img
                  src={previewImage}
                  alt="Image Preview"
                  className="object-cover rounded-full h-full w-full"
                />
              </div>
            )}

            {previewImage == null && (
              <button onClick={handleUploadMedia}>
                <CgProfile size={130} />
              </button>
            )}
            <input
              onChange={handleMediaPreview}
              className="hidden"
              type="file"
              ref={inputRef}
            />
          </div>

          {/* <img src={} alt="" /> */}
        </div>
        <div>
          <label
            className="text-sm text-gray-600 block text-start"
            htmlFor="group_name"
          >
            Group Name:
          </label>
          <input
            {...register("group_name", {
              required: "Group name cannot is reuired",
            })}
            className="border p-2 rounded-lg text-base w-full mt-2"
            type="text"
            id="group_name"
          />
          {errors.group_name && (
            <p className="text-red-500">{errors.group_name.message}</p>
          )}
        </div>
        <div>
          <label
            className="text-sm text-gray-600 block text-start"
            htmlFor="group_description"
          >
            Group Description:
          </label>
          <input
            {...register("description")}
            className="border p-2 rounded-lg text-base w-full mt-2"
            type="text"
            id="group_description"
          />
        </div>
        <div className="gap-2 flex flex-col">
          <label
            htmlFor="first_name"
            className="text-sm text-gray-600 block text-start"
          >
            Add Members:
          </label>
          {/* <input className="w-full " type="text" /> */}
          <Select
            ref={selectRef}
            isMulti
            onChange={(data) => {
              handleChange(data); // Handle change normally
            }}
            options={options}
            styles={{
              control: (provided, state) => ({
                ...provided,
                minHeight: "45px",
                overflowX: "auto",
                flexWrap: "nowrap",
                boxShadow: state.isFocused
                  ? "none !important"
                  : "none !importatnt",
                outline: state.isFocused
                  ? "none !importatnt"
                  : "none !importatnt",
                border: state.isFocused
                  ? "1px solid #000"
                  : "1px solid #D1D5DB",
                scrollbarWidth: "none",
                "&:hover": {
                  border: "1px solid black",
                },
                borderRadius: "8px",
              }),
              valueContainer: (provided) => ({
                ...provided,
                flexWrap: "nowrap",
                overflowX: "auto",
                flex: "1 1 auto",
                display: "flex",
                alignItems: "center",
                scrollbarWidth: "none", // Hide scrollbar in Firefox
                msOverflowStyle: "none", // Hide scrollbar in Edge
              }),
              multiValue: (provided) => ({
                ...provided,
                flex: "0 0 auto",
                minWidth: "fit-content",
              }),
              menu: (provided) => ({
                ...provided,
                width: "auto",
                minWidth: "100%",
                // border: "none",
              }),
            }}
            components={{
              MultiValue: ({ data, innerProps, removeProps }) => (
                <div
                  {...innerProps}
                  className="flex items-center bg-gray-100 rounded px-2 py-1 m-1"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {data.label}
                  <span
                    {...removeProps}
                    className="ml-2 cursor-pointer text-red-500"
                    aria-label="Remove"
                  >
                    &times;
                  </span>
                </div>
              ),
            }}
            // onChange={(data) => handleChange(data)}
          />
          {errors.members && (
            <p className="text-red-500">Please select atleast 2 members</p>
          )}
        </div>
        <div className="flex justify-end">
          <button className="shadow-md bg-gray-200 p-2 w-20">Save</button>
        </div>
      </form>
    </div>
  );
}

export default CreateNewGroup;
