import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import useStore from "../lib/useStore";
import { toast } from "react-toastify";

const UserFeedback = () => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false); // Track feedback visibility
  const { userId } = useStore();
  const navigate = useNavigate();

  const apiUrl =
    window.location.hostname === "localhost"
      ? "http://localhost:8000"
      : import.meta.env.VITE_APP_BASE_URL;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + attachments.length > 2) {
      toast.error("You can only upload a maximum of 2 images.");
      return;
    }
    setAttachments([...attachments, ...files]);
  };

  const removeImage = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("Feedback message cannot be empty.");
      return;
    }

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      setError("User not authenticated. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("message", message);
    attachments.forEach((file) => formData.append("attachments", file));

    try {
      setLoading(true);

      await axios.post(`${apiUrl}/api/feedback`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Feedback submitted successfully!");
      setMessage("");
      setAttachments([]);
      fetchFeedback();
    } catch (error) {
      console.error("Submission Error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to submit feedback. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedback = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/feedback/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${
            document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1]
          }`,
        },
      });

      const feedbacks = response.data?.data || [];
      setFeedbackList(feedbacks);
      setShowFeedback(true); // Show feedback after fetching
    } catch (error) {
      console.error("Error fetching feedback:", error.response?.data || error.message);
      setFeedbackList([]);
    }
  };

  const toggleFeedback = () => {
    if (showFeedback) {
      setShowFeedback(false);
    } else {
      fetchFeedback();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6 relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-500 transition"
      >
        <BiArrowBack size={20} />
        Back
      </button>

      <div className="max-w-lg w-full bg-gray-900 p-6 rounded-2xl shadow-lg mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Submit Feedback</h2>

        {error && <p className="text-red-400 text-center">{error}</p>}
        {success && <p className="text-green-400 text-center">{success}</p>}

        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-3 border border-gray-700 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Enter your feedback..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Upload Images (Max 2)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 transition"
            />
            {attachments.length > 0 && (
              <div className="mt-4 flex gap-4">
                {attachments.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-700"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full"
                      onClick={() => removeImage(index)}
                    >
                      <AiOutlineCloseCircle size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-500 transition"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>

        <button
          onClick={toggleFeedback}
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-500 transition"
        >
          {showFeedback ? "Hide Feedback" : "View My Feedback"}
        </button>
      </div>

      {/* Feedback List Section (Only visible when showFeedback is true) */}
      {showFeedback && feedbackList.length > 0 && (
        <div className="max-w-lg w-full bg-gray-900 p-6 rounded-2xl shadow-lg mt-6">
          <h2 className="text-xl font-bold mb-4 text-center">My Feedbacks</h2>
          <ul className="space-y-4">
            {feedbackList.map((feedback) => (
              <li key={feedback._id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-white">{feedback.message}</p>
                {feedback.attachments &&
                  feedback.attachments.map((img, index) => (
                    <img
                      key={index}
                      src={`${apiUrl}/${img}`}
                      alt="Feedback attachment"
                      className="w-full h-32 object-cover rounded-lg mt-2"
                    />
                  ))}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserFeedback;
