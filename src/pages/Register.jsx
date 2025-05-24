import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { IoReturnDownBackSharp } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from '../provider/AuthProvider';
import {
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/20/solid";
import { Helmet } from 'react-helmet';

const Register = () => {
  const { createUser, googleSignIn, updateUserProfile } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Helper function to validate URL and check if it's an image
  const isValidImageUrl = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('Content-Type');
      return contentType.startsWith('image/');
    } catch {
      return false;
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const photoURL = form.photoURL.value;
    const email = form.email.value;
    const password = form.password.value;

    // Reset previous error/success messages
    setError('');
    setSuccess('');

    // Validate photo URL if provided
    if (photoURL) {
      try {
        const isValid = await isValidImageUrl(photoURL);
        if (!isValid) {
          setError('Please provide a valid image URL');
          return;
        }
      } catch (error) {
        setError('Invalid image URL');
        return;
      }
    }

    // Password validation
    if (!/(?=.*[A-Z])/.test(password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }
    if (!/(?=.*[a-z])/.test(password)) {
      setError('Password must contain at least one lowercase letter');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const userCredential = await createUser(email, password);
      
      // Always update profile to ensure Firebase auth is updated
      await updateUserProfile(name, photoURL);
      
      // Create user profile in backend
      await createUserProfile(userCredential.user, name, photoURL);
      
      setSuccess('Registration successful!');
      setTimeout(() => {
        navigate('/');
        window.location.reload(); // Reload to ensure profile image is updated
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed');
    }
  };

  // Function to create user profile in backend
  const createUserProfile = async (user, name, photoURL) => {
    try {
      const token = await user.getIdToken();
      const response = await fetch('http://localhost:5001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: user.email,
          displayName: name,
          photoURL: photoURL,
          preferences: {
            notifications: true,
            emailUpdates: true
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create user profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  const handleGoogleSignIn = () => {
    googleSignIn()
      .then(result => {
        setSuccess('You are now Registered');
        setTimeout(() => navigate('/'), 1000);
      })
      .catch(error => {
        setError('Registration Failed');
       
      });
  };

  return (
    <div className="flex w-11/12 mx-auto mt-10 flex-1">
      <Helmet>
    <title>Registration - RoomRush</title>
  </Helmet>
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Already registered?{' '}
              <NavLink to="/auth/login" className="font-semibold text-green-600 hover:text-green-700">
                Sign in
              </NavLink>
            </p>
          </div>

          {/* Success Alert */}
          {success && (
            <div className="rounded-md bg-green-50 p-4 mb-4">
              <div className="flex">
                <div className="shrink-0">
                  <CheckCircleIcon
                    className="size-5 text-green-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{success}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setSuccess('')}
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
            <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 mb-4">
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
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                  Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="photoURL" className="block text-sm font-medium text-gray-900">
                  Profile Photo URL
                </label>
                <div className="mt-2">
                  <input
                    id="photoURL"
                    name="photoURL"
                    type="url"
                    placeholder="https://example.com/your-photo.jpg"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Enter a valid image URL for your profile photo
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="new-password"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Password must contain at least one uppercase letter, one lowercase letter, and be at least 6 characters long.
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[rgba(11,130,5,1)]"
                >
                  Register
                </button>
              </div>
            </form>

            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm font-medium text-gray-500">
                  <span className="bg-white px-4">Or sign up with</span>
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
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Register;
