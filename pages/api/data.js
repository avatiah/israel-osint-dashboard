export default async function handler(req, res) {
  try {
    const NEWS_KEY = process.env.NEWSAPI_KEY;
    const EIA_KEY = process.env.EIA_API_KEY;
    const FRED_KEY = process.env.FRED_API_KEY;

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");

    // ================= NEWS =================
    const newsUrl =
      `https://newsapi.org/v2/everything?q=(Israel OR Iran OR Hezbollah OR Gaza) AND (missile OR strike OR drone OR attack)&language=en&sortBy=publishedAt&pageSize=20&apiKey=${NEWS_KEY}`;

    const newsRes = await fetch(newsUrl);
    const newsData = await newsRes.json();

    let newsScore = 0;
    let headlines = [];

    if (newsData.articles) {
      const now = Date.now();

      newsData.articles.forEach(a => {
        const age = (now - new Date(a.publishedAt)) / 36e5;
        let w = 0;
        const t = (a.title + " " + a.description).toLowerCase();

        if (t.match(/missile|rocket|drone/)) w += 4;
        if (t.match(/strike|attack|explosion/)) w += 3;
        if (t.match(/war|retaliation|iran/)) w += 2;

        if (age < 6) w *= 1.4;
        else if (age < 24) w *= 1.1;

        newsScore += w;

        if (headlines.length < 6) headlines.push(a.title);
      });
    }

    newsScore = Math.min(newsScore, 100);

    // ================= BRENT =================
    const eiaUrl = `https://api.eia.gov/v2/petroleum/pri/spt/data/?api_key=${EIA_KEY}&frequency=daily&data[0]=value&facets[product][]=EPCBRENT&sort[0][column]=period&sort[0][direction]=desc&length=2`;
    const eiaRes = await fetch(eiaUrl);
    const eiaData = await eiaRes.json();

    let brent = 0;
    let brentScore = 0;

    if (eiaData.response?.data?.length >= 2) {
      const latest = parseFloat(eiaData.response.data[0].value);
      const prev = parseFloat(eiaData.response.data[1].value);
      brent = latest.toFixed(2);

      const change = ((latest - prev) / prev) * 100;
      brentScore = Math.min(Math.abs(change) * 8, 100);
    }

    // ================= USD/ILS =================
    const fredUrl = `https://api.stlouisfed.org/fred/series/observations?series_id=DEXISUS&api_key=${FRED_KEY}&file_type=json&sort_order=desc&limit=2`;
    const fredRes = await fetch(fredUrl);
    const fredData = await fredRes.json();

    let ils = 0;
    let fxScore = 0;

    if (fredData.observations?.length >= 2) {
      const latest = parseFloat(fredData.observations[0].value);
      const prev = parseFloat(fredData.observations[1].value);
      ils = latest.toFixed(2);

      const change = ((latest - prev) / prev) * 100;
      fxScore = Math.min(Math.abs(change) * 12, 100);
    }

    // ================= FINAL INDEX =================
    const index = Math.round(newsScore * 0.6 + brentScore * 0.25 + fxScore * 0.15);

    const status = index > 70 ? "HIGH" : index > 40 ? "ELEVATED" : "MODERATE";
    const color = index > 70 ? "#ff0000" : index > 40 ? "#ffff00" : "#00ff00";

    // ================= RESPONSE FOR YOUR UI =================
    res.status(200).json({
      updated: new Date().toISOString(),

      markets: {
        brent,
        ils,
        poly: Math.min(index, 100)
      },

      israel: {
        val: Math.max(index - 10, 5),
        range: "Internal Threat",
        status,
        color
      },

      us_iran: {
        val: index,
        range: "Regional Escalation",
        status: index > 70 ? "WAR_RISK" : "TENSION",
        color,
        triggers: {
          redlines: index > 65,
          embassy: index > 75,
          airspace: index > 60
        }
      },

      analytics: [
        { type: "OSINT", org: "News Signal Engine", text: "Conflict-related news intensity elevated" },
        { type: "MARKET", org: "Energy Monitor", text: "Oil volatility reacting to geopolitical signals" }
      ],

      feed: headlines.length ? headlines : ["No significant escalation signals detected"]
    });

  } catch (e) {
    res.status(500).json({ error: "API Failure", details: e.message });
  }
}
