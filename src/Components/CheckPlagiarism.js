import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Loding from "../partials/Loding";
import "react-toastify/dist/ReactToastify.css";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  BarController,
} from 'chart.js';

// Register required components
Chart.register(BarElement, CategoryScale, LinearScale, BarController);


ChartJS.register(ArcElement, Tooltip, Legend);

function CheckPlagiarism() {
  const location = useLocation();
  const navigate = useNavigate();
  const assignmentId = location.state?.assignment_id;
  const apiUrl =
    window.location.hostname === "localhost"
      ? "http://localhost:8000"
      : process.env.REACT_APP_BASE_URL;

  const [plagiarismData, setPlagiarismData] = useState([]);
  const [submitted, setSubmitted] = useState(0);
  const [notSubmitted, setNotSubmitted] = useState(0);
  const [late, setLate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittedSubmissions, setSubmittedSubmissions] = useState([]);
  const [editedSubmissions, setEditedSubmissions] = useState({});
  const [columns, setColumns] = useState({
    CosineSimilarity: true,
    JaccardSimilarity: true,
    CombinedSimilarity: true,
  });

  const handleFieldToggle = (column) => {
    setColumns((prevColumns) => ({
      ...prevColumns,
      [column]: !prevColumns[column],
    }));
  }



  const handleInputChange = (e, studentId, field) => {
    const { value } = e.target;
    setEditedSubmissions(prevState => ({
      ...prevState,
      [studentId]: {
        ...prevState[studentId],
        [field]: value
      }
    }));
  };

  const handleSave = async (studentId) => {
    const submissionData = editedSubmissions[studentId];
    if (!submissionData?.marks) {
      toast.error('Marks cannot be empty.');
      return;
    }
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))?.split('=')[1];

      if (!token) {
        toast.error('Please sign in to save submissions.');
        return navigate('/signin');
      }

      // Send the updated marks and feedback to your backend
      const response = await axios.post(`${apiUrl}/assignment/submission/save/${studentId}/${assignmentId}`, {
        marks: submissionData.marks,
        feedback: submissionData.feedback
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
       console.log(response);
      if (response.data.success) {
        toast.success('Submission saved successfully!');
      } else {
        toast.error('Failed to save submission.');
      }
    } catch (err) {
      toast.error('Error in saving submission.');
    }
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))?.split('=')[1];

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
          const { submitted, late } = response.data.submissions;

          const formattedSubmissions = [
            ...submitted.map((submission) => ({ ...submission, status: 'On Time' })),
            ...late.map((submission) => ({ ...submission, status: 'Late' })),
          ];

          setSubmittedSubmissions(formattedSubmissions);
          toast.success('Feedback loaded successfully!');
        } else {
          toast.error('Failed to fetch assignment Feedback.');
        }
      } catch (err) {
        toast.error('Error in fetching Feedback.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [assignmentId, navigate]);


  useEffect(() => {
    const fetchPlagiarismData = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          toast.error("Authentication token is missing. Please sign in.");
          return navigate("/signin");
        }

        const response = await axios.post(
          `${apiUrl}/assignment/checkplagiarism/${assignmentId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success && response.data.mlResponse.results) {
          setPlagiarismData(response.data.mlResponse.results);
          setSubmitted(response.data.submitted);
          setNotSubmitted(response.data.notSubmitted);
          setLate(response.data.late);
          toast.success("Plagiarism data fetched successfully.");
        } else {
          toast.error("Failed to fetch plagiarism data.");
        }
      } catch (err) {
        setError(err?.response?.data?.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlagiarismData();
  }, [assignmentId, navigate]);

  if (loading) {
    return <Loding />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>{error}</p>
      </div>
    );
  }

  const ranges = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  const aggregateCounts = (key) => {
    return ranges.slice(0, -1).map((rangeStart, index) => {
      const rangeEnd = ranges[index + 1];
      return plagiarismData.filter(
        (entry) =>
          entry[key] >= rangeStart && entry[key] < rangeEnd
      ).length;
    });
  };

  const chartData = {
    labels: ranges.slice(0, -1).map(
      (rangeStart, index) => `${rangeStart}-${ranges[index + 1] - 1}%`
    ),
    datasets: [
      {
        label: "Combined Similarity (%)",
        data: aggregateCounts("CombinedSimilarity"),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
      {
        label: "Cosine Similarity (%)",
        data: aggregateCounts("CosineSimilarity"),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
      {
        label: "Jaccard Similarity (%)",
        data: aggregateCounts("JaccardSimilarity"),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
    ],
  };



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
    <div className="min-h-screen bg-gray-900 text-gray-200 py-4 sm:py-8">
      <ToastContainer position="top-center" autoClose={1500} />

      <div className="container mx-auto bg-gray-800 p-4 sm:p-8 rounded-lg shadow-lg md:max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">
            Plagiarism Check
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="w-auto px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
          >
            Back
          </button>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-200 mb-4">Plagiarism Statistics</h2>
        <div className="container mx-auto mb-4 sm:mb-8 bg-gray-300 rounded-md overflow-hidden">
          <div className="h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] w-full">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top" },
                  title: {
                    display: true,
                    text: "Similarity Distribution",
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Similarity Percentage",
                      font: { size: 14 },
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Number of Comparisons",
                      font: { size: 14 },
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-200 mb-4">Submission Statistics</h2>
        <div className="flex justify-center items-center bg-gray-800 rounded-lg shadow-md mb-10 overflow-visible">
          <div className="w-full md:w-1/2 lg:w-1/3 h-[400px] overflow-visible">
            <Pie
              data={pieData}
              options={pieOptions}
            />
          </div>
        </div>


        <div className="overflow-x-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-200 mb-4">Plagiarism Report</h2>
          <div className="mb-4 flex flex-row justify-end gap-2 ">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={columns.CosineSimilarity}
              onChange={() => handleFieldToggle("CosineSimilarity")}
              className="mr-2"
            />
            Cosine Similarity
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={columns.JaccardSimilarity}
              onChange={() => handleFieldToggle("JaccardSimilarity")}
              className="mr-2"
            />
            Jaccard Similarity
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={columns.CombinedSimilarity}
              onChange={() => handleFieldToggle("CombinedSimilarity")}
              className="mr-2"
            />
            Combined Similarity
          </label>
        </div>
          <table className="w-full text-left border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-700 text-gray-200">
                <th className="px-2 sm:px-4 py-2 border border-gray-600">
                  Student 1
                </th>
                <th className="px-2 sm:px-4 py-2 border border-gray-600">
                  Student 2
                </th>
                {columns.CosineSimilarity && (
                  <th
                    className="px-2 sm:px-4 py-2 border border-gray-600 relative group"
                    title="Measures similarity by comparing the angle between two text vectors, focusing on word usage patterns"
                  >
                    Cosine Similarity (%){" "}
                    <span className="text-blue-400 cursor-help ml-1">🛈</span>
                  </th>
                )}
                {columns.JaccardSimilarity && (

                  <th
                    className="px-2 sm:px-4 py-2 border border-gray-600 relative group"
                    title="Measures similarity by comparing the overlap of unique words between two documents."
                  >
                    Jaccard Similarity (%){" "}
                    <span className="text-blue-400 cursor-help ml-1">🛈</span>
                  </th>
                )}
                {columns.CombinedSimilarity && (

                  <th
                    className="px-2 sm:px-4 py-2 border border-gray-600 relative group"
                    title="Combines cosine and Jaccard similarity for a more balanced score."
                  >
                    Combined Similarity (%){" "}
                    <span className="text-blue-400 cursor-help ml-1">🛈</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {plagiarismData.length > 0 ? (
                plagiarismData.map((entry, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                      } hover:bg-gray-600`}
                  >
                    <td
                      className="px-2 sm:px-4 py-2 border border-gray-600"
                      title={'Assignment 1'}
                    >
                      <a
                        href={`https://docs.google.com/gview?url=${entry.studentId1.fileUrl}&embedded=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        {entry.studentId1.name}
                      </a>
                    </td>
                    <td
                      className="px-2 sm:px-4 py-2 border border-gray-600"
                      title={"Assignment 2"}
                    >
                      <a
                        href={`https://docs.google.com/gview?url=${encodeURIComponent(entry.studentId2.fileUrl)}&embedded=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        {entry.studentId2.name}
                      </a>
                    </td>
                    {columns.CosineSimilarity && (
                      <td className="px-2 sm:px-4 py-2 border border-gray-600">
                        {entry.CosineSimilarity.toFixed(2)}%
                      </td>
                    )}
                    {columns.JaccardSimilarity && (

                      <td className="px-2 sm:px-4 py-2 border border-gray-600">
                        {entry.JaccardSimilarity.toFixed(2)}%
                      </td>
                    )}
                    {columns.CombinedSimilarity && (

                      <td className="px-2 sm:px-4 py-2 border border-gray-600">
                        {entry.CombinedSimilarity.toFixed(2)}%
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-gray-400 px-4 py-2"
                  >
                    No plagiarism data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto mt-8 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-200 mb-4">Grading and Feedback</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-gray-700">
              <thead>
                <tr className="bg-gray-700 text-gray-200">
                  <th className="px-4 py-2 border border-gray-600">Name</th>
                  <th className="px-4 py-2 border border-gray-600">Roll No</th>
                  <th className="px-4 py-2 border border-gray-600">Status</th>
                  <th className="px-4 py-2 border border-gray-600">Marks</th>
                  <th className="px-4 py-2 border border-gray-600">Feedback</th>
                  <th className="px-4 py-2 border border-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submittedSubmissions.length > 0 ? (
                  submittedSubmissions.map((submission, index) => (
                    <tr
                      key={submission.studentId}
                      className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                        } hover:bg-gray-600`}
                    >
                      <td className="border-b border-gray-600 px-4 py-2">
                        {submission.firstName} {submission.lastName}
                      </td>
                      <td className="border-b border-gray-600 px-4 py-2">
                        {submission.rollNo}
                      </td>
                      <td className="border-b border-gray-600 px-4 py-2">
                        {submission.status}
                      </td>
                      <td className="border-b border-gray-600 px-4 py-2">
                        <input
                          type="number"
                          value={editedSubmissions[submission.studentId]?.marks || submission.marks}
                          onChange={(e) => handleInputChange(e, submission.studentId, "marks")}
                          className="bg-gray-600 border border-gray-400 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border-b border-gray-600 px-4 py-2">
                        <input
                          type="text"
                          value={editedSubmissions[submission.studentId]?.feedback || submission.feedback}
                          onChange={(e) => handleInputChange(e, submission.studentId, "feedback")}
                          className="bg-gray-600 border border-gray-400 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border-b border-gray-600 px-4 py-2 text-center">
                        <button
                          onClick={() => handleSave(submission.studentId)}
                          className="bg-blue-600 text-white py-1 px-4 rounded-lg hover:bg-blue-500"
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-400 px-4 py-2">
                      No submissions found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>


      </div>
    </div>
  );
}

export default CheckPlagiarism;
