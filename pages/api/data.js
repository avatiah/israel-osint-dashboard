export default async function handler(req, res) {
  try {
    // We add specific "peace" keywords to the query to force the AI to see the balance
    const RSS_URL = 'https://news.google.com/rss/search?q=Israel+Rafah+reopens+ceasefire+calm+humanitarian&hl=en-US';
    const response = await fetch(RSS_URL);
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 50);

    let kinetic = 0, strategic = 0, deescalation = 0, usIran = 0;

    titles.forEach(t => {
      const text = t.toLowerCase();
      // Only count REAL violence (strikes/missiles), ignore "tensions"
      if (/(missile barrage|massive strike|large scale attack|heavy casualties)/.test(text)) kinetic += 2.0;
      // Drastically reduced strategic weight (ignore the "talk")
      if (/(warning|alert|high alert|threatens)/.test(text)) strategic += 0.2; 
      // MASSIVE weight for de-escalation
      if (/(ceasefire holds|rafah reopens|border opens|humanitarian aid|truce|peace talks|hostage deal)/.test(text)) deescalation += 6.0;
      // US-Iran (kept separate)
      if (/(carrier|strike group|pentagon|iran war)/.test(text)) usIran += 5.0;
    });

    // STARTING AT 5% (The most optimistic baseline)
    const rawLiveIndex = 5 + (kinetic * 3) + (strategic * 1) - (deescalation * 7);
    // Hard cap: even with noise, it shouldn't jump if Rafah is open
    const liveIndex = Math.max(8, Math.min(Math.round(rawLiveIndex), 98));
    
    const iranStrikeIndex = Math.max(5, Math.min(Math.round(5 + usIran), 100));
    
    // Forecast now only moves +10-15% from Live unless there's an actual strike
    const finalForecast = Math.min(Math.round(liveIndex + (iranStrikeIndex * 0.15)), 100);

    res.status(200).json({
      live: {
        index: liveIndex,
        verdict: liveIndex < 30 ? 'STABILIZED_OUTLOOK' : 'REGIONAL_VOLATILITY',
        breakdown: [
          { name: 'ACTIVE_CONFRONTATION', value: Math.round(Math.min(kinetic * 3, 20)) },
          { name: 'POLITICAL_NOISE', value: Math.round(Math.min(strategic * 1, 20)) },
          { name: 'DIPLOMATIC_BUFFER', value: Math.round(Math.min(deescalation * 7, 60)) }
        ]
      },
      forecast: { index: finalForecast, verdict: '24H_STABILITY_TREND' },
      iran_strike: { index: iranStrikeIndex, status: iranStrikeIndex > 85 ? 'HIGH_RISK' : 'DETERRENCE_ACTIVE' },
      signals: titles.slice(0, 5).map(t => t.split(' - ')[0]),
      last_update: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: "CALIBRATION_OFFLINE" });
  }
}
