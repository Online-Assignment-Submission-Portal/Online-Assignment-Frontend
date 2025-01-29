import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx"; // Import XLSX library

const ExistingUsers = () => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState("");
  // const apiUrl = process.env.REACT_APP_BASE_URL || "http://localhost:8000"
  const apiUrl = window.location.hostname === 'localhost'
    ? "http://localhost:8000" : process.env.REACT_APP_BASE_URL;
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
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

        const response = await axios.get(`${apiUrl}/admin/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStudents(response.data.students || []);
        setTeachers(response.data.teachers || []);
        toast.success("Users fetched successfully!");
      } catch (err) {
        toast.error("Failed to fetch users. Please try again.");
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleSearchInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      const filteredUsers = [...students, ...teachers].filter(user =>
        user.email.toLowerCase().includes(query)
      );
      setSuggestions(filteredUsers);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const user = suggestions.find(user => user.email.toLowerCase() === searchQuery);

    if (user) {
      handleViewUser(user._id);
    } else {
      toast.error("User not found.");
    }
  };

  const handleDownloadStudentsExcel = () => {
    const studentData = students.map((user) => ({
      Type: "Student",
      Name: user.name,
      Email: user.email,
    }));

    const worksheet = XLSX.utils.json_to_sheet(studentData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    XLSX.writeFile(workbook, "Students_List.xlsx");
  };


  const handleDownloadTeachersExcel = () => {
    const teacherData = teachers.map((user) => ({
      Type: "Teacher",
      Name: user.name,
      Email: user.email,
    }));

    const worksheet = XLSX.utils.json_to_sheet(teacherData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Teachers");

    XLSX.writeFile(workbook, "Teachers_List.xlsx");
  };

  const handleViewUser = async (userId) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("adminToken="))
        ?.split("=")[1];
      if (!token) {
        toast.error("Unauthorized access. Please log in.");
        return;
      }

      const response = await axios.get(
        `${apiUrl}/admin/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        navigate(`/profile/${userId}`, { state: { profile: response.data, userID: userId, userRole: 'admin' } });
      } else {
        toast.error("Failed to fetch profile data.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred during Profile view.");
    }
  };
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
      toast.error("Unauthorized access. Please log in.");
      navigate("/admin-signin");
      return;
    }

    try {
      const response = await axios.delete(
        `${apiUrl}/admin/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setStudents(students.filter((user) => user._id !== userId));
        setTeachers(teachers.filter((user) => user._id !== userId));
        toast.success("User deleted successfully!");
      } else {
        toast.error("Failed to delete user.");
      }
    } catch (err) {
      toast.error("Error occurred while deleting the user.");
    }
  };

  const handleLogout = async () => {
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
        toast.success("Logged out successfully!");
        navigate("/admin-signin");
      }
    } catch (err) {
      toast.error("Unauthorized or session expired.");
      navigate("/admin-signin");
    }
  };

  return (
    <div className="sm:w-full min-h-screen bg-gray-900 text-white lg:flex lg:flex-col lg:items-center py-10">
      {/* <ToastContainer position="top-center" autoClose={1500} /> */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full mx-auto">
        <div className="flex flex-row justify-between mb-4 font-semibold">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500 transition mb-2 sm:mb-0"
          >
            Back to Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-rose-500 transition mb-2 sm:mb-0"
          >
            Logout
          </button>
        </div>


        {/* Search bar */}
        <div className="mb-6 w-full max-w-md mx-auto relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Search by email..."
            />
            {suggestions.length > 0 && (
              <ul className="absolute top-12 left-0 w-full bg-white text-black rounded-md shadow-lg z-10">
                {suggestions.map(user => (
                  <li
                    key={user._id}
                    className="px-4 py-2 hover:bg-gray-300 cursor-pointer"
                    onClick={() => handleViewUser(user._id)}
                  >
                    {user.email}
                  </li>
                ))}
              </ul>
            )}
          </form>
        </div>


        <h2 className="text-3xl font-bold text-center mb-6">Existing Users</h2>

        <div className="sm:w-full lg:flex lg:justify-between mb-8">
          <div className="sm:mt-4 md:mt-4 lg:w-[45%] justify-between items-center h-96 overflow-y-scroll scrollbar-none lg:pt-2 mb-6">
            <div className="flex justify-between gap-4">
              <h3 className="text-xl font-bold mb-4">Students</h3>
              <button
                onClick={handleDownloadStudentsExcel}
                className="mb-4 mr-3 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-green-500 font-semibold hover:scale-[103%] transition-transform"
              >
                Download Students List
              </button>
            </div>
            {students.length === 0 ? (
              <p className="text-center">No students found.</p>
            ) : (
              <table className="table-auto w-full text-left text-sm bg-gray-700 rounded-lg overflow-hidden mb-6">
                <thead className="bg-green-700">
                  <tr>
                    <th className="px-4 py-2 text-center">Name</th>
                    <th className="px-4 py-2 text-center">Email</th>
                    <th className="px-4 py-2 text-center">Profile</th>
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
                          onClick={() => handleViewUser(user._id)}
                          className="bg-green-600 text-white py-1 px-4 rounded-md hover:bg-green-500 transition"
                        >
                          View
                        </button>
                      </td>
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

          <div className="sm:mt-4 md:mt-4 lg:w-[45%] justify-between items-center h-96 overflow-y-scroll scrollbar-none lg:pt-2 mb-6">
            <div className="flex justify-between gap-4">
              <h3 className="text-xl font-bold mb-4">Teachers</h3>
              <button
                onClick={handleDownloadTeachersExcel}
                className="mb-4 mr-3 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-green-500 font-semibold hover:scale-[103%] transition-transform"
              >
                Download Teachers List
              </button>
            </div>
            {teachers.length === 0 ? (
              <p className="text-center">No teachers found.</p>
            ) : (
              <table className="table-auto w-full text-left text-sm bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-green-700">
                  <tr>
                    <th className="px-4 py-2 text-center">Name</th>
                    <th className="px-4 py-2 text-center">Email</th>
                    <th className="px-4 py-2 text-center">Profile</th>
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
                          onClick={() => handleViewUser(user._id)}
                          className="bg-green-600 text-white py-1 px-4 rounded-md hover:bg-green-500 transition"
                        >
                          View
                        </button>
                      </td>
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
