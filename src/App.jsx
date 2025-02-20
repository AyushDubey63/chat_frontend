import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import "./App.css";

import { SocketProvider } from "./context/socket";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProtectedRoute from "./wrappers/ProtectedRoute";
import NotificationBox from "./components/NotificationBox";
import ViewStory from "./components/ViewStory";
import CreateNewGroup from "./components/CreateNewGroup";
import ViewProfile from "./components/ViewProfile";
import MyProfile from "./components/MyProfile";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" />
        <Routes>
          <Route
            path="/"
            element={
              <SocketProvider>
                <ProtectedRoute>
                  {" "}
                  <HomePage />{" "}
                </ProtectedRoute>
              </SocketProvider>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/stories" element={<ViewStory />} />
          <Route path="/create-group" element={<CreateNewGroup />} />
          <Route path="/view-profile" element={<ViewProfile />} />
          <Route path="/my-profile" element={<MyProfile />} />
          {/* <Route path="/notifications" element={<NotificationBox />} /> */}
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
