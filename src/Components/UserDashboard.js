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
          return navigate("/signin");
        }

        const response = await axios.get(
          `http://localhost:8000/user/dashboard/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("DASHBOARD ");
        console.log(response);
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          setError("Failed to fetch user data.");
        }
      } catch (err) {
        console.log("error is", err)
        if (err.response && err.response.status === 401) {
          navigate("/signin");
        } else {
          setError(err.response?.data?.message || "An error occurred.");
        }
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
        document.cookie =
          "token=; path=/; expires=Wed, 01 Jan 2025 00:00:00 UTC;";
        navigate("/signin");
      } else {
        setError(response.data.message || "Logout failed.");
      }
    } catch (err) {
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
    <div className="min-h-screen bg-gray-900 text-gray-200 flex justify-center">
      <div className="bg-gray-800 p-6 shadow-lg w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-center mb-4">
            Welcome, {user.firstName}!
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg"
          >
            Logout
          </button>
        </div>

        <div className="mb-4 w-1/3">
          <h2 className="text-lg font-semibold mb-2">Your Details:</h2>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-300">
              <span className="font-semibold text-gray-200">Name:</span> {user.firstName}{" "}
              {user.lastName}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold text-gray-200">Email:</span> {user.email}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold text-gray-200">Role:</span>{" "}
              {user.role[0].toUpperCase() + user.role.slice(1)}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold text-gray-200">Member Since:</span>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {user.role === "teacher" && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => navigate("/add-subject", { state: { teacherId: user.id } })}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
          >
            + Add Subject
          </button>
        </div>
      )}

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Your Subjects
          </h2>
          <div className="grid grid-cols-1 bg-[#64748b] sm:grid-cols-2 lg:grid-cols-4 gap-6 h-80 flex justify-center items-center overflow-y-auto">
          {user.subjectDetails && user.subjectDetails.length > 0 ? (
            user.subjectDetails.map((subject, index) => (
              <div
                key={index}
                className="bg-gray-700 p-4 rounded-lg h-64 w-56 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" onClick={async () => {
                  try {
                    const response = await axios.get(
                      `http://localhost:8000/subject/${subject.subjectId}`
                    );
                    if (response.status === 200 && response.data) {
                      navigate(`/subject/${subject.subjectId}`, { state: { subject: response.data } });
                    }
                  } catch (err) {
                    if (err.response && err.response.status === 404) {
                      console.log("backend me problem hai");
                      alert("Subject details not found.");
                    } else {
                      console.error(err);
                      alert("An error occurred while fetching subject details.");
                    }
                  }
                }}
              >
                <p className="text-black-800 h-1/2 bg-[#3b82f6] rounded-md flex items-center justify-center">
                  <span className="font-semibold text-gray-200"></span>{" "}
                  {subject.subjectName}
                </p>
                <p className=" mt-1 rounded-md h-1/2 bg-[#8b5cf6] flex items-center justify-center">
                  <span className="font-semibold "></span>{" "}
                  {subject.teacherName}
                </p>
                {/* <p className="text-gray-300">
                <span className="font-semibold text-gray-200">Subject ID:</span>{" "}
                {subject.subjectId} 
                </p> */}
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-300">No subjects found.</p>
          )}
        </div>

        </div>

        

      </div>
    </div>
  );
};

export default UserDashboard;