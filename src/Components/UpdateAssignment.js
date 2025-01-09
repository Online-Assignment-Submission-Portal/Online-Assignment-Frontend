import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AssignmentDetails from './AssignmentDetails';

function UpdateAssignment () {
const navigate = useNavigate();
const location = useLocation();
const assignmentId = location.state?.assignment_id;
const assignmentDetails = location.state?.assignment_details
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [assignment, setAssignment] = useState({...assignmentDetails});
console.log('assignment:', assignmentDetails);

const handleSubmit = async (e) => {
    e.preventDefault();
    const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
    console.log('hello', assignment);
    try{
    const response = await axios.put(`http://localhost:8000/assignment/updateassignment/${assignmentId}`, 
     {assignment},
     {
        headers: {
          Authorization: `Bearer ${token}`,
        },
     });
     
     if(response.data.success) {
        console.log(response.data);
        console.log("Assignment updated successfully");
        toast.success("Assignment updated successfully!", { autoClose: 1500 });
        setAssignment({...assignment, assignment: response.data})
        navigate(`/assignment/${assignmentId}`, { state: {assignment_details : assignment, assignment_id : assignmentId} });
     }
    } catch(err) {
      //   setError(err.response?.data?.message || "An error occurred during updating assignment.");
        toast.error(err.response?.data?.message || "Failed to update assignment.", { autoClose: 1500 });
    }

}

function extractFileName (fileLink) {
    const fileNameWithExtension = fileLink.split('/').pop(); 
    const lastDotIndex = fileNameWithExtension.lastIndexOf('.');
    let fileName = fileNameWithExtension.substring(0, lastDotIndex);
    fileName = decodeURIComponent(fileName);
    return fileName;
};

function extractFileExtension(fileLink) {
const fileNameWithExtension = fileLink.split('/').pop();
const lastDotIndex = fileNameWithExtension.lastIndexOf('.');
const fileExtension = fileNameWithExtension.substring(lastDotIndex + 1);
return fileExtension;
}


if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>{error}</p>
      </div>
    );
}

return (
<div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
    <div className="bg-gray-800 mt-3 mb-3 p-6 rounded-lg shadow-lg w-full max-w-md">
       <form onSubmit={handleSubmit} className="space-y-4">
       <div>
           <label htmlFor="Title" className="block text-sm font-medium mb-1">Title:</label>
           <input
            type="text"
            name="Title"
            value={assignment.title || ''}
            onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
            className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 
            focus:ring-green-500"
           />     
        </div>
        <div>
           <label htmlFor="Description" className="block text-sm font-medium mb-1">Description:</label>
           <input
            type="text"
            name="Description"
            value={assignment.description || ''}
            onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
            className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 
            focus:ring-green-500"
           />     
        </div>
        <div>
           <label htmlFor="Deadline" className="block text-sm font-medium mb-1">Deadline:</label>
           <input
            type="numeric"
            name="Deadline"
            value={assignment.deadline || ''}
            onChange={(e) => setAssignment({ ...assignment, deadline: e.target.value })}
            className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 
            focus:ring-green-500"
           />     
        </div>
        <div>
           <label htmlFor="FileName" className="block text-sm font-medium mb-1">FileName:</label>
           <input
            type="text"
            name="FileName"
            value={extractFileName(assignmentDetails.fileLink) + "." + 
                    extractFileExtension(assignmentDetails.fileLink) || ''} 
            disabled               
            className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 
            focus:ring-green-500"
           />     
        </div>
        <div>
           <label htmlFor="CreatedBy" className="block text-sm font-medium mb-1">CreatedBy:</label>
           <input
            type="text"
            name="CreatedBy"
            value={assignmentDetails.createdBy || ''}
            disabled
            className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 
            focus:ring-green-500"
           />     
        </div>
        <div>
           <label htmlFor="MinVal" className="block text-sm font-medium mb-1">Min-Marks:</label>
           <input
            type="text"
            name="MinVal"
            value={assignment.minVal || ''}
            onChange={(e) => setAssignment({ ...assignment, minVal: e.target.value })}
            className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 
            focus:ring-green-500"
           />     
        </div>
        <div>
           <label htmlFor="MaxVal" className="block text-sm font-medium mb-1">Max-Marks:</label>
           <input
            type="text"
            name="MaxVal"
            value={assignment.maxVal || ''}
            onChange={(e) => setAssignment({ ...assignment, maxVal: e.target.value })}
            className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 
            focus:ring-green-500"
           />     
        </div>
        <div>
            <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-md 
            font-bold transition"
            >
                Update Assignment
            </button>
        </div>
       </form>
       <ToastContainer position="top-center" autoClose={1500}/>
    </div>
</div>
);
}

export default UpdateAssignment;