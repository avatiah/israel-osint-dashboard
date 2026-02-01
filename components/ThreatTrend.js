import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function ThreatTrend() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("/data/history.json", { cache: "no-store" })
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error("Ошибка загрузки history.json:", err));
  }, []);

  const chartData = {
    labels: history.map(item => item.date),
    datasets: [
      {
        label: "Threat Index %",
        data: history.map(item => item.index),
        borderColor: "#F44336",
        backgroundColor: "rgba(244,67,54,0.2)",
        tension: 0.3,
      }
    ]
  };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto" }}>
      <h2 style={{ textAlign: "center" }}>Тренд Threat Index</h2>
      <Line data={chartData} />
    </div>
  );
}
