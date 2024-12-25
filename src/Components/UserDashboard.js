import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UserDashboard = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [user, setUser] = useState(null); 
  const [error, setError] = useState(""); 


  useEffect(() => {
    const fetchUserData = async (id) => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          navigate("/signin");
          return;
        }
        console.log(id);
        const response = await axios.get(`http://localhost:8000/user/dashboard/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
         console.log('hello',response.data);
        if (response.data.success) {
          console.log("hello user");
          setUser(response.data.user);
        } else {
          console.log('KemCho Majama')
          setError("Failed to fetch user data.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.response?.data?.message || "An error occurred.");
        navigate("/signin");
      }
    };

    fetchUserData(id);
  }, [id, navigate]);

  const handleLogout = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
  
      if (!token) {
        navigate("/signin");
        return;
      }
  
      const response = await axios.post(
        "http://localhost:8000/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        document.cookie = "token=; path=/; expires=Wed, 01 Jan 2025 00:00:00 UTC;";
        navigate("/signin");
      } else {
        console.error("Logout failed:", response.data.message);
        setError(response.data.message || "Logout failed.");
      }
    } catch (err) {
      console.error("Error during logout:", err);
      setError(err.response?.data?.message || "An error occurred during logout.");
    }
  };
  

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate("/signin")}
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-center mb-4">Welcome, {user.firstName}!</h1>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Your Details:</h2>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p>
              <span className="font-semibold">Name:</span> {user.firstName} {user.lastName}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p>
            <span className="font-semibold">Role:</span> {user.role[0].toUpperCase() + user.role.slice(1)}
            </p>
            <p>
              <span className="font-semibold">Member Since:</span> {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
