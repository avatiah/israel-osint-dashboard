import Head from "next/head";
import ThreatIndex from "../components/ThreatIndex";
import fs from "fs";
import path from "path";

export default function Home({ threatData }) {
  return (
    <>
      <Head>
        <title>Israel Security OSINT Dashboard</title>
        <meta
          name="description"
          content="OSINT Dashboard: текущий уровень напряжённости в регионе Израиля"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main style={{ background: "#111", minHeight: "100vh", color: "white", fontFamily: "Arial, sans-serif" }}>
        <header style={{ textAlign: "center", padding: "40px 20px" }}>
          <h1>OSINT Security Radar — Израиль</h1>
          <p>Индекс текущей военной угрозы в регионе на основе открытых аналитических источников</p>
          <p style={{ fontSize: "14px", color: "#888" }}>Последнее обновление: {new Date(threatData.last_update).toLocaleString()}</p>
        </header>

        {/* 🔹 Threat Index */}
        <ThreatIndex
          data={{
            military: (threatData.blocks.military / 20), // Переводим 0–100 → 0–5
            rhetoric: (threatData.blocks.rhetoric / 20),
            diplomacy: 2, // Если нет данных, ставим базовое значение
            proxies: (threatData.blocks.regional / 20),
            cyber: 1,
            alerts: 2
          }}
        />

        {/* 🔹 Последние сигналы OSINT */}
        <section style={{ maxWidth: "900px", margin: "40px auto" }}>
          <h2 style={{ textAlign: "center" }}>Последние аналитические сигналы</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
            {threatData.signals.map((s, i) => (
              <a
                key={i}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#1c1c1c",
                  padding: "15px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: "white",
                  transition: "0.2s",
                }}
              >
                <div style={{ fontWeight: "bold" }}>{s.title}</div>
                <div style={{ fontSize: "12px", color: "#aaa" }}>{s.source} | {new Date(s.date).toLocaleString()}</div>
              </a>
            ))}
          </div>
        </section>

        <footer style={{ textAlign: "center", padding: "20px", fontSize: "14px", color: "#888" }}>
          © 2026 OSINT Dashboard | Данные обновляются автоматически
        </footer>
      </main>
    </>
  );
}

// 🔹 getStaticProps для чтения data.json
export async function getStaticProps() {
  const filePath = path.join(process.cwd(), "data", "data.json");
  const jsonData = fs.readFileSync(filePath, "utf8");
  const threatData = JSON.parse(jsonData);

  return {
    props: { threatData },
    revalidate: 3600 // каждые 1 час Next.js пересобирает страницу
  };
}
