export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  
  try {
    const salt = Math.random().toString(36).substring(7);
    const RSS_URL = `https://news.google.com/rss/search?q=Israel+Rafah+opening+ceasefire&hl=en-US&gl=US&cache_bust=${salt}`;
    
    const response = await fetch(RSS_URL, { cache: 'no-store' });
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 40);

    let kinetic = 0, deescalation = 0;
    titles.forEach(t => {
      const text = t.toLowerCase();
      if (/(missile|strike|attack|clash)/.test(text)) kinetic += 1;
      if (/(ceasefire|reopens|humanitarian|truce|aid)/.test(text)) deescalation += 5;
    });

    // Расчет индекса с очень низким базовым уровнем (8%)
    const liveIndex = Math.max(12, Math.min(Math.round(8 + (kinetic * 2) - (deescalation * 6)), 95));

    res.status(200).json({
      version: "V12_DEEP_SOBER", // МЕТКА ДЛЯ ПРОВЕРКИ
      live: {
        index: liveIndex,
        verdict: liveIndex < 35 ? 'STABILIZED_ZONE' : 'MONITORED_VOLATILITY'
      },
      forecast: { index: liveIndex + 5 },
      iran_strike: { index: 45, status: 'DETERRENCE' },
      signals: titles.slice(0, 5).map(t => t.split(' - ')[0]),
      last_update: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: "ERR_REFRESH" });
  }
}
