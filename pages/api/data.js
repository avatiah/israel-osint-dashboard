export default async function handler(req, res) {
  try {
    // 1. Собираем новости по разным категориям для точности
    const feeds = [
      'Israel+security+emergency',
      'Israel+military+intelligence+news',
      'Hezbollah+Iran+threat'
    ];
    const randomFeed = feeds[Math.floor(Math.random() * feeds.length)];
    const response = await fetch(`https://news.google.com/rss/search?q=${randomFeed}&hl=en-US&gl=US&ceid=US:en`);
    const xml = await response.text();

    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 15);
    const links = [...xml.matchAll(/<link>(.*?)<\/link>/g)].map(m => m[1]).slice(1, 15);

    // 2. Логика оценки важности и факторов
    let alertCount = 0;
    const signals = titles.map((t, i) => {
      const text = t.toLowerCase();
      let importance = 'LOW';
      let color = '#555';

      if (/(attack|missile|rocket|explosion|strike|emergency|killed)/.test(text)) {
        importance = 'HIGH';
        color = '#ff0000';
        alertCount += 2; // Каждое важное событие повышает индекс
      } else if (/(warning|alert|deployment|border|tension|iran)/.test(text)) {
        importance = 'MEDIUM';
        color = '#ffae00';
        alertCount += 1;
      }

      return { title: t.split(' - ')[0], link: links[i], importance, color };
    });

    // 3. Дополнительные "бесплатные" факторы (Симуляция на основе анализа новостей)
    // В реальном OSINT это называется "Sentiment Analysis"
    const cyber_pressure = Math.min(20 + alertCount * 3, 100);
    const currency_volatility = alertCount > 5 ? 70 : 30; // Если новостей много, считаем рынок нестабильным

    const blocks = {
      military: Math.min(40 + alertCount * 4, 100),
      cyber: cyber_pressure,
      market_fear: currency_volatility,
      border_status: Math.min(30 + alertCount * 2, 100)
    };

    const totalIndex = Math.round(
      (blocks.military * 0.5) + (blocks.cyber * 0.2) + (blocks.market_fear * 0.15) + (blocks.border_status * 0.15)
    );

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({
      last_update: new Date().toISOString(),
      index: totalIndex,
      blocks,
      signals: signals.slice(0, 10)
    });
  } catch (e) {
    res.status(500).json({ error: "FEED_FAILED" });
  }
}
