import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative bg-black text-white"
    >
      <div className="absolute inset-0 bg-black opacity-90"></div>

      <div className="relative z-10 text-center">
        <div className="mb-8">
          <img
            src="/Error.gif"
            alt="404 Not Found"
            className="w-80 h-80 object-contain mx-auto"
          />
        </div>

        <p className="text-lg mb-8 text-gray-400">
          Oops! The page you're looking for doesn't exist or is temporarily unavailable.
        </p>

        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-500 transition duration-300"
        >
          Back to Home Page
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
