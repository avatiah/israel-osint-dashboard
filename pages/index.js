import { useEffect, useState } from "react";
import ThreatIndex from "../components/ThreatIndex";

export default function Home() {
  const [threatData, setThreatData] = useState(null);

  useEffect(() => {
    fetch("/data/data.json")
      .then(res => res.json())
      .then(data => setThreatData(data))
      .catch(err => console.error("Ошибка загрузки data.json:", err));
  }, []);

  if (!threatData) return <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>Загрузка данных...</div>;

  return (
    <main style={{ background: "#111", minHeight: "100vh", color: "white", fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>OSINT Security Radar — Израиль</h1>
      <p style={{ textAlign: "center", color: "#888" }}>Последнее обновление: {new Date(threatData.last_update).toLocaleString()}</p>

      <ThreatIndex
        data={{
          military: threatData.blocks.military / 20,
          rhetoric: threatData.blocks.rhetoric / 20,
          diplomacy: 2,
          proxies: threatData.blocks.regional / 20,
          cyber: 1,
          alerts: 2
        }}
      />

      <section style={{ maxWidth: "900px", margin: "40px auto" }}>
        <h2 style={{ textAlign: "center" }}>Последние сигналы</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
          {threatData.signals.map((s, i) => (
            <a key={i} href={s.link} target="_blank" rel="noopener noreferrer"
               style={{ background: "#1c1c1c", padding: "15px", borderRadius: "8px", color: "white", textDecoration: "none" }}>
              <div style={{ fontWeight: "bold" }}>{s.title}</div>
              <div style={{ fontSize: "12px", color: "#aaa" }}>{s.source} | {new Date(s.date).toLocaleString()}</div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
