import ProtectedRoute from "../wrappers/ProtectedRoute";
import { SocketProvider } from "../context/socket";
import { StreamProvider } from "../context/StreamContext";
import CallWrapper from "../wrappers/CallWrapper";
import { Outlet } from "react-router-dom";
const ProtectedLayout = () => (
  <ProtectedRoute>
    <SocketProvider>
      <StreamProvider>
        <CallWrapper />
        <Outlet />
      </StreamProvider>
    </SocketProvider>
  </ProtectedRoute>
);
export default ProtectedLayout;
