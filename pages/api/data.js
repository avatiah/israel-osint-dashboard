export default async function handler(req, res) {
  try {
    const RSS_URL = 'https://news.google.com/rss/search?q=Israel+military+strategic+intelligence+forecast&hl=en-US';
    const response = await fetch(RSS_URL);
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 25);

    let counts = { kinetic: 0, strategic: 0, systemic: 0 };
    titles.forEach(t => {
      const text = t.toLowerCase();
      if (/(missile|strike|attack|clash|border|idf)/.test(text)) counts.kinetic++;
      if (/(analysis|forecast|strategic|intelligence|report|isw)/.test(text)) counts.strategic++;
      if (/(cyber|market|economy|bank|currency|ils)/.test(text)) counts.systemic++;
    });

    // Расчет текущего индекса (LIVE)
    const f1 = Math.min(counts.kinetic * 6, 40);   
    const f2 = Math.min(counts.strategic * 8, 40); 
    const f3 = Math.min(counts.systemic * 5, 20);     
    const liveIndex = Math.min(Math.round(12 + f1 + f2 + f3), 100);

    // Логика прогноза (FORECAST 24H)
    // Если много стратегических отчетов (f2), прогноз будет расти выше текущего
    const trend = (f2 > 20) ? 1.15 : 0.95; 
    const forecastIndex = Math.min(Math.round(liveIndex * trend), 100);

    res.status(200).json({
      live: {
        index: liveIndex,
        breakdown: [
          { name: 'KINETIC_ACTIVITY', value: f1, desc: 'Direct military engagements and strikes.' },
          { name: 'STRATEGIC_FORECAST', value: f2, desc: 'Expert projections and intel reports.' },
          { name: 'SYSTEMIC_STRESS', value: f3, desc: 'Cyber and market volatility.' }
        ],
        verdict: liveIndex > 75 ? 'CRITICAL_ALERT' : 'STABLE_OPERATIONS'
      },
      forecast: {
        index: forecastIndex,
        breakdown: [
          { name: 'PROBABLE_ESCALATION', value: Math.round(f2 * trend), desc: 'Likelihood of situation worsening based on expert consensus.' },
          { name: 'REGIONAL_STABILITY', value: Math.round(40 - f1), desc: 'Expected stability of border zones in next 24h.' },
          { name: 'MARKET_RECOVERY', value: Math.max(0, 20 - f3), desc: 'Predicted financial system resilience.' }
        ],
        verdict: forecastIndex > liveIndex ? 'DETERIORATION_EXPECTED' : 'GRADUAL_STABILIZATION'
      },
      key_argument: titles.filter(t => /analysis|indicates|shows/i.test(t))[0]?.split(' - ')[0] || "Monitoring current strategic shifts.",
      last_update: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: "CALIBRATION_FAILED" });
  }
}
