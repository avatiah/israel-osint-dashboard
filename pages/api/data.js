export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');

  // База оперативных сводок для динамической ротации
  const newsPool = {
    US: [
      { ru: "Подтверждена переброска B-52H на базу Эль-Удейд.", en: "B-52H deployment to Al-Udeid confirmed." },
      { ru: "Зафиксирована активность заправщиков KC-135 над Иорданией.", en: "KC-135 tanker activity detected over Jordan." },
      { ru: "Пентагон: Уровень готовности сил в регионе повышен до DEFCON 3.", en: "Pentagon: Regional force readiness raised to DEFCON 3." },
      { ru: "Авианосная группа CVN-68 вошла в Аравийское море.", en: "Carrier Strike Group CVN-68 entered the Arabian Sea." },
      { ru: "Перехват SIGINT: Координация штабов в Катаре усилена.", en: "SIGINT Intercept: Qatar HQ coordination intensified." }
    ],
    IL: [
      { ru: "Системы 'Хец-3' переведены в режим повышенного разрешения.", en: "Arrow-3 systems shifted to high-resolution mode." },
      { ru: "ВВС завершили имитацию ударов на дальние дистанции.", en: "Air Force completed long-range strike simulations." },
      { ru: "Развертывание дополнительных батарей 'Железный купол' на севере.", en: "Additional Iron Dome batteries deployed in the north." },
      { ru: "Моссад сообщает о перемещении мобильных пусковых установок в Иране.", en: "Mossad reports movement of mobile launchers in Iran." },
      { ru: "Кибер-командование ЦАХАЛ зафиксировало попытки взлома сетей связи.", en: "IDF Cyber Command detected breach attempts on comm networks." }
    ],
    YE: [
      { ru: "ПРЕДУПРЕЖДЕНИЕ: Подозрительные маневры БПЛА в районе Баб-эль-Мандеб.", en: "WARNING: Suspicious UAV maneuvers near Bab-el-Mandeb." },
      { ru: "Изменение маршрутов танкеров в обход Красного моря.", en: "Tanker route changes bypassing the Red Sea." },
      { ru: "Зафиксирована активность РЛС на побережье Йемена.", en: "Coastal radar activity detected in Yemen." },
      { ru: "Запуск разведывательного дрона-камикадзе из района Ходейда.", en: "Kamikaze drone launch detected from Hodeidah area." },
      { ru: "Британская разведка: Хуситы получили новые противокорабельные ракеты.", en: "UK Intel: Houthis received new anti-ship missiles." }
    ]
  };

  const getRandom = (arr, n) => arr.sort(() => 0.5 - Math.random()).slice(0, n);

  // Динамические показатели с небольшой волатильностью
  const drift = () => (Math.random() * 2 - 1).toFixed(1);

  try {
    const data = {
      timestamp: new Date().toISOString(),
      apiHealth: 'optimal',
      netConnectivity: {
        score: (94.2 + parseFloat(drift())).toFixed(1),
        status: 'stable'
      },
      nodes: [
        {
          id: "US",
          title: { ru: "ВЕРОЯТНОСТЬ УДАРА США", en: "US STRIKE PROBABILITY" },
          value: (68.7 + parseFloat(drift())).toFixed(1),
          trend: Math.random() > 0.5 ? "up" : "stable",
          news: getRandom(newsPool.US, 3).map(n => ({ src: "INTEL", txt: n }))
        },
        {
          id: "IL",
          title: { ru: "ИНДЕКС БЕЗОПАСНОСТИ ИЗРАИЛЯ", en: "ISRAEL SECURITY INDEX" },
          value: (43.1 + parseFloat(drift())).toFixed(1),
          trend: Math.random() > 0.7 ? "up" : "stable",
          news: getRandom(newsPool.IL, 3).map(n => ({ src: "IDF", txt: n }))
        },
        {
          id: "YE",
          title: { ru: "УГРОЗА ЙЕМЕНА (ХУСИТЫ)", en: "YEMEN HOUTHI THREAT" },
          value: (39.8 + parseFloat(drift())).toFixed(1),
          trend: Math.random() > 0.4 ? "up" : "stable",
          news: getRandom(newsPool.YE, 3).map(n => ({ src: "MARITIME", txt: n }))
        }
      ],
      prediction: {
        date: "06.02.2026",
        impact: (74.5 + parseFloat(drift())).toFixed(1)
      }
    };
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ apiHealth: 'offline' });
  }
}
