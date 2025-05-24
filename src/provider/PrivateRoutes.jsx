import React, { use, useContext } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import { Navigate, useLocation } from "react-router";
import Spinner from '../components/Spinner';
const PrivateRoute = ({ children }) => {
    const { user, loading } = use(AuthContext);
    // console.log(user);
  const location = useLocation();
  console.log(location);

  if (loading) {
    return <Spinner></Spinner>;
  }

  if (user && user?.email || user?.displayName) {
    return children;
  }
  return <Navigate state={location.pathname} to="/auth/login"></Navigate>;
};


export default PrivateRoute;

