import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
const AuthLayout = () => {
  return (
    <div>
      <div className="bg-base-200 min-h-screen">
        <main className="w-11/12 mx-auto py-5">
          <Outlet></Outlet>
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
