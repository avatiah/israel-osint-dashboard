export default async function handler(req, res) {
  try {
    const RSS_URL = 'https://news.google.com/rss/search?q=Israel+military+ceasefire+Rafah+opening+Lebanon+tensions&hl=en-US';
    const response = await fetch(RSS_URL);
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 35);

    let kinetic = 0, strategic = 0, deescalation = 0, usIran = 0;
    const recentSignals = titles.slice(0, 5).map(t => t.split(' - ')[0]);

    titles.forEach(t => {
      const text = t.toLowerCase();
      // Kinetic (Reduced weights to avoid overestimation)
      if (/(missile|attack|clash|bombardment|strike|explosion|idf)/.test(text)) kinetic += 1.2;
      // Strategic (General tension)
      if (/(intelligence|warning|threat|alert|hezbollah|tensions)/.test(text)) strategic += 0.8;
      // De-escalation (Increased weight to counter-balance)
      if (/(ceasefire|reopening|negotiations|humanitarian|opening|truce|peace|aid|reopens)/.test(text)) deescalation += 3.5;
      // US-Iran Strategic Factor
      if (/(pentagon|carrier|us navy|white house|nuclear|iran strike)/.test(text)) usIran += 5.0;
    });

    // Lower base index (10%) and adjusted calculation for a more "sober" look
    const rawLiveIndex = 10 + (kinetic * 2.5) + (strategic * 3) - (deescalation * 4);
    const liveIndex = Math.max(10, Math.min(Math.round(rawLiveIndex), 98));
    
    const iranStrikeIndex = Math.max(5, Math.min(Math.round(5 + usIran), 100));

    // Forecast: Strongly linked to US-Iran situation as you requested
    const combinedForecast = (liveIndex * 0.7) + (iranStrikeIndex * 0.5);
    const finalForecast = Math.min(Math.round(combinedForecast), 100);

    res.status(200).json({
      live: {
        index: liveIndex,
        verdict: liveIndex > 65 ? 'HIGH_TENSION' : liveIndex > 35 ? 'ELEVATED_STABILITY' : 'NORMAL_MONITORING',
        breakdown: [
          { name: 'KINETIC_ACTIVITY', value: Math.round(Math.min(kinetic * 2, 40)) },
          { name: 'STRATEGIC_PRESSURE', value: Math.round(Math.min(strategic * 2.5, 40)) },
          { name: 'DE-ESCALATION', value: Math.round(Math.min(deescalation * 4, 30)) }
        ]
      },
      forecast: { 
        index: finalForecast, 
        verdict: finalForecast > 75 ? 'STRATEGIC_RISK' : 'MODERATE_OUTLOOK' 
      },
      iran_strike: { 
        index: iranStrikeIndex, 
        status: iranStrikeIndex > 80 ? 'IMMINENT_DANGER' : 'ACTIVE_DETERRENCE' 
      },
      signals: recentSignals,
      last_update: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: "FEED_OFFLINE" });
  }
}
