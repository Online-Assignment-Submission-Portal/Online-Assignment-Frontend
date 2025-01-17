import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative bg-gray-900 text-white"
      style={{
        backgroundImage: "url('https://www.bitmesra.ac.in/UploadedDocuments/user_pratyush_869/Header/Header295e75781b0f4b19b292cba095f2d310_Institute_Building.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="relative z-10 text-center">
        <h1 className="text-6xl font-bold text-blue-400 mb-6">404</h1>
        <h2 className="text-2xl font-semibold mb-4">This Page Doesn't Exist</h2>
        <p className="text-lg mb-8 text-gray-300">
          The page you're looking for might have been removed or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-300"
        >
          Back to Home Page
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
