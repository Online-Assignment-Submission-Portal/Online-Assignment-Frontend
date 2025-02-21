import React, { useEffect, useState , useCallback} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTrash, FaEdit, FaCheck, FaTimes, FaBars } from "react-icons/fa";

const NoticeBoard = ({ userRole, subject, notice }) => {
  const [messages, setMessages] = useState(notice);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedText, setEditedText] = useState("");
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [showOptions, setShowOptions] = useState(null);

  const apiUrl =
    window.location.hostname === "localhost"
      ? "http://localhost:8000"
      : process.env.REACT_APP_BASE_URL;

  const getToken = () =>
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

const [loaded, setLoaded] = useState(false); // Prevents multiple fetches

const fetchNotices = useCallback(async () => {
  const token = getToken();
  if (!token) {
    toast.error("Please sign in.");
    navigate("/signin");
    return;
  }

  try {
    const response = await axios.get(
      `${apiUrl}/subject/notice/${subject.subject_id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(response.data.notices);
    setMessages(response.data.notices);
    setLoaded(true); // Mark as loaded
  } catch (error) {
    console.error("Error fetching notices:", error);
    toast.error("Failed to load notices.");
  }
}, [apiUrl, subject.subject_id, getToken, navigate, setMessages]);

useEffect(() => {
  if (!loaded && subject.subject_id) {
    fetchNotices();
  }
}, [fetchNotices, loaded, subject.subject_id , messages , setMessages]);

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
      const transformedNotice = {
        ...response.data.notice,
        _id: response.data.notice.id,
      };
      setMessages((prev) =>
        [...prev, transformedNotice].sort(
          (a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt)
        )
      );
      console.log(messages);
      setNewMessage("");
      toast.success("Notice posted successfully.");
    } catch (error) {
      toast.error("Failed to post notice. Please try again.");
    }
  };

  const handleDeleteMessage = async (noticeId) => {
    const token = getToken();
    if (!token) {
      toast.error("Please sign in.");
      return navigate("/signin");
    }

    // Confirmation alert before deleting
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    console.log(noticeId, " there ");
    try {
      await axios.delete(`${apiUrl}/subject/notice/${noticeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the deleted notice from the state
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== noticeId)
      );

      // ✅ Automatically close edit/delete options after deleting
      setShowOptions(null);

      toast.success("Notice deleted successfully.");
    } catch (error) {
      console.error("Error deleting notice:", error);
      toast.error("Failed to delete notice. Please try again.");
    }
  };

  const handleEditMessage = async (noticeId) => {
    if (!editedText.trim()) return;

    const token = getToken();
    if (!token) {
      toast.error("Please sign in.");
      return navigate("/signin");
    }

    try {
      await axios.put(
        `${apiUrl}/subject/notice`,
        { noticeId, message: editedText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === noticeId
            ? {
                ...msg,
                message: editedText,
                lastUpdatedAt: new Date().toISOString(),
              }
            : msg
        )
      );
      setEditingMessage(null);
      setShowOptions(null);
      setEditedText("");
      toast.success("Notice updated successfully.");
    } catch (error) {
      toast.error("Failed to update notice. Please try again.");
    }
  };

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-semibold text-gray-200">
        📢 Notice Board - {subject?.subject_name}
      </h1>
      <div className="bg-gray-700 rounded-lg max-h-64 overflow-y-auto scrollbar-none m-8">
        {messages.length > 0 ? (
          [...messages].map((msg) => (
            <div
              key={msg._id}
              className="p-3 border-b border-gray-600 text-gray-200 flex justify-between items-center hover:bg-gray-800 max-w-screen"
            >
              {editingMessage === msg._id ? (
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full p-2 bg-gray-600 text-white rounded"
                />
              ) : (
                <span className="max-w-screen break-words scrollbar-none overflow-x-scroll mr-3">
                  {msg.message}
                </span>
              )}
              <div className="flex items-center gap-5 mt-2">
                <span className="text-sm text-gray-400">
                  {new Date(msg.lastUpdatedAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
                {userRole === "teacher" && (
                  <div className="relative flex items-center">
                    {/* Edit & Delete Options (Visible when menu is clicked) */}
                    {showOptions === msg._id && (
                      <div className="flex items-center gap-2">
                        {editingMessage === msg._id ? (
                          <>
                            <button
                              onClick={() => handleEditMessage(msg._id)}
                              className="text-green-500 hover:text-green-400 flex items-center"
                            >
                              <FaCheck size={16} className="mr-1" /> Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingMessage(null);
                                setShowOptions(null); // ✅ Hide buttons after cancel
                              }}
                              className="text-gray-400 hover:text-gray-300 flex items-center"
                            >
                              <FaTimes size={16} className="mr-1" /> Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingMessage(msg._id);
                                setEditedText(msg.message);
                              }}
                              className="text-yellow-400 hover:text-yellow-300 flex items-center"
                            >
                              <FaEdit size={16} className="mr-1" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(msg._id)}
                              className="text-red-500 hover:text-red-400 flex items-center"
                            >
                              <FaTrash size={16} className="mr-1" /> Delete
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    {/* Three-line menu button */}
                    <button
                      onClick={() =>
                        setShowOptions(showOptions === msg._id ? null : msg._id)
                      }
                      className={`text-gray-400 hover:text-gray-300 transition-transform duration-200 transform ${
                        showOptions === msg._id ? "rotate-90" : ""
                      } ml-2`}
                    >
                      <FaBars size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center p-4">No notices yet.</p>
        )}
      </div>
      {userRole === "teacher" && (
        <div className="mt-4">
          <textarea
            className="w-full p-3 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg"
            rows="3"
            placeholder="Type your notice here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            onClick={handlePostMessage}
            className="mt-3 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg"
          >
            Post Notice
          </button>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;
