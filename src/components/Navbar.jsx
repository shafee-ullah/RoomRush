import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import { useTheme } from "../provider/ThemeProvider";
import { FaUser, FaSignOutAlt, FaHome, FaSearch, FaPlus, FaList, FaUserCircle, FaSun, FaMoon } from "react-icons/fa";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  console.log('Navbar - Current theme:', isDarkMode ? 'dark' : 'light');

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

  const handleThemeToggle = () => {
    console.log('Theme toggle clicked');
    console.log('Current theme before toggle:', isDarkMode ? 'dark' : 'light');
    toggleTheme();
  };

  return (
    <nav className="bg-background-light dark:bg-secondary-800 shadow-lg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">RoomRush</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="nav-link px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <FaHome className="mr-2" />
              Home
            </Link>
            <Link to="/browse-listings" className="nav-link px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <FaSearch className="mr-2" />
              Browse
            </Link>
            {user && (
              <>
                <Link to="/find-roommate" className="nav-link px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <FaPlus className="mr-2" />
                  Add Listing
                </Link>
                <Link to="/my-listings" className="nav-link px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <FaList className="mr-2" />
                  My Listings
                </Link>
              </>
            )}
          </div>

          {/* User Menu and Theme Toggle */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-lg text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-200"
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
                  className="flex items-center space-x-2 text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <FaUserCircle className="h-8 w-8 text-secondary-400" />
                  )}
                  <span className="text-sm font-medium">
                    {userProfile?.displayName || user.displayName || user.email.split('@')[0]}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-background-light dark:bg-secondary-800 rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FaUser className="mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/auth/login" className="nav-link px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/auth/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none"
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
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="nav-link block px-3 py-2 rounded-md text-base font-medium flex items-center">
              <FaHome className="mr-2" />
              Home
            </Link>
            <Link to="/browse-listings" className="nav-link block px-3 py-2 rounded-md text-base font-medium flex items-center">
              <FaSearch className="mr-2" />
              Browse
            </Link>
            {user && (
              <>
                <Link to="/find-roommate" className="nav-link block px-3 py-2 rounded-md text-base font-medium flex items-center">
                  <FaPlus className="mr-2" />
                  Add Listing
                </Link>
                <Link to="/my-listings" className="nav-link block px-3 py-2 rounded-md text-base font-medium flex items-center">
                  <FaList className="mr-2" />
                  My Listings
                </Link>
                <Link to="/profile" className="nav-link block px-3 py-2 rounded-md text-base font-medium flex items-center">
                  <FaUser className="mr-2" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="nav-link block w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </>
            )}
            {!user && (
              <>
                <Link to="/auth/login" className="nav-link block px-3 py-2 rounded-md text-base font-medium">
                  Login
                </Link>
                <Link to="/auth/register" className="btn-primary block px-3 py-2 rounded-md text-base font-medium">
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
