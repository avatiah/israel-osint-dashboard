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
    // Используем проверенные аналитические фиды
    const [fdd, lwj, isw] = await Promise.all([
      fetchRSS('https://www.fdd.org/analysis/feed/'),
      fetchRSS('https://www.longwarjournal.org/feed'),
      fetchRSS('https://www.understandingwar.org/rss.xml')
    ]);

    const rawFeed = [...fdd, ...lwj, ...isw];

    // Умный фильтр для каждого конкретного узла
    const getStrictIntel = (mustHaveAll, atLeastOneOf) => {
      return rawFeed.filter(item => {
        const text = (item.title + item.description).toLowerCase();
        const hasRequired = mustHaveAll.every(k => text.includes(k.toLowerCase()));
        const hasTarget = atLeastOneOf.some(k => text.includes(k.toLowerCase()));
        return hasRequired && hasTarget;
      }).slice(0, 3).map(item => ({
        src: item.author?.toUpperCase().split(' ')[0] || "INTEL",
        txt: item.title
      }));
    };

    // Расчет индекса только на базе тематических сигналов
    const calculatePureRisk = (base, must, targets) => {
      const corpus = rawFeed.map(i => i.title.toLowerCase()).join(' ');
      let score = base;
      targets.forEach(t => {
        must.forEach(m => {
          if (corpus.includes(t) && corpus.includes(m)) score += 5.5;
        });
      });
      return Math.min(Math.max(score, 10), 99).toFixed(1);
    };

    const data = {
      timestamp: new Date().toISOString(),
      nodes: [
        {
          id: "US_STRIKE",
          title: { ru: "ПРОГНОЗ УДАРА США ПО ИРАНУ", en: "US STRIKE PROBABILITY ON IRAN" },
          value: calculatePureRisk(50, ['strike', 'attack', 'military', 'b-52', 'carrier'], ['iran', 'tehran', 'irgc']),
          trend: "up",
          // Ищем ТОЛЬКО связку США + ИРАН + Военные действия
          news: getStrictIntel(['iran'], ['strike', 'attack', 'b-52', 'carrier', 'centcom', 'pentagon'])
        },
        {
          id: "IL_SECURITY",
          title: { ru: "ИНДЕКС БЕЗОПАСНОСТИ ИЗРАИЛЯ", en: "ISRAEL SECURITY INDEX" },
          value: calculatePureRisk(40, ['idf', 'iaf', 'hezbollah', 'lebanon'], ['israel', 'northern']),
          trend: "stable",
          // Ищем ТОЛЬКО связку Израиль + Прямая угроза (Хезболла/Ливан)
          news: getStrictIntel(['israel'], ['hezbollah', 'lebanon', 'idf', 'iaf', 'intercept', 'strike'])
        },
        {
          id: "YE_HOUTHI",
          title: { ru: "УГРОЗА ХУСИТОВ (ЙЕМЕН)", en: "YEMEN HOUTHI THREAT LEVEL" },
          value: calculatePureRisk(30, ['houthi', 'uav', 'missile', 'ship'], ['red sea', 'yemen', 'aden']),
          trend: "up",
          // Ищем ТОЛЬКО связку Хуситы + Красное море + Атаки
          news: getStrictIntel(['houthi'], ['red sea', 'uav', 'missile', 'attack', 'shipping', 'yemen'])
        }
      ],
      prediction: {
        date: "FINAL_FILTER_SYNC",
        impact: (50 + Math.random() * 15).toFixed(1)
      }
    };

    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "INTEL_OFFLINE" });
  }
}
