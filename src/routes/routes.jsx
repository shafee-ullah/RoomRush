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
import AddRoommate from "../pages/AddRoommate";  
import ListingsBrowse from "../pages/ListingsBrowse";
import MyListings from "../pages/MyListings";
import PrivateRoute from "../provider/PrivateRoute";
import DetailsPage from "../pages/DetailsPage";  
import UpdatePost from "../pages/UpdatePost";    

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Errorpages />,
    children: [
      {
        index: true,
        element: <Home />,
        fallbackElement: <Spinner />,
      },
      {
        path: "/add-roommate",  
        element: (
          <PrivateRoute>
            <AddRoommate />
          </PrivateRoute>
        ),
        fallbackElement: <Spinner />,
      },
      {
        path: "/browse-listings",
        element: <ListingsBrowse />,
        fallbackElement: <Spinner />,
      },
      {
        path: "/my-listings",
        element: (
          <PrivateRoute>
            <MyListings />
          </PrivateRoute>
        ),
        fallbackElement: <Spinner />,
      },
      {
        path: "/details/:id",
        element: (
          <PrivateRoute>
            <DetailsPage />
          </PrivateRoute>
        ),
        fallbackElement: <Spinner />,
      },
      {
        path: "/update/:id", 
        element: (
          <PrivateRoute>
            <UpdatePost />
          </PrivateRoute>
        ),
        fallbackElement: <Spinner />,
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