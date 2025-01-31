import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Loding from "../partials/Loding";
import "react-toastify/dist/ReactToastify.css";

const Grievance = () => {
    const navigate = useNavigate();
    const apiUrl = window.location.hostname === 'localhost'
    ? "http://localhost:8000" : process.env.REACT_APP_BASE_URL;
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchFeedbacks = async () => {
            try{
                const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("adminToken="))
                ?.split("=")[1];
                
                if (!token) {
                    toast.error("Unauthorized access. Please log in.");
                    navigate("/admin-signin");
                    return;
                }
                
                const response = await axios.get(`${apiUrl}/admin/feedback`,  
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    
                    if(response.data.success){
                        setFeedbacks(response.data.Feedbacks);
                        toast.success(response.data.message);
                    }
                }catch(err){
                    toast.error(err.response?.data?.message || "Failed to fetch feedbacks.");
                } finally {
                    setLoading(false);
                }
            }
            fetchFeedbacks();
    }, [navigate])
console.log(feedbacks);
if (loading) {
    return (
        <Loding />
    );
    }

    if (error) {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>{error}</p>
        </div>
    );
}

return(
<div className="min-h-screen bg-gray-900 text-gray-200 py-8">
      <div className="container mx-auto bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
            Feedback
          </h1>
        </div>
        <table className="w-full text-left border-collapse border border-gray-700">
        <thead>
            <tr className="bg-gray-700 text-gray-200">
            <th className="px-2 sm:px-4 py-2 border border-gray-600">
                Name
            </th>
            <th className="px-2 sm:px-4 py-2 border border-gray-600">
                Email
            </th>
            <th className="px-2 sm:px-4 py-2 border border-gray-600">
                Feedbacks
            </th>
            </tr> 
        </thead>
        <tbody>
            {feedbacks.length > 0 ? (
            feedbacks.map((grievance, index) => (
                <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                      } hover:bg-gray-600`}
                >
                    <td
                      className="px-2 sm:px-4 py-2 border border-gray-600"
                      title={'Name'}
                    >
                        {grievance.name}
                    </td>
                    <td
                      className="px-2 sm:px-4 py-2 border border-gray-600"
                      title={'Email'}
                    >
                        {grievance.email}
                    </td>
                    <td
                      className="px-2 sm:px-4 py-2 border border-gray-600"
                      title={'Feedback'}
                    >
                        {grievance.feedback.map((feed, numIndex) => 
                        <li key={numIndex}>{feed}</li>)}
                        
                    </td>
                </tr> 
            ))):(<p>No Feedbacks Available</p>)}
        </tbody>
    </table>
    
    </div>
</div>
);
}

export default Grievance;