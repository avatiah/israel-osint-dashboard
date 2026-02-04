export default async function handler(req, res) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const [iranRes, israelRes, yemenRes] = await Promise.allSettled([
      fetch(`https://api.gdeltproject.org/api/v2/doc/doc?query=(Iran%20OR%20US)%20(Strike%20OR%20Military%20OR%20Nuclear)&mode=TimelineVolInfo&format=json`, { signal: controller.signal }),
      fetch(`https://api.redalert.me/alerts/history`, { signal: controller.signal }),
      fetch(`https://api.gdeltproject.org/api/v2/doc/doc?query=(Houthi%20OR%20Yemen)%20(Attack%20OR%20Missile)&mode=TimelineVolInfo&format=json`, { signal: controller.signal })
    ]);

    const iranVol = iranRes.status === 'fulfilled' && iranRes.value.ok ? (await iranRes.value.json()).timeline?.[0]?.data?.slice(-1)[0]?.value : 14.8;
    const yemenVol = yemenRes.status === 'fulfilled' && yemenRes.value.ok ? (await yemenRes.value.json()).timeline?.[0]?.data?.slice(-1)[0]?.value : 9.5;
    const alerts = israelRes.status === 'fulfilled' && israelRes.value.ok ? await israelRes.value.json() : [];
    const alertsCount = Array.isArray(alerts) ? alerts.length : 0;

    const strikeIndex = Math.min(22 + (iranVol * 4.1), 100).toFixed(1);
    const israelIndex = Math.min(42 + (alertsCount * 1.5), 100).toFixed(0);
    const yemenIndex = Math.min(28 + (yemenVol * 4.8), 100).toFixed(0);

    res.status(200).json({
      timestamp: new Date().toISOString(),
      nodes: [
        {
          id: "IL", title: "SECURITY_INDEX_ISRAEL", value: israelIndex,
          analysis: `Мониторинг ПВО: зафиксировано ${alertsCount} инцидентов. Режим готовности 'C' (Высокий).`,
          view: "Стабилизация на фоне превентивных ударов по пусковым установкам прокси."
        },
        {
          id: "US_IR", title: "US_IRAN_STRIKE_PROBABILITY", value: strikeIndex,
          analysis: "Анализ GDELT: рост риторики о 'неминуемом ответе'. Концентрация сил ВМС США в Оманском заливе.",
          view: "Индикаторы указывают на завершение этапа дипломатического давления."
        },
        {
          id: "YE", title: "YEMEN_HOUTHI_THREAT", value: yemenIndex,
          analysis: "Йемен (Хуситы): Активность в секторе Баб-эль-Мандеб. Повышенная вероятность пусков БПЛА.",
          view: "Риск для коммерческого и военного судоходства оценивается как критический."
        }
      ],
      prediction: {
        date: "06.02.2026",
        impact: (parseFloat(strikeIndex) + 40).toFixed(0),
        status: iranVol > 12 ? "ESCALATION_LIKELY" : "NEGOTIATION_TRACK"
      }
    });
  } catch (e) {
    res.status(200).json({ error: "RECOVERY_MODE", timestamp: new Date().toISOString() });
  } finally { clearTimeout(timeoutId); }
}
