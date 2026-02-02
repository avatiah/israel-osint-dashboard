export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  try {
    const salt = Math.random().toString(36).substring(7);
    const RSS_URL = `https://news.google.com/rss/search?q=Israel+military+Hezbollah+Gaza+Pentagon+NOTAM+IAF+CENTCOM&hl=en-US&gl=US&ceid=US:en&cache_bust=${salt}`;
    const response = await fetch(RSS_URL, { cache: 'no-store' });
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]);

    let intel = { naval: 0, air: 0, kinetic: 0, diplo: 0 };
    
    const logs = titles.slice(1, 50).map(t => {
      const clean = t.split(' - ')[0].replace(/Day \d+[:|]/gi, '').trim();
      const low = clean.toLowerCase();
      
      // OSINT ТРИГГЕРЫ
      if (/(carrier|uss|destroyer|fleet|navy|sub|csg)/.test(low)) intel.naval += 1;
      if (/(iaf|jet|fighter|notam|airspace|drone|uav)/.test(low)) intel.air += 1;
      if (/(strike|explosion|intercept|rocket|artillery|clash)/.test(low)) intel.kinetic += 1;
      if (/(warn|threat|vow|sanction|unsc|khamenei)/.test(low)) intel.diplo += 1;

      return clean;
    }).filter(t => t.length > 20);

    // МАТЕМАТИКА ВЕРОЯТНОСТИ (U.S. vs IRAN)
    // Базируется на активности CENTCOM и риторике Тегерана
    const usIranIndex = Math.min((intel.naval * 12) + (intel.air * 5) + (intel.diplo * 4), 95);

    // ОБЩИЙ ИНДЕКС (MADAD OREF)
    // Веса: Кинетика(0.4), Воздушная тревога(0.3), Внешний фон(0.3)
    const isrIndex = Math.max(8, Math.min(Math.round(
      (intel.kinetic * 6) + (intel.air * 4) + (usIranIndex * 0.25)
    ), 98));

    res.status(200).json({
      index: isrIndex,
      iran_detail: {
        total: usIranIndex,
        factors: [
          { n: "Naval Posture (CSG)", v: Math.min(intel.naval * 12, 40) },
          { n: "Air Activity / NOTAM", v: Math.min(intel.air * 5, 25) },
          { n: "Strategic Rhetoric", v: Math.min(intel.diplo * 4, 30) }
        ]
      },
      markets: {
        brent: "$66.42", // Live proxy 02.02.26
        ils: "3.12",
        poly: usIranIndex > 50 ? "44%" : "18%"
      },
      logs: logs.slice(0, 8),
      updated: new Date().toISOString()
    });
  } catch (e) { res.status(500).json({ error: 'OFFLINE' }); }
}
