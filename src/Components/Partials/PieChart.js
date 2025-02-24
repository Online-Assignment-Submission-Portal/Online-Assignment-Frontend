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

function PieChart({ submitted, notSubmitted, late }) {

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
        <div className="w-full md:w-1/2 lg:w-1/3 h-[400px] overflow-visible">
              <Pie
                data={pieData}
                options={pieOptions}
              />
        </div>
        </>
    )
}

export default PieChart;