export default async function handler(req, res) {
  try {
    // 1. Собираем новости
    const RSS_URL = 'https://news.google.com/rss/search?q=Israel+security+analysis+military&hl=en-US';
    const response = await fetch(RSS_URL);
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 15);

    // 2. Симуляция финансового фактора (USD/ILS) - в идеале здесь fetch на биржевой виджет
    const currencyVolatility = (Math.random() * 0.8).toFixed(2); // имитация изменения курса
    
    // 3. Анализ контента на экспертность
    let expertCount = 0;
    const signals = titles.map(t => {
      const isExpert = /isw|intelligence|strategic|think+tank|official/i.test(t);
      if (isExpert) expertCount++;
      return {
        title: t.split(' - ')[0],
        type: isExpert ? 'STRATEGIC' : 'TACTICAL',
        color: isExpert ? '#00ccff' : '#0f0'
      };
    });

    // 4. Итоговая формула индекса (Strategic Grade)
    // Веса: 40% - новости, 30% - финансовый стресс, 30% - экспертные сводки
    const newsImpact = Math.min(titles.length * 5, 40);
    const marketImpact = currencyVolatility * 50; 
    const strategicImpact = expertCount * 10;

    const totalIndex = Math.min(Math.round(newsImpact + marketImpact + strategicImpact + 10), 100);

    res.status(200).json({
      index: totalIndex,
      market_stress: `${currencyVolatility}%`,
      intel_nodes: expertCount,
      signals: signals.slice(0, 10),
      status: totalIndex > 75 ? 'DEFCON_2' : totalIndex > 50 ? 'DEFCON_3' : 'DEFCON_5'
    });
  } catch (e) {
    res.status(500).json({ error: 'SYSTEM_LINK_ERROR' });
  }
}
