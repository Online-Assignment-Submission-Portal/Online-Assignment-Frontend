import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSubject = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const teacherId = location.state?.teacherId || null; // Retrieve the teacherId from state

  const [subjectName, setSubjectName] = useState("");
  const [error, setError] = useState("");

  const handleAddSubject = async () => {
    if (!teacherId) {
      toast.error("Teacher ID is missing.");
      return;
    }

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        toast.error("Session expired. Please sign in again.");
        navigate("/signin");
        return;
      }
      if(!subjectName){
        toast.warning("Subject name can't be empty.");
        return;
      }
      const response = await axios.post(
        `http://localhost:8000/user/addsubject/${teacherId}`,
        { subject_name: subjectName}, // Include teacherId in the payload
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Subject added successfully!");
        navigate(`/dashboard/${teacherId}`);
      } else {
        toast.error(response.data.message || "Failed to add subject.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <ToastContainer position="top-center" autoClose={1500} />
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Add a New Subject</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="text"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          placeholder="Enter subject name"
          className="w-full p-2 rounded-lg bg-gray-700 text-white mb-4"
        />
        <button
          onClick={handleAddSubject}
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg w-full"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default AddSubject;