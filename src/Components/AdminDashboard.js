import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from './Footer';

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [error, setError] = useState("");
  const [selectedRoles, setSelectedRoles] = useState({});
  // const apiUrl = process.env.REACT_APP_BASE_URL || "http://localhost:8000"
  const apiUrl = window.location.hostname === 'localhost'
  ? "http://localhost:8000" : process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("adminToken="))
          ?.split("=")[1];

        if (!token) {
          toast.error("Unauthorized access. Please log in.");
          navigate("/admin-signin");
          return;
        }

        const response = await axios.get(`${apiUrl}/admin/check`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPendingUsers(response.data);
      } catch (err) {
        toast.error("Unauthorized or session expired.");
        navigate("/admin-signin");
      }
    };

    fetchPendingUsers();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("adminToken="))
        ?.split("=")[1];

      if (!token) {
        toast.error("Please sign in.");
        setTimeout(() => navigate("/admin-signin"), 1500);
        return;
      }

      const response = await axios.post(
        `${apiUrl}/admin/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        toast.success("Logout successful!");
        setTimeout(() => navigate("/admin-signin"), 1500);
      }
    } catch (err) {
      toast.error("Failed to log out. Please try again.");
      navigate("/admin-signin");
    }
  };

  const handleConfirmRole = async (userId) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken="))
      ?.split("=")[1];

    if (!token) {
      toast.error("Token not found. Please log in.");
      return;
    }

    const role = selectedRoles[userId];
    if (!role) {
      toast.warning("Please select a role before confirming.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/admin/approve`,
        { userId, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setPendingUsers(pendingUsers.filter((user) => user._id !== userId));
        setSelectedRoles((prev) => {
          const updatedRoles = { ...prev };
          delete updatedRoles[userId];
          return updatedRoles;
        });
        toast.success("Role confirmed successfully!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to confirm role.");
    }
  };

  const handleDeleteUser = async (userId) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken="))
      ?.split("=")[1];

    if (!token) {
      toast.error("Token not found. Please log in.");
      return;
    }

    try {
      const response = await axios.delete(
        `${apiUrl}/admin/deletependinguser/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setPendingUsers(pendingUsers.filter((user) => user._id !== userId));
        toast.success("User deleted successfully!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <ToastContainer position="top-center" autoClose={1500} />
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

        {error && (
          <div className="bg-red-600 text-white py-2 px-4 rounded-md mb-4">
            {error}
          </div>
        )}

        <h3 className="text-xl font-semibold mb-4">Pending Users</h3>

        {pendingUsers.length === 0 ? (
          <p className="text-center">No pending users.</p>
        ) : (
          <table className="table-auto w-full text-left text-sm bg-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-green-700">
              <tr>
                <th className="px-4 py-2 text-center">Name</th>
                <th className="px-4 py-2 text-center">Email</th>
                <th className="px-4 py-2 text-center">Set role</th>
                <th className="px-4 py-2 text-center">Options</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user) => (
                <tr key={user._id} className="odd:bg-gray-600 even:bg-gray-700 text-center">
                  <td className="px-4 py-2">{`${user.firstName} ${user.lastName}`}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-between">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`role-${user._id}`}
                          value="student"
                          checked={selectedRoles[user._id] === "student"}
                          onChange={() =>
                            setSelectedRoles((prev) => ({
                              ...prev,
                              [user._id]: "student",
                            }))
                          }
                          className="mr-2"
                        />
                        Student
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`role-${user._id}`}
                          value="teacher"
                          checked={selectedRoles[user._id] === "teacher"}
                          onChange={() =>
                            setSelectedRoles((prev) => ({
                              ...prev,
                              [user._id]: "teacher",
                            }))
                          }
                          className="mr-2"
                        />
                        Teacher
                      </label>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleConfirmRole(user._id)}
                        className="bg-green-600 text-white py-1 px-4 rounded-md hover:bg-green-500 transition"
                      >
                        Confirm role
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-600 text-white py-1 px-4 rounded-md hover:bg-red-500 transition"
                      >
                        Delete user
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate("/existing-users")}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500 transition"
          >
            See Existing Users
          </button>

          <button
            onClick={handleLogout}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-rose-500 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default AdminDashboard;
