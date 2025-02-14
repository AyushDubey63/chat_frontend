import React from "react";
import Modal from "../ui/Modal";
import Select from "react-select";
import "./style.css";
function CreateNewGroup() {
  const [open, setOpen] = React.useState(true);
  const handleChange = (data) => {
    console.log(data);
  };
  const options = [
    {
      value: "1",
      label: (
        <div className="h-full w-full flex gap-2 items-center">
          <div className="h-8 w-8 rounded-full object-cover">
            <img
              className="h-full w-full rounded-full object-cover"
              src="https://res.cloudinary.com/dg4wzx8c8/image/upload/v1739522416/app_images/qlukkimaeyxajqjx3cdt.jpg"
              alt=""
            />
          </div>
          <div>
            <span>kundan</span>
          </div>
        </div>
      ),
    },
    {
      value: "2",
      label: (
        <div className="h-full w-full flex gap-2 items-center">
          <div className="h-8 w-8 rounded-full object-cover">
            <img
              className="h-full w-full rounded-full object-cover"
              src="https://res.cloudinary.com/dg4wzx8c8/image/upload/v1739522416/app_images/qlukkimaeyxajqjx3cdt.jpg"
              alt=""
            />
          </div>
          <div>
            <span>Ayush</span>
          </div>
        </div>
      ),
    },
    {
      value: "3",
      label: (
        <div className="h-full w-full flex gap-2 items-center">
          <div className="h-8 w-8 rounded-full object-cover">
            <img
              className="h-full w-full rounded-full object-cover"
              src="https://res.cloudinary.com/dg4wzx8c8/image/upload/v1739522416/app_images/qlukkimaeyxajqjx3cdt.jpg"
              alt=""
            />
          </div>
          <div>
            <span>sumedh</span>
          </div>
        </div>
      ),
    },
    {
      value: "4",
      label: (
        <div className="h-full w-full flex gap-2 items-center">
          <div className="h-8 w-8 rounded-full object-cover">
            <img
              className="h-full w-full rounded-full object-cover"
              src="https://res.cloudinary.com/dg4wzx8c8/image/upload/v1739522416/app_images/qlukkimaeyxajqjx3cdt.jpg"
              alt=""
            />
          </div>
          <div>
            <span>Pawan</span>
          </div>
        </div>
      ),
    },
    {
      value: "5",
      label: (
        <div className="h-full w-full flex gap-2 items-center">
          <div className="h-8 w-8 rounded-full object-cover">
            <img
              className="h-full w-full rounded-full object-cover"
              src="https://res.cloudinary.com/dg4wzx8c8/image/upload/v1739522416/app_images/qlukkimaeyxajqjx3cdt.jpg"
              alt=""
            />
          </div>
          <div>
            <span>Manya</span>
          </div>
        </div>
      ),
    },
    {
      value: "6",
      label: (
        <div className="h-full w-full flex gap-2 items-center">
          <div className="h-8 w-8 rounded-full object-cover">
            <img
              className="h-full w-full rounded-full object-cover"
              src="https://res.cloudinary.com/dg4wzx8c8/image/upload/v1739522416/app_images/qlukkimaeyxajqjx3cdt.jpg"
              alt=""
            />
          </div>
          <div>
            <span>bhaskar</span>
          </div>
        </div>
      ),
    },
    {
      value: "7",
      label: (
        <div className="h-full w-full flex gap-2 items-center">
          <div className="h-8 w-8 rounded-full object-cover">
            <img
              className="h-full w-full rounded-full object-cover"
              src="https://res.cloudinary.com/dg4wzx8c8/image/upload/v1739522416/app_images/qlukkimaeyxajqjx3cdt.jpg"
              alt=""
            />
          </div>
          <div>
            <span>kundan</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
          <div>Add Group Members</div>
          <input className="w-full h-10" type="text" />
          <Select
            isMulti
            options={options}
            styles={{
              control: (provided) => ({
                ...provided,
                minHeight: "40px",
                overflowX: "auto",
                flexWrap: "nowrap",
                scrollbarWidth: "none", // Hide scrollbar in Firefox
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
            onChange={(data) => handleChange(data)}
          />
        </div>
      </Modal>
    </div>
  );
}

export default CreateNewGroup;
