export default function ThreatIndexSimple({ index }) {
  const percent = index || 0;

  const getColor = (p) => {
    if (p <= 20) return "#4CAF50";   // зелёный
    if (p <= 40) return "#FFC107";   // жёлтый
    if (p <= 60) return "#FF9800";   // оранжевый
    if (p <= 80) return "#F44336";   // красный
    return "#7F1D1D";                // тёмно‑красный
  };

  const color = getColor(percent);

  return (
    <div style={{ textAlign: "center", padding: "30px" }}>
      <svg width="180" height="180">
        <circle cx="90" cy="90" r="80" stroke="#333" strokeWidth="15" fill="none" />
        <circle
          cx="90"
          cy="90"
          r="80"
          stroke={color}
          strokeWidth="15"
          fill="none"
          strokeDasharray={`${(percent * 2.51)}, 502`}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
        />
        <text
          x="90"
          y="100"
          textAnchor="middle"
          fontSize="36"
          fill={color}
          fontWeight="bold"
        >
          {percent}%
        </text>
      </svg>
      <div style={{ marginTop: "8px", color: "#aaa" }}>Threat Index</div>
    </div>
  );
}
