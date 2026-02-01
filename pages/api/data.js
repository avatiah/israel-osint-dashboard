export default async function handler(req, res) {
  try {
    // Список источников: общие новости + профессиональные OSINT сводки
    const sources = [
      'https://news.google.com/rss/search?q=Israel+OSINT+analysis+military+intelligence&hl=en-US',
      'https://news.google.com/rss/search?q=ISW+Israel+Hezbollah+Iran+update&hl=en-US'
    ];
    
    const response = await fetch(sources[Math.floor(Math.random() * sources.length)]);
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 20);
    const pubDates = [...xml.matchAll(/<pubDate>(.*?)<\/pubDate>/g)].map(m => m[1]).slice(1, 20);

    // 1. Фактор "Информационного взрыва"
    // Считаем количество новостей за последние 60 минут
    const now = new Date();
    const recentSignals = pubDates.filter(date => {
      const diff = (now - new Date(date)) / (1000 * 60); // разница в минутах
      return diff < 60;
    }).length;

    const burstFactor = Math.min(recentSignals * 5, 30); // До +30% к индексу за скорость

    // 2. Мониторинг Экспертных мнений
    let expertAlert = false;
    const signals = titles.map((t, i) => {
      const text = t.toLowerCase();
      
      // Ищем маркеры профессиональной аналитики
      const isExpert = /(analysis|forecast|expert|satellite+imagery|intelligence+report|isw)/.test(text);
      if (isExpert && /(imminent|escalation|threat|preparation)/.test(text)) expertAlert = true;

      let importance = 'LOW', color = '#555';
      if (/(strike|attack|missile|barrage)/.test(text)) { importance = 'HIGH'; color = '#ff0000'; }
      else if (isExpert) { importance = 'OSINT'; color = '#0088ff'; } // Выделяем аналитиков синим

      return { 
        title: t.split(' - ')[0], 
        link: '#', 
        importance, 
        color,
        isExpert,
        time: new Date(pubDates[i]).toLocaleTimeString('he-IL', {hour:'2-digit', minute:'2-digit'})
      };
    });

    // Расчет индекса
    const base = 10;
    const expertBonus = expertAlert ? 25 : 0;
    const finalIndex = Math.min(base + burstFactor + expertBonus + (signals.length * 2), 100);

    res.status(200).json({
      last_update: now.toISOString(),
      index: finalIndex,
      factors: {
        burst: burstFactor,
        expert: expertBonus,
        volume: signals.length
      },
      signals: signals.slice(0, 12)
    });
  } catch (e) {
    res.status(500).json({ error: "OSINT_LINK_FAILURE" });
  }
}
