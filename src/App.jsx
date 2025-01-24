import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";

import { SocketProvider } from "./context/socket";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProtectedRoute from "./wrappers/ProtectedRoute";
import NotificationBox from "./components/NotificationBox";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
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
          {/* <Route path="/notifications" element={<NotificationBox />} /> */}
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
