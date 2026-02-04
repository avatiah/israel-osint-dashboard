export default function handler(req, res) {
  const currentTime = new Date().toISOString();
  
  // Динамические данные на 04.02.2026
  const data = {
    project_name: "Madad HaOref",
    last_update: currentTime,
    global_status: "WAITING_FOR_OMAN_OUTCOME", // Ожидание итогов Омана
    
    // ГЛАВНЫЕ ИНДЕКСЫ
    indices: [
      {
        id: "israel_internal",
        label: "БЕЗОПАСНОСТЬ ИЗРАИЛЯ",
        value: 62,
        trend: "stable",
        description: "Уровень готовности тыла и риск прямых обстрелов.",
        details: "ЦАХАЛ сохраняет контроль над ключевыми буферными зонами. Внутренняя активность ПВО в норме.",
        sources: ["IDF Spokesperson", "Israel Radar", "Channel 12"]
      },
      {
        id: "us_iran_strike",
        label: "ВЕРОЯТНОСТЬ УДАРА США",
        value: 38,
        trend: "down",
        description: "Вероятность превентивного удара США по ядерным объектам Ирана.",
        details: "Снижение из-за начала консультаций в Маскате (Оман). АУГ 'Линкольн' на позиции сдерживания.",
        sources: ["Reuters", "CENTCOM", "US Naval Institute"]
      },
      {
        id: "yemen_houthi",
        label: "УГРОЗА ИЗ ЙЕМЕНА (ХУТИТЫ)",
        value: 48,
        trend: "up",
        description: "Активность пусковых установок в Красном море.",
        details: "OSINT фиксирует перемещение мобильных групп в районе Ходейды. Возможны новые пуски БПЛА.",
        sources: ["MarineTraffic", "Al-Mayadeen", "Bellingcat"]
      }
    ],

    // СЦЕНАРНЫЙ АНАЛИЗ (ПРОГНОЗ НА 06.02)
    scenario_analysis: {
      title: "ПРОГНОЗ: СРЫВ ПЕРЕГОВОРОВ В ОМАНЕ",
      trigger_event: "Если 6 февраля Тегеран отвергнет условия Трампа по ядерной сделке",
      impact: [
        { target: "Индекс удара США", change: "+45%", new_value: 83, action: "Переход к боевой готовности (Hot Phase)" },
        { target: "Индекс Израиля", change: "+25%", new_value: 87, action: "Масштабный призыв резерва, закрытие аэропортов" },
        { target: "Рынок (Шекель)", change: "-15%", action: "Резкая девальвация на фоне паники" }
      ]
    },

    // ДИНАМИЧЕСКИЕ СИГНАЛЫ (LIVE FEED)
    live_signals: [
      { time: "12:45", src: "SAT_INT", msg: "Аномальное тепловое излучение на базе Натанз. Вероятное усиление работ." },
      { time: "11:20", src: "X_OSINT", msg: "Зафиксирован взлет 4-х дозаправщиков ВВС США с базы Аль-Удейд." },
      { time: "09:05", src: "NEWS_IL", msg: "Минобороны Израиля расширило зону гражданских ограничений на севере." }
    ]
  };

  res.status(200).json(data);
}
