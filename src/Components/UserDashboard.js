import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer';
import Header from './UserHeader'
import useStore from "../lib/useStore";
import notificationStore from "../lib/notificationStore";
import 'remixicon/fonts/remixicon.css';

const UserDashboard = () => {
  const { id } = useParams();
  // const apiUrl = process.env.REACT_APP_BASE_URL || "http://localhost:8000"
  const apiUrl = window.location.hostname === 'localhost'
    ? "http://localhost:8000" : process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  // const socket = io("${apiUrl}", {
  //   transports: ['websocket'],
  // });
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [joinMessage, setJoinMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState([]);
  const { disconnectSocket, socket } = useStore();
  const { notifications } = notificationStore();
  const userId = id.toString();
  let userData;


  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      // console.log("Fetching notifications...");
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1];
        const response = await axios.get(`${apiUrl}/notification/unread/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        // console.log(response.data);
        if (response.data.success) {
          setNotification(response.data.notifications);
        }
      } catch (error) {
        console.error("Error fetching notifications: ", error);
      }

      const interval = setInterval(fetchUnreadNotifications, 10000);
      return () => clearInterval(interval);
    }
    fetchUnreadNotifications();
    // fetchUnreadNotifications();
  }, [userId, apiUrl, notifications]);
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
        `${apiUrl}/user/dashboard/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
        `${apiUrl}/user/logout`,
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
        disconnectSocket();
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
        `${apiUrl}/user/join/${id}`,
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
        `${apiUrl}/user/getsubject/${subject.subjectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data) {

        // socket.emit('New Subject', {
        //   message: 'New subject has been fetched successfully!',
        //   subjectId: subject.subjectId
        // });
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
    <>
      <Header/>
    <div className="min-h-screen flex flex-col">
      <div className="min-h-screen bg-gray-900 text-gray-200">
        {/* <ToastContainer position="top-center" autoClose={1500} /> */}
        <div className="container mx-auto py-8 px-6">
          <div className="flex flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-center md:text-left">
              Welcome, {user.firstName}!
            </h1>
            <div className="flex flex-wrap justify-center sm:justify-end gap-4">
              <button
                onClick={() => navigate("/notification")}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-2 rounded-lg"

              >
                <span className="text-white mr-2 text-3xl text-center flex flex-row gap-1">
                
                  <i className="ri-notification-4-fill"></i>
                  {notification !== undefined && notification.length > 0 && (
                  <span className="bg-green-500 w-3 h-3 rounded-full"></span>
                )}

                </span>

                {/* Green dot if there are unread notifications */}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg w-auto"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mb-6 w-1/3">
            <h2 className="text-xl font-semibold mb-4">Your Details</h2>
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <p>
                <span className="font-semibold text-gray-100">Name:</span> {user.firstName} {user.lastName}
              </p>
              <p>
                <span className="font-semibold text-gray-100">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-semibold text-gray-100">Role:</span> {user.role[0].toUpperCase() + user.role.slice(1)}
              </p>
              <p>
                <span className="font-semibold text-gray-100">Member Since:</span>{" "}
                {new Date(user.createdAt).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })}
              </p>
            </div>
          </div>

          <div className="mb-4 flex justify-between sm:justify-start gap-2">
            {user?.role === "student" && (
              // <div className="mb-4 text-center sm:text-right">
              <button
                onClick={() => {
                  setJoinMessage("");
                  setIsModalOpen(true);
                  setSubjectCode("");
                }}
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg w-auto sm:hidden"
              >
                Join Subject
              </button>
              // </div>
            )}
            {user.role === "teacher" && (
              // <div className="mb-8 text-center sm:text-right">
              <button
                onClick={() => navigate("/add-subject", { state: { teacherId: user.id } })}
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg w-auto sm:hidden"
              >
                + Create Subject
              </button>
              // </div>
            )}

          </div>


          <div className="mb-10">
            <h2 className="text-xl font-semibold text-center mb-4">Your Subjects</h2>
            {isModalOpen && (
              <div className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-4 sm:w-3/4 md:w-1/2 lg:w-1/3">
                  <h2 className="text-xl font-bold mb-4 text-center text-gray-100">Join a Subject</h2>
                  <input
                    type="text"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    placeholder="Enter Subject Code"
                    className="w-full p-3 bg-gray-700 text-gray-200 rounded-lg mb-4 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                  <div className="flex flex-row justify-between gap-2">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleJoinSubject}
                      className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg"
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
            {user?.role === "student" && (
              <div className="mb-4 text-center sm:text-right hidden sm:flex justify-end">
                <button
                  onClick={() => {
                    setJoinMessage("");
                    setIsModalOpen(true);
                    setSubjectCode("");
                  }}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg w-auto"
                >
                  Join Subject
                </button>
              </div>
            )}
            {user.role === "teacher" && (
              <div className="mb-8 text-center sm:text-right hidden sm:flex justify-end">
                <button
                  onClick={() => navigate("/add-subject", { state: { teacherId: user.id } })}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg w-auto"
                >
                  + Create Subject
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {user.subjectDetails && user.subjectDetails.length > 0 ? (
                user.subjectDetails.map((subject, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 hover:bg-gray-600 transition-all duration-300 cursor-pointer"
                    onClick={() => handleSubject(subject)}
                  >
                    <p className="text-lg font-semibold text-blue-400 mb-2 overflow-auto">
                      {subject.subjectName}
                    </p>
                    <p className="text-gray-300">Teacher: {subject.teacherName}</p>
                  </div>
                ))
              ) : (
                <p className="text-center col-span-full text-gray-400">No subjects found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
</>
  );
};

export default UserDashboard;
