export default function handler(req, res) {
  const securityData = {
    "last_update": "2026-02-04T10:45:00Z",
    "index": 79.4,
    "strike_probability": "48%",
    "market": {
        "brent": "$84.20", // Цены на фоне неопределенности перед 6 февраля
        "usd_ils": "3.089"
    },
    "blocks": {
      "military": 89,
      "rhetoric": 95,
      "osint_activity": 74,
      "regional": 68
    },
    "signals": [
      {
        "source": "9_CHANNEL",
        "title": "Переговоры США и Ирана перенесены из Анкары в Оман (Маскат) на 6 февраля",
        "date": "2026-02-04T08:02:00Z"
      },
      {
        "source": "NEWS_RU",
        "title": "852-й день войны: ЦАХАЛ продолжает операции в Газе, Иудее и Самарии",
        "date": "2026-02-04T08:00:00Z"
      },
      {
        "source": "REUTERS",
        "title": "Спецпосланник Уиткофф прибыл в Иерусалим перед встречей с иранской делегацией",
        "date": "2026-02-04T09:15:00Z"
      },
      {
        "source": "CTP_ISW",
        "title": "Иран развернул сотни быстроходных катеров вблизи авианосца 'Авраам Линкольн'",
        "date": "2026-02-04T10:15:00Z"
      }
    ]
  };

  res.status(200).json(securityData);
}
