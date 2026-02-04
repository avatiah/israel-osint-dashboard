export default function handler(req, res) {
  const securityData = {
    last_update: "2026-02-04T11:00:00Z",
    index: 79.4,
    strike_probability: "48%",
    market: {
      brent: "84.20",
      usd_ils: "3.089"
    },
    blocks: {
      military: 89,
      rhetoric: 95,
      osint_activity: 74,
      regional: 68
    },
    signals: [
      {
        source: "REUTERS",
        title: "Пятница 6 февраля объявлена дедлайном для сделки по ядерной программе Ирана",
        date: "2026-02-04T09:15:00Z"
      },
      {
        source: "KAN",
        title: "Переговоры США и Ирана официально перенесены в Маскат (Оман)",
        date: "2026-02-04T08:30:00Z"
      },
      {
        source: "OSINT",
        title: "Авианосная группа 'Авраам Линкольн' развернута в Аравийском море",
        date: "2026-02-04T10:45:00Z"
      }
    ]
  };

  res.status(200).json(securityData);
}
