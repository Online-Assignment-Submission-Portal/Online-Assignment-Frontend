import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md py-4">
      <div className="container mx-auto flex flex-col items-center md:flex-row md:justify-between">
        <h2 className="text-2xl font-bold mb-2 md:mb-0">
          Welcome to Online File Submission Portal
        </h2>
        <nav className="flex space-x-6">
          <Link
            to="/signup"
            className="text-white hover:text-blue-300 transition duration-200"
          >
            Signup | 
          </Link>
          <Link
            to="/signin"
            className="text-white hover:text-blue-300 transition duration-200"
          >
            Signin |
          </Link>
          <Link
            to="/admin-signin"
            className="text-white hover:text-blue-300 transition duration-200"
          >
            Are You an Admin?
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
