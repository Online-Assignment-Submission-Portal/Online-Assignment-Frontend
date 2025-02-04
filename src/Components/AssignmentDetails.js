import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loding from "../partials/Loding";
import { Line } from 'react-chartjs-2';
import Header from './UserHeader';

function AssignmentDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const assignmentId = location.state?.assignment_id;
  const userRole = location.state?.userRole;
  const userID = location.state?.userID;
  const subjectID = location.state?.subjectID;
  // console.log(userID, "role2")
  const assignment = location.state?.assignment_details;
  const [assignmentDetails, setAssignmentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  // const apiUrl = process.env.REACT_APP_BASE_URL || "http://localhost:8000"
  const apiUrl = window.location.hostname === 'localhost'
  ? "http://localhost:8000" : process.env.REACT_APP_BASE_URL;
  const [submission, setSubmission] = useState(null);
  const [feedbackDetails, setFeedbackDetails] = useState();
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [submit, setSubmit] = useState(false);

  const handleBack = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        toast.error('Please sign in.');
        return navigate('/signin');
      }

      const response = await axios.get(
        `${apiUrl}/user/getsubject/${subjectID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data) {
        navigate(`/subject/${subjectID}`, {
          state: { subject: response.data, userID, userRole }
        });
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        toast.error("Subject details not found.");
      } else {
        toast.error("An error occurred while fetching subject details.");
      }
    }
  };

  const fetchMySubmission = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        return navigate('/signin');
      }

      const response = await axios.get(`${apiUrl}/assignment/${assignmentId}/${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      if (response.data.success) {
        setSubmission(response.data.fileURL);
        setFeedbackDetails(response.data)
        toast.success('Submission found! ');
      } else {
        toast.error('No submission found.');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'An error occurred while fetching your submission.');
    }
  };



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

        const response = await axios.get(`${apiUrl}/assignment/${assignmentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setAssignmentDetails(response.data.assignment);
        } else {
          // setError('Failed to fetch assignment details.');
          toast.error('Failed to fetch assignment details.');
        }
      } catch (err) {
        // setError('An error occurred while fetching assignment details.');
        toast.error('An error occurred while fetching assignment details.');

      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentDetails();
    if (userRole === 'student') fetchMySubmission();
  }, [assignmentId, navigate]);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    const allowedFormats = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'];
    const maxSize = 250 * 1024;

    if (uploadedFile && allowedFormats.includes(uploadedFile.name.split('.').pop().toLowerCase())) {
      if (uploadedFile.size <= maxSize) {
        setSelectedFile(uploadedFile);
      } else {
        toast.error('File size exceeds 250 KB.');
        e.target.value = null;
      }
    } else {
      toast.error('Unsupported file format. Allowed formats: pdf, doc, docx, txt, xls, xlsx, ppt, pptx.');
      e.target.value = null;
    }
  };

  const handleSubmitAssignment = async () => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];

    if (!selectedFile) {
      // setError('Please select a file to upload.');
      toast.error('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('fileupload', selectedFile);
    console.log('hello file:', selectedFile);
    try {

      const response = await axios.post(`${apiUrl}/assignment/submitassignment/${assignmentId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      console.log(response);
      if (response.data.success) {
        toast.success('Assignment submitted successfully!');
        console.log(response.data);
        setSubmission(response.data.submission.fileURL)
        // setData({ ...data, : response.data.data.image });
        closeModal();
        closeViewModal();
      }
    } catch (err) {
      // setError('An error occurred while submitting assignment');
      toast.error('An error occurred while submitting the assignment.');
    } finally {
      setIsUploading(false)
    }
  }

  const handleConnection = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      const response = await axios.post(`${apiUrl}/assignment/checkplagiarism/${assignmentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      if (response.data.success) {
        console.log(response.data);
        // const plagiarismResponse = await axios.post(`http://localhost:8501/checkplagiarism/${assignmentId}`, 
        // {data: response.data.fileDetails}, 
        // {
        //   headers:{ 
        //     'Content-Type': 'application/json', // Ensure Content-Type is set
        //   }
        //   })
        // console.log(plagiarismResponse);
      }
    } catch (err) {
      toast.error('An error occurred while checking Plagiarism.');
    }
  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setError('');
  };
  const closeViewModal = () => {
    setIsSubmissionModalOpen(false);
    setSelectedFile(null);
    setError('');
  }

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

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gray-900 text-gray-200 py-8">
      <div className="container mx-auto bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
            Assignment Details
          </h1>

          <div className="flex flex-wrap justify-center sm:justify-end gap-4">
            {userRole === 'teacher' && (
              <button
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
                onClick={() =>
                  navigate(`/updateassignment/${assignmentId}`, {
                    state: {
                      assignment_id: assignmentId,
                      assignment_details: assignmentDetails,
                      userRole,
                      userID,
                      subjectID,
                    },
                  })
                }
              >
                Update Details
              </button>
            )}
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
            >
              Back
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-gray-400 font-medium">Title:</p>
            <p>{assignmentDetails?.title}</p>
          </div>
          <div>
            <p className="text-gray-400 font-medium">Deadline:</p>
            <p>{new Date(assignmentDetails?.deadline).toLocaleString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })}</p>
          </div>
          <div>
            <p className="text-gray-400 font-medium">Description:</p>
            <p>{assignmentDetails?.description.length !== 0 ? assignmentDetails?.description : "No description available"}</p>
          </div>
          {assignmentDetails?.fileLink && (
            <div>
              <p className="text-gray-400 font-medium">Attachment:</p>
              <a
                href={`${assignmentDetails?.fileLink}`}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 font-medium">Marks Obtained:</p>
                  <p>
                    {feedbackDetails?.grade !== undefined
                      ? feedbackDetails?.grade
                      : 'Not graded yet'}
                  </p>
                  </div>
                  <div>
                  <p className="text-gray-400 font-medium">Teacher Feedback:</p>
                  <p>
                    {(feedbackDetails?.feedback !== undefined && feedbackDetails?.feedback.len > 0)
                      ? feedbackDetails?.feedback
                      : 'No feedback given'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Max Marks:</p>
                  <p>
                    {assignmentDetails?.maxVal !== undefined
                      ? assignmentDetails?.maxVal
                      : 'Not available'}
                  </p>
                </div>
              </div>

              {/* Submission Information */}
              <div className="mt-6">
                <p className="text-gray-400 font-medium">Status:</p>
                <p>
                  {feedbackDetails?.status !== undefined ?
                    feedbackDetails?.status : 'Not submitted yet'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap justify-center md:justify-end gap-4">
                {submission ? (
                  <button
                    onClick={() => setIsSubmissionModalOpen(true)}
                    className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg transition"
                  >
                    View My Submission
                  </button>
                ) : (
                  <button
                    onClick={openModal}
                    className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition"
                  >
                    {submit ? 'Submitting...' : 'Submit Assignment'}
                  </button>
                )}
              </div>
              {isSubmissionModalOpen && submission && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 overflow-auto">
                  <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-[90%] md:w-[50%] max-h-[90%] overflow-y-auto">
                    <div className="flex flex-col items-center">
                      <h2 className="text-xl font-semibold text-white text-center mb-2">Your Submission</h2>
                      <div className="w-full bg-gray-800 py-2 rounded-lg overflow-x-auto scrollbar-none font-medium text-gray-200 text-center whitespace-nowrap">
                        {extractFileName(submission)}.{extractFileExtension(submission)}
                      </div>

                      <div className="flex space-x-7">
                        <a
                          href={`https://docs.google.com/gview?url=${encodeURIComponent(submission)}&embedded=true`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline"
                        >
                          View File
                        </a>
                        <a
                          href={submission}
                          download
                          className="text-blue-400 hover:text-blue-300 underline"
                        >
                          Download File
                        </a>
                      </div>

                      <hr className="my-6 border-gray-600 w-full" />

                      <div className="w-full bg-gray-700 p-6 rounded-lg">
                        <p className="text-gray-300 text-xs text-center mb-4">
                          Your previous submission is shown above. If you'd like to submit a new file, you can upload it here.
                          <strong> Reuploading will replace your current submission.</strong>
                        </p>
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          className="block w-full text-gray-400 file:py-2 file:px-4 file:mr-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-500 transition"
                          accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                          required
                        />

                        <div className="flex justify-between w-full mt-4">
                          <button
                            onClick={closeViewModal}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSubmitAssignment()}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
                            disabled={isUploading}
                          >
                            {isUploading ? 'Uploading...' : 'Reupload'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              )}
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
                    <div className="flex justify-between mt-4">
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
            <div className="space-y-6">
              {/* Marks Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 font-medium">Min Marks:</p>
                  <p>
                    {assignmentDetails?.minVal !== undefined
                      ? assignmentDetails?.minVal
                      : 'Not graded yet'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Max Marks:</p>
                  <p>
                    {assignmentDetails?.maxVal !== undefined
                      ? assignmentDetails?.maxVal
                      : 'Not available'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
                <div className="flex justify-center md:justify-start">
                  <button
                    onClick={() =>
                      navigate(`/view-submission/${assignmentId}`, {
                        state: { assignment_id: assignmentId },
                      })
                    }
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition"
                  >
                    View Submissions
                  </button>
                </div>
                <div className="flex justify-center md:justify-end">
                  <button
                    onClick={() =>
                      navigate('/check-plagiarism', {
                        state: { assignment_id: assignmentId },
                      })
                    }
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition"
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
    </>
  );
}

export default AssignmentDetails;
