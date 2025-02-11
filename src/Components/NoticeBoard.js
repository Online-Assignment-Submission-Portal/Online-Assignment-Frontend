import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

const NoticeBoard = ({ userRole, subject, notice }) => {
  const [messages, setMessages] = useState(notice);
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const apiUrl =
    window.location.hostname === "localhost"
      ? "http://localhost:8000"
      : process.env.REACT_APP_BASE_URL;

  // Retrieve token from cookies
  const getToken = () =>
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

  // Handle posting a new notice
  const handlePostMessage = async () => {
    if (!newMessage.trim()) return;

    const token = getToken();
    if (!token) {
      toast.error("Please sign in.");
      return navigate("/signin");
    }

    try {
      const response = await axios.post(
        `${apiUrl}/subject/notice`,
        {
          message: newMessage,
          subjectId: subject.subject_id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update messages list with new notice
      setMessages((prevMessages) =>
        [...prevMessages, response.data.notice].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        )
      );
      setNewMessage("");
      toast.success("Notice posted successfully.");

    } catch (error) {
      toast.error("Failed to post notice. Please try again.");
    }
  };

  // Handle deleting a notice
  const handleDeleteMessage = async (noticeId) => {
    const token = getToken();
    if (!token) {
      toast.error("Please sign in.");
      return navigate("/signin");
    }

    if (!window.confirm("Are you sure you want to delete this notice?")) {
      return;
    }

    try {
      await axios.delete(`${apiUrl}/subject/notice/${noticeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove deleted notice from UI
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== noticeId)
      );
      toast.success("Notice deleted successfully.");
    } catch (error) {
      console.error("Error deleting notice:", error);
      toast.error("Failed to delete notice. Please try again.");
    }
  };

  return (
    <div className="mt-6">
      {/* Header with Subject Name */}
      <div className="flex flex-row justify-between items-center mb-4 gap-4">
        <h1 className="text-2xl font-semibold text-gray-200">
          📢 Notice Board - {subject?.subject_name}
        </h1>
      </div>

      {/* Messages Display Area */}
      <div className="bg-gray-700 rounded-lg max-h-64 overflow-y-auto scrollbar-none">
        {messages.length > 0 ? (
          messages
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map((msg) => (
              <div
                key={msg._id}
                className="p-3 border-b border-gray-600 text-gray-200 flex justify-between items-center hover:bg-gray-800 duration-100 ease-in-out"
              >
                <span>{msg.message}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">
                    {new Date(msg.lastUpdatedAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </span>

                  {/* Delete Icon (Visible only for teachers) */}
                  {userRole === "teacher" && (
                    <button
                      onClick={() => handleDeleteMessage(msg._id)}
                      className="text-red-500 hover:text-red-400 transition"
                    >
                      <FaTrash size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))
        ) : (
          <p className="text-gray-400 text-center p-4">No notices yet.</p>
        )}
      </div>

      {/* Input for Teachers */}
      {userRole === "teacher" && (
        <div className="mt-4">
          <textarea
            className="w-full p-3 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none"
            rows="3"
            placeholder="Type your notice here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <div className="flex flex-row items-right sm:justify-end justify-center">
            <button
              onClick={handlePostMessage}
              className="mt-3 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
            >
              Post Notice
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;
