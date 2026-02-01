export default async function handler(req, res) {
  try {
    const RSS_URL = 'https://news.google.com/rss/search?q=Israel+security+military+alert&hl=en-US&gl=US&ceid=US:en';
    const response = await fetch(RSS_URL);
    const xml = await response.text();

    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 15);
    const links = [...xml.matchAll(/<link>(.*?)<\/link>/g)].map(m => m[1]).slice(1, 15);

    let geo = { north: false, south: false, center: false, gaza: false, westbank: false };
    let criticalEvents = 0;
    
    const signals = titles.map((t, i) => {
      const text = t.toLowerCase();
      
      // Гео-детектор
      if (/north|lebanon|haifa|metula/.test(text)) geo.north = true;
      if (/gaza|hamas|rafah/.test(text)) geo.gaza = true;
      if (/south|negev|eilat|red sea/.test(text)) geo.south = true;
      if (/tel aviv|central israel|airport/.test(text)) geo.center = true;
      if (/west bank|jenin|nablus/.test(text)) geo.westbank = true;

      let importance = 'LOW', color = '#555';
      
      // Поиск критических событий
      if (/(attack|missile|rocket|explosion|direct hit|barrage)/.test(text)) {
        importance = 'HIGH';
        color = '#ff0000';
        criticalEvents += 1;
      } else if (/(alert|drone|intercept|siren|idf)/.test(text)) {
        importance = 'MEDIUM';
        color = '#ffae00';
      }

      return { title: t.split(' - ')[0], link: links[i], importance, color };
    });

    // --- НОВАЯ ПРОФЕССИОНАЛЬНАЯ ФОРМУЛА ИНДЕКСА ---
    // Базовый уровень напряженности (Base Load)
    let calculatedIndex = 15; 
    
    // Добавляем за каждую "горячую" географическую зону (+8% за зону)
    const activeZonesCount = Object.values(geo).filter(v => v).length;
    calculatedIndex += activeZonesCount * 8;
    
    // Добавляем за критические события (+12% за каждое уникальное событие в ленте)
    calculatedIndex += criticalEvents * 12;

    // Ограничиваем индекс (Cap) на 100%
    const finalIndex = Math.min(calculatedIndex, 100);

    res.status(200).json({
      last_update: new Date().toISOString(),
      index: finalIndex,
      geo,
      signals: signals.slice(0, 10)
    });
  } catch (e) {
    res.status(500).json({ error: "OFFLINE", geo: {}, signals: [] });
  }
}
