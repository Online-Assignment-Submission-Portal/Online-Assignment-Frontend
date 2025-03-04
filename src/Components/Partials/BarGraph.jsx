import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
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

function BarGraph({ plagiarismData }) {

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

    return (
        <>
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
        </>
    )
}

export default BarGraph;