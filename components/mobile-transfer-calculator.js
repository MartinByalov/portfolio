// Component: mobile-transfer-calculator
// Interactive transfer speed calculator, interface benchmark, and progress visualizer

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const id = comp.id || 'comp-transfer-calc-' + Math.random().toString(36).substr(2, 9);
  const title = comp.title || 'Лаборатория за пренос на данни: Калкулатор на скорости';
  const subtitle = comp.subtitle || 'Изберете обем на файла и комуникационен канал, за да изчислите реалното време за трансфер и да тествате симулатора.';

  const filePresets = [
    { label: 'Снимка с висока резолюция', sizeMB: 5, icon: 'fas fa-image', desc: '5 MB' },
    { label: '4K Видеоклип (10 минути)', sizeMB: 12000, icon: 'fas fa-video', desc: '12 GB (12 000 MB)' },
    { label: 'Учебна презентация с видео', sizeMB: 45, icon: 'fas fa-file-powerpoint', desc: '45 MB' },
    { label: 'Пълен бекъп на смартфона', sizeMB: 60000, icon: 'fas fa-box-archive', desc: '60 GB (60 000 MB)' }
  ];

  const channels = [
    { id: 'usb3', name: 'USB-C 3.2 Gen 1 (MTP кабел)', speedMBs: 400, speedLabel: '400 MB/s (3.2 Gbps)', icon: 'fas fa-bolt', color: '#10b981', note: 'Изисква флагмански телефон с USB 3.2 контролер и съвместим кабел.' },
    { id: 'usb2', name: 'USB-C 2.0 (MTP кабел)', speedMBs: 35, speedLabel: '35 MB/s (280 Mbps)', icon: 'fas fa-plug', color: '#0284c7', note: 'Масов стандарт при бюджетни и среден клас телефони въпреки модерния USB-C накрайник.' },
    { id: 'direct', name: 'Quick Share / AirDrop (Wi-Fi Direct)', speedMBs: 50, speedLabel: '50 MB/s (400 Mbps)', icon: 'fas fa-share-nodes', color: '#8b5cf6', note: 'Директна peer-to-peer Wi-Fi връзка между устройства в една стая без нужда от интернет.' },
    { id: 'wifi6', name: 'Домашен Wi-Fi 6 рутер (LAN)', speedMBs: 90, speedLabel: '90 MB/s (720 Mbps)', icon: 'fas fa-wifi', color: '#3b82f6', note: 'Локален пренос през високоскоростен домашен или училищен рутер.' },
    { id: 'c5g', name: '5G Облачен качване (Cloud)', speedMBs: 20, speedLabel: '20 MB/s (160 Mbps)', icon: 'fas fa-tower-cell', color: '#f59e0b', note: 'Качване в Google Drive / iCloud през бърза клетъчна 5G мрежа (изразходва мобилен трафик).' },
    { id: 'c4g', name: '4G LTE Cloud', speedMBs: 3, speedLabel: '3 MB/s (24 Mbps)', icon: 'fas fa-signal', color: '#ea580c', note: 'Стандартна скорост на мобилен ъплоуд при 4G покритие.' },
    { id: 'bt', name: 'Bluetooth 5.3', speedMBs: 0.2, speedLabel: '0.2 MB/s (1.6 Mbps)', icon: 'fab fa-bluetooth-b', color: '#64748b', note: 'Енергоспестяващ протокол, напълно неподходящ за видеоклипове и архиви.' }
  ];

  return `
    <div id="${esc(id)}" class="mobile-transfer-calc-wrapper" style="margin: 1.5rem 0; background: var(--surface-alt, #f8fafc); border: 1px solid var(--border-color, #e2e8f0); border-radius: 16px; padding: 1.5rem;">
      <div style="margin-bottom: 1.25rem;">
        <h3 style="margin: 0 0 0.4rem 0; font-size: 1.25rem; color: var(--text-color, #1e293b); font-weight: 700;">
          ${esc(title)}
        </h3>
        ${subtitle ? `<p style="margin: 0; font-size: 0.95rem; color: var(--text-muted, #64748b); line-height: 1.5;">${esc(subtitle)}</p>` : ''}
      </div>

      <!-- Step 1: Choose File Size (2x2 Grid) -->
      <div style="margin-bottom: 1.25rem;">
        <div style="font-size: 0.85rem; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 0.5rem;">
          1. Изберете обем на данните за прехвърляне:
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.65rem;">
          ${filePresets.map((p, idx) => `
            <button type="button" class="calc-file-btn ${idx === 1 ? 'active' : ''}" data-size="${p.sizeMB}" style="width: 100%; box-sizing: border-box; padding: 0.65rem 0.85rem; border-radius: 10px; border: 1.5px solid ${idx === 1 ? '#3b82f6' : '#cbd5e1'}; background: ${idx === 1 ? '#eff6ff' : '#ffffff'}; color: ${idx === 1 ? '#1d4ed8' : '#334155'}; font-size: 0.88rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; transition: all 0.2s ease;">
              <span style="display: flex; align-items: center; gap: 0.5rem; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                <i class="${p.icon}"></i>
                <span style="overflow: hidden; text-overflow: ellipsis;">${esc(p.label)}</span>
              </span>
              <span style="background: rgba(0,0,0,0.06); padding: 0.15rem 0.45rem; border-radius: 6px; font-size: 0.78rem; font-weight: 700; flex-shrink: 0;">${esc(p.desc)}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Step 2: Choose Channel -->
      <div style="margin-bottom: 1.5rem;">
        <div style="font-size: 0.85rem; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 0.5rem;">
          2. Изберете канал за трансфер:
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.5rem;">
          ${channels.map((c, idx) => `
            <div class="calc-channel-card ${idx === 0 ? 'selected' : ''}" data-channel="${c.id}" data-speed="${c.speedMBs}" style="border: 2px solid ${idx === 0 ? c.color : '#e2e8f0'}; background: #ffffff; border-radius: 10px; padding: 0.75rem; cursor: pointer; transition: all 0.2s ease; display: flex; flex-direction: column; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                <div style="width: 28px; height: 28px; border-radius: 6px; background: ${c.color}18; color: ${c.color}; display: flex; align-items: center; justify-content: center; font-size: 0.9rem;">
                  <i class="${c.icon}"></i>
                </div>
                <div style="font-size: 0.88rem; font-weight: 700; color: #1e293b;">${esc(c.name)}</div>
              </div>
              <div style="font-size: 0.82rem; color: #0284c7; font-weight: 600; margin-bottom: 0.2rem;">
                Реална скорост: ${esc(c.speedLabel)}
              </div>
              <div style="font-size: 0.75rem; color: #64748b; line-height: 1.35;">
                ${esc(c.note)}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Live Calculation Dashboard (Styled after Sandbox: SoC) -->
      <div class="os-cli-window" style="background: #0f172a; border-radius: 12px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.25); display: flex; flex-direction: column; margin-bottom: 1rem;">
        <div class="os-window-titlebar dark" style="display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1rem; background: #1e293b; color: #f1f5f9; border-bottom: 1px solid #334155;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="os-win-dots" style="display: flex; gap: 6px;">
              <span class="win-dot red" style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444; display: inline-block;"></span>
              <span class="win-dot yellow" style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b; display: inline-block;"></span>
              <span class="win-dot green" style="width: 10px; height: 10px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
            </div>
            <div class="os-win-title" style="font-size: 0.82rem; font-family: monospace; letter-spacing: 0.05em; color: #94a3b8; font-weight: 600;">
              СИМУЛАЦИЯ НА ТРАНСФЕР
            </div>
          </div>
          <div style="font-size: 0.72rem; font-family: monospace; color: #38bdf8; background: rgba(56, 189, 248, 0.12); padding: 0.2rem 0.5rem; border-radius: 4px; border: 1px solid rgba(56, 189, 248, 0.25);">
            BENCHMARK REAL-TIME
          </div>
        </div>

        <div style="padding: 0.9rem 1.25rem 0.55rem; display: flex; flex-direction: column; gap: 0.7rem;">
          <!-- Telemetry Summary Row -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; background: rgba(30, 41, 59, 0.6); padding: 0.9rem 1.15rem; border-radius: 10px; border: 1px solid #334155;">
            <div>
              <div style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; font-family: monospace; letter-spacing: 0.05em; font-weight: 600;">
                Параметри на трансфера:
              </div>
              <div id="calc-summary-text" style="font-size: 1.05rem; font-weight: 700; color: #f8fafc; margin-top: 0.25rem;">
                Прехвърляне на 12 GB през USB-C 3.2 Gen 1 (MTP кабел)
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; font-family: monospace; letter-spacing: 0.05em; font-weight: 600;">
                Необходимо време:
              </div>
              <div id="calc-time-result" style="font-size: 1.65rem; font-weight: 800; color: #38bdf8; font-family: monospace; text-shadow: 0 0 12px rgba(56,189,248,0.25);">
                30 секунди
              </div>
            </div>
          </div>

          <!-- Progress Simulation Container -->
          <div style="background: #0f172a; border-radius: 10px; padding: 0.9rem 1rem 0.55rem; border: 1px solid #334155;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; font-family: monospace; color: #cbd5e1; margin-bottom: 0.5rem;">
              <span></span>
              <span id="calc-sim-percent" style="font-weight: 700; color: #38bdf8; font-size: 0.95rem;">0%</span>
            </div>
            <div style="position: relative; background: #1e293b; height: 22px; border-radius: 11px; overflow: visible; border: 1px solid #475569;">
              <div id="calc-sim-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #0284c7, #38bdf8); transition: width 0.1s linear, background 0.25s ease; border-radius: 11px; box-shadow: 0 0 8px rgba(56,189,248,0.5);"></div>
              <span id="calc-sim-animal" aria-label="Животно, което показва скоростта на трансфера" style="position: absolute; left: 0%; top: 50%; transform: translate(-50%, -50%) scaleX(-1); font-size: 1.35rem; line-height: 1; transition: left 0.1s linear; pointer-events: none;">🐌</span>
            </div>
            <div style="margin-top: 0.55rem; display: flex; justify-content: flex-start;">
              <button type="button" id="calc-sim-start-btn" style="padding: 0.5rem 1.15rem; border-radius: 8px; border: 1px solid #0284c7; background: #0284c7; color: #ffffff; font-weight: 700; font-size: 0.85rem; font-family: monospace; cursor: pointer; display: flex; align-items: center; gap: 0.45rem; transition: all 0.2s ease;">
                <i class="fas fa-play"></i>
                <span>Тест</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Comparative Breakdown Matrix -->
      <div style="background: #ffffff; border: 1px solid var(--border-color, #e2e8f0); border-radius: 12px; padding: 1.25rem;">
        <div style="font-size: 0.95rem; font-weight: 700; color: #1e293b; margin-bottom: 0.75rem;">
          Колко време ще отнеме избраният файл през всички канали?
        </div>
        <div class="calc-matrix-table-wrap" style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
            <thead>
              <tr style="background: #f1f5f9; color: #475569; border-bottom: 2px solid #e2e8f0;">
                <th style="padding: 0.6rem 0.75rem;">Канал</th>
                <th style="padding: 0.6rem 0.75rem;">Реална скорост</th>
                <th style="padding: 0.6rem 0.75rem;">Време за избрания файл</th>
                <th style="padding: 0.6rem 0.75rem;">Оценка за този файл</th>
              </tr>
            </thead>
            <tbody id="calc-matrix-tbody">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id || 'comp-transfer-calc');
  if (!root) return;

  let currentSizeMB = 12000;
  let currentSpeedMBs = 400;
  let currentChannelName = 'USB-C 3.2 Gen 1 (MTP кабел)';
  let isSimulating = false;
  let simTimer = null;

  const channelsData = [
    { id: 'usb3', name: 'USB-C 3.2 Gen 1', speedMBs: 400 },
    { id: 'usb2', name: 'USB-C 2.0', speedMBs: 35 },
    { id: 'direct', name: 'Quick Share / AirDrop', speedMBs: 50 },
    { id: 'wifi6', name: 'Wi-Fi 6 LAN', speedMBs: 90 },
    { id: 'c5g', name: '5G Cloud Upload', speedMBs: 20 },
    { id: 'c4g', name: '4G LTE Cloud', speedMBs: 3 },
    { id: 'bt', name: 'Bluetooth 5.3', speedMBs: 0.2 }
  ];

  function formatTime(seconds) {
    if (seconds < 1) return 'под 1 секунда';
    if (seconds < 60) return `${Math.round(seconds)} секунди`;
    const mins = Math.floor(seconds / 60);
    const remSecs = Math.round(seconds % 60);
    if (mins < 60) {
      return remSecs > 0 ? `${mins} мин. ${remSecs} сек.` : `${mins} мин.`;
    }
    const hours = (seconds / 3600).toFixed(1);
    return `~${hours} часа (${mins} мин.)`;
  }

  function getRatingBadge(seconds) {
    if (seconds <= 40) return '<span style="color: #166534; background: #dcfce7; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 4px;">Светкавично</span>';
    if (seconds <= 300) return '<span style="color: #0369a1; background: #e0f2fe; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 4px;">Бързо (под 5 мин.)</span>';
    if (seconds <= 1800) return '<span style="color: #b45309; background: #fef3c7; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 4px;">Умерено (до 30 мин.)</span>';
    return '<span style="color: #991b1b; background: #fee2e2; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 4px;">Критично бавно!</span>';
  }

  function updateDashboard() {
    const timeSec = currentSizeMB / currentSpeedMBs;
    const summaryText = root.querySelector('#calc-summary-text');
    const timeResult = root.querySelector('#calc-time-result');
    const tbody = root.querySelector('#calc-matrix-tbody');

    const sizeFormatted = currentSizeMB >= 1000 ? `${(currentSizeMB / 1000).toFixed(currentSizeMB % 1000 === 0 ? 0 : 1)} GB` : `${currentSizeMB} MB`;

    if (summaryText) {
      summaryText.textContent = `Прехвърляне на ${sizeFormatted} през ${currentChannelName}`;
    }
    if (timeResult) {
      timeResult.textContent = formatTime(timeSec);
    }

    if (tbody) {
      tbody.innerHTML = channelsData.map(ch => {
        const s = currentSizeMB / ch.speedMBs;
        return `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 0.55rem 0.75rem; font-weight: 600; color: #1e293b;">${ch.name}</td>
            <td style="padding: 0.55rem 0.75rem; color: #64748b;">${ch.speedMBs} MB/s</td>
            <td style="padding: 0.55rem 0.75rem; font-weight: 700; color: #0284c7;">${formatTime(s)}</td>
            <td style="padding: 0.55rem 0.75rem;">${getRatingBadge(s)}</td>
          </tr>
        `;
      }).join('');
    }
  }

  // File button listeners
  const fileBtns = root.querySelectorAll('.calc-file-btn');
  fileBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      fileBtns.forEach(b => {
        b.style.background = '#ffffff';
        b.style.borderColor = '#cbd5e1';
        b.style.color = '#334155';
      });
      btn.style.background = '#eff6ff';
      btn.style.borderColor = '#3b82f6';
      btn.style.color = '#1d4ed8';

      currentSizeMB = parseFloat(btn.getAttribute('data-size'));
      updateDashboard();
    });
  });

  // Channel card listeners
  const channelCards = root.querySelectorAll('.calc-channel-card');
  channelCards.forEach(card => {
    card.addEventListener('click', () => {
      channelCards.forEach(c => {
        c.style.borderColor = '#e2e8f0';
      });
      card.style.borderColor = '#3b82f6';

      currentSpeedMBs = parseFloat(card.getAttribute('data-speed'));
      const headerTitle = card.querySelector('div[style*="font-weight: 700; color: #1e293b;"]');
      currentChannelName = headerTitle ? headerTitle.textContent : 'Избран канал';
      updateDashboard();
    });
  });

  // Simulation start button
  const startBtn = root.querySelector('#calc-sim-start-btn');
  const simBar = root.querySelector('#calc-sim-bar');
  const simPercent = root.querySelector('#calc-sim-percent');
  const simAnimal = root.querySelector('#calc-sim-animal');

  function getTransferAnimal(speed) {
    if (speed < 1) return '🐌';
    if (speed < 5) return '🐢';
    if (speed < 30) return '🚶';
    if (speed < 100) return '🐇';
    if (speed < 250) return '🦌';
    if (speed < 500) return '🐆';
    return '🦅';
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (isSimulating) return;
      isSimulating = true;
      startBtn.disabled = true;
      startBtn.style.opacity = '0.6';

      let progress = 0;
      simBar.style.width = '0%';
      simBar.style.background = 'linear-gradient(90deg, #0284c7, #38bdf8)';
      if (simAnimal) {
        simAnimal.textContent = getTransferAnimal(currentSpeedMBs);
        simAnimal.style.left = '0%';
      }
      simPercent.textContent = '0%';

      // Duration: relative scaled duration (between 1.5s and 5s for UX responsiveness)
      const realSeconds = currentSizeMB / currentSpeedMBs;
      const simDurationMs = Math.min(6000, Math.max(1200, Math.log10(realSeconds + 1) * 2000));
      const intervalMs = 50;
      const step = 100 / (simDurationMs / intervalMs);

      clearInterval(simTimer);
      simTimer = setInterval(() => {
        progress += step;
        if (progress >= 100) {
          progress = 100;
          clearInterval(simTimer);
          isSimulating = false;
          startBtn.disabled = false;
          startBtn.style.opacity = '1';
          simBar.style.background = '#16a34a';
          simBar.style.boxShadow = '0 0 8px rgba(34,197,94,0.55)';
        }
        simBar.style.width = `${progress}%`;
        if (simAnimal) simAnimal.style.left = `${progress}%`;
        simPercent.textContent = `${Math.round(progress)}%`;
      }, intervalMs);
    });
  }

  // Initial render
  updateDashboard();
}
