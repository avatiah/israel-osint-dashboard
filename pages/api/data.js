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
    // Фокусируемся на источниках, дающих оперативную военную аналитику
    const [fdd, lwj] = await Promise.all([
      fetchRSS('https://www.fdd.org/analysis/feed/'),
      fetchRSS('https://www.longwarjournal.org/feed')
    ]);

    const rawFeed = [...fdd, ...lwj];

    // Жесткий фильтр: оставляем только то, что относится к эскалации
    const filterIntel = (keywords, exclude = ['oil', 'economic', 'climate', 'trade', 'imports']) => {
      return rawFeed.filter(item => {
        const content = (item.title + item.description).toLowerCase();
        const hasKeyword = keywords.some(k => content.includes(k.toLowerCase()));
        const hasExcluded = exclude.some(e => content.includes(e.toLowerCase()));
        return hasKeyword && !hasExcluded;
      }).slice(0, 3).map(item => ({
        src: item.author?.toUpperCase().substring(0, 10) || "INTEL",
        txt: item.title
      }));
    };

    // Критические маркеры для индекса
    const analyzeRisk = (base, subjects) => {
      const corpus = rawFeed.map(i => i.title.toLowerCase()).join(' ');
      let score = base;
      const triggers = ['strike', 'missile', 'uav', 'attack', 'deployment', 'nuclear', 'warning'];
      
      subjects.forEach(s => {
        triggers.forEach(t => {
          if (corpus.includes(s) && corpus.includes(t)) score += 4.5;
        });
      });
      return Math.min(Math.max(score, 5), 98).toFixed(1);
    };

    const data = {
      timestamp: new Date().toISOString(),
      nodes: [
        {
          id: "US",
          title: { ru: "США: УДАРНЫЕ ГРУППЫ", en: "US: STRIKE GROUPS" },
          value: analyzeRisk(50, ['us', 'pentagon', 'centcom']),
          trend: "up",
          news: filterIntel(['Pentagon', 'B-52', 'Aircraft Carrier', 'Strike', 'Centcom', 'Red Sea'])
        },
        {
          id: "IL",
          title: { ru: "ИЗРАИЛЬ: ОПЕРАТИВНЫЕ ЦЕЛИ", en: "ISRAEL: OPERATIONAL TARGETS" },
          value: analyzeRisk(40, ['israel', 'idf', 'iaf']),
          trend: "stable",
          news: filterIntel(['IDF', 'IAF', 'Hezbollah', 'Lebanon', 'Syria', 'Intercept'])
        },
        {
          id: "IR",
          title: { ru: "ИРАН/ЙЕМЕН: ВЕКТОРЫ АТАК", en: "IRAN/YEMEN: ATTACK VECTORS" },
          value: analyzeRisk(35, ['iran', 'houthi', 'irgc']),
          trend: "up",
          news: filterIntel(['Houthi', 'Iran', 'IRGC', 'Drone', 'Ballistic', 'Tehran'])
        }
      ],
      prediction: {
        date: "SIGNAL_SYNC_06.02.26",
        impact: (45 + Math.random() * 20).toFixed(1)
      }
    };

    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "FEED_OFFLINE" });
  }
}
