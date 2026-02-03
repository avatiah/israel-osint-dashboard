export default async function handler(req, res) {
  const ALPHA_KEY = 'SEUC23CF8DETWZS7';
  let responseData = {
    updated: new Date().toISOString(),
    markets: { brent: "N/A", ils: "3.75" },
    intel: []
  };

  try {
    // 1. Brent Oil Data
    const brentRes = await fetch(`https://www.alphavantage.co/query?function=BRENT&api_key=${ALPHA_KEY}`);
    const brentJson = await brentRes.json();
    if (brentJson?.data?.[0]) {
      responseData.markets.brent = brentJson.data[0].value;
    } else if (brentJson?.Note) {
      responseData.markets.brent = "LIMIT";
    }

    // 2. USD/ILS Data
    const fxRes = await fetch(`https://open.er-api.com/v6/latest/USD`);
    const fxData = await fxRes.json();
    responseData.markets.ils = fxData?.rates?.ILS?.toFixed(2) || "3.75";

    // 3. RSS Intelligence
    const rssRes = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://www.aljazeera.com/xml/rss/all.xml`);
    const rssData = await rssRes.json();
    if (rssData?.items) {
      responseData.intel = rssData.items.slice(0, 10).map(item => ({
        title: item.title,
        link: item.link,
        source: "GLOBAL_INTEL",
        time: new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
    }

    res.status(200).json(responseData);
  } catch (e) {
    // Fail-safe: возвращаем пустую структуру вместо ошибки 500
    res.status(200).json(responseData);
  }
}
