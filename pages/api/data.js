export default async function handler(req, res) {
  const ALPHA_KEY = 'SEUC23CF8DETWZS7';
  
  // Объект-заглушка с реальной структурой, чтобы избежать undefined
  let responseData = {
    updated: new Date().toISOString(),
    markets: { brent: "CONNECTING...", ils: "3.75" },
    intel: [],
    node_status: "INITIALIZING"
  };

  try {
    // 1. ПОЛУЧЕНИЕ НЕФТИ BRENT
    const brentRes = await fetch(`https://www.alphavantage.co/query?function=BRENT&api_key=${ALPHA_KEY}`);
    const brentJson = await brentRes.json();
    
    if (brentJson?.data?.[0]) {
      responseData.markets.brent = brentJson.data[0].value;
      responseData.node_status = "OPERATIONAL";
    } else if (brentJson?.Note || brentJson?.Information) {
      responseData.markets.brent = "LIMIT_REACHED"; // Обработка лимита API
    }

    // 2. ПОЛУЧЕНИЕ КУРСА USD/ILS
    const fxRes = await fetch(`https://open.er-api.com/v6/latest/USD`);
    const fxData = await fxRes.json();
    responseData.markets.ils = fxData?.rates?.ILS?.toFixed(2) || "3.75";

    // 3. ПОЛУЧЕНИЕ ЖИВОЙ РАЗВЕДКИ (RSS -> JSON)
    const rssRes = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://www.aljazeera.com/xml/rss/all.xml`);
    const rssData = await rssRes.json();
    
    if (rssData?.items) {
      responseData.intel = rssData.items.slice(0, 12).map(item => ({
        title: item.title,
        link: item.link,
        source: "GLOBAL_OSINT",
        time: new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
    }

    res.status(200).json(responseData);
  } catch (e) {
    // Возвращаем структуру даже при ошибке, чтобы фронтенд не падал
    res.status(200).json(responseData);
  }
}
