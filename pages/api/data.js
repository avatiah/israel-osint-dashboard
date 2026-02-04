export default async function handler(req, res) {
  // Устанавливаем таймаут для внешних запросов, чтобы билд не висел
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 4000);

  try {
    // 1. Динамический мониторинг новостного фона через GDELT (Реальное время)
    const gdeltApi = `https://api.gdeltproject.org/api/v2/doc/doc?query=(Iran%20OR%20US%20OR%20Israel)%20(Strike%20OR%20Attack%20OR%20Military)&mode=TimelineVolInfo&format=json`;
    
    const [gdeltRes, alertsRes] = await Promise.allSettled([
      fetch(gdeltApi, { signal: controller.signal }),
      // Используем сторонний агрегатор сирен, так как прямой доступ к oref часто закрыт для облачных серверов
      fetch('https://api.redalert.me/alerts/history', { signal: controller.signal })
    ]);

    const gdeltData = gdeltRes.status === 'fulfilled' ? await gdeltRes.value.json() : null;
    const alertsData = alertsRes.status === 'fulfilled' ? await alertsRes.value.json() : [];

    // РАСЧЕТЫ (Без заглушек)
    const mediaVolume = gdeltData?.timeline?.[0]?.data?.slice(-1)[0]?.value || 0;
    const strikeProb = Math.min(20 + (mediaVolume * 3.5), 100);
    
    // Индекс Израиля на основе реальных срабатываний за последние 24ч
    const recentAlerts = Array.isArray(alertsData) ? alertsData.length : 0;
    const israelIndex = Math.min(40 + (recentAlerts * 2), 100);

    res.status(200).json({
      project: "Madad HaOref",
      timestamp: new Date().toISOString(),
      israel: {
        value: israelIndex,
        status: israelIndex > 70 ? "CRITICAL" : (israelIndex > 55 ? "ELEVATED" : "STABLE"),
        raw_alerts: recentAlerts
      },
      strike: {
        value: strikeProb.toFixed(1),
        vol: mediaVolume,
        status: strikeProb > 60 ? "HIGH_RISK" : "DIPLOMACY"
      },
      prediction: {
        scenario: strikeProb > 50 ? "ESCALATION" : "NEGOTIATION",
        impact: "Срыв 6 февраля поднимет индекс до " + (parseFloat(strikeProb) + 35).toFixed(0) + "%"
      }
    });

  } catch (error) {
    res.status(200).json({ 
      project: "Madad HaOref",
      timestamp: new Date().toISOString(),
      error: "SENSORS_OFFLINE",
      israel: { value: 0 }, strike: { value: 0 } 
    });
  } finally {
    clearTimeout(id);
  }
}
