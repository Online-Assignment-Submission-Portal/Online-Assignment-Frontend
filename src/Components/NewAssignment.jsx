import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function NewAssignment() {
  const navigate = useNavigate();
  const location = useLocation();
  const subject = location.state?.subject;
  const userID = location.state?.userID;
  const userRole = location.state?.userRole;
  const foundStudents = location.state?.foundStudents;
  // const apiUrl = process.env.REACT_APP_BASE_URL || "http://localhost:8000"
  const apiUrl = window.location.hostname === 'localhost'
    ? "http://localhost:8000" : import.meta.env.VITE_APP_BASE_URL;
  // const subjectID = location.state?.subject.subject_id
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [minVal, setMinVal] = useState('0');
  const [maxVal, setMaxVal] = useState('');
  const [deadline, setDeadline] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
  

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    const allowedFormats = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'];
    const maxSize = 250 * 1024;

    if (uploadedFile && allowedFormats.includes(uploadedFile.name.split('.').pop().toLowerCase())) {
      if (uploadedFile.size <= maxSize) {
        setFile(uploadedFile);
      } else {
        toast.error('File size exceeds 250 KB.');
        e.target.value = null;
      }
    } else {
      toast.error('Unsupported file format. Allowed formats: pdf, doc, docx, txt, xls, xlsx, ppt, pptx.');
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    if (!file) {
      toast.error('Please upload a file.');
      return;
    }

    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        toast.error('Token not found, redirecting to sign-in.');
        return navigate('/signin');
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('minVal', minVal);
      formData.append('maxVal', maxVal);
      formData.append('deadline', deadline);
      formData.append('file', file);
      // const subjectId = subject._id.toString();

      const response = await axios.post(
        `${apiUrl}/assignment/new/${subject.subject_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const senderId = userID;
      if (response.data.success) {
        toast.success('Assignment created successfully!');
        foundStudents.forEach(async (studentId) => {
          try {
            await axios.post(
              `${apiUrl}/notification/new`,
              {
                senderId,
                receiverId: studentId,
                content: `A new Assignment has been added to the subject: ${subject.subject_name}`,
                status:'unread',
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );
          } catch (error) {
            console.error('Error sending notification:', error);
          }
        });
        const response2 = await axios.get(
          `${apiUrl}/user/getsubject/${subject.subject_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response2, " resp2 ");
        if (response2.status === 200 && response2.data) {
          navigate(`/subject/${subject.subject_id}`, { state: { subject: response2.data, userID, userRole } });
        }
        else {
          toast.error(response2.data.message);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // console.error('Error creating assignment:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 flex items-center justify-center">
      {/* <ToastContainer position="top-center" autoClose={1500} hideProgressBar={false} /> */}
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-full max-w-3xl">
        <h1 className="text-4xl font-extrabold text-gray-200 mb-8 text-center">Create New Assignment</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 mb-2 font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter assignment title"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter assignment description"
              rows={10}
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-gray-400 mb-2 font-medium">Min Marks</label>
              <input
                type="number"
                value={minVal}
                onChange={(e) => setMinVal(e.target.value)}
                className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-400 mb-2 font-medium">Max Marks</label>
              <input
                type="number"
                value={maxVal}
                onChange={(e) => setMaxVal(e.target.value)}
                className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-2 font-medium">Deadline</label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 "
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2 font-medium">Upload File</label>
            <input
              type="file"
              onChange={handleFileUpload}
              className="block w-full text-gray-400 file:py-2 file:px-4 file:mr-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-500 transition"
              accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
              required
            />
          </div>

          <div className="flex justify-between items-center gap-2 font-semibold">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewAssignment;
