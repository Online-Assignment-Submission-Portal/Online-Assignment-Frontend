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
  const apiUrl =
    window.location.hostname === "localhost"
      ? "http://localhost:8000"
      : process.env.REACT_APP_BASE_URL;
  const [plagiarismData, setPlagiarismData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("CheckPlagiarism", plagiarismData);

  useEffect(() => {
    // Hardcoded test data
    const testData = [
      {
        "Assignment 1": "Assignment_A",
        "Assignment 2": "Assignment_B",
        "Cosine Similarity (%)": 45.23,
        "Jaccard Similarity (%)": 38.12,
        "Combined Similarity (%)": 41.67,
      },
      {
        "Assignment 1": "Assignment_A",
        "Assignment 2": "Assignment_C",
        "Cosine Similarity (%)": 78.56,
        "Jaccard Similarity (%)": 72.34,
        "Combined Similarity (%)": 75.45,
      },
      {
        "Assignment 1": "Assignment_B",
        "Assignment 2": "Assignment_D",
        "Cosine Similarity (%)": 12.34,
        "Jaccard Similarity (%)": 8.45,
        "Combined Similarity (%)": 10.12,
      },
      {
        "Assignment 1": "Assignment_C",
        "Assignment 2": "Assignment_E",
        "Cosine Similarity (%)": 60.78,
        "Jaccard Similarity (%)": 54.32,
        "Combined Similarity (%)": 57.55,
      },
      {
        "Assignment 1": "Assignment_C",
        "Assignment 2": "Assignment_E",
        "Cosine Similarity (%)": 60.78,
        "Jaccard Similarity (%)": 54.32,
        "Combined Similarity (%)": 57.55,
      },
      {
        "Assignment 1": "Assignment_C",
        "Assignment 2": "Assignment_E",
        "Cosine Similarity (%)": 60.78,
        "Jaccard Similarity (%)": 54.32,
        "Combined Similarity (%)": 57.55,
      },
      {
        "Assignment 1": "Assignment_D",
        "Assignment 2": "Assignment_F",
        "Cosine Similarity (%)": 90.12,
        "Jaccard Similarity (%)": 88.34,
        "Combined Similarity (%)": 89.23,
      },
    ];

    // Simulate data fetching
    setTimeout(() => {
      setPlagiarismData(testData);
      setLoading(false);
    }, 1000);
  }, []);


  // useEffect(() => {
  //   const fetchPlagiarismData = async () => {
  //     try {
  //       const token = document.cookie
  //         .split("; ")
  //         .find((row) => row.startsWith("token="))
  //         ?.split("=")[1];

  //       if (!token) {
  //         toast.error("Authentication token is missing. Please sign in.");
  //         return navigate("/signin");
  //       }

  //       const response = await axios.post(
  //         `${apiUrl}/assignment/checkplagiarism/${assignmentId}`,
  //         {},
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       if (response.data.results) {
  //         setPlagiarismData(response.data.results);
  //         toast.success("Plagiarism data fetched successfully.");
  //       } else {
  //         toast.error("Failed to fetch plagiarism data.");
  //       }
  //     } catch (err) {
  //       setError(err?.response?.data?.message || "An error occurred.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchPlagiarismData();
  // }, [assignmentId, navigate]);

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
        data: aggregateCounts("Combined Similarity (%)"),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
      {
        label: "Cosine Similarity (%)",
        data: aggregateCounts("Cosine Similarity (%)"),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
      {
        label: "Jaccard Similarity (%)",
        data: aggregateCounts("Jaccard Similarity (%)"),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
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
            className="w-auto px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
          >
            Back
          </button>
        </div>

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
                  className="px-2 sm:px-4 py-2 border border-gray-600 relative group"
                  title="Measures similarity by comparing the angle between two text vectors, focusing on word usage patterns"
                >
                  Cosine Similarity (%){" "}
                  <span className="text-blue-400 cursor-help ml-1">🛈</span>
                </th>
                <th
                  className="px-2 sm:px-4 py-2 border border-gray-600 relative group"
                  title="Measures similarity by comparing the overlap of unique words between two documents."
                >
                  Jaccard Similarity (%){" "}
                  <span className="text-blue-400 cursor-help ml-1">🛈</span>
                </th>
                <th
                  className="px-2 sm:px-4 py-2 border border-gray-600 relative group"
                  title="Combines cosine and Jaccard similarity for a more balanced score."
                >
                  Combined Similarity (%){" "}
                  <span className="text-blue-400 cursor-help ml-1">🛈</span>
                </th>

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
                      title={entry["Assignment 1"]}
                    >
                      <a
                        href={`/assignment/${entry["Assignment 1"]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        {entry["Assignment 1"]}
                      </a>
                    </td>
                    <td
                      className="px-2 sm:px-4 py-2 border border-gray-600"
                      title={entry["Assignment 2"]}
                    >
                      <a
                        href={`/assignment/${entry["Assignment 2"]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        {entry["Assignment 2"]}
                      </a>
                    </td>
                    <td className="px-2 sm:px-4 py-2 border border-gray-600">
                      {entry["Cosine Similarity (%)"].toFixed(2)}%
                    </td>
                    <td className="px-2 sm:px-4 py-2 border border-gray-600">
                      {entry["Jaccard Similarity (%)"].toFixed(2)}%
                    </td>
                    <td className="px-2 sm:px-4 py-2 border border-gray-600">
                      {entry["Combined Similarity (%)"].toFixed(2)}%
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
