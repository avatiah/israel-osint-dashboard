export default async function handler(req, res) {
  let ils = "3.75"; // Резервное значение
  let news = [];

  try {
    // 1. ЖИВОЙ КУРС ВАЛЮТ (Open Exchange Rates API - свободный доступ)
    const fxRes = await fetch(`https://open.er-api.com/v6/latest/USD`);
    const fxData = await fxRes.json();
    if (fxData.rates?.ILS) ils = fxData.rates.ILS.toFixed(2);

    // 2. ЖИВЫЕ НОВОСТИ (OSINT через RSS верифицированных агентств, например Al Jazeera или Reuters)
    // Используем rss2json как бесплатный прокси для парсинга
    const newsRes = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://www.aljazeera.com/xml/rss/all.xml`);
    const newsData = await newsRes.json();
    news = newsData.items?.slice(0, 5).map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate
    })) || [];

  } catch (e) {
    console.error("External Sync Error:", e);
  }

  // Расчет динамического индекса на основе анализа ключевых слов в новостях (простейший OSINT-алгоритм)
  const keywords = ["strike", "iran", "missile", "war", "escalation", "attack"];
  let threatScore = 30; // Базовый уровень
  news.forEach(n => {
    keywords.forEach(k => {
      if (n.title.toLowerCase().includes(k)) threatScore += 12;
    });
  });

  res.status(200).json({
    updated: new Date().toISOString(),
    ils: ils,
    threatIndex: Math.min(threatScore, 99),
    news: news
  });
}
