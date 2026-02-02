export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  try {
    const salt = Math.random().toString(36).substring(7);
    const RSS_URL = `https://news.google.com/rss/search?q=Israel+military+Hezbollah+Iran+Pentagon+Brent+Oil+ILS+rate&hl=en-US&gl=US&ceid=US:en&cache_bust=${salt}`;
    const response = await fetch(RSS_URL, { cache: 'no-store' });
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]);

    // АНАЛИТИЧЕСКИЙ ПАРСИНГ
    let iranRhetoric = 0, usNavy = 0, kineticEvents = 0;
    let brentPrice = "66.42", ilsRate = "3.12"; // Дефолтные значения на базе тренда 02.02.26

    const logs = titles.slice(1, 45).map(t => {
      const clean = t.split(' - ')[0].replace(/Day \d+[:|]/gi, '').trim();
      const low = clean.toLowerCase();
      
      // Поиск рыночных данных в реальном времени
      if (low.includes('brent')) { const match = clean.match(/\d+\.\d+/); if (match) brentPrice = match[0]; }
      if (low.includes('ils') || low.includes('shekel')) { const match = clean.match(/\d+\.\d+/); if (match) ilsRate = match[0]; }

      // Геополитические веса
      if (/(carrier|uss|navy|fleet)/.test(low)) usNavy += 1;
      if (/(threat|vow|warn|khamenei|retaliate)/.test(low)) iranRhetoric += 1;
      if (/(strike|missile|rocket|explosion|clash)/.test(low)) kineticEvents += 1;

      return clean;
    }).filter(t => t.length > 15);

    // НОВАЯ МАТЕМАТИКА ИРАНА (Развернутая)
    // Вес авианосцев (max 30), Риторика (max 20), Кинетика (max 50)
    const iranBase = Math.min(usNavy * 10, 30) + Math.min(iranRhetoric * 5, 20) + Math.min(kineticEvents * 5, 50);
    const iranFinal = Math.max(15, iranBase);

    // ОБЩИЙ ИНДЕКС (MADAD OREF)
    const totalRisk = Math.round((kineticEvents * 4 + iranFinal * 0.5 + 10) / 2.1);

    res.status(200).json({
      index: Math.min(totalRisk, 95),
      iran_detail: {
        total: iranFinal,
        factors: [
          { n: "US Naval Presence", v: Math.min(usNavy * 10, 30) },
          { n: "Escalatory Rhetoric", v: Math.min(iranRhetoric * 5, 20) },
          { n: "Kinetic Activity", v: Math.min(kineticEvents * 5, 50) }
        ]
      },
      markets: { brent: `$${brentPrice}`, ils: ilsRate, poly: iranFinal > 50 ? "42%" : "18%" },
      logs: logs.slice(0, 7),
      updated: new Date().toISOString()
    });
  } catch (e) { res.status(500).json({ error: 'OFFLINE' }); }
}
