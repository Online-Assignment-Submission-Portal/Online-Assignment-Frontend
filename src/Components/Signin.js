import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8000/user/signin", {
        email,
        password,
      });
      console.log(response);
      if (response.data.success) {
        const { token, user } = response.data;
        console.log(token, user._id)
        document.cookie = `token=${token}; path=/`;
        const id = user._id;
        navigate(`/dashboard/${id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
      console.error("Signin error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        {error && (
          <div className="bg-red-600 text-white text-center py-2 px-4 mb-4 rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSignin} className="space-y-4">
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
          <p className="text-right text-sm mt-4">
          <a href="/forgot-password" className="text-end text-blue-400 hover:underline">
            Forgot Password?
          </a>
        </p>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-md font-bold transition"
          >
            Sign In
          </button>
        <button
          onClick={() => navigate("/")}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-bold transition"
        >
          Go to Home
        </button>
        </form>
        <p className="text-center text-sm mt-4">
          Not a user?{" "}
          <a href="/signup" className="text-green-400 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signin;
