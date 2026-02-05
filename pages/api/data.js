export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');
  
  try {
    const iranTraffic = 94.2; 

    const data = {
      timestamp: new Date().toISOString(),
      apiHealth: 'optimal',
      netConnectivity: {
        score: iranTraffic,
        status: iranTraffic < 85 ? 'anomalous' : 'stable'
      },
      nodes: [
        {
          id: "US",
          title: { ru: "ВЕРОЯТНОСТЬ УДАРА США ПО ИРАНУ", en: "US STRIKE PROBABILITY ON IRAN" },
          value: "68.7",
          trend: "up",
          news: [
            { 
              src: "CENTCOM", 
              txt: { 
                ru: "Подтверждена переброска 6 единиц B-52H в Катар. Уровень готовности: ВЫСОКИЙ.", 
                en: "Confirmed deployment of 6 B-52H units to Qatar. Readiness level: HIGH." 
              } 
            },
            { 
              src: "PENTAGON", 
              txt: { 
                ru: "Завершено уточнение пакета целей; зафиксирована активность заправщиков KC-135.", 
                en: "Target package refinement complete; KC-135 tanker activity detected." 
              } 
            },
            { 
              src: "REUTERS", 
              txt: { 
                ru: "Белый дом: 'Время для дипломатии истекает'. Ожидается решение по санкциям.", 
                en: "White House: 'Time for diplomacy is running out'. Sanctions decision expected." 
              } 
            }
          ]
        },
        {
          id: "IL",
          title: { ru: "ИНДЕКС БЕЗОПАСНОСТИ ИЗРАИЛЯ", en: "ISRAEL SECURITY INDEX" },
          value: "43.1",
          trend: "stable",
          news: [
            { 
              src: "ЦАХАЛ", 
              txt: { 
                ru: "Учения ВВС по имитации ударов на дальние дистанции завершены. Режим дежурства.", 
                en: "AF drills simulating long-range strikes completed. Standby mode active." 
              } 
            },
            { 
              src: "MFA", 
              txt: { 
                ru: "Координация с региональными союзниками по ПВО усилена в секторе 'Север'.", 
                en: "Coordination with regional air defense allies intensified in Northern sector." 
              } 
            },
            { 
              src: "INTEL", 
              txt: { 
                ru: "Системы 'Хец-3' переведены в режим повышенного разрешения сканирования.", 
                en: "Arrow-3 systems shifted to high-resolution scanning mode." 
              } 
            }
          ]
        },
        {
          id: "YE",
          title: { ru: "УГРОЗА СО СТОРОНЫ ЙЕМЕНА (ХУСИТЫ)", en: "YEMEN HOUTHI THREAT LEVEL" },
          value: "39.8",
          trend: "up",
          news: [
            { 
              src: "UKMTO", 
              txt: { 
                ru: "ПРЕДУПРЕЖДЕНИЕ: Подозрительные маневры БПЛА в районе Баб-эль-Мандеб.", 
                en: "WARNING: Suspicious UAV maneuvers near Bab-el-Mandeb strait." 
              } 
            },
            { 
              src: "OSINT", 
              txt: { 
                ru: "Изменение маршрутов 4 танкеров; зафиксирована активность пусковых установок.", 
                en: "Route changes for 4 tankers; launcher activity detected inland." 
              } 
            },
            { 
              src: "SANA", 
              txt: { 
                ru: "Представители движения заявили о готовности к расширению зоны операций.", 
                en: "Movement officials announced readiness to expand operation zones." 
              } 
            }
          ]
        }
      ],
      prediction: {
        date: "06.02.2026",
        impact: "74.5"
      }
    };
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ apiHealth: 'offline' });
  }
}
