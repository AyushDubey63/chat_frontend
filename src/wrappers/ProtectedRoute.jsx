import React from "react";
import { Route, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { authenticateUser } from "../services/api";
import Loader from "../ui/Loader";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth"],
    queryFn: authenticateUser,
    retry: false,
  });
  console.log(isError);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full">
        <Loader status="authenticating" />
      </div>
    );
  }

  if (isError || !data) {
    navigate("/login");
  }
  return <>{children}</>;
};

export default ProtectedRoute;
