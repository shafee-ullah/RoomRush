import React from "react";
import { createBrowserRouter } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
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
import FindRoommate from "../pages/FindRoommate";
import Profile from "../pages/Profile";
import AuthProvider from "../provider/AuthProvider";
import About from "../pages/About";

const routes = [
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
        path: "/find-roommate",
        element: (
          <PrivateRoute>
            <FindRoommate />
          </PrivateRoute>
        ),
        fallbackElement: <Spinner />,
      },
      {
        path: "/find-roommate/:id",
        element: (
          <PrivateRoute>
            <FindRoommate />
          </PrivateRoute>
        ),
        fallbackElement: <Spinner />,
      },
      {
        path: "/about",
        element: <About />,
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
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "/auth/login",
        element: <Login />,
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
];

// Create router without AuthProvider wrapping
const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
  },
});

export default router;
