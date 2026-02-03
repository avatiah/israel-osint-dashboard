export default async function handler(req, res) {
  try {
    // 🔐 КЛЮЧИ (лучше хранить в Vercel Environment Variables)
    const NEWS_KEY = process.env.NEWSAPI_KEY || "0b059cc30ec4412eba37ef8fd9917df1";
    const EIA_KEY = process.env.EIA_API_KEY || "spVh99Esetqetg3X1mPv1M6nUCciQ5SUm1w5FEB4";
    const FRED_KEY = process.env.FRED_API_KEY || "aa2d6782fd84e0776bc14511020b0917";

    // ⏱ КЭШ НА 10 МИНУТ
    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate");

    // ==============================
    // 📰 1. NEWSAPI — СИГНАЛЫ КОНФЛИКТА
    // ==============================
    const newsUrl =
      `https://newsapi.org/v2/everything?q=(Israel OR Iran OR Hezbollah OR Gaza OR Syria) AND (strike OR attack OR missile OR drone OR explosion)&language=en&sortBy=publishedAt&pageSize=30&apiKey=${NEWS_KEY}`;

    const newsRes = await fetch(newsUrl);
    const newsData = await newsRes.json();

    let newsScore = 0;
    let recentArticles = [];

    if (newsData.articles) {
      const now = Date.now();

      newsData.articles.forEach(article => {
        const ageHours = (now - new Date(article.publishedAt)) / 36e5;

        let weight = 0;
        const text = (article.title + " " + article.description).toLowerCase();

        if (text.match(/missile|rocket|drone/)) weight += 4;
        if (text.match(/strike|airstrike|attack/)) weight += 3;
        if (text.match(/explosion|sirens|intercepted/)) weight += 2;
        if (text.match(/war|invasion|retaliation/)) weight += 2;

        // свежие новости важнее
        if (ageHours < 3) weight *= 1.5;
        else if (ageHours < 12) weight *= 1.2;

        newsScore += weight;

        if (recentArticles.length < 5) {
          recentArticles.push({
            title: article.title,
            source: article.source.name,
            time: article.publishedAt
          });
        }
      });
    }

    newsScore = Math.min(newsScore, 100);

    // ==============================
    // 🛢 2. EIA — ЦЕНА НЕФТИ (BRENT)
    // ==============================
    const eiaUrl = `https://api.eia.gov/v2/petroleum/pri/spt/data/?api_key=${EIA_KEY}&frequency=daily&data[0]=value&facets[product][]=EPCBRENT&sort[0][column]=period&sort[0][direction]=desc&length=2`;

    const eiaRes = await fetch(eiaUrl);
    const eiaData = await eiaRes.json();

    let brentPrice = null;
    let brentChangeScore = 0;

    if (eiaData.response?.data?.length >= 2) {
      const latest = parseFloat(eiaData.response.data[0].value);
      const prev = parseFloat(eiaData.response.data[1].value);

      brentPrice = latest;
      const changePct = ((latest - prev) / prev) * 100;

      // рост нефти = рост напряжённости
      brentChangeScore = Math.min(Math.abs(changePct) * 10, 100);
    }

    // ==============================
    // 💱 3. FRED — USD/ILS
    // ==============================
    const fredUrl = `https://api.stlouisfed.org/fred/series/observations?series_id=DEXISUS&api_key=${FRED_KEY}&file_type=json&sort_order=desc&limit=2`;

    const fredRes = await fetch(fredUrl);
    const fredData = await fredRes.json();

    let usdIls = null;
    let fxScore = 0;

    if (fredData.observations?.length >= 2) {
      const latest = parseFloat(fredData.observations[0].value);
      const prev = parseFloat(fredData.observations[1].value);

      usdIls = latest;
      const changePct = ((latest - prev) / prev) * 100;

      // ослабление шекеля = рост риска
      fxScore = Math.min(Math.abs(changePct) * 15, 100);
    }

    // ==============================
    // 🧠 4. ИТОГОВЫЙ ИНДЕКС
    // ==============================
    const finalIndex = Math.round(
      newsScore * 0.6 +
      brentChangeScore * 0.25 +
      fxScore * 0.15
    );

    let level = "Low";
    if (finalIndex > 70) level = "High";
    else if (finalIndex > 40) level = "Elevated";

    // ==============================
    // 📦 ОТВЕТ ДЛЯ ДАШБОРДА
    // ==============================
    res.status(200).json({
      timestamp: new Date().toISOString(),
      index: finalIndex,
      level,
      components: {
        newsScore,
        brentChangeScore,
        fxScore
      },
      brentPrice,
      usdIls,
      headlines: recentArticles
    });

  } catch (error) {
    res.status(500).json({ error: "Data fetch failed", details: error.message });
  }
}
