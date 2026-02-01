export default async function handler(req, res) {
  try {
    const RSS_URL = 'https://news.google.com/rss/search?q=Israel+security+military+border&hl=en-US&gl=US&ceid=US:en';
    const response = await fetch(RSS_URL);
    const xml = await response.text();

    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 15);
    const links = [...xml.matchAll(/<link>(.*?)<\/link>/g)].map(m => m[1]).slice(1, 15);

    // Гео-триггеры
    let geo = { north: false, south: false, center: false, gaza: false, westbank: false };
    
    const signals = titles.map((t, i) => {
      const text = t.toLowerCase();
      
      // Анализ локаций
      if (text.includes('north') || text.includes('lebanon') || text.includes('haifa')) geo.north = true;
      if (text.includes('gaza') || text.includes('hamas') || text.includes('rafah')) geo.gaza = true;
      if (text.includes('south') || text.includes('ashkelon') || text.includes('negev')) geo.south = true;
      if (text.includes('tel aviv') || text.includes('center') || text.includes('ben gurion')) geo.center = true;
      if (text.includes('west bank') || text.includes('jenin') || text.includes('nablus')) geo.westbank = true;

      let importance = 'LOW';
      let color = '#555';
      if (/(attack|missile|rocket|explosion|strike)/.test(text)) { importance = 'HIGH'; color = '#ff0000'; }
      else if (/(warning|alert|idf|iran)/.test(text)) { importance = 'MEDIUM'; color = '#ffae00'; }

      return { title: t.split(' - ')[0], link: links[i], importance, color };
    });

    res.status(200).json({
      last_update: new Date().toISOString(),
      index: 45 + (Object.values(geo).filter(v => v).length * 10), // Индекс растет от кол-ва активных зон
      geo,
      signals: signals.slice(0, 8)
    });
  } catch (e) {
    res.status(500).json({ error: "FAILED" });
  }
}
