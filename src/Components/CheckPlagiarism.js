
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Loding from "../partials/Loding";
import "react-toastify/dist/ReactToastify.css";

function CheckPlagiarism() {
  const location = useLocation();
  const navigate = useNavigate();
  const assignmentId = location.state?.assignment_id;
  
  const [plagiarismData, setPlagiarismData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for column visibility
  const [columns, setColumns] = useState({
    semantic: true,
    fingerprint: true,
    combined: true,
  });
  
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
        console.log('hello every', response.data);
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

  // hardcoded data for testing
  // useEffect(() => {
  //   const fetchPlagiarismData = async () => {
  //     try {
  //       const token = document.cookie
  //         .split("; ")
  //         .find((row) => row.startsWith("token="))
  //         ?.split("=")[1];

  //       if (!token) {
  //         toast.error("Please sign in.");
  //         return navigate("/signin");
  //       }

  //       const testData = [
  //         {
  //           studentId1: {
  //             name: "Student A",
  //             fileUrl: "http://example.com/fileA.pdf",
  //           },
  //           studentId2: {
  //             name: "Student B",
  //             fileUrl: "http://example.com/fileB.pdf",
  //           },
  //           SemanticSimilarity: 85,
  //           FingerprintSimilarity: 75,
  //           CombinedSimilarity: 80,
  //         },
  //         {
  //           studentId1: {
  //             name: "Student C",
  //             fileUrl: "http://example.com/fileC.pdf",
  //           },
  //           studentId2: {
  //             name: "Student D",
  //             fileUrl: "http://example.com/fileD.pdf",
  //           },
  //           SemanticSimilarity: 65,
  //           FingerprintSimilarity: 70,
  //           CombinedSimilarity: 68,
  //         },
  //         {
  //           studentId1: {
  //             name: "Student E",
  //             fileUrl: "http://example.com/fileE.pdf",
  //           },
  //           studentId2: {
  //             name: "Student F",
  //             fileUrl: "http://example.com/fileF.pdf",
  //           },
  //           SemanticSimilarity: 90,
  //           FingerprintSimilarity: 85,
  //           CombinedSimilarity: 88,
  //         },
  //       ];

  //       setPlagiarismData(testData);
  //       toast.success("Test plagiarism data loaded successfully.");
  //     } catch (err) {
  //       setError("An error occurred while loading test data.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchPlagiarismData();
  // }, [navigate]);

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

  const handleColumnToggle = (column) => {
    setColumns((prevColumns) => ({
      ...prevColumns,
      [column]: !prevColumns[column],
    }));
  };

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

        {/* Column toggle controls */}
        <div className="mb-4">
          <label className="inline-flex items-center mr-4">
            <input
              type="checkbox"
              checked={columns.semantic}
              onChange={() => handleColumnToggle("semantic")}
              className="mr-2"
            />
            Semantic Similarity
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="checkbox"
              checked={columns.fingerprint}
              onChange={() => handleColumnToggle("fingerprint")}
              className="mr-2"
            />
            Fingerprint Similarity
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={columns.combined}
              onChange={() => handleColumnToggle("combined")}
              className="mr-2"
            />
            Combined Similarity
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-700 text-gray-200">
                <th className="px-4 py-2 border border-gray-600">Student 1</th>
                <th className="px-4 py-2 border border-gray-600">Student 2</th>
                {columns.semantic && (
                  <th
                    className="px-4 py-2 border border-gray-600"
                    title="Measures the similarity in meaning or context between the assignments."
                  >
                    Semantic Similarity (%)
                  </th>
                )}
                {columns.fingerprint && (
                  <th
                    className="px-4 py-2 border border-gray-600"
                    title="Measures the similarity in structural or fingerprint aspects between the assignments."
                  >
                    Fingerprint Similarity (%)
                  </th>
                )}
                {columns.combined && (
                  <th
                    className="px-4 py-2 border border-gray-600"
                    title="A weighted combination of semantic and fingerprint similarities."
                  >
                    Combined Similarity (%)
                  </th>
                )}
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
                      <a
                        href={`https://docs.google.com/gview?url=${encodeURIComponent(
                          entry.studentId1.fileUrl
                        )}&embedded=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        {entry.studentId1.name}
                      </a>
                    </td>
                    <td className="px-4 py-2 border border-gray-600">
                      <a
                        href={`https://docs.google.com/gview?url=${encodeURIComponent(
                          entry.studentId2.fileUrl
                        )}&embedded=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        {entry.studentId2.name}
                      </a>
                    </td>
                    {columns.semantic && (
                      <td className="px-4 py-2 border border-gray-600">
                        {entry.SemanticSimilarity}%
                      </td>
                    )}
                    {columns.fingerprint && (
                      <td className="px-4 py-2 border border-gray-600">
                        {entry.FingerprintSimilarity}%
                      </td>
                    )}
                    {columns.combined && (
                      <td className="px-4 py-2 border border-gray-600">
                        {entry.CombinedSimilarity}%
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
      </div>
    </div>
  );
}

export default CheckPlagiarism;

