import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    if (!isLoading && (isError || !data)) {
      navigate("/login");
    }
  }, [isLoading, isError, data, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full">
        <Loader status="authenticating" />
      </div>
    );
  }

  if (isError || !data) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
