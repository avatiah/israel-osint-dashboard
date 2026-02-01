export default async function handler(req, res) {
  try {
    const RSS_URL = 'https://news.google.com/rss/search?q=US+military+Iran+strike+Pentagon+nuclear+tensions&hl=en-US';
    const response = await fetch(RSS_URL);
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 30);

    // Логика основного индекса (предыдущая)
    let kinetic = 0, strategic = 0, deescalation = 0;
    // Логика для США vs Иран
    let usIranEscalation = 0;

    titles.forEach(t => {
      const text = t.toLowerCase();
      // Основные факторы
      if (/(missile|attack|clash|bombardment|strike|explosion)/.test(text)) kinetic += 1.8;
      if (/(intelligence|forecast|warning|threat|alert|hezbollah)/.test(text)) strategic += 1.2;
      if (/(ceasefire|reopening|negotiations|humanitarian|truce)/.test(text)) deescalation += 2.5;

      // Специфические триггеры США/Иран
      if (/(pentagon|carrier|us navy|white house|red line|nuclear facility)/.test(text)) usIranEscalation += 4;
      if (/(retaliation|unavoidable|preemptive|direct strike)/.test(text)) usIranEscalation += 5;
    });

    const liveIndex = Math.max(15, Math.min(Math.round(20 + (kinetic*3) + (strategic*4) - (deescalation*2.5)), 98));
    
    // Расчет индекса США-Иран (База 5% + найденные триггеры)
    const iranStrikeIndex = Math.max(5, Math.min(Math.round(5 + usIranEscalation), 100));

    res.status(200).json({
      live: {
        index: liveIndex,
        verdict: liveIndex > 70 ? 'HIGH_TENSION' : 'ELEVATED_STABILITY',
        breakdown: [
            { name: 'KINETIC_ACTIVITY', value: Math.round(kinetic * 3) },
            { name: 'STRATEGIC_PRESSURE', value: Math.round(strategic * 4) }
        ]
      },
      iran_strike: {
        index: iranStrikeIndex,
        status: iranStrikeIndex > 60 ? 'IMMINENT_DANGER' : iranStrikeIndex > 30 ? 'ACTIVE_DETERRENCE' : 'LOW_PROBABILITY',
        desc: 'Assessment of U.S. kinetic action against Iranian strategic assets or nuclear infrastructure.'
      },
      key_argument: titles.find(t => /pentagon|nuclear|strike|analysis/i.test(t))?.split(' - ')[0] || "U.S. strategic assets remain in high-readiness posture in the Persian Gulf.",
      last_update: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: "CALIBRATION_OFFLINE" });
  }
}
