import React from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const PrivateRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    // Save the attempted location for redirect after login
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
