import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Loding from "../partials/Loding";
import "react-toastify/dist/ReactToastify.css";

const Grievance = () => {
    const navigate = useNavigate();
    const apiUrl = window.location.hostname === 'localhost'
        ? "http://localhost:8000" : import.meta.env.VITE_APP_BASE_URL;

    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedFeedbacks, setExpandedFeedbacks] = useState({});

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const token = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("adminToken="))
                    ?.split("=")[1];

                if (!token) {
                    toast.error("Unauthorized access. Please log in.");
                    navigate("/admin-signin");
                    return;
                }

                const response = await axios.get(`${apiUrl}/admin/feedback`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.success) {
                    setFeedbacks(response.data.Feedbacks);
                    toast.success(response.data.message);
                }
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to fetch feedbacks.");
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, [navigate]);

    const toggleExpand = (index) => {
        setExpandedFeedbacks((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    if (loading) return <Loding />;

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
                    <button
                        onClick={() => {
                            document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                            toast.success("Logged out successfully!");
                            navigate("/admin-signin");
                        }}
                        className="bg-red-600 font-semibold text-white py-2 px-4 rounded-lg hover:bg-red-500 transition duration-300 shadow-md"
                    >
                        Logout
                    </button>
                </div>

                <h1 className="text-3xl font-bold text-center mb-6 text-gray-200">
                    Contact Us
                </h1>

                {feedbacks.length === 0 ? (
                    <p className="text-center text-gray-300">No Feedbacks Available.</p>
                ) : (
                    <div className="overflow-x-auto bg-gray-700 p-4 rounded-lg shadow">
                        <table className="table-auto w-full text-left text-sm bg-gray-700 rounded-lg overflow-hidden mb-6">
                            <thead className="bg-green-700">
                                <tr>
                                    <th className="px-4 py-2 text-center">Name</th>
                                    <th className="px-4 py-2 text-center">Email</th>
                                    <th className="px-4 py-2 text-center w-[65%]">Feedback</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feedbacks.map((grievance, index) => (
                                    <tr
                                        key={index}
                                        className="odd:bg-gray-600 even:bg-gray-700 items-center text-center transition"
                                    >
                                        <td className="px-4 py-2">{grievance.name}</td>
                                        <td className="px-4 py-2">{grievance.email}</td>
                                        <td className="px-4 py-2 max-w-xs">
                                            <div className="max-h-30">
                                                <ol className="list-decimal list-inside text-left space-y-2">
                                                    {grievance.feedback.slice(0, expandedFeedbacks[index] ? grievance.feedback.length : 3).map((feed, numIndex) => (
                                                        <React.Fragment key={numIndex}>
                                                            <li className="line-clamp-4 overflow-y-auto scrollbar-none break-words" title={feed}>
                                                                {feed}
                                                            </li>
                                                            {numIndex < grievance.feedback.length - 1 && (
                                                                <hr className="border-t-2 border-gray-100 my-2" />
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </ol>
                                            </div>
                                            {grievance.feedback.length > 3 && (
                                                <button
                                                    onClick={() => toggleExpand(index)}
                                                    className="text-blue-400 hover:underline mt-2"
                                                >
                                                    {expandedFeedbacks[index] ? "Show Less" : "Read More"}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Grievance;
