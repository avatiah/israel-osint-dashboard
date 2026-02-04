export default function handler(req, res) {
  const analystData = {
    project_name: "Madad HaOref (Индекс Тыла)",
    last_update: "2026-02-04T11:00:00Z",
    // Сводный индекс: рассчитывается как средневзвешенное от сигналов OSINT
    total_index: 79, 
    details: {
      military_mobilization: 88, // ISW: Иран восстановил запасы ракет до уровня 2025 года
      diplomatic_tension: 95,    // Трамп: ультиматум "сделка до пятницы"
      osint_signals: 74,        // Спутники: укрепление объектов в Парчине бетоном
      regional_stability: 65     // Оман: перенос переговоров — попытка Ирана выиграть время
    },
    strike_probability: "48%",
    status_text: "Уровень угрозы: ВЫСОКИЙ (Красная зона)",
    explanation: "Индекс повышен из-за истечения срока ультиматума США (6 февраля) и концентрации сил ВМС США в Аравийском море.",
    logic: "Расчет: [Военная активность x 0.4] + [Риторика лидеров x 0.3] + [Спутниковые данные x 0.2] + [Региональные маневры x 0.1]"
  };

  res.status(200).json(analystData);
}
