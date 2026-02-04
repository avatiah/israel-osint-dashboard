export default async function handler(req, res) {
  // Устанавливаем жесткий лимит, чтобы Vercel не обрывал функцию сам
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const fetchOptions = { signal: controller.signal, headers: { 'User-Agent': 'Mozilla/5.0' } };

    const [iranRes, israelRes, yemenRes] = await Promise.allSettled([
      fetch(`https://api.gdeltproject.org/api/v2/doc/doc?query=(Iran%20OR%20US)%20(Strike%20OR%20Military)&mode=TimelineVolInfo&format=json`, fetchOptions),
      fetch(`https://api.redalert.me/alerts/history`, fetchOptions),
      fetch(`https://api.gdeltproject.org/api/v2/doc/doc?query=(Houthi%20OR%20Yemen)%20(Attack%20OR%20Missile)&mode=TimelineVolInfo&format=json`, fetchOptions)
    ]);

    // Базовые аналитические веса (Fallback), если API недоступны
    let iranVol = 14.2;
    let yemenVol = 9.1;
    let alertsCount = 0;

    if (iranRes.status === 'fulfilled' && iranRes.value.ok) {
      const data = await iranRes.value.json();
      iranVol = data.timeline?.[0]?.data?.slice(-1)[0]?.value || iranVol;
    }

    if (yemenRes.status === 'fulfilled' && yemenRes.value.ok) {
      const data = await yemenRes.value.json();
      yemenVol = data.timeline?.[0]?.data?.slice(-1)[0]?.value || yemenVol;
    }

    if (israelRes.status === 'fulfilled' && israelRes.value.ok) {
      const data = await israelRes.value.json();
      alertsCount = Array.isArray(data) ? data.length : 0;
    }

    // Финальный расчет индексов
    const strikeVal = Math.min(22 + (iranVol * 4.1), 100).toFixed(1);
    const israelVal = Math.min(42 + (alertsCount * 1.5), 100).toFixed(0);
    const yemenVal = Math.min(28 + (yemenVol * 4.8), 100).toFixed(0);

    res.status(200).json({
      timestamp: new Date().toISOString(),
      nodes: [
        { id: "IL", title: "SECURITY_INDEX_ISRAEL", value: israelVal, analysis: `Мониторинг ПВО: зафиксировано ${alertsCount} инцидентов.`, view: "Стабильная работа систем перехвата." },
        { id: "US", title: "US_IRAN_STRIKE_PROBABILITY", value: strikeVal, analysis: "Анализ подготовки ВВС США и риторики в СМИ.", view: "Высокая концентрация сил в регионе." },
        { id: "YE", title: "YEMEN_HOUTHI_THREAT", value: yemenVal, analysis: "Активность в секторе Баб-эль-Мандеб.", view: "Угроза пусков БПЛА сохраняется." }
      ],
      prediction: { 
        date: "06.02.2026", 
        impact: (parseFloat(strikeVal) + 40).toFixed(0), 
        status: iranVol > 12 ? "ESCALATION_LIKELY" : "NEGOTIATION_TRACK" 
      }
    });

  } catch (error) {
    // Если произошла критическая ошибка, отдаем безопасные данные
    res.status(200).json({
      timestamp: new Date().toISOString(),
      nodes: [
        { id: "IL", title: "SECURITY_INDEX_ISRAEL", value: "42", analysis: "Сенсоры: Ожидание данных.", view: "DATA_LOCKED" },
        { id: "US", title: "US_IRAN_STRIKE_PROBABILITY", value: "26.7", analysis: "OSINT: Ожидание пакетов.", view: "DATA_LOCKED" },
        { id: "YE", title: "YEMEN_HOUTHI_THREAT", value: "28", analysis: "Йемен: Ожидание подтверждения.", view: "DATA_LOCKED" }
      ],
      prediction: { date: "06.02.2026", impact: "67", status: "SYNC_ERROR_RECOVERY" }
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
