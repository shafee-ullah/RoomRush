import React from "react";
import logoImg from "../assets/icons8-job-100.png";
import { NavLink } from "react-router";
import { FaFacebook } from "react-icons/fa";
import { FaTwitterSquare } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";

const Footer = () => {
  return (
    <div>
      <footer className="footer footer-center bg-black text-primary-content p-10 flex flex-col gap-8">
        <aside className="text-center w-full">
          <div className="flex items-center justify-center">
            <img src={logoImg} className="w-8 h-8" alt="Logo" />
            <NavLink to="/" className="text-xl font-bold ml-2">
              RoomRush
            </NavLink>
          </div>
        </aside>

        <nav className="w-full">
          <div className="flex flex-wrap justify-center gap-8  font-medium">
            <NavLink to="/" className="link link-hover">
              Home
            </NavLink>
            <NavLink to="/about" className="link link-hover">
              About
            </NavLink>
            <NavLink to="/OurSuccess" className="link link-hover">
             Our Success Stories
            </NavLink>
            <NavLink to="/ContactUs" className="link link-hover">
              Contact Us
            </NavLink>
          </div>
        </nav>
       
        <div className="flex items-center justify-center gap-4">
          <a href="https://www.facebook.com/programmingHero/">
            <FaFacebook size={24} />
          </a>

          <a href="https://x.com/programminghero">
            <FaTwitterSquare size={24} />
          </a>

          <a href="https://www.youtube.com/c/ProgrammingHero">
            <FaYoutube size={24} />
          </a>

          <a href="https://bd.linkedin.com/company/programminghero">
            <FaLinkedin size={24} />
          </a>
        </div>
      </footer>
    </div>
  );
};


export default Footer;
