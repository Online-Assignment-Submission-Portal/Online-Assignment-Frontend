import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CheckPlagiarism() {
  const location = useLocation();
  const navigate = useNavigate();
  const assignmentId = location.state?.assignment_id; 
    console.log("FD FD");
  const [plagiarismData, setPlagiarismData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlagiarismData = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          toast.error("Please sign in.");
          return navigate("/signin");
        }

        const response = await axios.post(
          `http://localhost:8000/assignment/checkplagiarism/${assignmentId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        console.log(response.data.mlResponse.results);
        if (response.data.success) {
          setPlagiarismData(response.data.mlResponse.results);
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
      <ToastContainer position="top-center" autoClose={1500} />
      <div className="container mx-auto bg-gray-800 p-8 rounded-lg shadow-lg max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Plagiarism Check</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
          >
            Back
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-700 text-gray-200">
                <th className="px-4 py-2 border border-gray-600">Student 1</th>
                <th className="px-4 py-2 border border-gray-600">Student 2</th>
                <th className="px-4 py-2 border border-gray-600">Semantic Similarity (%)</th>
                <th className="px-4 py-2 border border-gray-600">Fingerprint Similarity (%)</th>
                <th className="px-4 py-2 border border-gray-600">Combined Similarity (%)</th>
              </tr>
            </thead>
            <tbody>
              {plagiarismData.length > 0 ? (
                plagiarismData.map((entry, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                    } hover:bg-gray-600`}
                  >
                    <td className="px-4 py-2 border border-gray-600">
                      {entry.studentId1}
                    </td>
                    <td className="px-4 py-2 border border-gray-600">
                      {entry.studentId2}
                    </td>
                    <td className="px-4 py-2 border border-gray-600">
                      {entry.SemanticSimilarity}%
                    </td>
                    <td className="px-4 py-2 border border-gray-600">
                      {entry.FingerprintSimilarity}%
                    </td>
                    <td className="px-4 py-2 border border-gray-600">
                      {entry.CombinedSimilarity}%
                    </td>
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
      </div>
    </div>
  );
}

export default CheckPlagiarism;
