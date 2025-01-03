import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function NewAssignment() {
  const navigate = useNavigate();
  const location = useLocation();
  const subject = location.state?.subject;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [minVal, setMinVal] = useState('0');
  const [maxVal, setMaxVal] = useState('');
  const [deadline, setDeadline] = useState('');
  const [file, setFile] = useState(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    const allowedFormats = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'];
    const maxSize = 5 * 1024 * 1024;

    if (uploadedFile && allowedFormats.includes(uploadedFile.name.split('.').pop().toLowerCase())) {
      if (uploadedFile.size <= maxSize) {
        setFile(uploadedFile);
      } else {
        alert('File size exceeds 5MB.');
      }
    } else {
      alert('Unsupported file format. Allowed formats: pdf, doc, docx, txt, xls, xlsx, ppt, pptx.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please upload a file.');
      return;
    }

    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        return navigate('/signin');
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('minVal', minVal);
      formData.append('maxVal', maxVal);
      formData.append('deadline', deadline);
      formData.append('createdBy', subject.teacher_id);
      formData.append('file', file);
      // const subjectId = subject._id.toString();
      console.log(subject);

      const response = await axios.post(
        `http://localhost:8000/assignment/new/${subject.subject_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        alert('Assignment created successfully!');
        navigate(`/dashboard/${subject.userID}`);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 flex items-center justify-center">
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
              rows={5}
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
              className="block w-full text-gray-400 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition"
              accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewAssignment;
