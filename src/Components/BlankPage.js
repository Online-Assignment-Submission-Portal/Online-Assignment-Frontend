// BlankPage.js
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const BlankPage = () => {
  const navigate = useNavigate();
  // const apiUrl = process.env.REACT_APP_BASE_URL || "http://localhost:8000"
  const apiUrl = window.location.hostname === 'localhost'
  ? "http://localhost:8000" : process.env.REACT_APP_BASE_URL;
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token available for logout.");
        navigate("/signin");
        return;
      }

      const response = await fetch(`${apiUrl}/user/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Logged out successfully.");
        localStorage.clear();
        navigate("/signin");
      } else {
        toast.error(data.message || "Failed to log out.");
      }
    } catch (error) {
      toast.error("An error occurred during logout.");
      // console.error("Error during logout:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* <ToastContainer position="top-center" autoClose={1500} /> */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Welcome to Your Dashboard
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Profile Details
        </h2>
        <p className="text-gray-600 mb-2">
          <span className="font-medium">First Name:</span>{" "}
          {"Not available"}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-medium">Last Name:</span>{" "}
          {"Not available"}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Email:</span>{" "}
          {"Not available"}
        </p>
        <button
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default BlankPage;
