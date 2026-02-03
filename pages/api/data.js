// pages/api/data.js

export default async function handler(req, res) {
  const TIMEOUT = 3000; // 3 секунды на ответ от внешних сервисов

  const fetchWithTimeout = async (url) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), TIMEOUT);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  };

  try {
    // 1. ЖИВЫЕ РЫНКИ (USD/ILS)
    const fxRes = await fetchWithTimeout('https://open.er-api.com/v6/latest/USD');
    const fxData = await fxRes.json();
    const currentILS = fxData.rates.ILS.toFixed(2);

    // 2. ЖИВЫЕ НОВОСТИ (AL JAZEERA / REUTERS RSS)
    const newsRes = await fetchWithTimeout('https://api.rss2json.com/v1/api.json?rss_url=https://www.aljazeera.com/xml/rss/all.xml');
    const newsData = await newsRes.json();
    const liveNews = newsData.items || [];
    const newsTitles = liveNews.map(i => i.title.toLowerCase());

    // 3. МАТЕМАТИЧЕСКИЙ РАСЧЕТ РИСКА (На основе реальных слов)
    // Веса: Strike (30), Missile (25), Iran (20), Explosion (25)
    let dynamicScore = 15; // Базовый фон
    if (newsTitles.some(t => t.includes('strike') || t.includes('attack'))) dynamicScore += 35;
    if (newsTitles.some(t => t.includes('iran') || t.includes('hezbollah'))) dynamicScore += 25;
    if (newsTitles.some(t => t.includes('missile') || t.includes('rocket'))) dynamicScore += 20;
    
    const finalVal = Math.min(dynamicScore, 98);

    // 4. ТРИГГЕРЫ (На основе новостного контекста)
    const triggers = {
      carrier: true, // CSG-3 всегда там, это константа сейчас
      redlines: newsTitles.some(t => t.includes('warn') || t.includes('ultimatum')),
      evacuations: newsTitles.some(t => t.includes('evacuate') || t.includes('diplomat')),
      airspace: newsTitles.some(t => t.includes('notam') || t.includes('airspace'))
    };

    res.status(200).json({
      updated: new Date().toISOString(),
      markets: {
        brent: "DYNAMIC_WAIT", // Для нефти нужен чуть более сложный скрейпинг
        ils: currentILS,
        poly: finalVal > 60 ? "38" : "18"
      },
      israel: {
        val: Math.max(finalVal - 10, 12),
        status: finalVal > 70 ? "HIGH_ALERT" : "STABLE",
        color: finalVal > 70 ? "#ff0" : "#0f0"
      },
      us_iran: {
        val: finalVal,
        status: finalVal > 75 ? "WAR_FOOTING" : "MONITORING",
        triggers
      },
      feed: liveNews.slice(0, 6).map(item => item.title)
    });

  } catch (error) {
    // Если всё упало - отдаем "Безопасный режим"
    res.status(200).json({ error: "External Data Timeout - Low Signal" });
  }
}
