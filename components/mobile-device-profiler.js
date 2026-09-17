// Component: mobile-device-profiler
// Interactive hardware profiling, specification matrix, and authentic scenario matcher

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const id = comp.id || 'comp-device-profiler-' + Math.random().toString(36).substr(2, 9);
  const title = comp.title || 'Хардуерен диагностичен стенд: Четири класа устройства';
  const subtitle = comp.subtitle || 'Сравнете техническите параметри на четири класа устройства и изберете оптималната конфигурация според целта и бюджета.';

  const devices = [
    {
      id: 'budget',
      name: 'Бюджетен модел',
      subtitle: 'Базов модел за училище и комуникация',
      badgeColor: '#10b981',
      icon: 'fas fa-mobile-screen',
      soc: 'MediaTek Helio G85 (12nm, 8 ядра, до 2.0 GHz)',
      ram: '4 GB LPDDR4X (базова за мултитаскинг)',
      storage: '64 GB eMMC 5.1 (~250 MB/s четене)',
      display: '6.5" IPS LCD, 90 Hz, 1600x720 (HD+)',
      camera: '50 MP основна + 2 MP сензор за дълбочина (1080p 30fps)',
      battery: '5000 mAh (18W жично зареждане)',
      connectivity: '4G LTE, Wi-Fi 5 (ac), Bluetooth 5.0, NFC, 3.5mm жак',
      port: 'USB-C (стандарт USB 2.0, до 40 MB/s)',
      priceIndex: '~130 – 180 €',
      idealFor: 'Текстови съобщения, телефонни разговори, социални мрежи, електронно банкиране и леки приложения за обучение.'
    },
    {
      id: 'creator',
      name: 'Мултимедиен флагман',
      subtitle: 'За професионална фотография и 4K/8K видео',
      badgeColor: '#8b5cf6',
      icon: 'fas fa-camera-retro',
      soc: 'Snapdragon 8 Gen 3 / Apple A17 Pro (3-4nm, мощен NPU/ISP)',
      ram: '12 GB LPDDR5X (свръхбърза памет)',
      storage: '512 GB UFS 4.0 / NVMe (~4200 MB/s четене)',
      display: '6.8" LTPO AMOLED 1-120 Hz, 3120x1440 (QHD+), 2600 нита',
      camera: '50 MP 1" сензор + 50 MP 5x Перископ + 50 MP Ultrawide (8K / 4K 120fps)',
      battery: '5000 mAh (45W жично + 15W безжично зареждане)',
      connectivity: '5G Dual-SIM, Wi-Fi 7, Bluetooth 5.4, Ultra-Wideband (UWB)',
      port: 'USB-C (стандарт USB 3.2 Gen 2, до 10 Gbps + DisplayPort)',
      priceIndex: '~900 – 1300 €',
      idealFor: 'Тежък мобилен видеомонтаж, 4K/8K заснемане, мобилен изкуствен интелект на устройството (on-device AI) и професионална фотография.'
    },
    {
      id: 'tablet',
      name: 'Образователен таблет',
      subtitle: 'За дигитални учебници, чертане и бележки',
      badgeColor: '#0ea5e9',
      icon: 'fas fa-tablet-screen-button',
      soc: '8-ядрен енергоспестяващ процесор (6nm, до 2.4 GHz)',
      ram: '6 GB LPDDR4X',
      storage: '128 GB UFS 2.2 (+ слот за microSD карта до 1 TB)',
      display: '11.0" IPS LCD, 90 Hz, 2000x1200 (2K), активен стилус',
      camera: '13 MP задна + 8 MP предна широкоъгълна (центриране при уроци)',
      battery: '7500 mAh (целодневна работа в училище)',
      connectivity: 'Wi-Fi 6, Bluetooth 5.2, 4 стерео говорителя с Dolby Atmos',
      port: 'USB-C (стандарт USB 2.0 с OTG поддръжка)',
      priceIndex: '~230 – 330 €',
      idealFor: 'Четене на електронни учебници и PDF материали, водене на ръкописни бележки с писалка, онлайн уроци и мултитаскинг с два прозореца.'
    },
    {
      id: 'gaming',
      name: 'Геймърски модел',
      subtitle: 'Максимална графична мощ и ниска латентност',
      badgeColor: '#ef4444',
      icon: 'fas fa-gamepad',
      soc: 'Овърклокнат 4nm SoC с медна изпарителна камера (Vapor Chamber)',
      ram: '16 GB LPDDR5X',
      storage: '512 GB UFS 4.0',
      display: '6.78" AMOLED, 165 Hz опресняване, 720 Hz тъч семплиране',
      camera: '50 MP + 13 MP (оптимизирана за стрийминг с предна камера)',
      battery: '6000 mAh (двуклетъчна батерия с 120W хиперзареждане)',
      connectivity: '5G с оптимизирана антенен масив, Wi-Fi 7, ултразвукови тригери за пръсти',
      port: 'Двоен USB-C (страничен порт за зареждане по време на игра)',
      priceIndex: '~700 – 970 €',
      idealFor: 'Тежки 3D мобилни игри с постоянни 90-120 кадъра в секунда (FPS), продължително натоварване без прегряване (термален throttling).'
    }
  ];

  const scenarios = [
    {
      id: 'scen-1',
      title: '1. Видеовлогър и училищен репортер',
      task: 'Ани подготвя училищни видеорепортажи. Изисква се запис на 4K видео при 60 кадъра/сек, бърз монтаж на телефона и светкавично прехвърляне на 20 GB файлове към лаптоп без интернет.',
      bestDeviceId: 'creator',
      explanation: 'Правилният избор е **Мултимедийният флагман**. Защо? Защото разполага с мощен ISP за 4K видео, бърза UFS 4.0 памет за гладък монтаж и най-важното - **USB 3.2 Gen 2 порт**, който прехвърля 20 GB за по-малко от 30 секунди! Бюджетният телефон има USB 2.0 порт и същият трансфер би отнел над 9 минути.'
    },
    {
      id: 'scen-2',
      title: '2. Математика, чертане и електронни учебници',
      task: 'Борис търси дигитално устройство за училище, на което да отваря едновременно PDF учебник и електронен тетрадков лист, да чертае геометрични фигури с писалка и батерията да издържа цял учебен ден.',
      bestDeviceId: 'tablet',
      explanation: 'Правилният избор е **Образователният таблет**. 11-инчовият екран дава достатъчно площ за разделен екран (Split-screen), писалката позволява прецизни математически чертежи, а голямата батерия от 7500 mAh осигурява надеждна автономност.'
    },
    {
      id: 'scen-3',
      title: '3. Ежедневна комуникация при разумен бюджет',
      task: 'Калоян иска надежден телефон за ежедневни разговори, WhatsApp, чат с приятели, навигация в града и социални мрежи, като бюджетът му е ограничен до 150 €.',
      bestDeviceId: 'budget',
      explanation: 'Правилният избор е **Бюджетният модел**. За тези задачи не е необходим скъп 4nm процесор или 8K камера. 4 GB RAM и 5000 mAh батерия с енергоспестяващ IPS екран осигуряват над 1.5 дни комфортна работа на достъпна цена.'
    }
  ];

  return `
    <div id="${esc(id)}" class="mobile-device-profiler-wrapper" style="margin: 1.5rem 0; background: var(--surface-alt, #f8fafc); border: 1px solid var(--border-color, #e2e8f0); border-radius: 16px; padding: 1.5rem;">
      <div style="margin-bottom: 1.25rem;">
        <h3 style="margin: 0 0 0.4rem 0; font-size: 1.25rem; color: var(--text-color, #1e293b); font-weight: 700;">
          ${esc(title)}
        </h3>
        ${subtitle ? `<p style="margin: 0; font-size: 0.95rem; color: var(--text-muted, #64748b); line-height: 1.5;">${esc(subtitle)}</p>` : ''}
      </div>

      <!-- Device Tabs Navigation (All 4 on one line) -->
      <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem; width: 100%;">
        ${devices.map((d, idx) => `
          <button type="button" class="device-tab-btn ${idx === 0 ? 'active' : ''}" data-device="${d.id}" style="flex: 1 1 0; min-width: 0; padding: 0.65rem 0.4rem; border-radius: 10px; border: 1px solid ${idx === 0 ? 'var(--accent-blue, #3b82f6)' : 'var(--border-color, #e2e8f0)'}; background: ${idx === 0 ? '#eff6ff' : '#ffffff'}; color: ${idx === 0 ? '#1d4ed8' : 'var(--text-color, #1e293b)'}; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: all 0.2s ease; white-space: nowrap; text-align: center;">
            <i class="${d.icon}" style="color: ${d.badgeColor}; flex-shrink: 0;"></i>
            <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${esc(d.name)}</span>
          </button>
        `).join('')}
      </div>

      <!-- Device Detailed Spec Cards -->
      <div class="device-spec-container" style="background: #ffffff; border: 1px solid var(--border-color, #e2e8f0); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
        ${devices.map((d, idx) => `
          <div class="device-spec-card" id="spec-${d.id}" style="display: ${idx === 0 ? 'block' : 'none'};">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #f1f5f9;">
              <div>
                <h4 style="margin: 0; font-size: 1.15rem; color: #0f172a; font-weight: 700;">${esc(d.name)}</h4>
                <div style="font-size: 0.85rem; color: #64748b; margin-top: 0.2rem;">${esc(d.subtitle)}</div>
              </div>
              <div style="background: #f8fafc; padding: 0.4rem 0.75rem; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.85rem; font-weight: 700; color: #334155;">
                Ориентировъчна цена: <span style="color: #0284c7;">${esc(d.priceIndex)}</span>
              </div>
            </div>

            <!-- Spec Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.75rem; font-size: 0.88rem;">
              <div style="background: #f8fafc; padding: 0.6rem 0.75rem; border-radius: 8px; border-left: 3px solid #3b82f6;">
                <div style="color: #64748b; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Процесор (SoC)</div>
                <div style="color: #1e293b; font-weight: 600; margin-top: 0.2rem;">${esc(d.soc)}</div>
              </div>
              <div style="background: #f8fafc; padding: 0.6rem 0.75rem; border-radius: 8px; border-left: 3px solid #8b5cf6;">
                <div style="color: #64748b; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Оперативна памет (RAM)</div>
                <div style="color: #1e293b; font-weight: 600; margin-top: 0.2rem;">${esc(d.ram)}</div>
              </div>
              <div style="background: #f8fafc; padding: 0.6rem 0.75rem; border-radius: 8px; border-left: 3px solid #06b6d4;">
                <div style="color: #64748b; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Вградена памет за файлове</div>
                <div style="color: #1e293b; font-weight: 600; margin-top: 0.2rem;">${esc(d.storage)}</div>
              </div>
              <div style="background: #f8fafc; padding: 0.6rem 0.75rem; border-radius: 8px; border-left: 3px solid #f59e0b;">
                <div style="color: #64748b; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Дисплей и опресняване</div>
                <div style="color: #1e293b; font-weight: 600; margin-top: 0.2rem;">${esc(d.display)}</div>
              </div>
              <div style="background: #f8fafc; padding: 0.6rem 0.75rem; border-radius: 8px; border-left: 3px solid #10b981;">
                <div style="color: #64748b; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Батерия и зареждане</div>
                <div style="color: #1e293b; font-weight: 600; margin-top: 0.2rem;">${esc(d.battery)}</div>
              </div>
              <div style="background: #f8fafc; padding: 0.6rem 0.75rem; border-radius: 8px; border-left: 3px solid #ef4444;">
                <div style="color: #64748b; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">USB-C порт и трансфер</div>
                <div style="color: #1e293b; font-weight: 600; margin-top: 0.2rem;">${esc(d.port)}</div>
              </div>
            </div>

            <div style="margin-top: 0.85rem; padding: 0.6rem 0.85rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; font-size: 0.88rem; color: #166534;">
              <strong>Оптимално приложение:</strong> ${esc(d.idealFor)}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Interactive Scenario Challenge -->
      <div style="background: #ffffff; border: 1px solid var(--border-color, #e2e8f0); border-radius: 12px; padding: 1.25rem;">
        <div style="font-size: 0.95rem; font-weight: 700; color: #1e293b; margin-bottom: 0.75rem;">
          Практически казуси за консултация: Кое устройство е най-подходящо?
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${scenarios.map((sc) => `
            <div class="scenario-box" data-scenario="${sc.id}" style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem; background: #fafafa;">
              <div style="font-weight: 700; font-size: 0.92rem; color: #334155; margin-bottom: 0.3rem;">
                ${esc(sc.title)}
              </div>
              <div style="font-size: 0.87rem; color: #475569; margin-bottom: 0.75rem; line-height: 1.45;">
                ${esc(sc.task)}
              </div>
              <div style="display: flex; gap: 0.4rem; width: 100%;">
                ${devices.map(d => `
                  <button type="button" class="scenario-choice-btn" data-scenario="${sc.id}" data-chosen="${d.id}" data-correct="${sc.bestDeviceId}" style="flex: 1 1 0; min-width: 0; padding: 0.45rem 0.35rem; font-size: 0.8rem; font-weight: 600; border-radius: 6px; border: 1px solid #cbd5e1; background: #ffffff; color: #334155; cursor: pointer; transition: all 0.15s ease; white-space: nowrap; text-align: center; overflow: hidden; text-overflow: ellipsis;">
                    ${esc(d.name)}
                  </button>
                `).join('')}
              </div>
              <div class="scenario-feedback" id="feedback-${sc.id}" style="display: none; margin-top: 0.75rem; padding: 0.65rem 0.85rem; border-radius: 8px; font-size: 0.85rem; line-height: 1.45;"></div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id || 'comp-device-profiler');
  if (!root) return;

  // Tab switching
  const tabBtns = root.querySelectorAll('.device-tab-btn');
  const specCards = root.querySelectorAll('.device-spec-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const devId = btn.getAttribute('data-device');
      tabBtns.forEach(b => {
        b.style.background = '#ffffff';
        b.style.borderColor = 'var(--border-color, #e2e8f0)';
        b.style.color = 'var(--text-color, #1e293b)';
      });
      btn.style.background = '#eff6ff';
      btn.style.borderColor = 'var(--accent-blue, #3b82f6)';
      btn.style.color = '#1d4ed8';

      specCards.forEach(card => {
        card.style.display = card.id === `spec-${devId}` ? 'block' : 'none';
      });
    });
  });

  // Scenario buttons
  const choiceBtns = root.querySelectorAll('.scenario-choice-btn');
  choiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const scenId = btn.getAttribute('data-scenario');
      const chosen = btn.getAttribute('data-chosen');
      const correct = btn.getAttribute('data-correct');
      const fbBox = root.querySelector(`#feedback-${scenId}`);

      // Reset sibling buttons in this scenario
      const siblingBtns = root.querySelectorAll(`.scenario-choice-btn[data-scenario="${scenId}"]`);
      siblingBtns.forEach(b => {
        b.style.background = '#ffffff';
        b.style.borderColor = '#cbd5e1';
        b.style.color = '#334155';
      });

      const isCorrect = chosen === correct;
      if (isCorrect) {
        btn.style.background = '#dcfce7';
        btn.style.borderColor = '#22c55e';
        btn.style.color = '#15803d';

        fbBox.style.display = 'block';
        fbBox.style.background = '#f0fdf4';
        fbBox.style.border = '1px solid #bbf7d0';
        fbBox.style.color = '#166534';
        
        let explanation = '';
        if (scenId === 'scen-1') {
          explanation = '<strong>Отличен избор!</strong> Мултимедийният флагман разполага с UFS 4.0 за бърз 4K монтаж и <strong>USB 3.2 Gen 2 порт (до 10 Gbps)</strong>, който прехвърля 20 GB за ~25 секунди. На бюджетен модел с USB 2.0 това би отнело 9 минути.';
        } else if (scenId === 'scen-2') {
          explanation = '<strong>Точно така!</strong> 11-инчовият екран дава нужната площ за разделяне на екрана между учебник и тетрадка, стилусът е перфектен за чертане, а батерията 7500 mAh издържа над 10 часа учене.';
        } else {
          explanation = '<strong>Правилен избор!</strong> За чат, WhatsApp и браузване няма нужда от скъп флагмански чип - бюджетният модел с 5000 mAh батерия изпълнява тези задачи перфектно на ниска цена.';
        }
        fbBox.innerHTML = explanation;
      } else {
        btn.style.background = '#fee2e2';
        btn.style.borderColor = '#ef4444';
        btn.style.color = '#b91c1c';

        fbBox.style.display = 'block';
        fbBox.style.background = '#fef2f2';
        fbBox.style.border = '1px solid #fecaca';
        fbBox.style.color = '#991b1b';
        fbBox.innerHTML = '<strong>Не съвсем.</strong> Проверете изискванията за скорост на пренос (USB стандарт), размер на екрана или бюджета и опитайте отново.';
      }
    });
  });
}
