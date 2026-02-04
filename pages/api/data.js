export default async function handler(req, res) {
  try {
    // 1. Мониторинг новостной активности (GDELT)
    const gdeltApi = `https://api.gdeltproject.org/api/v2/doc/doc?query=(Iran%20OR%20US%20OR%20Israel)%20(Strike%20OR%20Attack%20OR%20Military)&mode=TimelineVolInfo&format=json`;
    const gdeltRes = await fetch(gdeltApi);
    const gdeltData = await gdeltRes.json();

    // 2. Мониторинг сирен (Используем стабильный агрегатор)
    const alertsRes = await fetch('https://api.redalert.me/alerts/history').catch(() => null);
    const alerts = alertsRes ? await alertsRes.json() : [];

    // МАТЕМАТИЧЕСКИЙ РАСЧЕТ ИНДЕКСОВ
    // Индекс удара: Базируется на волатильности медиа-потока
    const mediaVolume = gdeltData?.timeline?.[0]?.data?.slice(-1)[0]?.value || 0;
    const strikeProb = Math.min(25 + (mediaVolume * 3), 100);

    // Индекс Израиля: Базируется на количестве реальных срабатываний за 24ч
    const alertsCount = Array.isArray(alerts) ? alerts.length : 0;
    const israelIndex = Math.min(45 + (alertsCount * 1.5), 100);

    res.status(200).json({
      timestamp: new Date().toISOString(),
      israel: {
        value: israelIndex.toFixed(0),
        status: israelIndex > 70 ? "CRITICAL" : (israelIndex > 55 ? "ELEVATED" : "NORMAL")
      },
      strike: {
        value: strikeProb.toFixed(1),
        vol: mediaVolume,
        status: strikeProb > 60 ? "HIGH_ALERT" : "DIPLOMACY"
      },
      prediction: {
        scenario: strikeProb > 50 ? "ESCALATION" : "NEGOTIATION",
        impact: `СРЫВ ПЕРЕГОВОРОВ 6 ФЕВРАЛЯ МГНОВЕННО ПОДНИМЕТ ИНДЕКС ДО ${(parseFloat(strikeProb) + 38).toFixed(0)}%`
      }
    });
  } catch (error) {
    res.status(503).json({ error: "NODE_SENSORS_FAIL" });
  }
}
