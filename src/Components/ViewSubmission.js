import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ViewSubmission() {
  const navigate = useNavigate();
  const location = useLocation();
  const assignmentId = location.state?.assignment_id;
  const [submittedSubmissions, setSubmittedSubmissions] = useState([]);
  const [lateSubmissions, setLateSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1];

        if (!token) {
          toast.error('Please sign in to view submissions.');
          return navigate('/signin');
        }

        const response = await axios.get(`http://localhost:8000/assignment/submission/${assignmentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setSubmittedSubmissions(response.data.submissions.submitted);
          setLateSubmissions(response.data.submissions.late);
          toast.success('Submissions loaded successfully!');

        } else {
          // setError('Failed to fetch assignment submissions.');
          toast.error('Failed to fetch assignment submissions.');
        }
      } catch (err) {
        // setError("Error in fetching submissions.");
        toast.error('Error in fetching submissions.');

      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [assignmentId, navigate]);

  function extractFileName(fileLink) {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-8">
      <ToastContainer
        position="top-center"
        autoClose={1500}
        
      />
      <div className="container mx-auto bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl">
        <div className='flex justify-between items-center mb-8'>
          <h1 className="text-3xl font-semibold">
            Assignment Submission
          </h1>
          <button
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold 
            rounded-lg transition "
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

        {/* Submitted Submissions Table */}
        <h2 className="text-2xl font-semibold mb-4">Submissions</h2>
        <div className='w-5/5 h-96 overflow-y-auto mt-6'>
          <table className="w-full bg-gray-800 text-gray-200 rounded-lg">
            <thead>
              <tr className="bg-violet-800">
                <th className="px-4 py-2 text-center">Student Name</th>
                <th className="px-4 py-2 text-center">Roll No</th>
                <th className="px-4 py-2 text-center">Student ID</th>
                <th className="px-4 py-2 text-center">Assignment Submission</th>
              </tr>
            </thead>
            <tbody>
              {submittedSubmissions.map((submission, index) => (
                <tr key={index} className="hover:bg-gray-700 transition text-center">
                  <td className="border-b border-gray-600 px-4 py-2 items-center">
                    {submission.firstName + " " + submission.lastName}
                  </td>
                  <td className="border-b border-gray-600 px-4 py-2 items-center">
                    {submission.rollNo}
                  </td>
                  <td className="border-b border-gray-600 px-4 py-2 items-center">
                    {submission.studentId}
                  </td>
                  {submission.fileURL && (
                    <td className="border-b border-gray-600 px-4 py-2 items-center">
                      <a 
                        href={`${submission.fileURL}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        {extractFileName(submission.fileURL)}.{extractFileExtension(submission.fileURL)}
                      </a>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Late Submissions Table */}
        <h2 className="text-2xl font-semibold mb-4 mt-8">Late Submissions</h2>
        <div className='w-5/5 h-96 overflow-y-auto mt-6'>
          <table className="w-full bg-gray-800 text-gray-200 rounded-lg">
            <thead>
              <tr className="bg-red-800">
                <th className="px-4 py-2 text-center">Student Name</th>
                <th className="px-4 py-2 text-center">Roll No</th>
                <th className="px-4 py-2 text-center">Student ID</th>
                <th className="px-4 py-2 text-center">Assignment Submission</th>
              </tr>
            </thead>
            <tbody>
              {lateSubmissions.map((submission, index) => (
                <tr key={index} className="hover:bg-gray-700 transition text-center">
                  <td className="border-b border-gray-600 px-4 py-2 items-center">
                    {submission.firstName + " " + submission.lastName}
                  </td>
                  <td className="border-b border-gray-600 px-4 py-2 items-center">
                    {submission.rollNo}
                  </td>
                  <td className="border-b border-gray-600 px-4 py-2 items-center">
                    {submission.studentId}
                  </td>
                  {submission.fileURL && (
                    <td className="border-b border-gray-600 px-4 py-2 items-center">
                      <a 
                        href={`${submission.fileURL}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        {extractFileName(submission.fileURL)}.{extractFileExtension(submission.fileURL)}
                      </a>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewSubmission;
