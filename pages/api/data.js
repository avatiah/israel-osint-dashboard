export default async function handler(req, res) {
  const ALPHA_KEY = 'SEUC23CF8DETWZS7';
  
  // Структура по умолчанию, чтобы фронтенд всегда имел объект для чтения
  let responseData = {
    updated: new Date().toISOString(),
    markets: { brent: "N/A", ils: "3.75" },
    intel: [],
    status: "SYNC_ERROR"
  };

  try {
    // 1. Попытка получить BRENT
    const brentRes = await fetch(`https://www.alphavantage.co/query?function=BRENT&api_key=${ALPHA_KEY}`);
    const brentJson = await brentRes.json();
    
    if (brentJson && brentJson.data && brentJson.data[0]) {
      responseData.markets.brent = brentJson.data[0].value;
      responseData.status = "OPERATIONAL";
    } else if (brentJson["Note"]) {
      responseData.markets.brent = "LIMIT_REACHED"; // Обработка лимита бесплатного ключа
    }

    // 2. Попытка получить USD/ILS
    const fxRes = await fetch(`https://open.er-api.com/v6/latest/USD`).catch(() => null);
    if (fxRes && fxRes.ok) {
      const fxData = await fxRes.json();
      responseData.markets.ils = fxData.rates?.ILS?.toFixed(2) || "3.75";
    }

    // 3. Попытка получить RSS (динамическая разведка)
    const rssRes = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://www.aljazeera.com/xml/rss/all.xml`).catch(() => null);
    if (rssRes && rssRes.ok) {
      const rssData = await rssRes.json();
      responseData.intel = rssData.items?.slice(0, 10).map(item => ({
        title: item.title,
        link: item.link,
        source: "GLOBAL_INTEL_NODE",
        timestamp: new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })) || [];
    }

    res.status(200).json(responseData);
  } catch (e) {
    // Даже в случае полной катастрофы возвращаем структуру, а не 500
    res.status(200).json(responseData);
  }
}
