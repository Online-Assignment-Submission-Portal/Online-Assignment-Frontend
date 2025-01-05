import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
function AssignmentDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const assignmentId = location.state?.assignment_id;
  const userRole = location.state?.userRole; 
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
   
  // const extractFileName = async (fileLink) => {
  //   const fileNameWithExtension = fileLink.split('/').pop(); 
  //   const lastDotIndex = fileNameWithExtension.lastIndexOf('.');
  //   const fileName = fileNameWithExtension.substring(0, lastDotIndex);
  //   const fileExtension = fileNameWithExtension.substring(lastDotIndex + 1);
  //   return { fileName, fileExtension };
  // };

  // const handleDownload = async (fileLink, fileName) => {
  //   const fileUrl = fileLink;
  //   console.log('File URL:', fileUrl);
  //   console.log('File Name:', fileName);
  //   const link = document.createElement('a');
  //   link.href = fileUrl;
  //   link.target="_blank"
  //   link.rel="noopener noreferrer"
  //   link.setAttribute('download', fileName);
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);

  // }

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
      <div className="container mx-auto bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Assignment Details</h1>

          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
          >
            Back
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-gray-400 font-medium">Title:</p>
            <h2 className="text-2xl font-semibold">{assignmentDetails.title}</h2>
          </div>
          <div>
            <p className="text-gray-400 font-medium">Deadline:</p>
            <p>{new Date(assignmentDetails.deadline).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-400 font-medium">Description:</p>
            <p>{assignmentDetails.description}</p>
          </div>
          {assignmentDetails.fileLink && (
            <div>
              <p className="text-gray-400 font-medium">Attachment:</p>
              <a
                href={`${assignmentDetails.fileLink}`}
                // onClick={() => handleDownload(assignmentDetails.fileLink, extractFileName(assignmentDetails.fileLink).fileName)}
                // download={(() => {
                //   const { fileName, fileExtension } = extractFileName(assignmentDetails.fileLink); // Extract name and extension
                //   return `${fileName}.${fileExtension}`; // Return the formatted download name
                // })()}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Download Attachment
              </a>
            </div>
          )}
          
          {userRole === 'student' ? (
            <>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 font-medium">Marks Obtained:</p>
                  <p>
                    {assignmentDetails.marksObtained !== undefined
                      ? assignmentDetails.marksObtained
                      : 'Not graded yet'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Max Marks:</p>
                  <p>{assignmentDetails.maxVal !== undefined ? assignmentDetails.maxVal : 'Not available'}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-400 font-medium">Submitted At:</p>
                <p>
                  {assignmentDetails.submittedAt
                    ? new Date(assignmentDetails.submittedAt).toLocaleString()
                    : 'Not submitted yet'}
                </p>
              </div>

              <div className="mt-8 text-right">
                <button
                  onClick={() => alert('Submit Assignment feature is under construction!')}
                  className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition"
                >
                  Submit Assignment
                </button>
              </div>
            </>
          ) : userRole === 'teacher' ? (
            <div>
              <div> 
                <p className="text-gray-400 font-medium">Max Marks:</p>
                <p>{assignmentDetails.maxVal !== undefined ? assignmentDetails.maxVal : 'Not available'}</p>
              </div>
              <div className="mt-8 text-right">
                <button
                  onClick={() => alert('Check for Plagiarism feature is under construction!')}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition"
                  >
                  Check for Plagiarism
                </button>
              </div>
            </div>
          ) : null}

        </div>
      </div>
    </div>
  );
}

export default AssignmentDetails;
