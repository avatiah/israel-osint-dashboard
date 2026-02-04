export default function handler(req, res) {
  // Актуальные данные на 04.02.2026
  const securityData = {
    "last_update": "2026-02-04T10:40:00Z",
    "index": 79,
    "strike_probability": "48%",
    "blocks": {
      "military": 89,
      "rhetoric": 95,
      "osint_activity": 74,
      "regional": 68
    },
    "signals": [
      {
        "source": "REUTERS",
        "title": "Трамп подтвердил: крайний срок по иранской сделке — пятница, 6 февраля",
        "date": "2026-02-04T09:15:00Z"
      },
      {
        "source": "KAN_NEWS",
        "title": "ЦАХАЛ перевел системы ПВО на севере в режим повышенной готовности",
        "date": "2026-02-04T10:05:00Z"
      },
      {
        "source": "ISRAEL_RADAR",
        "title": "США и Иран начали предварительные технические консультации в Омане",
        "date": "2026-02-04T08:30:00Z"
      }
    ]
  };

  res.status(200).json(securityData);
}
