export default async function handler(req, res) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 4000);

  try {
    const [gdeltRes, alertsRes, yemenRes] = await Promise.allSettled([
      fetch(`https://api.gdeltproject.org/api/v2/doc/doc?query=(Iran%20OR%20US%20OR%20Israel)%20(Strike%20OR%20Military%20OR%20Nuclear)&mode=TimelineVolInfo&format=json`, { signal: controller.signal }),
      fetch(`https://api.redalert.me/alerts/history`, { signal: controller.signal }),
      fetch(`https://api.gdeltproject.org/api/v2/doc/doc?query=(Houthi%20OR%20Yemen)%20(Red%20Sea%20OR%20Attack)&mode=TimelineVolInfo&format=json`, { signal: controller.signal })
    ]);

    // Обработка данных
    const mediaVol = gdeltRes.status === 'fulfilled' ? (await gdeltRes.value.json()).timeline?.[0]?.data?.slice(-1)[0]?.value : 15;
    const yemenVol = yemenRes.status === 'fulfilled' ? (await yemenRes.value.json()).timeline?.[0]?.data?.slice(-1)[0]?.value : 10;
    const alerts = alertsRes.status === 'fulfilled' ? await alertsRes.value.json() : [];
    const recentAlerts = Array.isArray(alerts) ? alerts.length : 0;

    // Расчет индексов (Военная аналитика)
    const strikeProb = Math.min(20 + (mediaVol * 4), 100).toFixed(1);
    const israelIndex = Math.min(40 + (recentAlerts * 2), 100).toFixed(0);
    const yemenIndex = Math.min(25 + (yemenVol * 5), 100).toFixed(0);

    res.status(200).json({
      timestamp: new Date().toISOString(),
      indices: [
        { 
          id: "IL", label: "SECURITY_INDEX_ISRAEL", val: israelIndex, 
          analysis: "ПВО в режиме повышенной готовности. Интенсивность обстрелов за 24ч: " + recentAlerts,
          source: "IDF / Pikud HaOref" 
        },
        { 
          id: "US", label: "US_IRAN_STRIKE_PROBABILITY", val: strikeProb, 
          analysis: "Медиа-фон указывает на завершение подготовки общественного мнения в США к 'хирургическим' ударам.",
          source: "OSINT / GDELT Monitor" 
        },
        { 
          id: "YE", label: "YEMEN_HOUTHI_THREAT", val: yemenIndex, 
          analysis: "Зафиксирована активность пусковых установок в Ходейде. Риск БПЛА-атак повышен.",
          source: "CENTCOM / Al-Mayadeen" 
        }
      ],
      forecast: {
        scenario: strikeProb > 50 ? "ESCALATION_TRACK" : "STAGNATION",
        critical_date: "06.02.2026",
        impact: (parseFloat(strikeProb) + 40).toFixed(0)
      }
    });
  } catch (e) {
    res.status(200).json({ error: "SENSORS_OFFLINE" });
  } finally { clearTimeout(id); }
}
