export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  try {
    const salt = Math.random().toString(36).substring(7);
    const RSS_URL = `https://news.google.com/rss/search?q=Israel+Hezbollah+Gaza+Iran+Pentagon&hl=en-US&gl=US&ceid=US:en&cache_bust=${salt}`;
    const response = await fetch(RSS_URL, { cache: 'no-store' });
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 50);

    let sectors = { north: 5, south: 5, east: 5 };
    let logs = [];

    titles.forEach(t => {
      const txt = t.toLowerCase();
      if (/(hezbollah|lebanon|border|northern)/.test(txt)) { sectors.north += 4; logs.push({f: 'NORTH', t: t.split(' - ')[0]}); }
      if (/(gaza|hamas|rafah|southern)/.test(txt)) { sectors.south += 3; logs.push({f: 'SOUTH', t: t.split(' - ')[0]}); }
      if (/(iran|tehran|khamenei|strike|syria)/.test(txt)) { sectors.east += 6; logs.push({f: 'EAST', t: t.split(' - ')[0]}); }
    });

    const finalIndex = Math.max(12, Math.min(Math.round((sectors.north + sectors.south + sectors.east) / 1.8), 95));

    // Симуляция данных для графика 72ч (тренд)
    const history = Array.from({length: 12}, (_, i) => ({
      time: `${(i*6)}h ago`,
      val: Math.max(10, finalIndex + Math.floor(Math.random() * 20) - 10)
    })).reverse();

    res.status(200).json({
      index: finalIndex,
      history,
      fronts: [
        { id: 'NORTH', name: 'LEBANON/HEZBOLLAH', level: Math.min(sectors.north * 3, 100) },
        { id: 'SOUTH', name: 'GAZA/HAMAS', level: Math.min(sectors.south * 3, 100) },
        { id: 'EAST', name: 'IRAN/REGIONAL', level: Math.min(sectors.east * 3, 100) }
      ],
      market: { poly: "61%", brent: "$65.66", usdils: "3.11" },
      logs: logs.slice(0, 5),
      updated: new Date().toISOString()
    });
  } catch (e) { res.status(500).json({ error: 'OFFLINE' }); }
}
