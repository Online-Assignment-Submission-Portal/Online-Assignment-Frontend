import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminSignin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAdminSignin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/admin/login", { email, password });
      if (response.status === 200) {
        console.log("Admin Signin successful:", response.data);
        navigate("/admin-dashboard");
      }
    } catch (err) {
      setError("Invalid admin credentials. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Sign In</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleAdminSignin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded transition duration-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignin;
