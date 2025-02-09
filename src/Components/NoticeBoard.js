import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const NoticeBoard = ({ userRole, subject, notice }) => {
  const [messages, setMessages] = useState(notice);
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const apiUrl =
    window.location.hostname === "localhost"
      ? "http://localhost:8000"
      : process.env.REACT_APP_BASE_URL;

  const handlePostMessage = async () => {
    if (!newMessage.trim()) return;

    // Retrieve token from cookies
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      toast.error("Please sign in.");
      return navigate("/signin");
    }

    try {
      const response = await axios.post(
        `${apiUrl}/subject/notice`,
        {
          message: newMessage,
          subjectId: subject.subject_id, // Ensure subjectId is sent
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );

      // Update UI with the new message and sort messages by latest timestamp
      setMessages((prevMessages) =>
        [...prevMessages, response.data.notice].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        )
      );
      setNewMessage(""); // Clear input field
    } catch (error) {
      console.error("Error posting message:", error);
      toast.error("Failed to post notice. Please try again.");
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
          [...messages]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort latest first
            .map((msg, index) => (
              <div
                key={index}
                className="p-3 border-b border-gray-600 text-gray-200 flex justify-between items-center hover:bg-gray-800 duration-100 ease-in-out"
              >
                <span>{msg.message}</span>
                <span className="text-sm text-gray-400">
                  {new Date(msg.lastUpdatedAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}{" "}
                  {/* Local time format */}
                </span>
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
              className=" mt-3 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition "
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
