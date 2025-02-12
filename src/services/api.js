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

const fetchNotifications = async () =>
  await axios.get(`${BASE_URL}/notification/get-all-notifications`, {
    withCredentials: true,
  });

const fetchUnreadNotificationsCount = async () =>
  await axios.get(`${BASE_URL}/notification/get-unread-notifications-count`, {
    withCredentials: true,
  });

const updateNotificationStatus = async ({ notification_ids }) =>
  await axios.patch(
    `${BASE_URL}/notification/update-notification-status`,
    { notification_ids },
    {
      withCredentials: true,
    }
  );

const fetchChatRequests = async () =>
  await axios.get(`${BASE_URL}/request/get-connection-requests-received`, {
    withCredentials: true,
  });

const fetchRequestsSent = async () =>
  await axios.get(`${BASE_URL}/request/get-connection-requests-sent`, {
    withCredentials: true,
  });

const sendMediaInChat = async (formData) => {
  await axios.post(`${BASE_URL}/chat/send-media`, formData, {
    withCredentials: true,
  });
};

const addStatus = async (formData) => {
  await axios.post(`${BASE_URL}/status/add-status`, formData, {
    withCredentials: true,
  });
};

const fetchStatus = async () => {
  return axios.get(`${BASE_URL}/status/get-status`, {
    withCredentials: true,
  });
};

const fetchAllChatsStatus = async () => {
  return axios.get(`${BASE_URL}/status/get-all-chats-status`, {
    withCredentials: true,
  });
};

export {
  registerUserMutation,
  loginUserMutation,
  logoutUser,
  fetchUserAllChats,
  fetchChatsByChatId,
  authenticateUser,
  searchNewContact,
  fetchNotifications,
  fetchChatRequests,
  fetchRequestsSent,
  updateNotificationStatus,
  fetchUnreadNotificationsCount,
  sendMediaInChat,
  addStatus,
  fetchStatus,
  fetchAllChatsStatus,
};
