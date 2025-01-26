import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Bar } from "react-chartjs-2";
import Loding from "../partials/Loding";
import "react-toastify/dist/ReactToastify.css";
import { Chart as ChartJS } from "chart.js/auto";

function CheckPlagiarism() {
  const location = useLocation();
  const navigate = useNavigate();
  const assignmentId = location.state?.assignment_id;
  // const apiUrl = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
  const apiUrl = window.location.hostname === 'localhost'
  ? "http://localhost:8000" : process.env.REACT_APP_BASE_URL;
  const [plagiarismData, setPlagiarismData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // State for column visibility
  const [columns, setColumns] = useState({
    semantic: true,
    fingerprint: true,
    combined: true,
  });

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
  //             id: "S001",
  //             name: "Student A",
  //             fileUrl: "http://example.com/fileA.pdf",
  //           },
  //           studentId2: {
  //             id: "S002",
  //             name: "Student B",
  //             fileUrl: "http://example.com/fileB.pdf",
  //           },
  //           SemanticSimilarity: 45,
  //           FingerprintSimilarity: 75,
  //           CombinedSimilarity: 80,
  //         },
  //         {
  //           studentId1: {
  //             id: "S003",
  //             name: "Student C",
  //             fileUrl: "http://example.com/fileC.pdf",
  //           },
  //           studentId2: {
  //             id: "S004",
  //             name: "Student D",
  //             fileUrl: "http://example.com/fileD.pdf",
  //           },
  //           SemanticSimilarity: 65,
  //           FingerprintSimilarity: 70,
  //           CombinedSimilarity: 68,
  //         },
  //         {
  //           studentId1: {
  //             id: "S005",
  //             name: "Student E",
  //             fileUrl: "http://example.com/fileE.pdf",
  //           },
  //           studentId2: {
  //             id: "S006",
  //             name: "Student F",
  //             fileUrl: "http://example.com/fileF.pdf",
  //           },
  //           SemanticSimilarity: 90,
  //           FingerprintSimilarity: 85,
  //           CombinedSimilarity: 88,
  //         },
  //         {
  //           studentId1: {
  //             id: "S001",
  //             name: "Student A",
  //             fileUrl: "http://example.com/fileA.pdf",
  //           },
  //           studentId2: {
  //             id: "S003",
  //             name: "Student C",
  //             fileUrl: "http://example.com/fileC.pdf",
  //           },
  //           SemanticSimilarity: 50,
  //           FingerprintSimilarity: 60,
  //           CombinedSimilarity: 58,
  //         },
  //         {
  //           studentId1: {
  //             id: "S002",
  //             name: "Student B",
  //             fileUrl: "http://example.com/fileB.pdf",
  //           },
  //           studentId2: {
  //             id: "S004",
  //             name: "Student D",
  //             fileUrl: "http://example.com/fileD.pdf",
  //           },
  //           SemanticSimilarity: 55,
  //           FingerprintSimilarity: 65,
  //           CombinedSimilarity: 63,
  //         },
  //         {
  //           studentId1: {
  //             id: "S005",
  //             name: "Student E",
  //             fileUrl: "http://example.com/fileE.pdf",
  //           },
  //           studentId2: {
  //             id: "S001",
  //             name: "Student A",
  //             fileUrl: "http://example.com/fileA.pdf",
  //           },
  //           SemanticSimilarity: 75,
  //           FingerprintSimilarity: 80,
  //           CombinedSimilarity: 78,
  //         },
  //         {
  //           studentId1: {
  //             id: "S006",
  //             name: "Student F",
  //             fileUrl: "http://example.com/fileF.pdf",
  //           },
  //           studentId2: {
  //             id: "S002",
  //             name: "Student B",
  //             fileUrl: "http://example.com/fileB.pdf",
  //           },
  //           SemanticSimilarity: 40,
  //           FingerprintSimilarity: 55,
  //           CombinedSimilarity: 50,
  //         },
  //         {
  //           studentId1: {
  //             id: "S003",
  //             name: "Student C",
  //             fileUrl: "http://example.com/fileC.pdf",
  //           },
  //           studentId2: {
  //             id: "S005",
  //             name: "Student E",
  //             fileUrl: "http://example.com/fileE.pdf",
  //           },
  //           SemanticSimilarity: 60,
  //           FingerprintSimilarity: 75,
  //           CombinedSimilarity: 70,
  //         },
  //         {
  //           studentId1: {
  //             id: "S004",
  //             name: "Student D",
  //             fileUrl: "http://example.com/fileD.pdf",
  //           },
  //           studentId2: {
  //             id: "S006",
  //             name: "Student F",
  //             fileUrl: "http://example.com/fileF.pdf",
  //           },
  //           SemanticSimilarity: 85,
  //           FingerprintSimilarity: 90,
  //           CombinedSimilarity: 88,
  //         },
  //         {
  //           studentId1: {
  //             id: "S001",
  //             name: "Student A",
  //             fileUrl: "http://example.com/fileA.pdf",
  //           },
  //           studentId2: {
  //             id: "S004",
  //             name: "Student D",
  //             fileUrl: "http://example.com/fileD.pdf",
  //           },
  //           SemanticSimilarity: 70,
  //           FingerprintSimilarity: 65,
  //           CombinedSimilarity: 68,
  //         },
  //         {
  //           studentId1: {
  //             id: "S003",
  //             name: "Student C",
  //             fileUrl: "http://example.com/fileC.pdf",
  //           },
  //           studentId2: {
  //             id: "S006",
  //             name: "Student F",
  //             fileUrl: "http://example.com/fileF.pdf",
  //           },
  //           SemanticSimilarity: 55,
  //           FingerprintSimilarity: 50,
  //           CombinedSimilarity: 53,
  //         },
  //         {
  //           studentId1: {
  //             id: "S002",
  //             name: "Student B",
  //             fileUrl: "http://example.com/fileB.pdf",
  //           },
  //           studentId2: {
  //             id: "S005",
  //             name: "Student E",
  //             fileUrl: "http://example.com/fileE.pdf",
  //           },
  //           SemanticSimilarity: 72,
  //           FingerprintSimilarity: 78,
  //           CombinedSimilarity: 75,
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

//   useEffect(() => {

  
  // testing
  // const testdata = [
    //   { "Assignment 1": "http://example.com/file1.pdf", "Assignment 2": "http://example.com/file2.docx", "Similarity (%)": 85.34 },
    //   { "Assignment 1": "http://example.com/file1.pdf", "Assignment 2": "http://example.com/file2.docx", "Similarity (%)": 85.34 },
    //   { "Assignment 1": "http://example.com/file1.pdf", "Assignment 2": "http://example.com/file2.docx", "Similarity (%)": 85.34 },
    //   { "Assignment 1": "http://example.com/file1.pdf", "Assignment 2": "http://example.com/file2.docx", "Similarity (%)": 85.34 },
    //   { "Assignment 1": "http://example.com/file1.pdf", "Assignment 2": "http://example.com/file2.docx", "Similarity (%)": 85.34 },
    //   { "Assignment 1": "http://example.com/file1.pdf", "Assignment 2": "http://example.com/file2.docx", "Similarity (%)": 85.34 },
    //   { "Assignment 1": "http://example.com/file1.pdf", "Assignment 2": "http://example.com/file2.docx", "Similarity (%)": 85.34 },
    //   { "Assignment 1": "http://example.com/file3.pptx", "Assignment 2": "http://example.com/file4.pdf", "Similarity (%)": 72.45 },
    //   { "Assignment 1": "http://example.com/file5.pdf", "Assignment 2": "http://example.com/file6.docx", "Similarity (%)": 65.12 },
    //   { "Assignment 1": "http://example.com/file7.pptx", "Assignment 2": "http://example.com/file8.docx", "Similarity (%)": 45.23 },
    //   { "Assignment 1": "http://example.com/file9.pdf", "Assignment 2": "http://example.com/file10.pptx", "Similarity (%)": 95.67 },
    //   { "Assignment 1": "http://example.com/file11.docx", "Assignment 2": "http://example.com/file12.pdf", "Similarity (%)": 33.89 },
    // ];
    // setPlagiarismData(testdata);      
    // setLoading(false);
    // testing end
    
    useEffect(() => {

    const fetchPlagiarismData = async () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
        
        if (!token) {
          toast.error("Please sign in.");
          return navigate("/signin");
        }
      try {
        // console.log(token);
        const response = await axios.post(
          `${apiUrl}/assignment/checkplagiarism/${assignmentId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response);
        if (response.data.success) {
          setPlagiarismData(response.data.mlResponse.results);
          // toast.success("Plagiarism data fetched successfully.");
        } else {
          toast.error("Failed to fetch plagiarism data.");
        }
      }
       catch (err) {
        setError(err?.response?.data?.message || "An error occurred.");
    } finally {
        setLoading(false);
      }
    }
   
    }
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

  // Ranges for similarity
  const ranges = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  // Function to aggregate similarity counts into ranges
  const aggregateCounts = () => {
    return ranges.slice(0, -1).map((rangeStart, index) => {
      const rangeEnd = ranges[index + 1];
      return plagiarismData.filter(
        (entry) =>
          entry["Similarity (%)"] >= rangeStart &&
          entry["Similarity (%)"] < rangeEnd
      ).length;
    });
  };

  // Prepare chart data
  const chartData = {
    labels: ranges.slice(0, -1).map(
      (rangeStart, index) => `${rangeStart}-${ranges[index + 1] - 1}%`
    ),
    datasets: [
      {
        label: "Similarity Distribution",
        data: aggregateCounts(),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
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
            className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
          >
            Back
          </button>
        </div>

        {/* Chart */}
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
                    text: "Plagiarism Similarity Distribution",
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-700 text-gray-200">
                <th className="px-2 sm:px-4 py-2 border border-gray-600">
                  Assignment 1
                </th>
                <th className="px-2 sm:px-4 py-2 border border-gray-600">
                  Assignment 2
                </th>
                <th
                  className="px-2 sm:px-4 py-2 border border-gray-600"
                  title="The percentage similarity between the two assignments."
                >
                  Similarity (%)
                  <span
                    className="inline-block ml-1 text-gray-400 cursor-pointer"
                    title="The percentage similarity between the two assignments."
                  >
                    ⓘ
                  </span>
                </th>
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
                    <td className="px-2 sm:px-4 py-2 border border-gray-600">
                      <a
                        href={entry["Assignment 1"]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        {entry["Assignment 1"]}
                      </a>
                    </td>
                    <td className="px-2 sm:px-4 py-2 border border-gray-600">
                      <a
                        href={entry["Assignment 2"]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        {entry["Assignment 2"]}
                      </a>
                    </td>
                    <td
                      className="px-2 sm:px-4 py-2 border border-gray-600"
                      title={`${entry["Similarity (%)"]}% similarity between the assignments.`}
                    >
                      {/* {entry["Similarity (%)"].toFixed(2)}% */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
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
