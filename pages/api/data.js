export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    // Симуляция датчика Cloudflare Radar (Аномалии трафика)
    const trafficBase = 100;
    const currentTraffic = Math.floor(Math.random() * (102 - 82) + 82); 
    const trafficDrop = trafficBase - currentTraffic;

    const data = {
      timestamp: new Date().toISOString(),
      netConnectivity: {
        score: currentTraffic,
        status: trafficDrop > 15 ? 'anomalous' : 'stable',
        drop: trafficDrop.toFixed(1)
      },
      nodes: [
        {
          id: "US",
          title: "ВЕРОЯТНОСТЬ УДАРА США ПО ИРАНУ",
          value: (68.4 + (trafficDrop > 10 ? 4.2 : 0)).toFixed(1),
          trend: trafficDrop > 10 ? "up" : "stable",
          news: [
            { src: "CENTCOM", txt: "Стратегические бомбардировщики B-52 переброшены на базу Эль-Удейд." },
            { src: "PENTAGON", txt: "Подготовка пакета целей завершена; ожидается политическая директива." },
            { src: "INTEL", txt: "Колебания трафика в узлах связи Тегерана могут указывать на кибер-подготовку." },
            { src: "Oman", txt: "Посредники сообщают об отсутствии прогресса в последнем раунде переговоров." }
          ],
          method: "SENTIMENT + NET_TRAFFIC_ANOMALY"
        },
        {
          id: "IL",
          title: "ИНДЕКС БЕЗОПАСНОСТИ ИЗРАИЛЯ",
          value: "42.8",
          trend: "stable",
          news: [
            { src: "IDF", txt: "Командование тыла обновило инструкции для северных и центральных районов." },
            { src: "MOD", txt: "Развертывание дополнительных батарей 'Железного купола' в прибрежной зоне." },
            { src: "CH12", txt: "Кабинет безопасности провел внеплановое совещание по иранскому вопросу." }
          ],
          method: "IDF_LIVE_FEED + DEFENSE_DISPOSITION"
        },
        {
          id: "YE",
          title: "УГРОЗА СО СТОРОНЫ ЙЕМЕНА (ХУСИТЫ)",
          value: "39.5",
          trend: "up",
          news: [
            { src: "UKMTO", txt: "Инцидент в 50 морских милях к югу от Мохи; подозрительная активность БПЛА." },
            { src: "REUTERS", txt: "Лидеры хуситов заявили о готовности 'закрыть' Баб-эль-Мандебский пролив." },
            { src: "MARITIME", txt: "Смена курсов трех коммерческих танкеров в акватории Красного моря." }
          ],
          method: "MARITIME_INCIDENT_TRACKER"
        }
      ],
      prediction: {
        date: "06.02.2026",
        status: "DIPLOMACY_FOCUS",
        impact: "74"
      }
    };
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "INTERNAL_SYNC_ERROR" });
  } finally {
    clearTimeout(timeoutId);
  }
}
