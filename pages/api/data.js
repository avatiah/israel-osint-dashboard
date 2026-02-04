export default async function handler(req, res) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 4000);

  try {
    // ЖИВЫЕ ИСТОЧНИКИ
    const [gdeltRes, alertsRes, yemenRes] = await Promise.allSettled([
      fetch(`https://api.gdeltproject.org/api/v2/doc/doc?query=(Iran%20OR%20US%20OR%20Israel)%20(Strike%20OR%20Attack)&mode=TimelineVolInfo&format=json`, { signal: controller.signal }),
      fetch(`https://api.redalert.me/alerts/history`, { signal: controller.signal }),
      fetch(`https://api.gdeltproject.org/api/v2/doc/doc?query=(Houthi%20OR%20Yemen)%20(Red%20Sea%20OR%20Missile)&mode=TimelineVolInfo&format=json`, { signal: controller.signal })
    ]);

    // Обработка GDELT (Медиа-фон США/Иран)
    const mediaVol = gdeltRes.status === 'fulfilled' ? (await gdeltRes.value.json()).timeline?.[0]?.data?.slice(-1)[0]?.value : 10;
    
    // Обработка Йемена
    const yemenVol = yemenRes.status === 'fulfilled' ? (await yemenRes.value.json()).timeline?.[0]?.data?.slice(-1)[0]?.value : 5;

    // Обработка сирен Израиля
    const alerts = alertsRes.status === 'fulfilled' ? await alertsRes.value.json() : [];
    const alertsCount = Array.isArray(alerts) ? alerts.length : 0;

    res.status(200).json({
      timestamp: new Date().toISOString(),
      indices: [
        {
          id: "IL",
          label: "SECURITY_INDEX_ISRAEL",
          value: Math.min(35 + (alertsCount * 1.5), 100).toFixed(0),
          status: alertsCount > 10 ? "ELEVATED" : "STABLE",
          desc: `На основе ${alertsCount} сигналов ПВО за 24ч.`,
          source_url: "https://www.oref.org.il/"
        },
        {
          id: "US_IR",
          label: "US_STRIKE_PROBABILITY",
          value: Math.min(15 + (mediaVol * 4), 100).toFixed(1),
          status: mediaVol > 15 ? "HIGH_NOISE" : "DIPLOMACY",
          desc: "Анализ частоты упоминаний подготовки удара в мировых СМИ.",
          source_url: "https://www.gdeltproject.org/"
        },
        {
          id: "YE",
          label: "YEMEN_HOUTHI_RISK",
          value: Math.min(20 + (yemenVol * 5), 100).toFixed(0),
          status: yemenVol > 10 ? "ACTIVE_THREAT" : "MONITORING",
          desc: "Активность в Красном море и пуски БПЛА.",
          source_url: "https://www.centcom.mil/"
        }
      ],
      prediction: {
        scenario: mediaVol > 12 ? "ESCALATION_RISK" : "NEGOTIATION_TRACK",
        impact_val: (15 + (mediaVol * 4) + 35).toFixed(0)
      }
    });
  } catch (e) {
    res.status(200).json({ error: "SENSORS_OFFLINE" });
  } finally { clearTimeout(id); }
}
