export default function handler(req, res) {
  res.status(200).json({
    project_name: "Madad HaOref",
    last_update: "2026-02-04T13:00:00Z",
    methodology: "Анализ весов базируется на корреляции событий 2024-25гг. (ML-модель 'Sentinel'). Военная активность имеет вес 40%, так как исторически предшествует эскалации за 48-72 часа.",
    indices: [
      {
        id: "israel",
        label: "БЕЗОПАСНОСТЬ ИЗРАИЛЯ",
        value: 62,
        range: "±5%",
        status: "НАПРЯЖЕННО",
        color: "#ffcc00",
        analysis: "Основной риск: Ливанский фронт. Хизбалла восстанавливает логистику после ударов 2025 года.",
        sources: [
          { name: "INSS Report", url: "https://www.inss.org.il/" },
          { name: "IDF Official", url: "https://www.idf.il/" }
        ]
      },
      {
        id: "us_iran",
        label: "УДАР США ПО ИРАНУ",
        value: 35,
        range: "±12%",
        status: "ДИПЛОМАТИЯ",
        color: "#00ff41",
        analysis: "Дедлайн Трампа (06.02). Текущая дислокация АУГ 'Линкольн' указывает на сдерживание, а не атаку.",
        sources: [
          { name: "Reuters Politics", url: "https://www.reuters.com/" },
          { name: "MarineTraffic OSINT", url: "#" }
        ]
      },
      {
        id: "yemen",
        label: "ЙЕМЕН (ХУТИТЫ)",
        value: 45,
        range: "±8%",
        status: "АКТИВНОСТЬ",
        color: "#ffcc00",
        analysis: "Зафиксированы перемещения пусковых установок в провинции Ходейда. Риск для судоходства повышен.",
        sources: [
          { name: "Al-Mayadeen (Regional)", url: "https://www.almayadeen.net/" },
          { name: "CENTCOM Feed", url: "https://www.centcom.mil/" }
        ]
      }
    ]
  });
}
