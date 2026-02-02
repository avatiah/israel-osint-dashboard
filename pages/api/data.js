export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  try {
    const salt = Math.random().toString(36).substring(7);
    const RSS_URL = `https://news.google.com/rss/search?q=Israel+military+Hezbollah+Gaza+strike+Iran&hl=en-US&gl=US&ceid=US:en&cache_bust=${salt}`;
    const response = await fetch(RSS_URL, { cache: 'no-store' });
    const xml = await response.text();
    
    // Чистим заголовки от названий СМИ и дат
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)]
      .map(m => m[1].split(' - ')[0].replace(/Day \d+[:|]/g, '').trim())
      .slice(1, 40);

    let stats = { mil: 0, pol: 0, log: 0 };
    let logs = [];

    titles.forEach(t => {
      const txt = t.toLowerCase();
      if (/(missile|strike|rocket|interception|killed|explosion|shelling)/.test(txt)) {
        stats.mil += 1;
        logs.push({ s: 'MIL', t });
      } else if (/(threaten|warn|statement|official|pm says)/.test(txt)) {
        stats.pol += 1;
        logs.push({ s: 'POL', t });
      } else if (/(deployment|border|tank|troop|convoy)/.test(txt)) {
        stats.log += 1;
        logs.push({ s: 'LOG', t });
      }
    });

    // МАТЕМАТИКА: Считаем вклад каждого типа данных
    const milPoints = stats.mil * 5;
    const polPoints = stats.pol * 3;
    const logPoints = stats.log * 4;
    
    // Нормализация: делим на 4.5, чтобы индекс был адекватным (не завышенным)
    const finalIndex = Math.max(12, Math.min(Math.round((milPoints + polPoints + logPoints) / 4.5), 95));

    res.status(200).json({
      index: finalIndex,
      matrix: [
        { label: "Military", count: stats.mil, impact: milPoints },
        { label: "Political", count: stats.pol, impact: polPoints },
        { label: "Logistics", count: stats.log, impact: logPoints }
      ],
      logs: logs.slice(0, 8),
      updated: new Date().toISOString()
    });
  } catch (e) { res.status(500).json({ error: 'DATA_OFFLINE' }); }
}
