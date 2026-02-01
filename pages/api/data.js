// Force Vercel to treat this as a dynamic route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function handler(req, res) {
  // Disable all possible caching layers
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    const salt = Math.random().toString(36).substring(7);
    // Focus query on de-escalation markers to balance the "Trump-Iran" noise
    const RSS_URL = `https://news.google.com/rss/search?q=Israel+Rafah+opening+ceasefire+calm+humanitarian&hl=en-US&gl=US&ceid=US:en&cache_bust=${salt}`;
    
    const response = await fetch(RSS_URL, { cache: 'no-store' });
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 40);

    let kinetic = 0, strategic = 0, deescalation = 0, usIran = 0;

    titles.forEach(t => {
      const text = t.toLowerCase();
      // Only extreme kinetic events count (barrages, massive strikes)
      if (/(missile barrage|massive strike|large scale attack|heavy casualties)/.test(text)) kinetic += 1.5;
      // Strategic noise has very low weight now
      if (/(warning|alert|high alert|threatens|tensions)/.test(text)) strategic += 0.15; 
      // De-escalation (Rafah opening is key today)
      if (/(ceasefire|rafah opening|border reopens|humanitarian aid|truce|negotiations|aid trucks)/.test(text)) deescalation += 7.0;
      // US-Iran Strategic Factor
      if (/(carrier|strike group|pentagon|iran war|nuclear strike)/.test(text)) usIran += 5.0;
    });

    // NEW LOGIC: Lower base (8%) and heavy de-escalation discount
    // If Rafah is open, it should keep the index low regardless of "threat" news
    const rawLiveIndex = 8 + (kinetic * 2.5) + (strategic * 0.8) - (deescalation * 8);
    const liveIndex = Math.max(12, Math.min(Math.round(rawLiveIndex), 98));
    
    const iranStrikeIndex = Math.max(5, Math.min(Math.round(5 + usIran), 100));
    
    // Forecast: Tied 20% to Iran threat and 80% to local trend
    const finalForecast = Math.min(Math.round(liveIndex + (iranStrikeIndex * 0.20)), 100);

    res.status(200).json({
      live: {
        index: liveIndex,
        verdict: liveIndex < 35 ? 'STABILIZED_ZONE' : 'MONITORED_VOLATILITY',
        breakdown: [
          { name: 'ACTIVE_CONFRONTATION', value: Math.round(Math.min(kinetic * 3, 20)) },
          { name: 'GEOPOLITICAL_NOISE', value: Math.round(Math.min(strategic * 1, 15)) },
          { name: 'DIPLOMATIC_BUFFER', value: Math.round(Math.min(deescalation * 8, 65)) }
        ]
      },
      forecast: { index: finalForecast, verdict: '24H_REGIONAL_TREND' },
      iran_strike: { index: iranStrikeIndex, status: iranStrikeIndex > 85 ? 'CRITICAL_RISK' : 'DETERRENCE' },
      signals: titles.slice(0, 5).map(t => t.split(' - ')[0]),
      last_update: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: "FEED_ERROR" });
  }
}
