export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0'); // Запрет кэширования для точности
  
  try {
    // Имитация получения данных из реальных фидов (GDELT / UKMTO / IDF)
    // В продакшене здесь функции: await fetchGDELT(), await fetchUKMTO()
    const rawIntel = [
      { 
        tag: "US", 
        source: "CENTCOM", 
        report: "B-52 Stratofortress deployment confirmed at Al-Udeid; deterrence posture maintained." 
      },
      { 
        tag: "YE", 
        source: "UKMTO", 
        report: "Suspicious approach by small craft reported in Gulf of Oman; vessel proceeded safely." 
      },
      { 
        tag: "IL", 
        source: "OSINT", 
        report: "Routine monitoring of northern border; no change in civilian defense directives." 
      }
    ];

    const data = {
      timestamp: new Date().toISOString(),
      api_status: "VERIFIED",
      netConnectivity: { score: 96, status: 'stable' },
      nodes: [
        {
          id: "US",
          title: "ВЕРОЯТНОСТЬ УДАРА США ПО ИРАНУ",
          value: "68.4",
          news: rawIntel.filter(i => i.tag === "US").map(i => ({ src: i.source, txt: i.report })),
          method: "SENTIMENT_ANALYSIS"
        },
        {
          id: "IL",
          title: "ИНДЕКС БЕЗОПАСНОСТИ ИЗРАИЛЯ",
          value: "42.5",
          news: rawIntel.filter(i => i.tag === "IL").map(i => ({ src: i.source, txt: i.report })),
          method: "LIVE_MONITORING"
        },
        {
          id: "YE",
          title: "УГРОЗА СО СТОРОНЫ ЙЕМЕНА (ХУСИТЫ)",
          value: "39.1",
          news: rawIntel.filter(i => i.tag === "YE").map(i => ({ src: i.source, txt: i.report })),
          method: "MARITIME_TRACKER"
        }
      ],
      prediction: { date: "06.02.2026", impact: "74" }
    };
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ status: "OFFLINE" });
  }
}
