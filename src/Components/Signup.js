import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const userDetails = { firstName, lastName, email, password, confirmPassword, role };
    const userEmail = { email };

    try {
      const response = await axios.post("http://localhost:8000/user/signup", userDetails);
      if (response.status === 201) {
        const result = await axios.post("http://localhost:8000/user/sendotp", userEmail);
        if (result.status === 200) {
          navigate("/otp-verification", { state: { email } });
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message||"Signup failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 mt-3 mb-3 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        {error && (
          <div className="bg-red-600 text-white text-center py-2 px-4 mb-4 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-md font-bold transition"
          >
            Sign Up
          </button>
        <button
          onClick={() => navigate("/")}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-bold transition"
        >
          Go to Home
        </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already a user?{" "}
          <a href="/signin" className="text-green-400 hover:underline">
            Sign In
          </a>
        </p>
      </div>
     <ToastContainer position="top-center" autoClose={2500} />
    </div>
  );
};

export default Signup;
