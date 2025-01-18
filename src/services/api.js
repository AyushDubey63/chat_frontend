import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const registerUserMutation = async (data) =>
  await axios.post(`${BASE_URL}/user/register-user`, data);

const loginUserMutation = async (formData) => {
  const response = await fetch(`${BASE_URL}/user/login-user`, {
    method: "POST",
    credentials: "include", // Ensures cookies are sent with the request
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }
  console.log(response.headers, 21);
  return response; // Return the entire response object
};

export { registerUserMutation, loginUserMutation };
