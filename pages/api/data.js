export default async function handler(req, res) {
  try {
    const RSS_URL = 'https://news.google.com/rss/search?q=Israel+military+intelligence+analysis+forecast&hl=en-US';
    const response = await fetch(RSS_URL);
    const xml = await response.text();

    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 20);
    const pubDates = [...xml.matchAll(/<pubDate>(.*?)<\/pubDate>/g)].map(m => m[1]).slice(1, 20);

    // 1. Фактор "Информационного взрыва" (Скорость)
    const now = new Date();
    const recentSignals = pubDates.filter(d => (now - new Date(d)) / 60000 < 60).length;
    const burstScore = Math.min(recentSignals * 6, 35);

    // 2. Сентимент-анализ (Очки угрозы)
    let threatPoints = 0;
    let expertCount = 0;
    const signals = titles.map((t, i) => {
      const text = t.toLowerCase();
      const isExpert = /(analysis|report|isw|strategic|intelligence)/.test(text);
      if (isExpert) expertCount++;

      let weight = 1;
      if (/(missile|attack|strike|explosion|barrage)/.test(text)) weight = 5;
      else if (/(warning|alert|idf|hezbollah|iran)/.test(text)) weight = 3;
      
      threatPoints += weight;

      return {
        title: t.split(' - ')[0],
        importance: weight >= 5 ? 'CRITICAL' : weight >= 3 ? 'ELEVATED' : 'ROUTINE',
        color: weight >= 5 ? '#ff0000' : weight >= 3 ? '#ffae00' : '#0f0',
        time: new Date(pubDates[i]).toLocaleTimeString('he-IL', {hour:'2-digit', minute:'2-digit'})
      };
    });

    // Расчет итогового индекса
    const finalIndex = Math.min(15 + burstScore + (threatPoints * 0.8) + (expertCount * 5), 100);

    res.status(200).json({
      index: Math.round(finalIndex),
      last_update: now.toISOString(),
      factors: {
        volatility: burstScore,
        sentiment: threatPoints,
        intel_nodes: expertCount
      },
      signals: signals.slice(0, 15)
    });
  } catch (e) {
    res.status(500).json({ error: "DATA_LINK_FAILURE" });
  }
}
