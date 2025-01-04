import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AssignmentDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const assignmentId = location.state?.assignment_id;

  const [assignmentDetails, setAssignmentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1];

        if (!token) {
          return navigate('/signin');
        }

        const response = await axios.get(`http://localhost:8000/assignment/${assignmentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setAssignmentDetails(response.data.assignment);
        } else {
          setError('Failed to fetch assignment details.');
        }
      } catch (err) {
        setError('An error occurred while fetching assignment details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentDetails();
  }, [assignmentId, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 flex flex-col">
      <div className="container mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-200">Assignment Details</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
          >
            Back
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-gray-400">Assignment Name:</p>
            <h2 className="text-xl font-semibold text-gray-200">{assignmentDetails.title}</h2>
          </div>

          <div>
            <p className="text-gray-400">Deadline:</p>
            <p className="text-gray-300">{new Date(assignmentDetails.deadline).toLocaleString()}</p>
          </div>

          <div>
            <p className="text-gray-400">Assignment Body:</p>
            <p className="text-gray-300">{assignmentDetails.body}</p>
          </div>

          {assignmentDetails.attachment && (
            <div>
              <p className="text-gray-400">Attachment:</p>
              <a
                href={assignmentDetails.attachment}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                Download Attachment
              </a>
            </div>
          )}

          <div>
            <button
              onClick={() => alert('Submit Assignment feature is under construction!')}
              className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition"
            >
              Submit Assignment
            </button>
          </div>

          <div>
            <p className="text-gray-400">Marks Obtained:</p>
            <p className="text-gray-300">{assignmentDetails.marksObtained ?? 'Not graded yet'}</p>
          </div>

          <div>
            <p className="text-gray-400">Submitted At:</p>
            <p className="text-gray-300">{assignmentDetails.submittedAt ?? 'Not submitted yet'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentDetails;
