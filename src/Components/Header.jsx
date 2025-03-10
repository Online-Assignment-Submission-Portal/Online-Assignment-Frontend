import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-50 text-white shadow-md transition-all duration-300 hover:brightness-110">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 transition-all duration-500"></div>

      <div className="relative container mx-auto px-6 flex items-center justify-between py-5">
        <h1 className="text-3xl font-extrabold tracking-wide drop-shadow-lg select-none">CollegeHub</h1>
        <nav className="hidden md:flex space-x-8">
          {[
            { path: "/", label: "Home" },
            { path: "/signup", label: "Sign Up" },
            { path: "/signin", label: "Sign In" },
            { path: "/admin-signin", label: "Are You an Admin?" },
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className="relative text-lg font-semibold tracking-wide group transform transition-all duration-300 hover:text-yellow-300 hover:drop-shadow-lg hover:-translate-y-1"
            >
              {label}
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-yellow-300 scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden text-white focus:outline-none transition-transform duration-300 hover:scale-110"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      <div
        className={`md:hidden absolute top-full left-0 w-full bg-gradient-to-r from-blue-700 to-indigo-800 transition-all duration-500 overflow-hidden ${isMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <ul className="flex flex-col items-center space-y-5 py-6">
          {[
            { path: "/", label: "Home" },
            { path: "/signup", label: "Sign Up" },
            { path: "/signin", label: "Sign In" },
            { path: "/admin-signin", label: "Are You an Admin?" },
          ].map(({ path, label }) => (
            <li key={path}>
              <Link
                to={path}
                className="block text-lg font-semibold tracking-wide relative group transform transition-all duration-300 hover:text-yellow-300 hover:drop-shadow-lg hover:-translate-y-1"
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-yellow-300 scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;
