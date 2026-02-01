export default async function handler(req, res) {
  try {
    const RSS_URL = 'https://news.google.com/rss/search?q=Israel+military+strategic+intelligence+forecast&hl=en-US';
    const response = await fetch(RSS_URL);
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 30);

    let kinetic = 0, strategic = 0, deescalation = 0;

    titles.forEach(t => {
      const text = t.toLowerCase();
      if (/(missile|attack|clash|bombardment|strike|explosion|idf)/.test(text)) kinetic += 1.8;
      if (/(intelligence|forecast|warning|threat|alert|iran|hezbollah|tensions)/.test(text)) strategic += 1.2;
      if (/(ceasefire|reopening|negotiations|humanitarian|opening|truce|peace|aid)/.test(text)) deescalation += 2.5;
    });

    const f1 = Math.min(kinetic * 3, 35);   
    const f2 = Math.min(strategic * 4, 35); 
    const f3 = Math.max(0, deescalation * 2.5); 

    // LIVE calculation (Current reality)
    const liveIndex = Math.max(15, Math.min(Math.round(20 + f1 + f2 - f3), 98));

    // FORECAST calculation (Next 24h)
    // If de-escalation signs are strong, forecast trends lower
    const forecastIndex = Math.max(15, Math.min(Math.round(liveIndex * (deescalation > 5 ? 0.85 : 1.1)), 100));

    res.status(200).json({
      live: {
        index: liveIndex,
        breakdown: [
          { name: 'KINETIC_ACTIVITY', value: Math.round(f1), desc: 'Direct combat and border incidents.' },
          { name: 'STRATEGIC_PRESSURE', value: Math.round(f2), desc: 'Threat assessments and intelligence.' },
          { name: 'DE-ESCALATION_SIGNS', value: Math.round(f3), desc: 'Diplomatic progress and humanitarian openings.' }
        ],
        verdict: liveIndex > 70 ? 'HIGH_TENSION' : 'ELEVATED_STABILITY'
      },
      forecast: {
        index: forecastIndex,
        breakdown: [
          { name: 'ESCALATION_RISK', value: Math.round(f2 * 1.2), desc: 'Probability of sudden tactical shifts.' },
          { name: 'STABILIZATION_TREND', value: Math.round(f3 * 0.8), desc: 'Projected endurance of current diplomatic channels.' },
          { name: 'REGIONAL_BUFFER', value: 20, desc: 'Estimated resilience of civil infrastructure.' }
        ],
        verdict: forecastIndex < liveIndex ? 'STABILIZATION_LIKELY' : 'VOLATILITY_EXPECTED'
      },
      key_argument: titles.find(t => /opening|reopens|analysis|ceasefire/i.test(t))?.split(' - ')[0] || "Diplomatic channels remain active despite tactical friction.",
      last_update: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: "CALIBRATION_OFFLINE" });
  }
}
