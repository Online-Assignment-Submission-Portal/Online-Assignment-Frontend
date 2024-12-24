import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-blue-600 text-white shadow-lg py-4">
      <div className="container mx-auto px-6 flex flex-col items-center md:flex-row md:justify-between">
        <h2 className="text-2xl font-bold text-center md:text-left mb-4 md:mb-0">
          Welcome to Online File Submission Portal
        </h2>
        <nav className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 text-center md:text-left">
          <Link
            to="/signup"
            className="text-white hover:text-blue-300 transition duration-200 font-semibold"
          >
            Signup
          </Link>
          <Link
            to="/signin"
            className="text-white hover:text-blue-300 transition duration-200 font-semibold"
          >
            Signin
          </Link>
          <Link
            to="/admin-signin"
            className="text-white hover:text-blue-300 transition duration-200 font-semibold"
          >
            Are You an Admin?
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
