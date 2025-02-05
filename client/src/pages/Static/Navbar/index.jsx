import React, { useState } from "react";
import { Logo } from "../../../assets/constant";
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";
import { PiArrowUpRightBold } from "react-icons/pi";
import { HiMenu } from "react-icons/hi";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      {/* Fixed Navbar */}
      <div className={`${window.innerWidth <= 768
          ? 'fixed top-0 left-0 w-full bg-white z-50 shadow-md'
          : 'relative'
        }`}>
        <div className="custom-container">
          <nav className="flex items-center justify-between px-0 md:px-6 py-4">
            {/* Logo */}
            <div>
              <Logo className="w-28 h-auto sm:w-24 md:w-28 lg:w-32" />
            </div>

            {/* Regular Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#portfolio" className="text-gray-700 hover:text-gray-900">
                Portfolio
              </a>
              <a href="#gallery" className="text-gray-700 hover:text-gray-900">
                Gallery
              </a>
              <a href="#contact" className="text-gray-700 hover:text-gray-900">
                Contact Us
              </a>
              <Link to="/login" >
                <button className="px-4 py-3 text-sm bg-[#996830] text-white rounded-lg flex items-center space-x-2">
                  <span>Login</span>
                  <PiArrowUpRightBold />
                </button>
              </Link>
            </div>

            {/* Hamburger Button */}
            <button
              className="block md:hidden text-gray-700 focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <FaXmark className="text-2xl text-[#996830]" />
              ) : (
                <HiMenu className="text-3xl text-[#996830]" />
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Menu with Sliding Transition */}
      <div
        className={`w-[300px] md:hidden fixed top-0 right-0 h-full bg-white z-50 transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 shadow-lg`}
      >
        {/* Close Button */}
        <button
          className="absolute top-6 left-4 text-2xl text-[#996833] border-[#996833] border w-10 h-10 flex items-center justify-center rounded-full focus:outline-none"
          onClick={toggleMenu}
        >
          <IoClose />
        </button>

        {/* Links */}
        <div className="flex flex-col items-center py-24 h-[90%] space-y-4 mt-0 ">
          <a
            href="#portfolio"
            className="px-4 py-2 border text-center w-[170px] border-[#996833] text-[#996833] rounded-lg text-lg hover:bg-[#996833] hover:text-white transition"
            onClick={toggleMenu}
          >
            Portfolio
          </a>
          <a
            href="#gallery"
            className="px-4 py-2 border text-center w-[170px] border-[#996833] text-[#996833] rounded-lg text-lg hover:bg-[#996833] hover:text-white transition"
            onClick={toggleMenu}
          >
            Gallery
          </a>
          <a
            href="#contact"
            className="px-4 py-2 border text-center w-[170px] border-[#996833] text-[#996833] rounded-lg text-lg hover:bg-[#996833] hover:text-white transition"
            onClick={toggleMenu}
          >
            Contact Us
          </a>
          <button
            className="px-4 py-2 text-center w-[170px] bg-[#996833] text-white rounded-lg text-lg hover:bg-[#8B5D33] transition"
            onClick={toggleMenu}
          >
            Login
          </button>
        </div>

        {/* Footer Line */}
        <div className="absolute bottom-0 left-0 w-full border-t border-gray-300 text-center text-[9px] py-3 text-[#4444]">
          2022 Inteo - Award-winning studio. Made with love by{" "}
          <span className="text-[#996833]">Landify</span>
          <div className="flex justify-center align-center gap-2">
            <span className="font-semibold text-[#4444]">CONNECT</span>
            <div className="w-[35px] h-[1px] bg-[#444444] mt-2"></div>
            <div className="flex gap-2">
              <a href="" className="text-[#996833]">
                <FaInstagram />
              </a>
              <a href="" className="text-[#996833]">
                <FaFacebook />
              </a>
              <a href="" className="text-[#996833]">
                <FaYoutube />
              </a>
              <a href="" className="text-[#996833]">
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
