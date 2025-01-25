import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const registerUserMutation = async (data) =>
  await axios.post(`${BASE_URL}/auth/register-user`, data);

const fetchUserAllChats = async () =>
  await axios.get(`${BASE_URL}/chat/get-all-chats`, {
    withCredentials: true,
  });
const fetchChatsByChatId = async ({ chat_id, page, limit = 10 }) =>
  await axios.get(
    `${BASE_URL}/chat/get-chats?chat_id=${chat_id}&page=${page}&limit=${limit}`,
    {
      withCredentials: true,
    }
  );
const loginUserMutation = async (formData) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
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
const authenticateUser = async () =>
  await axios.post(
    `${BASE_URL}/auth/authenticate`,
    {},
    {
      withCredentials: true,
    }
  );

const logoutUser = async () =>
  await axios.post(
    `${BASE_URL}/auth/logout`,
    {},
    {
      withCredentials: true,
    }
  );
const searchNewContact = async ({ searchTerm }) =>
  await axios.get(`${BASE_URL}/user/search-users?search=${searchTerm}`, {
    withCredentials: true,
  });
export {
  registerUserMutation,
  loginUserMutation,
  logoutUser,
  fetchUserAllChats,
  fetchChatsByChatId,
  authenticateUser,
  searchNewContact,
};
