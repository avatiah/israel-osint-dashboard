import React, { useEffect, useState } from "react";

export default function ThreatIndex({ data }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!data) return;
    console.log("ThreatIndex data:", data);

    const sum =
      (data.military || 0) +
      (data.rhetoric || 0) +
      (data.diplomacy || 0) +
      (data.proxies || 0) +
      (data.cyber || 0) +
      (data.alerts || 0);

    const maxSum = 5 * 6;
    const percent = Math.round((sum / maxSum) * 100);
    setTotal(percent);
  }, [data]);

  const getColor = (percent) => {
    if (percent < 30) return "#4CAF50";
    if (percent < 60) return "#FFC107";
    if (percent < 80) return "#FF9800";
    return "#F44336";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "40px 0",
      }}
    >
      <svg width="200" height="200">
        <circle
          cx="100"
          cy="100"
          r="90"
          stroke="#333"
          strokeWidth="20"
          fill="none"
        />
        {total > 0 && (
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke={getColor(total)}
            strokeWidth="20"
            fill="none"
            strokeDasharray={`${(total * 565) / 100}, 565`}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
          />
        )}
        <text
          x="100"
          y="110"
          textAnchor="middle"
          fontSize="36"
          fill={getColor(total)}
          fontWeight="bold"
        >
          {total}%
        </text>
      </svg>

      <div style={{ marginTop: "10px", color: "#aaa" }}>Threat Index</div>

      {/* 🔹 Отладка */}
      <div style={{ marginTop: "20px", color: "white" }}>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}
