export default async function handler(req, res) {
  // ——————————————————
  // Sources (free, no API keys)
  const FX_URL = "https://api.exchangerate.host/latest?base=USD&symbols=ILS";
  const RSS_FEEDS = [
    "https://www.reutersagency.com/feed/?best-topics=world&post_type=best",
    "https://www.aljazeera.com/xml/rss/all.xml",
    "https://feeds.bbci.co.uk/news/world/rss.xml"
  ];

  let ils = "N/A";
  let allNews = [];

  // ——————————————————
  // Fetch live data
  try {
    // 1) Forex USD->ILS
    const fxResp = await fetch(FX_URL);
    const fxData = await fxResp.json();
    if (fxData && fxData.rates && fxData.rates.ILS) {
      ils = fxData.rates.ILS.toFixed(3);
    }

    // 2) Fetch RSS news from all free sources
    const rssPromises = RSS_FEEDS.map(feed => {
      const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}`;
      return fetch(url).then(r => r.json()).catch(_ => null);
    });
    const rssResults = await Promise.all(rssPromises);

    rssResults.forEach(feedData => {
      if (feedData && Array.isArray(feedData.items)) {
        // map titles + links
        const items = feedData.items.map(i => ({
          title: i.title,
          link: i.link,
          pubDate: i.pubDate
        }));
        allNews.push(...items);
      }
    });

    // dedupe news by title
    allNews = Array.from(new Map(allNews.map(n => [n.title, n])).values());

  } catch (err) {
    console.error("Error loading external data:", err);
  }

  // ——————————————————
  // ANALYZE NEWS SIGNALS
  const keyWords = [
    "attack", "strike", "missile", "rocket", "war", "bomb", "killed",
    "clash", "tension", "iran", "israel", "conflict", "escalation"
  ];

  let alertCount = 0;
  let feedLines = [];

  allNews.forEach(item => {
    const text = item.title.toLowerCase();
    const match = keyWords.some(w => text.includes(w));
    if (match) alertCount++;
    feedLines.push(item.title);
  });

  // threat scoring — simple normalized model
  const newsTotal = allNews.length;
  const rawScore = newsTotal > 0 ? Math.min(100, Math.round((alertCount / newsTotal) * 100)) : 0;

  // interpret ranges
  const israelThreatVal = rawScore; // 0–100
  const usIranThreatVal = Math.min(100, rawScore + 10);

  // statuses
  const getStatus = (v) => {
    if (v > 70) return "HIGH";
    if (v > 40) return "ELEVATED";
    return "LOW";
  };

  // ——————————————————
  // Build JSON response
  res.status(200).json({
    updated: new Date().toISOString(),

    markets: {
      brent: "Real-Time Not Available", // placeholder — replace if you find free feed
      ils: ils,
      poly: "- (no public free API)"
    },

    israel: {
      val: israelThreatVal,
      range: `${Math.max(0, israelThreatVal - 10)}-${Math.min(100, israelThreatVal + 10)}%`,
      status: getStatus(israelThreatVal),
      color: israelThreatVal > 70 ? "#f00" : israelThreatVal > 40 ? "#ff0" : "#0f0"
    },

    us_iran: {
      val: usIranThreatVal,
      range: `${Math.max(0, usIranThreatVal - 10)}-${Math.min(100, usIranThreatVal + 10)}%`,
      status: getStatus(usIranThreatVal),
      color: usIranThreatVal > 70 ? "#f00" : usIranThreatVal > 40 ? "#ff0" : "#0f0",
      triggers: {
        airspace: allNews.some(n => /airspace/i.test(n.title)),
        embassy: allNews.some(n => /embassy|diplomatic evacuation/i.test(n.title)),
        redlines: allNews.some(n => /ultimatum|red line/i.test(n.title)),
        carrier: allNews.some(n => /carrier|navy|fleet/i.test(n.title))
      }
    },

    analytics: allNews.slice(0, 5).map(n => ({
      type: "NEWS",
      org: "RSS",
      text: n.title
    })),

    feed: feedLines.slice(0, 20)
  });
}
