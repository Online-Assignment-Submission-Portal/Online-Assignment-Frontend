// BlankPage.jsx
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useStore from "../lib/useStore";
import axios from "axios";

const BlankPage = () => {
  const navigate = useNavigate();
  // const apiUrl = process.env.REACT_APP_BASE_URL || "http://localhost:8000"
  const apiUrl =
    window.location.hostname === "localhost"
      ? "http://localhost:8000"
      : import.meta.env.VITE_APP_BASE_URL;
  const { disconnectSocket, resetStore } = useStore();
  const handleLogout = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        toast.error("Please sign in.");
        return navigate("/signin");
      }

      const response = await axios.post(
        `${apiUrl}/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        document.cookie =
          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        localStorage.clear();
        resetStore();
        toast.success("Logout Successful");
        disconnectSocket();
        setTimeout(() => navigate(`/signin`), 1500);
        // setTimeout(() => navigate(`/dashboard/${user._id}`), 1500); // Redirect after 2 seconds
      } else {
        toast.error(response.data.message || "Logout failed.");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "An error occurred during logout."
      );
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
          <span className="font-medium">First Name:</span> {"Not available"}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-medium">Last Name:</span> {"Not available"}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Email:</span> {"Not available"}
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
