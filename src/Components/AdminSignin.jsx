import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from './Footer';
import Header from "./Header";

const AdminSignin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // const apiUrl = process.env.REACT_APP_BASE_URL || "http://localhost:8000"
  const apiUrl = window.location.hostname === 'localhost'
    ? "http://localhost:8000" : import.meta.env.VITE_APP_BASE_URL;
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/admin/signin`, {
        email,
        password,
      });

      if (response.data.success) {
        document.cookie = `adminToken=${response.data.token}; path=/;`;
        // navigate("/admin-dashboard");
        toast.success("Login successful! Redirecting to dashboard...");
        setTimeout(() => {
          navigate("/admin-dashboard");
        }, 1500); // Redirect after 1.5 seconds

      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Please try again.");
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col">
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white"
          style={{
            backgroundImage: "url('https://media.licdn.com/dms/image/v2/C511BAQHoPIk0tnbfaQ/company-background_10000/company-background_10000/0/1583941043537/training_and_placement_division_bit_mesra_cover?e=2147483647&v=beta&t=PhznJQB4Zk_YWU-z95Pds5orGyAgG21Vz20konwsZCA')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}>
          {/* <ToastContainer position="top-center" autoClose={1500} /> */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
            {error && (
              <div className="bg-red-600 text-white text-center py-2 px-4 mb-4 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-4">

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

                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-md font-bold transition"
                >
                  {loading ? "Signing In..." : "Sign In"}
                  </button>
              </form>
              <button
                onClick={() => navigate("/")}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md font-bold transition"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AdminSignin;
