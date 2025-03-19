import { useState, useEffect } from "react";
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
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
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
          Authorization: `Bearer ${document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1]}`,
        },
      });

      const feedbacks = response.data?.data || [];
      setFeedbackList(feedbacks);
      setShowFeedback(true);
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

  const handleImageClick = (imgSrc) => {
    setSelectedImage(imgSrc);
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
            <input type="file" accept="image/*" multiple onChange={handleFileChange} className="file-input" />
          </div>

          <button type="submit" className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-500 transition" disabled={loading}>
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>

        <button onClick={toggleFeedback} className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-500 transition">
          {showFeedback ? "Hide Feedback" : "View My Feedback"}
        </button>
      </div>

      {showFeedback && feedbackList.length > 0 && (
        <div className="max-w-lg w-full bg-gray-900 p-6 rounded-2xl shadow-lg mt-6">
          <h2 className="text-xl font-bold mb-4 text-center">My Feedbacks</h2>
          <ul className="space-y-4">
            {feedbackList.map((feedback) => (
              <li key={feedback._id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-white">{feedback.message}</p>
                <p className="text-sm text-gray-400">Status: {feedback.status}</p>
                {feedback.attachments.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="Feedback attachment"
                    className="max-h-[300px] w-auto object-contain rounded-lg mt-2 cursor-pointer"
                    onClick={() => handleImageClick(img)}
                  />
                ))}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Enlarged feedback attachment"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              className="absolute top-2 right-2 bg-gray-800 rounded-full p-2 hover:bg-gray-700"
              onClick={() => setSelectedImage(null)}
            >
              <AiOutlineCloseCircle size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFeedback;
