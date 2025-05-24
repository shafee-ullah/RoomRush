// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../provider/AuthProvider";
import { useTheme } from "../provider/ThemeProvider";
import { FaUser, FaSignOutAlt, FaHome, FaSearch, FaPlus, FaList, FaUserCircle, FaSun, FaMoon, FaInfoCircle } from "react-icons/fa";
import logoImg from "../assets/icons8-room-100 (1).png";
const Navbar = () => {
  const { user, logOut } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const response = await fetch(`http://localhost:5001/users/${user.email}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setUserProfile(data);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleAuthRequired = (e, path) => {
    if (!user) {
      e.preventDefault();
      navigate("/auth/login", { state: path });
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src={logoImg} alt="RoomRush Logo" className="h-8 w-8 mr-2" />
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">RoomRush</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              <FaHome className="mr-2" />
              Home
            </Link>
            <Link to="/browse-listings" className="px-3 py-2 rounded-md text-sm font-medium flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              <FaSearch className="mr-2" />
              Browse
            </Link>
            <div className="relative group">
              <Link 
                to="/find-roommate" 
                onClick={(e) => handleAuthRequired(e, "/find-roommate")}
                className="px-3 py-2 rounded-md text-sm font-medium flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <FaPlus className="mr-2" />
                Add Listing
                {!user && (
                  <FaInfoCircle className="ml-1 text-gray-400 group-hover:text-blue-500" />
                )}
              </Link>
              {!user && (
                <div className="absolute hidden group-hover:block w-48 px-2 py-1 bg-gray-700 text-white text-xs rounded mt-1">
                  Login required to add listings
                </div>
              )}
            </div>
            <div className="relative group">
              <Link 
                to="/my-listings"
                onClick={(e) => handleAuthRequired(e, "/my-listings")}
                className="px-3 py-2 rounded-md text-sm font-medium flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <FaList className="mr-2" />
                My Listings
                {!user && (
                  <FaInfoCircle className="ml-1 text-gray-400 group-hover:text-blue-500" />
                )}
              </Link>
              {!user && (
                <div className="absolute hidden group-hover:block w-48 px-2 py-1 bg-gray-700 text-white text-xs rounded mt-1">
                  Login required to view your listings
                </div>
              )}
            </div>
          </div>

          {/* User Menu and Theme Toggle */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <FaSun className="h-5 w-5" />
              ) : (
                <FaMoon className="h-5 w-5" />
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <FaUserCircle className="h-8 w-8 text-gray-400" />
                  )}
                  <span className="text-sm font-medium">
                    {userProfile?.displayName || user.displayName || user.email.split('@')[0]}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FaUser className="mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/auth/login" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Login
                </Link>
                <Link to="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              <FaHome className="mr-2" />
              Home
            </Link>
            <Link to="/browse-listings" className="block px-3 py-2 rounded-md text-base font-medium flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              <FaSearch className="mr-2" />
              Browse
            </Link>
            <Link 
              to="/find-roommate"
              onClick={(e) => handleAuthRequired(e, "/find-roommate")}
              className="block px-3 py-2 rounded-md text-base font-medium flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <FaPlus className="mr-2" />
              Add Listing
              {!user && (
                <FaInfoCircle className="ml-1 text-gray-400" />
              )}
            </Link>
            <Link 
              to="/my-listings"
              onClick={(e) => handleAuthRequired(e, "/my-listings")}
              className="block px-3 py-2 rounded-md text-base font-medium flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <FaList className="mr-2" />
              My Listings
              {!user && (
                <FaInfoCircle className="ml-1 text-gray-400" />
              )}
            </Link>
            {user && (
              <>
                <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  <FaUser className="mr-2" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </>
            )}
            {!user && (
              <>
                <Link to="/auth/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Login
                </Link>
                <Link to="/auth/register" className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;