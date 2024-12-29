import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const AddSubject = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const teacherId = location.state?.teacherId || null; // Retrieve the teacherId from state

  const [subjectName, setSubjectName] = useState("");
  const [error, setError] = useState("");

  const handleAddSubject = async () => {
    if (!teacherId) {
      setError("An error occurred while creating the subject.");
      return;
    }

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        navigate("/signin");
        return;
      }

      if (!subjectName) {
        alert("Subject name can't be empty");
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/user/addsubject/${teacherId}`, // Pass teacherId in the URL
        { subject_name: subjectName }, // Send only the subject name in the payload
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        navigate("/dashboard/${teacherId}"); // Redirect to the teacher's dashboard with the newly created subject
      } else {
        setError("An error occurred while creating the subject.");
      }
    } catch (err) {
      setError("An error occurred while creating the subject.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Add a New Subject</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="text"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          placeholder="hindi"
          className="w-full p-2 rounded-lg bg-gray-700 text-white mb-4"
        />
        <button
          onClick={handleAddSubject}
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg w-full"
        >
          Create Subject
        </button>
      </div>
    </div>
  );
};

export default AddSubject;
