export default async function handler(req, res) {
  try {
    const RSS_URL = 'https://news.google.com/rss/search?q=Israel+military+strategic+analysis+forecast&hl=en-US';
    const response = await fetch(RSS_URL);
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 20);

    // ОПРЕДЕЛЯЕМ ФАКТОРЫ
    let counts = { kinetic: 0, strategic: 0, cyber: 0 };
    
    titles.forEach(t => {
      const text = t.toLowerCase();
      if (/(missile|strike|attack|clash|border)/.test(text)) counts.kinetic++;
      if (/(analysis|forecast|strategic|intelligence|report)/.test(text)) counts.strategic++;
      if (/(cyber|market|economy|bank)/.test(text)) counts.cyber++;
    });

    // ВЛИЯНИЕ КАЖДОГО ФАКТОРА (профессиональная калибровка)
    // Веса: Кинетика (40%), Стратегия (40%), Вторичные факторы (20%)
    const f1 = Math.min(counts.kinetic * 7, 40);   // Прямые военные действия
    const f2 = Math.min(counts.strategic * 10, 40); // Аналитические прогнозы
    const f3 = Math.min(counts.cyber * 5, 20);     // Экономика и киберпространство

    const totalIndex = 10 + f1 + f2 + f3; // 10% — базовый фон региона

    res.status(200).json({
      index: Math.min(totalIndex, 100),
      breakdown: [
        { name: 'KINETIC_ACTIVITY', value: f1, desc: 'Прямые столкновения и обстрелы' },
        { name: 'STRATEGIC_FORECAST', value: f2, desc: 'Прогнозы экспертов и разведки' },
        { name: 'SYSTEMIC_STRESS', value: f3, desc: 'Давление на рынки и кибер-среду' }
      ],
      last_update: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: "CALIBRATION_FAILED" });
  }
}
