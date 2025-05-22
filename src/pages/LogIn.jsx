import React, { useContext, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { IoReturnDownBackSharp } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import {
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/20/solid";
import { AuthContext } from "../provider/AuthProvider";
import { Helmet } from "react-helmet";

const LogIn = () => {
  const { signIn, googleSignIn } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || location.state || "/";

  const handleLogin = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    signIn(email, password)
      .then(() => {
        setSuccess("Logged In Successfully");
        setTimeout(() => navigate(from, { replace: true }), 1000);
      })
      .catch(() => {
        setError("An error occurred");
      });
  };

  const handleGoogleSignIn = () => {
    setError("");
    setSuccess("");

    googleSignIn()
      .then(() => {
        setSuccess("Logged In Successfully");
        setTimeout(() => navigate(from, { replace: true }), 1000);
      })
      .catch(() => {
        setError("An error occurred");
      });
  };

  return (
    <div className="flex w-11/12 mx-auto mt-10 flex-1">
      {/* Title */}
      <Helmet>
        <title>Login - RoomRush</title>
      </Helmet>

      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              New to JobTrack?{" "}
              <NavLink
                to="/auth/register"
                className="font-semibold text-green-600 hover:text-green-700"
              >
                Register here
              </NavLink>
            </p>
          </div>

          {/* Success Alert */}
          {success && (
            <div className="rounded-md bg-green-50 p-4 my-4">
              <div className="flex">
                <div className="shrink-0">
                  <CheckCircleIcon
                    className="size-5 text-green-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {success}
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setSuccess("")}
                    className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                  >
                    <XMarkIcon className="size-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 my-4">
              <div className="flex">
                <div className="shrink-0">
                  <ExclamationTriangleIcon
                    className="size-5 text-yellow-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                <div className="mt-2 text-right">
                  <NavLink
                    to="/auth/forgot-password"
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    Forgot password?
                  </NavLink>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[rgba(11,130,5,1)]"
                >
                  Sign in
                </button>
              </div>
            </form>

            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm font-medium text-gray-500">
                  <span className="bg-white px-4">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGoogleSignIn}
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50"
                >
                  <FcGoogle className="h-5 w-5" />
                  <span>Google</span>
                </button>
              </div>

              <div className="mt-6 flex justify-center">
                <NavLink
                  to="/"
                  className="inline-flex items-center justify-center rounded-full bg-green-600 p-3 text-white shadow-sm hover:bg-green-700"
                  aria-label="Back to Home"
                  title="Back to Home"
                >
                  <IoReturnDownBackSharp className="h-5 w-5" />
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default LogIn;
