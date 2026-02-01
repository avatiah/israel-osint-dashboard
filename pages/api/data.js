export default async function handler(req, res) {
  try {
    const RSS_URL = 'https://news.google.com/rss/search?q=Israel+military+strategic+US+Iran+strike+forecast&hl=en-US';
    const response = await fetch(RSS_URL);
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 35);

    let kinetic = 0, strategic = 0, deescalation = 0, usIran = 0;

    titles.forEach(t => {
      const text = t.toLowerCase();
      if (/(missile|attack|clash|bombardment|strike|explosion|idf)/.test(text)) kinetic += 1.8;
      if (/(intelligence|forecast|warning|threat|alert|hezbollah|tensions)/.test(text)) strategic += 1.2;
      if (/(ceasefire|reopening|negotiations|humanitarian|opening|truce|peace|aid)/.test(text)) deescalation += 2.5;
      if (/(pentagon|carrier|us navy|white house|nuclear|iran strike)/.test(text)) usIran += 5.5;
    });

    const liveIndex = Math.max(15, Math.min(Math.round(20 + (kinetic*3) + (strategic*4) - (deescalation*2.5)), 98));
    const iranStrikeIndex = Math.max(5, Math.min(Math.round(5 + usIran), 100));

    // CORRELATED FORECAST LOGIC
    // Israel Forecast is now a product of local dynamics AND the US-Iran threat level.
    const localTrend = deescalation > (kinetic + strategic) ? 0.8 : 1.1;
    const combinedForecast = (liveIndex * localTrend) + (iranStrikeIndex * 0.45);
    const finalForecast = Math.min(Math.round(combinedForecast), 100);

    res.status(200).json({
      live: {
        index: liveIndex,
        verdict: liveIndex > 70 ? 'HIGH_TENSION' : 'ELEVATED_STABILITY',
        breakdown: [
          { name: 'KINETIC_ACTIVITY', value: Math.round(Math.min(kinetic * 3, 40)), desc: 'Current tactical engagements and border friction.' },
          { name: 'STRATEGIC_PRESSURE', value: Math.round(Math.min(strategic * 4, 40)), desc: 'Intelligence reports and direct threat rhetoric.' },
          { name: 'DE-ESCALATION_SIGNS', value: Math.round(Math.min(deescalation * 2.5, 20)), desc: 'Diplomatic progress and humanitarian relief.' }
        ]
      },
      forecast: {
        index: finalForecast,
        verdict: finalForecast > 80 ? 'CRITICAL_WAR_PROBABILITY' : 'REGIONAL_VOLATILITY'
      },
      iran_strike: {
        index: iranStrikeIndex,
        status: iranStrikeIndex > 80 ? 'IMMINENT_DANGER' : 'MONITORING_DETERRENCE',
        desc: 'Assessment of U.S. kinetic action against Iranian strategic assets or nuclear infrastructure.'
      },
      key_argument: titles.find(t => /iran|pentagon|nuclear|strike|analysis/i.test(t))?.split(' - ')[0] || "Strategic monitoring of regional naval assets and air defense readiness.",
      last_update: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: "CALIBRATION_FAILED" });
  }
}
