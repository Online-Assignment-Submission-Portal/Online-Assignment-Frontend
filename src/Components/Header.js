import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md relative z-50">
      <div className="container mx-auto px-6 flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold tracking-wide">
          Online File Submission Portal
        </h1>

        <button
          className="text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>
      <nav
        className={`absolute top-full left-0 w-full bg-gradient-to-r from-blue-600 to-blue-800 ${isMenuOpen ? "block" : "hidden"
          }`}
      >
        <ul className="flex flex-col items-center space-y-4 py-4">
          <li>
            <Link
              to="/signup"
              className="text-white font-semibold relative group"
            >
              Sign Up
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-300 scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
          </li>
          <li>
            <Link
              to="/signin"
              className="text-white font-semibold relative group"
            >
              Sign In
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-300 scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin-signin"
              className="text-white font-semibold relative group"
            >
              Are You an Admin?
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-300 scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
