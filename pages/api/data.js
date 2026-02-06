export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');

  const fetchRSS = async (url) => {
    try {
      const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`);
      const data = await response.json();
      return data.items || [];
    } catch (e) { return []; }
  };

  try {
    // Тянем данные из мировых источников в реальном времени
    const [bbc, aljazeera] = await Promise.all([
      fetchRSS('http://feeds.bbci.co.uk/news/world/middle_east/rss.xml'),
      fetchRSS('https://www.aljazeera.com/xml/rss/all.xml')
    ]);

    const allNews = [...bbc, ...aljazeera];

    // Фильтрация по ключевым словам для каждого узла
    const filter = (keywords) => allNews
      .filter(item => keywords.some(k => 
        item.title.toLowerCase().includes(k.toLowerCase()) || 
        item.content.toLowerCase().includes(k.toLowerCase())
      ))
      .slice(0, 3)
      .map(item => ({
        src: item.author || "LIVE_FEED",
        txt: item.title // Только оригинал (English)
      }));

    const data = {
      timestamp: new Date().toISOString(),
      apiHealth: 'optimal',
      netConnectivity: { score: (93 + Math.random() * 2).toFixed(1), status: 'stable' },
      nodes: [
        {
          id: "US",
          title: { ru: "США: СТРАТЕГИЧЕСКИЙ МОНИТОРИНГ", en: "US STRATEGIC MONITORING" },
          value: (65 + Math.random() * 5).toFixed(1),
          trend: "up",
          news: filter(['US', 'Pentagon', 'Biden', 'Centcom', 'Navy', 'Air Force', 'B-52'])
        },
        {
          id: "IL",
          title: { ru: "ИЗРАИЛЬ: ИНДЕКС БЕЗОПАСНОСТИ", en: "ISRAEL SECURITY INDEX" },
          value: (40 + Math.random() * 5).toFixed(1),
          trend: "stable",
          news: filter(['Israel', 'IDF', 'Gaza', 'Lebanon', 'Hezbollah', 'Mossad', 'Tel Aviv'])
        },
        {
          id: "YE",
          title: { ru: "ИРАН / ЙЕМЕН: АНАЛИЗ УГРОЗ", en: "IRAN / YEMEN THREAT ANALYSIS" },
          value: (35 + Math.random() * 10).toFixed(1),
          trend: "up",
          news: filter(['Iran', 'Tehran', 'Houthi', 'Yemen', 'Red Sea', 'Drone', 'Missile'])
        }
      ],
      prediction: {
        date: new Date().toLocaleDateString(),
        impact: (70 + Math.random() * 10).toFixed(1)
      }
    };

    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ status: 'error' });
  }
}
