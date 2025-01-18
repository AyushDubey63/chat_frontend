import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { SOCKET_URL } from "./config";

const SocketContext = createContext(null);

const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      autoConnect: false,
      auth: { user_id: localStorage.getItem("user_id") },
      withCredentials: true,
    });

    setSocket(socketInstance);
    socketInstance.connect();

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  if (!socket) {
    return null; // Or a loading spinner while the socket is being initialized
  }

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, useSocket };
