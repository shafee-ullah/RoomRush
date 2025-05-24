import React from "react";
import logoImg from "../assets/icons8-room-100 (1).png";
import { NavLink } from "react-router";
import { FaFacebook, FaTwitterSquare, FaYoutube, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img src={logoImg} className="w-8 h-8" alt="Logo" />
              <NavLink to="/" className="text-xl font-bold ml-2">
                RoomRush
              </NavLink>
            </div>
            <p className="text-gray-400 text-sm">
              Find your perfect roommate and ideal living space with RoomRush. We make the process of finding compatible roommates simple and secure.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <nav className="space-y-3">
              <NavLink to="/" className="block text-gray-400 hover:text-white transition-colors">
                Home
              </NavLink>
              <NavLink to="/find-roommate" className="block text-gray-400 hover:text-white transition-colors">
                Add Listing
              </NavLink>
              <NavLink to="/browse-listings" className="block text-gray-400 hover:text-white transition-colors">
                Browse Listings
              </NavLink>
              <NavLink to="/my-listings" className="block text-gray-400 hover:text-white transition-colors">
                My Listings
              </NavLink>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-400">
                <FaMapMarkerAlt className="mr-2" />
                <span>123 Room Street, Apartment City</span>
              </div>
              <div className="flex items-center text-gray-400">
                <FaPhone className="mr-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-400">
                <FaEnvelope className="mr-2" />
                <span>support@roomrush.com</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook size={24} />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitterSquare size={24} />
              </a>
              <a href="https://www.youtube.com" className="text-gray-400 hover:text-white transition-colors">
                <FaYoutube size={24} />
              </a>
              <a href="https://www.linkedin.com" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} RoomRush. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
