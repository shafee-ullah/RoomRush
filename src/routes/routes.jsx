import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import HomeLayout from "../layouts/HomeLayout";
import Home from "../pages/Home";
import LogIn from "../pages/LogIn";
import Register from "../pages/Register";
import ForgotPassword from "../provider/ForgotPassword";
import Spinner from "../components/Spinner";
import Errorpages from "../pages/ErrorPages";
import AuthLayout from "../layouts/AuthLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Errorpages />,
    children: [
      {
        index: true,
        element:<Home/>, 
        hydrateFallbackElement: <Spinner />,
      },
      {
        
      },
    ],
  },
  {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            {
                path: "/auth/login",
                element: <LogIn />,
            },
            {
                path: "/auth/register",
                element: <Register />,
            },
            {
                path: "/auth/forgot-password",
                element: <ForgotPassword />,
            },
        ],
    },
     {
      path: "/*",
      element: <Errorpages />,
    },
]);
export default router;
