import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

const AuthLayout = () => {
  return (
    <div className="min-h-screen transition-colors duration-200">
      <div className="w-11/12 mx-auto py-5">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
