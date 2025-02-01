import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loding from "../partials/Loding";
import "react-toastify/dist/ReactToastify.css";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  BarController,
} from 'chart.js';
import Header from './UserHeader';

// Register required components
Chart.register(BarElement, CategoryScale, LinearScale, BarController);

function ViewSubmission() {
  // const apiUrl = process.env.REACT_APP_BASE_URL || "http://localhost:8000"
  const apiUrl = window.location.hostname === 'localhost'
  ? "http://localhost:8000" : process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const assignmentId = location.state?.assignment_id;
  const [submittedSubmissions, setSubmittedSubmissions] = useState([]);
  const [lateSubmissions, setLateSubmissions] = useState([]);
  const [submitted, setSubmitted] = useState(0);
  const [notSubmitted, setNotSubmitted] = useState(0);
  const [late, setLate] = useState(0);
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

        const response = await axios.get(`${apiUrl}/assignment/submission/${assignmentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setSubmittedSubmissions(response.data.submissions.submitted);
          setLateSubmissions(response.data.submissions.late);
          setSubmitted(response.data.submitted);
          setNotSubmitted(response.data.notSubmitted);
          setLate(response.data.late);
          toast.success('Submissions loaded successfully!');

        } else {
          toast.error('Failed to fetch assignment submissions.');
        }
      } catch (err) {
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

  const pieData = {
    labels: ["Submitted", "Not Submitted", "Late"],
    datasets: [
      {
        label: "Assignment Status",
        data: [submitted, notSubmitted, late],
        backgroundColor: ["#4caf50", "#f44336", "#ff9800"],
        borderColor: ["#4caf50", "#f44336", "#ff9800"],
        borderWidth: 1,
        hoverOffset: 20,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 10
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) =>
            `${tooltipItem.label}: ${tooltipItem.raw} (${(
              (tooltipItem.raw / (submitted + notSubmitted + late)) *
              100
            ).toFixed(2)}%)`,
        },
      },
    },
  };

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gray-900 text-gray-200 py-8">
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

        <div className="flex justify-center items-center bg-gray-800 rounded-lg shadow-md mb-10 overflow-visible">
            <div className="w-full md:w-1/2 lg:w-1/3 h-[400px] overflow-visible">
                <Pie
                  data={pieData}
                  options={pieOptions}
                />
              </div>
          </div>

        {/* Submitted Submissions Table */}
        <h2 className="text-2xl font-semibold mb-4">Submissions</h2>
        <div className='w-5/5 max-h-96 overflow-y-auto mt-6'>
          <table className="w-full bg-gray-800 text-gray-200 rounded-lg">
            <thead>
              <tr className="bg-violet-800">
                <th className="px-4 py-2 text-center">Student Name</th>
                <th className="px-4 py-2 text-center">Roll No</th>
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
                  {submission.fileURL && (
                    <td className="border-b border-gray-600 px-4 py-2 items-center">
                      <div className="flex flex-col items-center">
                        <span className="font-medium text-gray-200">
                          {extractFileName(submission.fileURL)}.{extractFileExtension(submission.fileURL)}
                        </span>
                        <div className="flex space-x-7 mt-2">
                          <a
                            href={`https://docs.google.com/gview?url=${encodeURIComponent(submission.fileURL)}&embedded=true`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            View File
                          </a>
                          <a
                            href={submission.fileURL}
                            download
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            Download File
                          </a>
                        </div>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Late Submissions Table */}
        <h2 className="text-2xl font-semibold mb-4 mt-16">Late Submissions</h2>
        <div className='w-5/5 max-h-96 overflow-y-auto mt-6'>
          <table className="w-full bg-gray-800 text-gray-200 rounded-lg">
            <thead>
              <tr className="bg-red-800">
                <th className="px-4 py-2 text-center">Student Name</th>
                <th className="px-4 py-2 text-center">Roll No</th>
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
                  {submission.fileURL && (
                    <td className="border-b border-gray-600 px-4 py-2 items-center">
                      <div className="flex flex-col items-center">
                        <span className="font-medium text-gray-200">
                          {extractFileName(submission.fileURL)}.{extractFileExtension(submission.fileURL)}
                        </span>
                        <div className="flex space-x-7 mt-2">
                          <a
                            href={`https://docs.google.com/gview?url=${encodeURIComponent(submission.fileURL)}&embedded=true`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            View File
                          </a>
                          <a
                            href={submission.fileURL}
                            download
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            Download File
                          </a>
                        </div>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
}

export default ViewSubmission;