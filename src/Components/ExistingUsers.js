import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ExistingUsers = () => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("adminToken="))
          ?.split("=")[1];

        if (!token) {
          navigate("/admin-signin");
          return;
        }

        const response = await axios.get("http://localhost:8000/admin/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStudents(response.data.students || []);
        setTeachers(response.data.teachers || []);
      } catch (err) {
        setError("Failed to fetch users. Please try again.");
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    );
    if (!confirmDelete) return;

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken="))
      ?.split("=")[1];

    if (!token) {
      setError("Unauthorized access. Please log in.");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:8000/admin/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setStudents(students.filter((user) => user._id !== userId));
        setTeachers(teachers.filter((user) => user._id !== userId));
      } else {
        setError("Failed to delete user.");
      }
    } catch (err) {
      setError("Error occurred while deleting the user.");
    }
  };

  const handleLogout = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("adminToken="))
        ?.split("=")[1];

      if (!token) {
        navigate("/admin-signin");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/admin/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        navigate("/admin-signin");
      }
    } catch (err) {
      setError("Unauthorized or session expired.");
      navigate("/admin-signin");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full w-4/5">
      <div className="flex justify-between">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500 transition"
          >
            Back to Dashboard
          </button>
          <div></div>
          <button
            onClick={handleLogout}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-500 transition"
          >
            Logout
          </button>
        </div>
        <h2 className="text-3xl font-bold text-center mb-6">Existing Users</h2>
        

        {error && (
          <div className="bg-red-600 text-white py-2 px-4 rounded-md mb-4">
            {error}
          </div>
        )}
  
      
      <div className="flex justify-between  mb-8">
      
        <div className="w-[45%]  justify-between items-center h-96 overflow-y-auto">
          <div><h3 className="text-xl font-bold mb-4">Students</h3></div>
        {students.length === 0 ? (
          <p className="text-center">No students found.</p>
        ) : (
          <table className="table-auto w-full text-left text-sm bg-gray-700 rounded-lg overflow-hidden mb-6">
            <thead className="bg-green-700">
              <tr>
                <th className="px-4 py-2 text-center">Name</th>
                <th className="px-4 py-2 text-center">Email</th>
                <th className="px-4 py-2 text-center">Delete User</th>
              </tr>
            </thead>
            <tbody>
              {students.map((user) => (
                <tr
                  key={user._id}
                  className="odd:bg-gray-600 even:bg-gray-700 items-center text-center"
                >
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-600 text-white py-1 px-4 rounded-md hover:bg-red-500 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        </div>

        <div className="w-[45%] h-96  justify-between items-center overflow-y-auto">
        <div><h3 className="text-xl font-bold mb-4">Teachers</h3></div>
        {teachers.length === 0 ? (
          <p className="text-center">No teachers found.</p>
        ) : (
          <table className="table-auto w-full text-left text-sm bg-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-green-700">
              <tr>
                <th className="px-4 py-2 text-center">Name</th>
                <th className="px-4 py-2 text-center">Email</th>
                <th className="px-4 py-2 text-center">Delete User</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((user) => (
                <tr
                  key={user._id}
                  className="odd:bg-gray-600 even:bg-gray-700 items-center text-center"
                >
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-600 text-white py-1 px-4 rounded-md hover:bg-red-500 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        </div>
      </div>

      </div>
    </div>
  );
};

export default ExistingUsers;
