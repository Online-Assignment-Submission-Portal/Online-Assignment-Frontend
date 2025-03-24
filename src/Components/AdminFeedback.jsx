import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineCloseCircle } from "react-icons/ai";  // Add this import

const AdminFeedback = () => {
    const apiUrl = window.location.hostname === 'localhost'
        ? "http://localhost:8000" : import.meta.env.VITE_APP_BASE_URL;
    const [feedbacks, setFeedbacks] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();
    const pendingFeedbacks = feedbacks.filter(f => f.status === "pending" || f.status === "new");
    const reviewedFeedbacks = feedbacks.filter(f => f.status === "reviewed");
    const resolvedFeedbacks = feedbacks.filter(f => f.status === "resolved");

    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("adminToken="))
        ?.split("=")[1];
    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/feedback/admin/all-feedbacks`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFeedbacks(response.data.data);
            // console.log(response);
        } catch (error) {
            toast.error("Failed to load feedbacks");
        }
    };
    useEffect(() => {
        fetchFeedbacks();
    }, [navigate, token]);

    const handleLogout = async () => {
        try {
    
          if (!token) {
            toast.error('Please sign in.');
            return navigate('/admin-signin');
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
          console.log(response);
    
          if (response.status === 200) {
            document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            localStorage.clear();
            resetStore();
            toast.success("Logout Successful");
            // disconnectSocket();
            setTimeout(() => navigate(`/admin-signin`), 1500);
            // setTimeout(() => navigate(`/dashboard/${user._id}`), 1500); // Redirect after 2 seconds
    
          } else {
            toast.error(response.data.message || "Logout failed.");
          }
        } catch (err) {
          toast.error(err.response?.data?.message || "An error occurred during logout.");
        }
      };

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.patch(`${apiUrl}/api/feedback/${id}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFeedbacks(feedbacks.map(f => f._id === id ? { ...f, status: newStatus } : f));
            toast.success("Status updated successfully");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    // Delete Feedback
    const deleteFeedback = async (id) => {
        if (!window.confirm("Are you sure you want to delete this feedback?")) return;

        try {
            await axios.delete(`${apiUrl}/api/feedback/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFeedbacks(feedbacks.filter(f => f._id !== id));
            toast.success("Feedback deleted successfully");
        } catch (error) {
            toast.error("Failed to delete feedback");
        }
    };

    const renderTable = (title, data, bgColor) => (
        <div className={`bg-gray-700 p-4 rounded-lg shadow mb-6`}>
            <h2 className={`text-xl font-semibold text-center mb-4 ${bgColor} text-white py-2 rounded-lg`}>
                {title}
            </h2>
            {data.length === 0 ? (
                <p className="text-center text-gray-300">No {title} Feedbacks</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-left text-sm bg-gray-700 rounded-lg overflow-hidden">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-4 py-2 text-center">Email</th>
                                <th className="px-4 py-2 text-center w-[40%]">Feedback</th>
                                <th className="px-4 py-2 text-center">Attachments</th>
                                <th className="px-4 py-2 text-center">Status</th>
                                <th className="px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((feedback, index) => (
                                <tr key={index} className="odd:bg-gray-600 even:bg-gray-700 text-center">
                                    <td className="px-4 py-2">{feedback.userId.email}</td>
                                    <td className="px-4 py-2">{feedback.message}</td>
                                    <td className="px-4 py-2">
                                        {feedback.attachments?.length > 0 ? (
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                {feedback.attachments.map((url, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={url}
                                                        alt={`Attachment ${idx + 1}`}
                                                        className="w-16 h-16 object-cover rounded-lg border border-gray-500 hover:scale-105 transition cursor-pointer"
                                                        onClick={() => setSelectedImage(url)}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">No Attachments</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        <select
                                            value={feedback?.status === "new" ? "pending" : feedback?.status}
                                            onChange={(e) => updateStatus(feedback._id, e.target.value)}
                                            className={`border border-gray-600 rounded-lg px-2 py-1 text-white
                                            ${feedback.status === "pending" || feedback.status === "new" ? "bg-yellow-600" : ""}
                                            ${feedback.status === "reviewed" ? "bg-blue-600" : ""}
                                            ${feedback.status === "resolved" ? "bg-green-600" : ""}
                                        `}
                                        >
                                            <option value="pending" className="bg-gray-800">Pending</option>
                                            <option value="reviewed" className="bg-gray-800">Reviewed</option>
                                            <option value="resolved" className="bg-gray-800">Resolved</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => deleteFeedback(feedback._id)}
                                            className="bg-red-600 px-3 py-1 text-white rounded-lg hover:bg-red-500 transition duration-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-6xl">
                <div className="flex flex-wrap justify-between mb-6">
                    <button
                        onClick={() => navigate("/admin-dashboard")}
                        className="bg-blue-600 font-semibold text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-300 shadow-md"
                    >
                        Back to Dashboard
                    </button>

                </div>

                <h1 className="text-3xl font-bold text-center mb-6 text-gray-200">User Feedback</h1>

                {renderTable("Pending Feedback", pendingFeedbacks, "bg-yellow-700")}
                {renderTable("Reviewed Feedback", reviewedFeedbacks, "bg-blue-700")}
                {renderTable("Resolved Feedback", resolvedFeedbacks, "bg-green-700")}
            </div>

            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-[90vw] max-h-[90vh]">
                        <img
                            src={selectedImage}
                            alt="Enlarged attachment"
                            className="max-w-full max-h-[90vh] object-contain"
                        />
                        <button
                            className="absolute top-2 right-2 bg-gray-800 rounded-full p-2 hover:bg-gray-700"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(null);
                            }}
                        >
                            <AiOutlineCloseCircle size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFeedback;
