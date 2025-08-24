import React from 'react';
import { FaHome, FaUsers, FaShieldAlt, FaSearch } from 'react-icons/fa';
import { Helmet } from "react-helmet";

const About = () => {
  const features = [
    {
      icon: <FaHome className="w-6 h-6 text-blue-500" />,
      title: "Find Perfect Housing",
      description: "Discover ideal living spaces that match your preferences and budget. Browse through a wide selection of rooms and apartments."
    },
    {
      icon: <FaUsers className="w-6 h-6 text-green-500" />,
      title: "Connect with Roommates",
      description: "Meet potential roommates who share your lifestyle and interests. Our platform helps you find compatible living partners."
    },
    {
      icon: <FaShieldAlt className="w-6 h-6 text-purple-500" />,
      title: "Secure and Trusted",
      description: "Your safety is our priority. All listings and users are verified to ensure a secure and trustworthy environment."
    },
    {
      icon: <FaSearch className="w-6 h-6 text-red-500" />,
      title: "Easy Search",
      description: "Advanced search features help you filter and find exactly what you're looking for quickly and efficiently."
    }
  ];

  const stats = [
    { number: "1000+", label: "Active Listings" },
    { number: "5000+", label: "Happy Users" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-200">
      <Helmet>
        <title>About Us - RoomRush</title>
      </Helmet>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              About RoomRush
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-blue-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Your trusted platform for finding the perfect roommate and ideal living space.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-white dark:from-gray-900"></div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            At RoomRush, we're committed to revolutionizing how people find roommates and living spaces. 
            Our platform is designed to make the process simple, secure, and successful for everyone.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600 dark:bg-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white">{stat.number}</div>
                <div className="mt-2 text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How RoomRush Works</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">1</div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Create an Account</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Sign up for free and create your profile with your preferences and requirements.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">2</div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Browse Listings</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Search through available listings or post your own listing to find the perfect match.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">3</div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Connect & Move In</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Connect with potential roommates, finalize details, and start your new living arrangement.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
