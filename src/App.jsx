import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import "./App.css";

import { SocketProvider } from "./context/socket";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProtectedRoute from "./wrappers/ProtectedRoute";
import ViewStory from "./components/ViewStory";
import CreateNewGroup from "./components/CreateNewGroup";
import ViewProfile from "./components/ViewProfile";
import MyProfile from "./components/MyProfile";
import ForgotPassword from "./pages/ForgotPassword";
import SocketEventListener from "./wrappers/SocketEventListener";
import { PeerProvider } from "./context/peer";

const queryClient = new QueryClient();

// A layout that wraps protected routes
const ProtectedLayout = () => (
  <SocketProvider>
    <PeerProvider>
      <ProtectedRoute>
        <SocketEventListener />
        <Outlet />
      </ProtectedRoute>
    </PeerProvider>
  </SocketProvider>
);

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" />
        <Routes>
          {/* Protected routes go here */}
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/stories" element={<ViewStory />} />
            <Route path="/create-group" element={<CreateNewGroup />} />
            <Route path="/view-profile" element={<ViewProfile />} />
            <Route path="/my-profile" element={<MyProfile />} />
          </Route>

          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
