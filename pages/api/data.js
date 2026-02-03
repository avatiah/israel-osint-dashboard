export default async function handler(req, res) {
  const ALPHA_KEY = 'SEUC23CF8DETWZS7';
  const dataOut = {
    updated: new Date().toISOString(),
    markets: { brent: "LOADING...", ils: "3.75" },
    intel: []
  };

  try {
    // 1. РЕАЛЬНАЯ НЕФТЬ (Alpha Vantage)
    const brentRes = await fetch(`https://www.alphavantage.co/query?function=BRENT&api_key=${ALPHA_KEY}`);
    const brentJson = await brentRes.json();
    if (brentJson.data?.[0]) dataOut.markets.brent = brentJson.data[0].value;

    // 2. РЕАЛЬНЫЙ ШЕКЕЛЬ (Open Exchange)
    const fxRes = await fetch(`https://open.er-api.com/v6/latest/USD`);
    const fxData = await fxRes.json();
    dataOut.markets.ils = fxData.rates?.ILS?.toFixed(2) || "3.75";

    // 3. ЖИВАЯ АНАЛИТИКА (OSINT RSS Feed)
    // Мы берем поток от международных агентств в реальном времени
    const rssRes = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://www.aljazeera.com/xml/rss/all.xml`);
    const rssData = await rssRes.json();
    
    dataOut.intel = rssData.items?.slice(0, 10).map(item => ({
      title: item.title,
      link: item.link,
      source: "GLOBAL_OSINT_NODE",
      timestamp: new Date(item.pubDate).toLocaleTimeString()
    })) || [];

  } catch (e) {
    console.error("SYNC_ERROR", e);
  }

  res.status(200).json(dataOut);
}
