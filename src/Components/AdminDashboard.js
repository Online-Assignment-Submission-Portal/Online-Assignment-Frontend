import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch pending users when component mounts
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("adminToken="))
          ?.split("=")[1];

        if (!token) {
          navigate("/admin-signin");
          return;
        }

        const response = await axios.get("http://localhost:8000/admin/check", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPendingUsers(response.data);
      } catch (err) {
        setError("Unauthorized or session expired.");
        navigate("/admin-signin");
      }
    };

    fetchPendingUsers();
  }, [navigate, ]);

  // Handle logout
  const handleLogout = () => {
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    navigate("/admin-signin");
  };

  // Handle role confirmation (student/teacher)
  const handleConfirmRole = async (userId, role) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken="))
      ?.split("=")[1];

    if (!token) {
      setError("Token not found.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/admin/approve",
        { userId, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setPendingUsers(pendingUsers.filter(user => user._id !== userId)); // Remove the user from pending list
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to confirm role.");
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken="))
      ?.split("=")[1];

    if (!token) {
      setError("Token not found.");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:4000/admin/delete-user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setPendingUsers(pendingUsers.filter(user => user._id !== userId)); // Remove the deleted user from the list
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

        {/* Error Message */}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {/* Logout Button */}
        <div className="text-right mb-6">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-400"
          >
            Logout
          </button>
        </div>

        {/* Pending Users List */}
        <h2 className="text-2xl font-semibold mb-4">Pending Users</h2>
        <div className="space-y-4">
          {pendingUsers.length === 0 ? (
            <p className="text-center text-gray-500">No pending users.</p>
          ) : (
            pendingUsers.map((user) => (
              <div key={user._id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-semibold">{user.firstName} {user.lastName}</p>
                  <p className="text-gray-600">{user.email}</p>
                </div>

                {/* Action Buttons */}
                <div className="space-x-2">
                  <button
                    onClick={() => handleConfirmRole(user._id, "student")}
                    className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-400"
                  >
                    Confirm as Student
                  </button>
                  <button
                    onClick={() => handleConfirmRole(user._id, "teacher")}
                    className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-400"
                  >
                    Confirm as Teacher
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-400"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
