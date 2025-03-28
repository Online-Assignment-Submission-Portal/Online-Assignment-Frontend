import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loding from "../partials/Loding";
import "react-toastify/dist/ReactToastify.css";
import Feedback from "./Feedback";
import PieChart from "./Partials/PieChart";
import BarGraph from "./Partials/BarGraph";
import Header from "./UserHeader";

function CheckPlagiarism() {
  const location = useLocation();
  const navigate = useNavigate();
  const assignmentId = location.state?.assignment_id;
  const apiUrl =
    window.location.hostname === "localhost"
      ? "http://localhost:8000"
      : import.meta.env.VITE_APP_BASE_URL;

  const [plagiarismData, setPlagiarismData] = useState([]);
  const [submitted, setSubmitted] = useState(0);
  const [notSubmitted, setNotSubmitted] = useState(0);
  const [late, setLate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissions, setSubmissions] = useState([]);
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
  };

  const handleUpdateSubmissions = (updatedSubmissions) => {
    setSubmissions(updatedSubmissions);
  };

  const mergeData = (mlResponse, submissions) => {
    if (!mlResponse?.rubricResults || !Array.isArray(mlResponse.rubricResults)) {
      console.error("Invalid mlResponse or rubricResults is not an array:", mlResponse);
      return [];
    }
  
    if (!submissions || !Array.isArray(submissions)) {
      console.error("Invalid submissions or submissions is not an array:", submissions);
      return [];
    }
    const rubricMap = mlResponse.rubricResults.reduce((acc, item) => {
      const studentId = item?.studentId?.id;
      if (studentId !== undefined) {
        acc[String(studentId)] = item; 
      }
      return acc;
    }, {});
    const mergedData = submissions.map(submission => {
      const submissionId = String(submission.studentId);
      const matchingRubric = rubricMap[submissionId]; 
      return {
        ...submission, 
        ...(matchingRubric || {}), 
        studentId: matchingRubric ? matchingRubric.studentId : { id: submission.studentId }
      };
    });
    return mergedData;
  };
  

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
        // console.log(response);

        if (response.data.success && response.data.mlResponse.results) {
          setPlagiarismData(response.data.mlResponse.results);
          setSubmitted(response.data.submitted);
          setNotSubmitted(response.data.notSubmitted);
          setLate(response.data.late);
          const mergedData = mergeData(response.data.mlResponse, response.data.submissions);
          // console.log(mergedData);
          setSubmissions(mergedData);
          const toastId = "plagiarism-success";
          if (!toast.isActive(toastId)) {
            toast.success("Data fetched successfully.", { toastId });
          }
        } else {
          toast.error("Failed to fetch data.");
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-gray-200 py-4 sm:py-8">
        <div className="container mx-auto bg-gray-800 p-4 sm:p-8 rounded-lg shadow-lg md:max-w-6xl">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">
              Submission Details
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
            <BarGraph plagiarismData={plagiarismData} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-200 mb-4">Submission Statistics</h2>
          <div className="flex justify-center items-center bg-gray-800 rounded-lg shadow-md mb-10 overflow-visible">
            <PieChart submitted={submitted} notSubmitted={notSubmitted} late={late} />
          </div>
          <div className="overflow-x-auto mt-8 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-200">Plagiarism Report</h2>
            <div className="mb-4 flex flex-row justify-between sm:justify-end gap-3 mt-2">
              <label className="inline-flex items-center select-none">
                <input
                  type="checkbox"
                  checked={columns.CosineSimilarity}
                  onChange={() => handleFieldToggle("CosineSimilarity")}
                  className="mr-2"
                />
                Cosine Similarity
              </label>
              <label className="inline-flex items-center select-none">
                <input
                  type="checkbox"
                  checked={columns.JaccardSimilarity}
                  onChange={() => handleFieldToggle("JaccardSimilarity")}
                  className="mr-2"
                />
                Jaccard Similarity
              </label>
              <label className="inline-flex items-center select-none">
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
                      title="Measures similarity by comparing the angle between two text vectors, focusing on word usage patterns."
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
                      title="Combines Cosine and Jaccard similarity for a more balanced score."
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
                        title={"Assignment 1"}
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
                          href={`https://docs.google.com/gview?url=${encodeURIComponent(
                            entry.studentId2.fileUrl
                          )}&embedded=true`}
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
          <Feedback assignmentId={assignmentId} submissions={submissions} onUpdateSubmissions={handleUpdateSubmissions} />
        </div>
      </div>
    </>
  );
}

export default CheckPlagiarism;
