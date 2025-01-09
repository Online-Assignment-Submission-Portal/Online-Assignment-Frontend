import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
function AssignmentDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const assignmentId = location.state?.assignment_id;
  const userRole = location.state?.userRole;
  const userID = location.state?.userID;
  // console.log(userID, "role2")
  const assignment = location.state?.assignment_details;
  // console.log('kya be assignment:', assignment); 
  const [assignmentDetails, setAssignmentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);

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
  
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    const allowedFormats = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'];
    const maxSize = 5 * 1024 * 1024;
    
    if (uploadedFile && allowedFormats.includes(uploadedFile.name.split('.').pop().toLowerCase())) {
      if (uploadedFile.size <= maxSize) {
        setSelectedFile(uploadedFile);
      } else {
        alert('File size exceeds 5MB.');
      }
    } else {
      alert('Unsupported file format. Allowed formats: pdf, doc, docx, txt, xls, xlsx, ppt, pptx.');
    }
  };

  const handleSubmitAssignment = async () => {
    const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];
    
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }
    
    const formData = new FormData();
    formData.append('fileupload', selectedFile);
    console.log('hello file:', selectedFile);
    try{
      
      const response = await axios.post(`http://localhost:8000/assignment/submitassignment/${assignmentId}`, 
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }); 
      console.log(response);
      if(response.data.success) {
        alert('Assignment submitted successfully!');
        console.log(response.data);
        // setData({ ...data, : response.data.data.image });
        closeModal();
      }
    }catch(err) {
      setError('An error occurred while submitting assignment');
    }
  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setError('');
  };
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
          <div className='space-x-4'>
          <button
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
            onClick={()=> navigate(`/updateassignment/${assignmentId}`, {state : {assignment_id : assignmentId, 
            assignment_details : assignmentDetails ,userRole ,userID}})}
            >
              Update Details
            </button>
        
          <button
            onClick={() => navigate(`/dashboard/${userID}`)} // to be changed
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
          >
            Back
          </button>

          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-gray-400 font-medium">Title:</p>
            <p>{assignmentDetails.title}</p>
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
                  // onClick={() => handleSubmitAssignment(assignmentDetails)}
                  onClick={openModal}
                  className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition"
                >
                  Submit Assignment
                </button>
              </div>
              {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-[90%] md:w-[50%]">
            <h2 className="text-xl font-semibold mb-4 text-white text-center">Upload Assignment</h2>
            <input
              type="file"
              onChange={handleFileUpload}
              className="block w-full text-gray-400 file:py-2 file:px-4 file:mr-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-500 transition"
              accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
              required
            />
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="mr-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitAssignment()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          </div>
        </div>
      )}
            </>
          ) : userRole === 'teacher' ? (
            <div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 font-medium">Min Marks:</p>
                  <p>
                    {assignmentDetails.minVal !== undefined ? assignmentDetails.minVal : 'Not graded yet'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Max Marks:</p>
                  <p>{assignmentDetails.maxVal !== undefined ? assignmentDetails.maxVal : 'Not available'}</p>
                </div>
              </div>
              <div>
                
              </div>
              <div className='flex justify-between items-center mb-8'>
              <div className="mt-8 text-left">
                <button
                onClick={() => navigate(`/view-submission/${assignmentId}`, {state : {assignment_id: assignmentId}})}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold 
                rounded-lg transition">
                  View Submissions
                </button>
              </div>
              <div className="mt-8 text-right">
                <button
                  onClick={() => alert('Check for Plagiarism feature is under construction!')}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold 
                  rounded-lg transition"
                  >
                  Check for Plagiarism
                </button>
              </div>
              </div>
            </div>
          ) : null}

        </div>
      </div>
    </div>
  );
}

export default AssignmentDetails;
