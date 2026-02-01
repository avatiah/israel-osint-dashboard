const fs = require('fs');

function calculateScore(count, avg) {
  const ratio = count / avg;
  if (ratio <= 1) return 25;
  if (ratio <= 1.5) return 50;
  if (ratio <= 2) return 75;
  return 100;
}

// 🔹 Пример входных данных (пока тест)
const todaySignals = {
  military: 18,
  rhetoric: 12,
  regional: 7,
  osint: 30
};

const avgSignals = {
  military: 10,
  rhetoric: 8,
  regional: 5,
  osint: 15
};

// 🔹 Расчёт блоков
const militaryScore = calculateScore(todaySignals.military, avgSignals.military);
const rhetoricScore = calculateScore(todaySignals.rhetoric, avgSignals.rhetoric);
const regionalScore = calculateScore(todaySignals.regional, avgSignals.regional);
const osintScore = calculateScore(todaySignals.osint, avgSignals.osint);

// 🔹 Итоговый индекс
const index =
  militaryScore * 0.35 +
  rhetoricScore * 0.25 +
  osintScore * 0.20 +
  regionalScore * 0.20;

// 🔹 Формирование JSON
const output = {
  last_update: new Date().toISOString(),
  index: Math.round(index),
  trend: 0,
  blocks: {
    military: militaryScore,
    rhetoric: rhetoricScore,
    osint_activity: osintScore,
    regional: regionalScore
  },
  signals: []
};

fs.writeFileSync('./data/data.json', JSON.stringify(output, null, 2));

console.log("Data updated");
