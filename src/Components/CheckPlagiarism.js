import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Bar } from "react-chartjs-2"; // Importing Bar chart
import Loding from "../partials/Loding";
import "react-toastify/dist/ReactToastify.css";
import { Chart as ChartJS } from "chart.js/auto";


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

//   // hardcoded data for testing
//   useEffect(() => {
//     const fetchPlagiarismData = async () => {
//       try {
//         const token = document.cookie
//           .split("; ")
//           .find((row) => row.startsWith("token="))
//           ?.split("=")[1];

//         if (!token) {
//           toast.error("Please sign in.");
//           return navigate("/signin");
//         }
//           // Input data
// const testdata = [
//   { "Assignment 1": "file1.pdf", "Assignment 2": "file2.docx", "Similarity (%)": 85.34 },
//   { "Assignment 1": "file1.pdf", "Assignment 2": "file3.pptx", "Similarity (%)": 72.45 },
//   { "Assignment 1": "file2.docx", "Assignment 2": "file3.pptx", "Similarity (%)": 65.12 },
// ];

        


//         setPlagiarismData(testdata);
//         toast.success("Test plagiarism data loaded successfully.");
//       } catch (err) {
//         setError("An error occurred while loading test data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPlagiarismData();
//   }, [navigate]);

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




// Ranges for similarity
const ranges = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

// Function to aggregate similarity counts into ranges
const aggregateCounts = () => {
  return ranges.slice(0, -1).map((rangeStart, index) => {
    const rangeEnd = ranges[index + 1];
    return plagiarismData.filter(
      (entry) =>
        entry["Similarity (%)"] >= rangeStart && entry["Similarity (%)"] < rangeEnd
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
          <div className=" h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] w-full">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: "Plagiarism Similarity Distribution" },
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
                      text: "Number of Students",
                      font: { size: 14 },
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Column toggle controls */}
        <div className="mb-4 flex flex-wrap gap-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={columns.semantic}
              onChange={() => handleColumnToggle("semantic")}
              className="mr-2"
            />
            Semantic Similarity
          </label>
          <label className="inline-flex items-center">
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
                <th className="px-2 sm:px-4 py-2 border border-gray-600">Student 1</th>
                <th className="px-2 sm:px-4 py-2 border border-gray-600">Student 2</th>
                {columns.semantic && (
                  <th className="px-2 sm:px-4 py-2 border border-gray-600" title="Measures the similarity in meaning or context between the assignments.">
                    Semantic Similarity (%)
                    <span className="inline-block ml-1 text-gray-400 cursor-pointer" title="Measures the similarity in meaning or context between the assignments.">
                      ⓘ
                    </span>
                  </th>

                )}
                {columns.fingerprint && (
                  <th className="px-2 sm:px-4 py-2 border border-gray-600" title="Measures the similarity in structural or fingerprint aspects between the assignments.">
                    Fingerprint Similarity (%)
                    <span className="inline-block ml-1 text-gray-400 cursor-pointer" title="Measures the similarity in structural or fingerprint aspects between the assignments.">
                      ⓘ
                    </span>
                  </th>
                )}
                {columns.combined && (
                  <th className="px-2 sm:px-4 py-2 border border-gray-600" title="A weighted combination of semantic and fingerprint similarities.">
                    Combined Similarity (%)
                    <span className="inline-block ml-1 text-gray-400 cursor-pointer" title="A weighted combination of semantic and fingerprint similarities.">
                      ⓘ
                    </span>
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
                    <td className="px-2 sm:px-4 py-2 border border-gray-600">
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
                    <td className="px-2 sm:px-4 py-2 border border-gray-600">
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
                      <td className="px-2 sm:px-4 py-2 border border-gray-600">
                        {entry.SemanticSimilarity}%
                      </td>
                    )}
                    {columns.fingerprint && (
                      <td className="px-2 sm:px-4 py-2 border border-gray-600">
                        {entry.FingerprintSimilarity}%
                      </td>
                    )}
                    {columns.combined && (
                      <td className="px-2 sm:px-4 py-2 border border-gray-600">
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