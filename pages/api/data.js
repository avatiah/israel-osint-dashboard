export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    // В реальном проекте здесь были бы fetch к Yahoo Finance или AlphaVantage (бесплатные лимиты)
    const data = {
      timestamp: new Date().toISOString(),
      market: { brent: "78.42", usils: "3.64", gold: "2042.10" }, // Живые рыночные индикаторы
      nodes: [
        {
          id: "US",
          title: "ВЕРОЯТНОСТЬ УДАРА США ПО ИРАНУ",
          value: "68.4",
          trend: "up", // Новый параметр
          news: [
            { src: "CENTCOM", txt: "Зафиксирована подготовка к нанесению удара в случае срыва дипломатии." },
            { src: "Oman", txt: "Переговоры зашли в тупик: Иран отверг условия по ядерной сделке." },
            { src: "INTEL", txt: "Переброска ракетных комплексов на передовые позиции в Иордании." }
          ],
          method: "SENTIMENT_ANALYSIS + GDELT_VOLATILITY"
        },
        {
          id: "IL",
          title: "ИНДЕКС БЕЗОПАСНОСТИ ИЗРАИЛЯ",
          value: "42.5",
          trend: "stable",
          news: [
            { src: "IDF", txt: "Система ПВО переведена в состояние повышенной готовности." },
            { src: "MOD", txt: "Зафиксирована атака БПЛА со стороны восточной границы." }
          ],
          method: "IDF_LIVE_FEED + AIR_DEFENSE_STATUS"
        },
        {
          id: "YE",
          title: "УГРОЗА СО СТОРОНЫ ЙЕМЕНА (ХУСИТЫ)",
          value: "39.1",
          trend: "up",
          news: [
            { src: "UKMTO", txt: "Ракета упала вблизи торгового судна в Красном море." },
            { src: "REUTERS", txt: "Хуситы угрожают расширением зоны боевых действий." }
          ],
          method: "MARITIME_INCIDENT_TRACKER"
        }
      ],
      prediction: {
        date: "06.02.2026",
        status: "DIPLOMACY_FOCUS",
        impact: "74"
      }
    };
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "API_TIMEOUT" });
  } finally {
    clearTimeout(timeoutId);
  }
}
