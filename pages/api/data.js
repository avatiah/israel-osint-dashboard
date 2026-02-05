export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  
  try {
    // Имитация датчика аномалий Иранского сегмента Cloudflare
    const iranTraffic = 94; // Текущий уровень
    
    const data = {
      timestamp: new Date().toISOString(),
      apiHealth: 'optimal', // Теперь всегда GREEN при успешном ответе
      netConnectivity: {
        score: iranTraffic,
        status: iranTraffic < 85 ? 'anomalous' : 'stable'
      },
      nodes: [
        {
          id: "US",
          title: "ВЕРОЯТНОСТЬ УДАРА США ПО ИРАНУ",
          value: "68.4",
          trend: "up",
          method: "SENTIMENT_ANALYSIS",
          news: [
            { src: "CENTCOM", txt: "Подтверждено развертывание B-52 на базе Эль-Удейд; поддержание режима сдерживания." },
            { src: "PENTAGON", txt: "Завершено уточнение пакета целей; ожидается решение на политическом уровне." },
            { src: "REUTERS", txt: "США перемещают дополнительные активы дозаправки в зону ответственности CENTCOM." },
            { src: "INTEL", txt: "Анализ сигналов указывает на повышение готовности ударных групп в регионе." }
          ]
        },
        {
          id: "IL",
          title: "ИНДЕКС БЕЗОПАСНОСТИ ИЗРАИЛЯ",
          value: "42.5",
          trend: "stable",
          method: "IDF_LIVE_FEED",
          news: [
            { src: "ЦАХАЛ", txt: "Плановый мониторинг северных границ; изменений в гражданских директивах нет." },
            { src: "MFA", txt: "Дипломатические усилия направлены на укрепление региональной коалиции ПВО." },
            { src: "CH12", txt: "Системы 'Хец' и 'Праща Давида' работают в режиме стандартного дежурства." }
          ]
        },
        {
          id: "YE",
          title: "УГРОЗА СО СТОРОНЫ ЙЕМЕНА (ХУСИТЫ)",
          value: "39.1",
          trend: "up",
          method: "MARITIME_TRACKER",
          news: [
            { src: "UKMTO", txt: "Подозрительное сближение малых судов в Оманском заливе; судно в безопасности." },
            { src: "OSINT", txt: "Зафиксированы пуски учебных БПЛА в глубине территории Йемена." },
            { src: "SANA", txt: "Лидеры движения подтвердили готовность к действиям в Красном море." }
          ]
        }
      ],
      prediction: { date: "06.02.2026", impact: "74" }
    };
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ apiHealth: 'offline' });
  }
}
