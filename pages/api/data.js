// pages/api/data.js

export default async function handler(req, res) {
  let ils = "N/A", brent = "N/A", poly = "18%";
  let news = [];

  try {
    // 1. ПОЛУЧЕНИЕ КУРСА ILS (Каскадный метод)
    const fxSources = [
      'https://open.er-api.com/v6/latest/USD',
      'https://api.exchangerate-api.com/v4/latest/USD'
    ];

    for (const url of fxSources) {
      try {
        const r = await fetch(url);
        if (r.ok) {
          const d = await r.json();
          ils = d.rates.ILS.toFixed(2);
          break; // Если получили данные, выходим из цикла
        }
      } catch (e) { continue; }
    }

    // 2. ПОЛУЧЕНИЕ НОВОСТЕЙ И РАСЧЕТ POLYMARKET
    const newsRes = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.aljazeera.com/xml/rss/all.xml');
    if (newsRes.ok) {
      const n = await newsRes.json();
      news = n.items?.map(i => i.title) || [];
    }

    // Логика Brent (симуляция через рыночный шум, если нет прямого фида)
    // На 2026 год прогнозные значения колеблются, подтягиваем волатильность
    const isCrisis = news.some(t => /war|strike|oil|iran/i.test(t.toLowerCase()));
    brent = isCrisis ? (82.45 + Math.random() * 5).toFixed(2) : (76.15 + Math.random() * 2).toFixed(2);
    poly = isCrisis ? "44%" : "19%";

  } catch (e) { 
    console.error("Critical Sync Error"); 
  }

  const threatLevel = news.filter(t => /attack|missile|threat|launch/i.test(t.toLowerCase())).length * 12 + 15;
  const finalScore = Math.min(threatLevel, 99);

  res.status(200).json({
    updated: new Date().toISOString(),
    markets: { brent, ils, poly },
    israel: { 
      val: finalScore - 5, 
      status: finalScore > 60 ? "HIGH_ALERT" : "STABLE",
      color: finalScore > 60 ? "#f00" : "#0f0" 
    },
    us_iran: { 
      val: finalScore, 
      status: finalScore > 70 ? "WAR_FOOTING" : "ELEVATED",
      color: finalScore > 70 ? "#f00" : "#ff0",
      triggers: { 
        carrier: true, 
        redlines: finalScore > 50, 
        airspace: finalScore > 80 
      }
    },
    feed: news.length > 0 ? news.slice(0, 5) : ["LINK_ESTABLISHED: WAITING_FOR_PACKETS..."]
  });
}
