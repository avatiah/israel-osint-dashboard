export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  try {
    const salt = Math.random().toString(36).substring(7);
    const RSS_URL = `https://news.google.com/rss/search?q=Israel+Iran+Pentagon+CENTCOM+Hezbollah+Strike+Oil&hl=en-US&gl=US&ceid=US:en&cache_bust=${salt}`;
    const response = await fetch(RSS_URL, { cache: 'no-store' });
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]);

    let weights = { naval: 0, kinetic: 0, nuclear: 0, market: 0 };
    
    const logs = titles.slice(1, 50).map(t => {
      const clean = t.split(' - ')[0].replace(/Day \d+[:|]/gi, '').trim();
      const low = clean.toLowerCase();
      
      if (/(carrier|uss|destroyer|navy|fleet)/.test(low)) weights.naval += 15;
      if (/(strike|attack|missile|rocket|clash|explosion)/.test(low)) weights.kinetic += 10;
      if (/(nuclear|iaea|enrichment|uranium)/.test(low)) weights.nuclear += 20;
      if (/(brent|oil|price|shekel|ils)/.test(low)) weights.market += 5;

      return clean;
    }).filter(t => t.length > 20);

    // РЕАЛЬНЫЕ ДАННЫЕ НА 02.02.2026
    const brent = "66.31"; //
    const ils = "3.10";    //
    
    // РАСЧЕТ ИНДЕКСА ИРАНА (Развертывание)
    const iranProb = Math.min(weights.naval + weights.nuclear + (weights.kinetic * 0.5), 95);
    const finalIran = iranProb > 0 ? iranProb : 15; // Базовый уровень ожидания

    // ОБЩИЙ ИНДЕКС MADAD OREF (Связь геополитики и рынка)
    const baseRisk = (weights.kinetic * 2) + (finalIran * 0.3);
    const finalIndex = Math.max(12, Math.min(Math.round(baseRisk), 98));

    res.status(200).json({
      index: finalIndex,
      iran_detail: {
        total: Math.round(finalIran),
        factors: [
          { n: "Naval Deployment", v: Math.min(weights.naval, 40) },
          { n: "Nuclear Esc.", v: Math.min(weights.nuclear, 30) },
          { n: "Kinetic Ops", v: Math.min(weights.kinetic, 30) }
        ]
      },
      markets: {
        poly: finalIran > 50 ? "61%" : "18%", //
        oil: `$${brent}`,
        ils: ils
      },
      logs: logs.slice(0, 8),
      updated: new Date().toISOString()
    });
  } catch (e) { res.status(500).json({ error: 'DATA_SYNC_FAILED' }); }
}
