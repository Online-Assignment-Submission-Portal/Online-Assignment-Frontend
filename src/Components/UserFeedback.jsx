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
  const {userId} = useStore();

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
  
    // Get token from cookies
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
  
    if (!token) {
      setError("User not authenticated. Please log in.");
      return;
    }
  
    // Replace this with actual user ID from authentication
  
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("message", message);
    attachments.forEach((file) => formData.append("attachments", file));
  
    try {
      setLoading(true);
  
      const response = await axios.post(`${apiUrl}/api/feedback`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
  
      setSuccess("Feedback submitted successfully!");
      setMessage("");
      setAttachments([]);
    } catch (error) {
      console.error("Submission Error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to submit feedback. Try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6 relative">
      {/* Back Button - Positioned at the top-left outside the box */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-500 transition"
      >
        <BiArrowBack size={20} />
        Back
      </button>

      {/* Feedback Box */}
      <div className="max-w-lg w-full bg-gray-900 p-6 rounded-2xl shadow-lg mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Submit Feedback</h2>

        {error && <p className="text-red-400 text-center">{error}</p>}
        {success && <p className="text-green-400 text-center">{success}</p>}

        <form onSubmit={handleSubmit}>
          {/* Feedback Message */}
          <textarea
            className="w-full p-3 border border-gray-700 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Enter your feedback..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>

          {/* Image Upload */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              Upload Images (Max 2)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 transition"
            />

            {/* Image Preview */}
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

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-500 transition"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserFeedback;
