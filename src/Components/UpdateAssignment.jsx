import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AssignmentDetails from './AssignmentDetails';

function UpdateAssignment() {
  const navigate = useNavigate();
  // const apiUrl = process.env.REACT_APP_BASE_URL || "http://localhost:8000"
  const apiUrl = window.location.hostname === 'localhost'
  ? "http://localhost:8000" : process.env.REACT_APP_BASE_URL;
  const location = useLocation();
  const assignmentId = location.state?.assignment_id;
  const assignmentDetails = location.state?.assignment_details;
  const userRole = location.state?.userRole;
  const userID = location.state?.userID;
  const subjectID = location.state?.subjectID;
  const [assignment, setAssignment] = useState({ ...assignmentDetails });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  // const [loading, setLoading] = useState(false); // Loading state

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = document.cookie

      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    try {
      const response = await axios.put(`${apiUrl}/assignment/updateassignment/${assignmentId}`,
        { assignment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (response.data.success) {
        toast.success("Assignment updated successfully!", { autoClose: 1500 });
        setAssignment({ ...assignment, assignment: response.data })
        navigate(`/assignment/${assignmentId}`, { state: { assignment_details: assignment, assignment_id: assignmentId, userRole, userID, subjectID } });
      }
    } catch (err) {
      //   setError(err.response?.data?.message || "An error occurred during updating assignment.");
      toast.error(err.response?.data?.message || "Failed to update assignment.", { autoClose: 1500 });
    } finally {
      setLoading(false);
    }


    // try {
    //   const response = await axios.put(
    //     `${apiUrl}/assignment/updateassignment/${assignmentId}`,
    //     { assignment },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );

    //   if (response.data.success) {
    //     console.log('Assignment updated successfully:', response.data);
    //     navigate(`/assignment/${assignmentId}`, { state: { assignment_details: assignment, assignment_id: assignmentId, userRole, userID } });
    //   }
    // } catch (err) {
    //   setError(err.response?.data?.message || 'An error occurred during updating the assignment.');
    // }
  };

  function extractFileName(fileLink) {
    const fileNameWithExtension = fileLink.split('/').pop();
    const lastDotIndex = fileNameWithExtension.lastIndexOf('.');
    return decodeURIComponent(fileNameWithExtension.substring(0, lastDotIndex));
  }

  function extractFileExtension(fileLink) {
    const fileNameWithExtension = fileLink.split('/').pop();
    const lastDotIndex = fileNameWithExtension.lastIndexOf('.');
    return fileNameWithExtension.substring(lastDotIndex + 1);
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 flex items-center justify-center">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-full max-w-3xl">
        <h1 className="text-4xl font-extrabold text-gray-200 mb-8 text-center">Update Assignment</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 mb-2 font-medium">Title</label>
            <input
              type="text"
              value={assignment.title || ''}
              onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
              className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter assignment title"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2 font-medium">Description</label>
            <textarea
              value={assignment.description || ''}
              onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
              className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter assignment description"
              rows={10}
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2 font-medium">Deadline</label>
            <input
              type="datetime-local"
              value={assignment.deadline ? assignment.deadline.slice(0, 16) : ''}
              onChange={(e) => setAssignment({ ...assignment, deadline: e.target.value })}
              className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2 font-medium">File Name</label>
            <input
              type="text"
              value={`${extractFileName(assignmentDetails.fileLink)}.${extractFileExtension(assignmentDetails.fileLink)}`}
              disabled
              className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-gray-400 mb-2 font-medium">Min Marks</label>
              <input
                type="number"
                value={assignment.minVal !== undefined ? assignment.minVal : ''}
                onChange={(e) => setAssignment({ ...assignment, minVal: e.target.value })}
                className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-400 mb-2 font-medium">Max Marks</label>
              <input
                type="number"
                value={assignment.maxVal !== undefined ? assignment.maxVal : ''}
                onChange={(e) => setAssignment({ ...assignment, maxVal: e.target.value })}
                className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-between items-center gap-2 font-semibold">
            <button
              type="button"
              onClick={() => navigate(`/assignment/${assignmentId}`, { state: { assignment_details: assignment, assignment_id: assignmentId, userRole, userID, subjectID } })}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
              disabled={loading}
            >
             {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>

      {/* <ToastContainer position="top-center" autoClose={1500} /> */}

    </div>
  );
}

export default UpdateAssignment;
