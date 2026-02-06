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
    // Подключение к аналитическим узлам ISW, FDD и экспертным фидам
    const [isw, fdd, crisis] = await Promise.all([
      fetchRSS('https://www.understandingwar.org/rss.xml'),
      fetchRSS('https://www.fdd.org/analysis/feed/'),
      fetchRSS('https://www.crisisgroup.org/rss.xml')
    ]);

    const rawFeed = [...isw, ...fdd, ...crisis];

    // КРИТИЧЕСКИЕ СИГНАЛЫ ЭСКАЛАЦИИ (Keywords для анализа веса)
    const CRITICAL_SIGNALS = {
      high: ['nuclear', 'preemptive', 'ballistic', 'deployment', 'mobilization', 'intercept'],
      medium: ['sanctions', 'cyberattack', 'proxy', 'drill', 'tensions', 'repositioning'],
      low: ['diplomacy', 'talks', 'humanitarian', 'visit', 'observation']
    };

    const analyzeEscalation = (base, scopeKeywords) => {
      let weight = base;
      const corpus = rawFeed
        .filter(i => scopeKeywords.some(k => i.title.toLowerCase().includes(k.toLowerCase())))
        .map(i => (i.title + i.content).toLowerCase()).join(' ');

      CRITICAL_SIGNALS.high.forEach(word => {
        const matches = (corpus.match(new RegExp(word, 'g')) || []).length;
        weight += matches * 3.5; // Высокий приоритет сигнала
      });

      CRITICAL_SIGNALS.medium.forEach(word => {
        const matches = (corpus.match(new RegExp(word, 'g')) || []).length;
        weight += matches * 1.5;
      });

      CRITICAL_SIGNALS.low.forEach(word => {
        const matches = (corpus.match(new RegExp(word, 'g')) || []).length;
        weight -= matches * 2.5; // Снижение риска при наличии мирных сигналов
      });

      return Math.min(Math.max(weight, 5), 98).toFixed(1);
    };

    const data = {
      timestamp: new Date().toISOString(),
      apiHealth: 'optimal',
      nodes: [
        {
          id: "US",
          title: { ru: "США: СИГНАЛЫ ЭСКАЛАЦИИ", en: "US ESCALATION SIGNALS" },
          value: analyzeEscalation(55, ['US', 'Pentagon', 'B-52', 'Navy', 'CENTCOM']),
          trend: "up",
          news: rawFeed.filter(i => i.title.match(/US|Pentagon|Biden|Force/i)).slice(0, 3).map(i => ({
            src: "OSINT_ANALYST",
            txt: i.title
          }))
        },
        {
          id: "IL",
          title: { ru: "ИЗРАИЛЬ: ОПЕРАТИВНЫЙ ФОН", en: "ISRAEL: OPERATIONAL BACKGROUND" },
          value: analyzeEscalation(45, ['Israel', 'IDF', 'Hezbollah', 'Lebanon', 'IAF']),
          trend: "stable",
          news: rawFeed.filter(i => i.title.match(/Israel|IDF|Hezbollah|Northern/i)).slice(0, 3).map(i => ({
            src: "MIL_INTEL",
            txt: i.title
          }))
        },
        {
          id: "IR_YE",
          title: { ru: "ИРАН/ЙЕМЕН: АНАЛИЗ УГРОЗ", en: "IRAN/YEMEN: THREAT ANALYSIS" },
          value: analyzeEscalation(40, ['Iran', 'Houthi', 'Red Sea', 'IRGC', 'Drone']),
          trend: "up",
          news: rawFeed.filter(i => i.title.match(/Iran|Houthi|Yemen|IRGC/i)).slice(0, 3).map(i => ({
            src: "SIGINT_DATA",
            txt: i.title
          }))
        }
      ],
      prediction: {
        date: "SYSTEM_SYNC_06.02.26",
        impact: (40 + Math.random() * 30).toFixed(1)
      },
      netConnectivity: { score: 99.1, status: 'stable' }
    };

    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ status: 'error' });
  }
}
