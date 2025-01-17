import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import io from "socket.io-client";
const UserDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = io("http://localhost:8000", {
    transports: ['websocket'],
  });
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [joinMessage, setJoinMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState([]);
  const userId = id.toString();
  let userData;

  const fetchUserData = async (id) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        toast.error('Please sign in.');
        return navigate('/signin');
      }

      const response = await axios.get(
        `http://localhost:8000/user/dashboard/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      if (response.data.success) {
        setUser(response.data.user);
        userData = response.data.user;
      } else {
        toast.error("Failed to fetch user data.");
        setError("Failed to fetch user data.");
      }
    } catch (err) {
      if (err.response && err.response.status === 500) {
        toast.error(err.response?.data?.message || "An error occurred.");
        navigate("/signin");
      } else {
        toast.error(err.response?.data?.message || "An error occurred.");
      }
    }
  };
  useEffect(() => {
    fetchUserData(id);
  }, [id, navigate]);

  useEffect(() => {
    console.log("hello");
    socket.on('notification', (notification) => {
      console.log(notification.message); // Handle the notification (e.g., show an alert or update UI)
    });

    return () => {
      socket.off('notification'); // Clean up socket listeners
    };
  }, []);


  const handleLogout = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        toast.error('Please sign in.');
        return navigate('/signin');
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
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        toast.success("Logout Successful")
        setTimeout(() => navigate(`/signin`), 1500);
        // setTimeout(() => navigate(`/dashboard/${user._id}`), 1500); // Redirect after 2 seconds

      } else {
        toast.error(response.data.message || "Logout failed.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred during logout.");
    }
  };

  const handleJoinSubject = async () => {
    try {
      setJoinMessage("");
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

        if (!token) {
          toast.error('Please sign in.');
          return navigate('/signin');
        }

      const response = await axios.post(
        `http://localhost:8000/user/join/${id}`,
        { subject_code: subjectCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // setJoinMessage(`Successfully joined subject: ${response.data.subject.subject_name}`);
        toast.success(`Successfully joined subject: ${response.data.subject.subject_name}`);
        setSubjectCode("");
        setUser((prevUser) => ({
          ...prevUser,
          subjectDetails: [...prevUser.subjectDetails, response.data.subject],
        }));
        fetchUserData(id);
      }
    } catch (err) {
      // setJoinMessage(
      //   err.response?.data?.message || "An error occurred while joining the subject."
      // );
      toast.error(err.response?.data?.message || "An error occurred while joining the subject.");

    }
  };

  const handleSubject = async (subject) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

        if (!token) {
          toast.error('Please sign in.');
          return navigate('/signin');
        }

      const response = await axios.get(
        `http://localhost:8000/user/getsubject/${subject.subjectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data) {
        console.log(response);

        socket.emit('New Subject', {
          message: 'New subject has been fetched successfully!',
          subjectId: subject.subjectId
        });
        navigate(`/subject/${subject.subjectId}`, {
          state: { subject: response.data, userID: id, userRole: user.role },
        });
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        toast.error("Subject details not found.");
      } else {
        toast.error("An error occurred while fetching subject details.");
      }
    }
  };

  const handleProfile = async (userId) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        toast.error('Please sign in.');
        return navigate('/signin');
      }

      
      // console.log(userId);

      const response = await axios.get(
        `http://localhost:8000/user/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        navigate(`/profile/${userId}`, { state: { profile: response.data, userID: userId, userRole : user.role } });
      } else {
        toast.error("Failed to fetch profile data.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred during Profile view.");
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
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
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <ToastContainer position="top-center" autoClose={1500} />
      <div className="container mx-auto py-8 px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user.firstName}!</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg"
          >
            Logout
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Details</h2>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <p>
              <span className="font-semibold text-gray-100">Name:</span>{" "}
              {user.firstName} {user.lastName}
            </p>
            <p>
              <span className="font-semibold text-gray-100">Email:</span>{" "}
              {user.email}
            </p>
            <p>
              <span className="font-semibold text-gray-100">Role:</span>{" "}
              {user.role[0].toUpperCase() + user.role.slice(1)}
            </p>
            <p>
              <span className="font-semibold text-gray-100">Member Since:</span>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div>
          <button onClick={() => handleProfile(userId)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">
            View Profile</button>
        </div>
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-center">
            Your Subjects
          </h2>
          {user?.role === "student" && (
            <div className="mb-8 text-right">
              <button
                onClick={() => { setJoinMessage(""); setIsModalOpen(true); setSubjectCode(""); }}
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg"
              >
                Join Subject
              </button>
            </div>
          )}

          {isModalOpen && (
            <div className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className=" bg-gray-800 p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-xl font-bold mb-4 text-center">Join a Subject</h2>
                <input
                  type="text"
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  placeholder="Enter Subject Code"
                  className="w-full p-2 bg-gray-700 text-gray-200 rounded-lg mb-4"
                />
                <div className="flex justify-between">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleJoinSubject}
                    className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Join
                  </button>
                </div>
                {joinMessage && (
                  <p className="text-center mt-4 text-green-500">{joinMessage}</p>
                )}
              </div>
            </div>
          )}
          {user.role === "teacher" && (
            <div className="mb-8 text-right">
              <button
                onClick={() =>
                  navigate("/add-subject", { state: { teacherId: user.id } })
                }
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg"
              >
                + Create Subject
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
            {user.subjectDetails && user.subjectDetails.length > 0 ? (
              user.subjectDetails.map((subject, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 hover:bg-gray-600 transition-all duration-300 cursor-pointer"
                  onClick={() => handleSubject(subject)}
                >
                  <p className="text-lg font-semibold text-blue-400 mb-2 overflow-auto scrollbar-none">
                    {subject.subjectName}
                  </p>
                  <p className="text-gray-300">Teacher: {subject.teacherName}</p>
                </div>
              ))
            ) : (
              <p className="text-center col-span-full text-gray-400">
                No subjects found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
