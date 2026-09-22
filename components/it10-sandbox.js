// Interactive IT-10 Sandbox: Networks, Security, and Excel Simulation

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const compId = comp.id || 'it10-sandbox';
  const mode = comp.mode || 'all'; // 'all', 'networks', 'security', 'excel'
  const title = comp.title || (
    mode === 'networks' || mode === 'security' ? '' :
    mode === 'excel' ? 'Интерактивна лаборатория: Анализ на данни в Excel' :
    'Интерактивна лаборатория за начален преговор'
  );

  const showHeaderTabs = mode === 'all';
  const showHeader = showHeaderTabs || Boolean(title);
  const showNetworks = mode === 'all' || mode === 'networks';
  const showSecurity = mode === 'all' || mode === 'security';
  const showExcel = mode === 'all' || mode === 'excel';

  return `
    <section class="component it10-sandbox-container" style="margin: 28px 0;">
      <div class="live-sandbox-block" id="${esc(compId)}" data-mode="${esc(mode)}" style="background: #0f172a; border-radius: 12px; border: 1px solid #1e293b; color: #f8fafc; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
        ${showHeader ? `
        <div class="sandbox-header" style="display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; background: #1e293b; border-bottom: 1px solid #334155; flex-wrap: wrap; gap: 10px;">
          <div class="sandbox-title" style="font-size: 15px; font-weight: 700; color: #f8fafc; letter-spacing: -0.2px;">
            <span>${esc(title)}</span>
          </div>
          ${showHeaderTabs ? `
          <div class="sandbox-tabs" style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button type="button" class="sandbox-tab-btn active" data-tab="tab-networks" style="padding: 6px 12px; border-radius: 6px; border: 1px solid #475569; background: #334155; color: #fff; font-size: 12.5px; font-weight: 600; cursor: pointer;">
              1. Топологии & Кабели
            </button>
            <button type="button" class="sandbox-tab-btn" data-tab="tab-security" style="padding: 6px 12px; border-radius: 6px; border: 1px solid transparent; background: transparent; color: #94a3b8; font-size: 12.5px; font-weight: 600; cursor: pointer;">
              2. IP, DNS & Защитна стена
            </button>
            <button type="button" class="sandbox-tab-btn" data-tab="tab-excel" style="padding: 6px 12px; border-radius: 6px; border: 1px solid transparent; background: transparent; color: #94a3b8; font-size: 12.5px; font-weight: 600; cursor: pointer;">
              3. Excel COUNTIF & Валидиране
            </button>
          </div>
          ` : ''}
        </div>
        ` : ''}

        <!-- TAB 1: NETWORKS & TOPOLOGY -->
        ${showNetworks ? `
        <div class="sandbox-tab-content ${mode === 'networks' || mode === 'all' ? 'active' : ''}" id="${esc(compId)}-tab-networks" style="${mode === 'networks' || mode === 'all' ? 'display: block; padding: 18px;' : 'display:none; padding: 18px;'}">
          <div style="display: grid; grid-template-columns: 280px 1fr; gap: 20px;" class="sandbox-grid-responsive">
            <div style="background: #1e293b; border-radius: 10px; padding: 16px; border: 1px solid #334155;">
              <h4 style="margin: 0 0 12px 0; font-size: 13.5px; color: #38bdf8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Конфигурация на мрежа</h4>
              
              <label style="display: block; font-size: 13px; font-weight: 600; color: #cbd5e1; margin-bottom: 6px;">Мрежова топология:</label>
              <select class="net-topology-select" style="width: 100%; background: #0f172a; border: 1.5px solid #475569; color: #f8fafc; padding: 8px 10px; border-radius: 6px; font-size: 13px; margin-bottom: 14px; font-weight: 500;">
                <option value="star">Звезда (Star - с централен комутатор/Switch)</option>
                <option value="ring">Кръг (Ring - пръстенна последователност)</option>
                <option value="bus">Шина (Bus - общ преносен канал с терминатори)</option>
                <option value="tree">Дървовидна (Tree - йерархична)</option>
              </select>

              <label style="display: block; font-size: 13px; font-weight: 600; color: #cbd5e1; margin-bottom: 6px;">Преносна среда (Кабел):</label>
              <select class="net-cable-select" style="width: 100%; background: #0f172a; border: 1.5px solid #475569; color: #f8fafc; padding: 8px 10px; border-radius: 6px; font-size: 13px; margin-bottom: 16px; font-weight: 500;">
                <option value="twisted">Усукана двойка (UTP/STP Cat 6e - 1 Gb/s, до 100 m)</option>
                <option value="fiber">Оптичен кабел (Single-Mode Fiber - 10+ Gb/s, до 40 km)</option>
                <option value="coax">Коаксиален кабел (RG-58 - 10 Mb/s, исторически)</option>
              </select>

              <div style="margin-bottom: 16px; padding: 12px; background: #0f172a; border-radius: 8px; border: 1px solid #334155; font-size: 12.5px;" class="net-metrics-panel">
                <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                  <span style="color:#94a3b8;">Макс. скорост:</span>
                  <strong style="color:#4ade80; font-weight: 700;" class="net-speed-val">1 Gb/s (1000 Mb/s)</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                  <span style="color:#94a3b8;">Макс. сегмент:</span>
                  <strong style="color:#60a5fa; font-weight: 700;" class="net-dist-val">100 метра</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                  <span style="color:#94a3b8;">Устойчивост на шум:</span>
                  <strong style="color:#f59e0b; font-weight: 700;" class="net-noise-val">Средна</strong>
                </div>
              </div>

              <button type="button" class="net-simulate-fail-btn" style="width: 100%; background: #ea580c; border: 1.5px solid #c2410c; color: #ffffff; padding: 10px 14px; border-radius: 6px; font-size: 13px; cursor: pointer; font-weight: 700; display:flex; align-items:center; justify-content:center; transition: all 0.2s; box-shadow: 0 2px 8px rgba(234, 88, 12, 0.3);">
                Симулирай прекъснат кабел
              </button>
            </div>

            <div style="background: #1e293b; border-radius: 10px; padding: 16px; border: 1px solid #334155; display:flex; flex-direction:column;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
                <span style="font-size: 13.5px; font-weight: 700; color: #f8fafc;">Схема на предаване на пакети</span>
                <span class="net-status-badge" style="font-size: 11.5px; padding: 4px 10px; border-radius: 12px; background: #16a34a; color: #ffffff; font-weight: 700; margin-left: auto;">Мрежата е активна (100%)</span>
              </div>
              <!-- LIGHT BACKGROUND CANVAS FOR CONNECTIONS AND DEVICES -->
              <div class="net-canvas-container" style="flex:1; min-height: 250px; background: #f8fafc; border-radius: 8px; border: 1.5px solid #cbd5e1; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; box-shadow: inset 0 1px 3px rgba(0,0,0,0.04);">
                <svg class="net-topology-svg" width="100%" height="250" viewBox="0 0 500 250"></svg>
              </div>
              <p class="net-explanation-text" style="font-size: 12.5px; color: #cbd5e1; margin: 12px 0 0 0; line-height: 1.55;">
                В топология <strong>Звезда</strong> всички компютри са свързани към централен комутатор (Switch). Ако единичен кабел към клиент прекъсне, останалите компютри продължават да комуникират без прекъсване.
              </p>
            </div>
          </div>
        </div>
        ` : ''}

        <!-- TAB 2: SECURITY, DNS & IP -->
        ${showSecurity ? `
        <div class="sandbox-tab-content ${mode === 'security' ? 'active' : ''}" id="${esc(compId)}-tab-security" style="${mode === 'security' ? 'display: block; padding: 18px;' : (mode === 'all' ? 'display:none; padding: 18px;' : 'display: block; padding: 18px;')}">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;" class="sandbox-grid-responsive">
            
            <!-- DNS & IP Lookup -->
            <div style="background: #1e293b; border-radius: 10px; padding: 16px; border: 1px solid #334155;">
              <h4 style="margin: 0 0 12px 0; font-size: 13.5px; color: #38bdf8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                DNS преобразуване
              </h4>
              <p style="font-size: 13px; color: #cbd5e1; margin-bottom: 12px; line-height: 1.5;">
                DNS превежда лесно запомнящите се домейн имена в машинно-четими IP адреси (IPv4 / IPv6).
              </p>
              <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                <input type="text" class="dns-input" value="google.com" style="flex:1; background: #0f172a; border: 1.5px solid #475569; color: #38bdf8; padding: 8px 12px; border-radius: 6px; font-family: monospace; font-size: 13px; font-weight: 600;">
                <button type="button" class="dns-resolve-btn" style="background: #2563eb; border: 1px solid #1d4ed8; color: #fff; padding: 8px 14px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
                  DNS Търсене
                </button>
              </div>
              <div class="dns-trace-box" style="background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 12px; font-family: monospace; font-size: 12px; color: #cbd5e1; min-height: 110px; line-height: 1.6;">
                <div style="color: #64748b;">[Готовност за DNS заявка]</div>
                <div>Натиснете "DNS Търсене", за да проследите резолвера.</div>
              </div>
            </div>

            <!-- Firewall & Password Security -->
            <div style="background: #1e293b; border-radius: 10px; padding: 16px; border: 1px solid #334155;">
              <h4 style="margin: 0 0 12px 0; font-size: 13.5px; color: #38bdf8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                Сигурност на парола и защитна стена
              </h4>
              <label style="display: block; font-size: 13px; color: #cbd5e1; font-weight: 600; margin-bottom: 6px;">Тествай парола за вход:</label>
              <input type="text" class="pwd-input" placeholder="Въведете парола..." value="Parola123!" style="width: 100%; box-sizing: border-box; background: #0f172a; border: 1.5px solid #475569; color: #f8fafc; padding: 8px 12px; border-radius: 6px; font-family: monospace; font-size: 13px; margin-bottom: 8px;">
              
              <div style="background: #334155; border-radius: 6px; height: 8px; width: 100%; overflow: hidden; margin-bottom: 8px;">
                <div class="pwd-strength-bar" style="height: 100%; width: 60%; background: #f59e0b; transition: all 0.3s;"></div>
              </div>
              <div class="pwd-feedback" style="font-size: 12px; color: #fcd34d; margin-bottom: 14px; font-weight: 600;">
                Сила: Средна. Време за разбиване с Brute-force: около 3 дни.
              </div>

              <div style="padding-top: 12px; border-top: 1px solid #334155;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:6px;">
                  <span style="font-size: 12.5px; color: #cbd5e1; font-weight: 700;">Правила на защитната стена (Firewall):</span>
                  <span class="fw-status-badge" style="font-size: 11px; padding: 2px 8px; border-radius: 10px; background: #16a34a; color: #fff; font-weight: 700;">Филтрирането е активно</span>
                </div>
                <div style="display:flex; gap:12px; flex-wrap:wrap; margin-bottom: 10px;">
                  <label class="fw-port-label-443" style="font-size:12px; color:#4ade80; display:flex; align-items:center; gap:5px; font-weight: 600; cursor:pointer;">
                    <input type="checkbox" checked class="fw-port" data-port="443" value="443"> Порт 443 (HTTPS)
                  </label>
                  <label class="fw-port-label-80" style="font-size:12px; color:#4ade80; display:flex; align-items:center; gap:5px; font-weight: 600; cursor:pointer;">
                    <input type="checkbox" checked class="fw-port" data-port="80" value="80"> Порт 80 (HTTP)
                  </label>
                  <label class="fw-port-label-22" style="font-size:12px; color:#94a3b8; display:flex; align-items:center; gap:5px; font-weight: 600; cursor:pointer;">
                    <input type="checkbox" class="fw-port" data-port="22" value="22"> Порт 22 (SSH)
                  </label>
                </div>
                <div class="fw-feedback" style="font-size: 12px; color: #93c5fd; background: #0f172a; padding: 8px 10px; border-radius: 6px; border: 1px solid #334155; line-height: 1.5;">
                  Уеб трафикът (портове 80 и 443) е разрешен. Порт 22 е блокиран срещу неоторизирани отдалечени атаки.
                </div>
              </div>
            </div>

          </div>
        </div>
        ` : ''}

        <!-- TAB 3: EXCEL FORMULAS & VALIDATION -->
        ${showExcel ? `
        <div class="sandbox-tab-content ${mode === 'excel' ? 'active' : ''}" id="${esc(compId)}-tab-excel" style="${mode === 'excel' ? 'display: block; padding: 18px;' : (mode === 'all' ? 'display:none; padding: 18px;' : 'display: block; padding: 18px;')}">
          <div style="background: #1e293b; border-radius: 10px; padding: 16px; border: 1px solid #334155;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom: 14px;">
              <div>
                <h4 style="margin:0; font-size: 14.5px; color: #38bdf8; font-weight: 700;">
                  Таблица за входящо ниво: Анализ с COUNTIF & Data Validation
                </h4>
                <p style="margin:4px 0 0 0; font-size:12.5px; color:#94a3b8;">
                  Диапазон: <code>B2:B9</code> (Точки). Изпробвайте функцията <code>COUNTIF(диапазон; критерий)</code> и сортирането.
                </p>
              </div>

              <!-- Controls -->
              <div style="display:flex; gap:8px; align-items:center; flex-wrap: wrap;">
                <select class="excel-criteria-select" style="background:#0f172a; border:1.5px solid #475569; color:#f8fafc; padding:6px 10px; border-radius:6px; font-family:monospace; font-size:12.5px; font-weight: 600;">
                  <option value=">=25">=COUNTIF(F2:F9; ">=25")  [Отличници: 25-30 т.]</option>
                  <option value="<15">=COUNTIF(F2:F9; "&lt;15")   [Слаби резултати: &lt;15 т.]</option>
                  <option value=">=21">=COUNTIF(F2:F9; ">=21")  [Добра + Мн. добра: >=21 т.]</option>
                  <option value="ИТ">=COUNTIF(D2:D9; "ИТ")    [Специалност "ИТ"]</option>
                </select>
                <button type="button" class="excel-calc-btn" style="background:#16a34a; border:1px solid #15803d; color:#fff; padding:6px 12px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer;">
                  Изчисли
                </button>
                <button type="button" class="excel-sort-btn" style="background:#334155; border:1.5px solid #475569; color:#f8fafc; padding:6px 12px; border-radius:6px; font-size:12.5px; cursor:pointer; font-weight: 600;">
                  <i class="fa-solid fa-arrow-down-short-wide"></i> Custom Sort (Точки ↓)
                </button>
              </div>
            </div>

            <!-- Excel Table Display -->
            <div style="overflow-x:auto; margin-bottom: 12px; border-radius: 8px; border: 1px solid #334155; background: #0f172a;">
              <table class="excel-grid-table" style="width: 100%; border-collapse: collapse; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <thead>
                  <tr style="background: #1e293b; color: #94a3b8; text-align: left;">
                    <th style="padding: 8px 10px; border-bottom: 1px solid #334155; border-right: 1px solid #334155; width: 40px; font-weight: 700;">#</th>
                    <th style="padding: 8px 10px; border-bottom: 1px solid #334155; border-right: 1px solid #334155; font-weight: 700; color: #f8fafc;">A: Име на ученик</th>
                    <th style="padding: 8px 10px; border-bottom: 1px solid #334155; border-right: 1px solid #334155; font-weight: 700;">B: Клас</th>
                    <th style="padding: 8px 10px; border-bottom: 1px solid #334155; border-right: 1px solid #334155; font-weight: 700;">C: Специалност</th>
                    <th style="padding: 8px 10px; border-bottom: 1px solid #334155; border-right: 1px solid #334155; font-weight: 700;">D: Оценка 9. клас</th>
                    <th style="padding: 8px 10px; border-bottom: 1px solid #334155; border-right: 1px solid #334155; color: #60a5fa; font-weight: 700;">F: Входно ниво точки (0-30)</th>
                    <th style="padding: 8px 10px; border-bottom: 1px solid #334155; font-weight: 700;">Статус</th>
                  </tr>
                </thead>
                <tbody class="excel-table-body">
                  <!-- Generated dynamically in init -->
                </tbody>
              </table>
            </div>

            <!-- Result bar -->
            <div style="display:flex; justify-content:space-between; align-items:center; background:#0f172a; border:1px solid #334155; border-radius:6px; padding:10px 14px;">
              <span style="font-size:13px; color:#cbd5e1; font-weight: 600;">Резултат от формулата:</span>
              <span class="excel-result-display" style="font-family:monospace; font-size:13.5px; color:#4ade80; font-weight:700;">Натиснете "Изчисли", за да изпълните формулата.</span>
            </div>

            <!-- Validation simulation dialog -->
            <div style="margin-top:12px; padding:10px 14px; background:#1e3a8a33; border-left:4px solid #3b82f6; border-radius:4px; font-size:12.5px; color:#93c5fd;">
              <strong>Data Validation правило за колона F:</strong> Разрешени стойности: <code>Whole number (цяло число) между 0 и 30</code>. При въвеждане на некоректна стойност (напр. 35 или текст), Excel показва предупредителен прозорец <code>Error Alert: Stop</code>.
            </div>

          </div>
        </div>
        ` : ''}

      </div>
    </section>
  `;
}

export function init(comp) {
  const compId = comp.id || 'it10-sandbox';
  const root = document.getElementById(compId);
  if (!root) return;

  // 1. Tab Switching
  const tabBtns = root.querySelectorAll('.sandbox-tab-btn');
  const tabContents = root.querySelectorAll('.sandbox-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.style.color = '#94a3b8';
        b.style.background = 'transparent';
        b.style.borderColor = 'transparent';
      });
      tabContents.forEach(c => {
        c.style.display = 'none';
        c.classList.remove('active');
      });
      btn.classList.add('active');
      btn.style.color = '#ffffff';
      btn.style.background = '#334155';
      btn.style.borderColor = '#475569';

      const targetId = compId + '-' + btn.dataset.tab;
      const targetContent = root.querySelector('#' + targetId);
      if (targetContent) {
        targetContent.style.display = 'block';
        targetContent.classList.add('active');
      }
    });
  });

  // 2. Network Topology SVG Drawer & Simulation
  const svg = root.querySelector('.net-topology-svg');
  const topologySelect = root.querySelector('.net-topology-select');
  const cableSelect = root.querySelector('.net-cable-select');
  const speedVal = root.querySelector('.net-speed-val');
  const distVal = root.querySelector('.net-dist-val');
  const noiseVal = root.querySelector('.net-noise-val');
  const failBtn = root.querySelector('.net-simulate-fail-btn');
  const statusBadge = root.querySelector('.net-status-badge');
  const explanationText = root.querySelector('.net-explanation-text');

  let isCableBroken = false;

  const cableSpecs = {
    twisted: { speed: '1 Gb/s (1000 Mb/s)', dist: '100 метра', noise: 'Средна' },
    fiber: { speed: '10+ Gb/s', dist: 'до 40 км', noise: 'Отлична' },
    coax: { speed: '10 Mb/s', dist: 'до 500 метра', noise: 'Ниска' }
  };

  function updateCableSpecs() {
    const spec = cableSpecs[cableSelect.value] || cableSpecs.twisted;
    if (speedVal) speedVal.textContent = spec.speed;
    if (distVal) distVal.textContent = spec.dist;
    if (noiseVal) noiseVal.textContent = spec.noise;
  }

  if (cableSelect) {
    cableSelect.addEventListener('change', updateCableSpecs);
  }

  function drawTopology() {
    const topo = topologySelect ? topologySelect.value : 'star';
    if (!svg) return;

    let linesHtml = '';
    let devicesHtml = '';

    const activeLineColor = isCableBroken ? '#dc2626' : '#16a34a';

    if (topo === 'star') {
      const clients = [
        { x: 100, y: 50, name: 'PC-1' },
        { x: 400, y: 50, name: 'PC-2' },
        { x: 80, y: 190, name: 'PC-3' },
        { x: 420, y: 190, name: 'PC-4' },
        { x: 250, y: 220, name: 'Server' }
      ];

      // 1. ALL LINES BEHIND DEVICES
      clients.forEach((c, idx) => {
        const isBrokenNode = isCableBroken && idx === 1;
        const lineCol = isBrokenNode ? '#dc2626' : (isCableBroken ? '#2563eb' : activeLineColor);
        const lineDash = isBrokenNode ? 'stroke-dasharray="5,4"' : '';
        linesHtml += `<line x1="250" y1="125" x2="${c.x}" y2="${c.y}" stroke="${lineCol}" stroke-width="2.5" ${lineDash}/>`;
      });

      // 2. DEVICES ON TOP
      // Switch at center (250, 125)
      devicesHtml += `<circle cx="250" cy="125" r="24" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>`;
      devicesHtml += `<text x="250" y="129" fill="#ffffff" font-size="10.5" font-weight="bold" text-anchor="middle">SWITCH</text>`;

      clients.forEach((c, idx) => {
        const isBrokenNode = isCableBroken && idx === 1;
        devicesHtml += `<rect x="${c.x - 24}" y="${c.y - 14}" width="48" height="28" rx="6" fill="#ffffff" stroke="${isBrokenNode ? '#dc2626' : '#94a3b8'}" stroke-width="1.8"/>`;
        devicesHtml += `<text x="${c.x}" y="${c.y + 4}" fill="${isBrokenNode ? '#dc2626' : '#1e293b'}" font-size="11" text-anchor="middle" font-weight="700">${c.name}</text>`;
      });

      if (explanationText) {
        explanationText.innerHTML = isCableBroken
          ? `<span style="color:#ef4444; font-weight:700;">[Диагностика]: Кабелът към PC-2 е прекъснат!</span> Въпреки това, централният Switch изолира повредата – всички останали компютри (PC-1, PC-3, PC-4 и Сървърът) запазват пълна мрежова свързаност.`
          : `В топология <strong>Звезда</strong> всички компютри са свързани директно към централен суич (Switch). Ако единичен кабел към клиент прекъсне, останалите компютри продължават комуникацията без смущения.`;
      }
    } else if (topo === 'ring') {
      const ringNodes = [
        { x: 250, y: 40, name: 'Възел 1' },
        { x: 400, y: 110, name: 'Възел 2' },
        { x: 340, y: 210, name: 'Възел 3' },
        { x: 160, y: 210, name: 'Възел 4' },
        { x: 100, y: 110, name: 'Възел 5' }
      ];

      // 1. ALL LINES BEHIND
      for (let i = 0; i < ringNodes.length; i++) {
        const n1 = ringNodes[i];
        const n2 = ringNodes[(i + 1) % ringNodes.length];
        const isBroken = isCableBroken && i === 1;
        linesHtml += `<line x1="${n1.x}" y1="${n1.y}" x2="${n2.x}" y2="${n2.y}" stroke="${isBroken ? '#dc2626' : (isCableBroken ? '#94a3b8' : activeLineColor)}" stroke-width="2.5" ${isBroken ? 'stroke-dasharray="5,4"' : ''}/>`;
      }

      // 2. DEVICES ON TOP
      ringNodes.forEach((n) => {
        devicesHtml += `<circle cx="${n.x}" cy="${n.y}" r="20" fill="#ffffff" stroke="${isCableBroken ? '#dc2626' : '#2563eb'}" stroke-width="2"/>`;
        devicesHtml += `<text x="${n.x}" y="${n.y + 4}" fill="#1e293b" font-size="10.5" font-weight="700" text-anchor="middle">${n.name}</text>`;
      });

      if (explanationText) {
        explanationText.innerHTML = isCableBroken
          ? `<span style="color:#ef4444; font-weight:700;">[Критична повреда]: Прекъсване в пръстена!</span> При класическия Кръг прекъсването на една линия нарушава циркулацията на токена/пакета и цялата мрежа спира работа.`
          : `В топология <strong>Кръг (Ring)</strong> всеки възел е свързан точно с два съседни. Сигналът се предава еднопосочно от компютър на компютър под формата на електронен маркер (токен).`;
      }
    } else if (topo === 'bus') {
      const busY = 125;

      const busClients = [
        { x: 110, y: 60, name: 'Работна станция 1' },
        { x: 230, y: 60, name: 'Работна станция 2' },
        { x: 350, y: 60, name: 'Работна станция 3' },
        { x: 170, y: 190, name: 'Мрежов принтер' },
        { x: 290, y: 190, name: 'Файлов сървър' }
      ];

      // 1. ALL LINES BEHIND
      linesHtml += `<line x1="50" y1="${busY}" x2="450" y2="${busY}" stroke="${isCableBroken ? '#dc2626' : '#2563eb'}" stroke-width="4.5" ${isCableBroken ? 'stroke-dasharray="6,4"' : ''}/>`;
      busClients.forEach(c => {
        linesHtml += `<line x1="${c.x}" y1="${busY}" x2="${c.x}" y2="${c.y}" stroke="#64748b" stroke-width="2"/>`;
      });

      // 2. DEVICES ON TOP
      // Terminators
      devicesHtml += `<rect x="38" y="${busY - 11}" width="12" height="22" rx="2" fill="#d97706" stroke="#b45309" stroke-width="1.5"/>`;
      devicesHtml += `<rect x="450" y="${busY - 11}" width="12" height="22" rx="2" fill="#d97706" stroke="#b45309" stroke-width="1.5"/>`;

      busClients.forEach(c => {
        devicesHtml += `<rect x="${c.x - 38}" y="${c.y - 13}" width="76" height="26" rx="5" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>`;
        devicesHtml += `<text x="${c.x}" y="${c.y + 4}" fill="#1e293b" font-size="9.5" font-weight="600" text-anchor="middle">${c.name}</text>`;
      });

      if (explanationText) {
        explanationText.innerHTML = isCableBroken
          ? `<span style="color:#ef4444; font-weight:700;">[Срив на магистралата]:</span> Кабелът на шината е прекъснат. Сигналът се отразява обратно (липсва заземяване от терминатора) и цялата комуникация по шината прекъсва.`
          : `В топология <strong>Шина (Bus)</strong> всички устройства ползват един общ комуникационен канал (коаксиален кабел), завършващ с терминатори в двата края.`;
      }
    } else if (topo === 'tree') {
      // 1. ALL LINES BEHIND
      linesHtml += `<line x1="250" y1="40" x2="160" y2="120" stroke="#2563eb" stroke-width="2.5"/>`;
      linesHtml += `<line x1="250" y1="40" x2="340" y2="120" stroke="${isCableBroken ? '#dc2626' : '#2563eb'}" stroke-width="2.5" ${isCableBroken ? 'stroke-dasharray="5,4"' : ''}/>`;

      linesHtml += `<line x1="160" y1="120" x2="110" y2="200" stroke="#64748b" stroke-width="1.8"/>`;
      linesHtml += `<line x1="160" y1="120" x2="210" y2="200" stroke="#64748b" stroke-width="1.8"/>`;
      linesHtml += `<line x1="340" y1="120" x2="290" y2="200" stroke="${isCableBroken ? '#dc2626' : '#64748b'}" stroke-width="1.8"/>`;
      linesHtml += `<line x1="340" y1="120" x2="390" y2="200" stroke="${isCableBroken ? '#dc2626' : '#64748b'}" stroke-width="1.8"/>`;

      // 2. DEVICES ON TOP
      devicesHtml += `<circle cx="250" cy="40" r="20" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>`;
      devicesHtml += `<text x="250" y="44" fill="#fff" font-size="9.5" font-weight="bold" text-anchor="middle">Root</text>`;

      devicesHtml += `<circle cx="160" cy="120" r="16" fill="#16a34a" stroke="#15803d" stroke-width="1.5"/>`;
      devicesHtml += `<text x="160" y="124" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle">SW-1</text>`;

      devicesHtml += `<circle cx="340" cy="120" r="16" fill="${isCableBroken ? '#dc2626' : '#16a34a'}" stroke="${isCableBroken ? '#b91c1c' : '#15803d'}" stroke-width="1.5"/>`;
      devicesHtml += `<text x="340" y="124" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle">SW-2</text>`;

      [110, 210, 290, 390].forEach((x, i) => {
        const isDown = isCableBroken && (x === 290 || x === 390);
        devicesHtml += `<rect x="${x - 18}" y="190" width="36" height="22" rx="4" fill="#ffffff" stroke="${isDown ? '#dc2626' : '#94a3b8'}" stroke-width="1.5"/>`;
        devicesHtml += `<text x="${x}" y="${205}" fill="${isDown ? '#dc2626' : '#1e293b'}" font-size="9.5" font-weight="700" text-anchor="middle">L${i + 1}</text>`;
      });

      if (explanationText) {
        explanationText.innerHTML = isCableBroken
          ? `<span style="color:#ef4444; font-weight:700;">[Изолиран клон]:</span> Връзката към десния разпределител SW-2 прекъсна. Неговите подвъзли L3 и L4 губят контакт с главния сървър, но левият клон (L1, L2) остава напълно функциониращ!`
          : `В <strong>Дървовидната топология</strong> има йерархично групиране на комутаторите. Широко се използва в големи училищни и университетски сгради (Campus LAN).`;
      }
    }

    svg.innerHTML = linesHtml + devicesHtml;
  }

  if (topologySelect) {
    topologySelect.addEventListener('change', () => {
      isCableBroken = false;
      if (statusBadge) {
        statusBadge.style.background = '#16a34a';
        statusBadge.textContent = 'Мрежата е активна (100%)';
      }
      if (failBtn) {
        failBtn.textContent = 'Симулирай прекъснат кабел';
        failBtn.style.borderColor = '#c2410c';
        failBtn.style.color = '#ffffff';
        failBtn.style.background = '#ea580c';
      }
      drawTopology();
    });
  }

  if (failBtn) {
    failBtn.addEventListener('click', () => {
      isCableBroken = !isCableBroken;
      if (isCableBroken) {
        failBtn.textContent = 'Възстанови кабела';
        failBtn.style.borderColor = '#16a34a';
        failBtn.style.color = '#ffffff';
        failBtn.style.background = '#16a34a';
        if (statusBadge) {
          statusBadge.style.background = '#dc2626';
          statusBadge.textContent = 'Открит дефект в трасето!';
        }
      } else {
        failBtn.textContent = 'Симулирай прекъснат кабел';
        failBtn.style.borderColor = '#c2410c';
        failBtn.style.color = '#ffffff';
        failBtn.style.background = '#ea580c';
        if (statusBadge) {
          statusBadge.style.background = '#16a34a';
          statusBadge.textContent = 'Мрежата е активна (100%)';
        }
      }
      drawTopology();
    });
  }

  drawTopology();

  // 3. DNS Lookup Simulation
  const dnsBtn = root.querySelector('.dns-resolve-btn');
  const dnsInput = root.querySelector('.dns-input');
  const dnsTrace = root.querySelector('.dns-trace-box');

  const domainIpMap = {
    'google.com': '142.250.180.14',
    'egvt.alle.bg': '212.122.187.42',
    'mon.bg': '193.109.55.12',
    'cloud.google.com': '142.250.187.142',
    'drive.microsoft.com': '13.107.42.12',
    'wikipedia.org': '208.80.154.224'
  };

  if (dnsBtn && dnsInput && dnsTrace) {
    dnsBtn.addEventListener('click', () => {
      const domain = (dnsInput.value || '').trim().toLowerCase();
      const ip = domainIpMap[domain] || '142.250.180.14';
      const tldMatch = domain.match(/\.([a-z]{2,})$/i);
      const tld = tldMatch ? `.${tldMatch[1]}` : '.com';

      dnsTrace.innerHTML = `<div style="color: #38bdf8; font-weight: 600;">[Заявка стартирана] Преобразуване на: ${esc(domain)}...</div>`;
      
      setTimeout(() => {
        dnsTrace.innerHTML += `<div style="color: #94a3b8;">1. Проверка в локален кеш (Client Cache) -> Не е намерено</div>`;
      }, 250);

      setTimeout(() => {
        dnsTrace.innerHTML += `<div style="color: #94a3b8;">2. Запитване към ISP DNS Resolver (8.8.8.8)...</div>`;
      }, 500);

      setTimeout(() => {
        dnsTrace.innerHTML += `
          <div style="color: #94a3b8;">3. Root TLD (${tld}) -> Authoritative Nameserver</div>
          <div style="color: #4ade80; font-weight: bold; margin-top: 6px;">
            ✓ УСПЕШЕН ОТГОВОР: ${esc(domain)} -> IPv4 [${ip}]
          </div>
        `;

        // Check against active Firewall port rules
        const p443 = root.querySelector('.fw-port[data-port="443"]')?.checked;
        const p80 = root.querySelector('.fw-port[data-port="80"]')?.checked;

        if (!p443 && !p80) {
          dnsTrace.innerHTML += `
            <div style="color: #ef4444; font-weight: bold; margin-top: 8px; padding: 6px 8px; background: rgba(239, 68, 68, 0.15); border-radius: 4px; border: 1px solid #ef4444;">
              ✕ БЛОКИРАНО ОТ FIREWALL: Портове 80 (HTTP) и 443 (HTTPS) са забранени! Защитната стена отказа връзката към ${esc(domain)}.
            </div>
          `;
        } else if (!p443) {
          dnsTrace.innerHTML += `
            <div style="color: #f59e0b; font-weight: bold; margin-top: 8px; padding: 6px 8px; background: rgba(245, 158, 11, 0.15); border-radius: 4px; border: 1px solid #f59e0b;">
              ⚠ FIREWALL ПРЕДУПРЕЖДЕНИЕ: Порт 443 (HTTPS) е блокиран! Възможен е само нешифрован HTTP (Порт 80).
            </div>
          `;
        } else {
          dnsTrace.innerHTML += `
            <div style="color: #38bdf8; font-size: 11.5px; margin-top: 6px;">
              ✓ Firewall проверка: Порт 443 (HTTPS) е разрешен. Криптираният трафик преминава успешно през защитната стена.
            </div>
          `;
        }
      }, 800);
    });
  }

  // 4. Password Strength Analyzer
  const pwdInput = root.querySelector('.pwd-input');
  const pwdBar = root.querySelector('.pwd-strength-bar');
  const pwdFeedback = root.querySelector('.pwd-feedback');

  if (pwdInput && pwdBar && pwdFeedback) {
    pwdInput.addEventListener('input', () => {
      const val = pwdInput.value;
      let score = 0;
      if (val.length >= 8) score += 25;
      if (val.length >= 12) score += 25;
      if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score += 20;
      if (/[0-9]/.test(val)) score += 15;
      if (/[^A-Za-z0-9]/.test(val)) score += 15;

      pwdBar.style.width = score + '%';

      if (score < 40) {
        pwdBar.style.background = '#ef4444';
        pwdFeedback.style.color = '#f87171';
        pwdFeedback.textContent = 'Сила: Слаба! Разбива се за секунди. Добавете повече символи, главни букви и знаци.';
      } else if (score < 75) {
        pwdBar.style.background = '#f59e0b';
        pwdFeedback.style.color = '#fcd34d';
        pwdFeedback.textContent = 'Сила: Средна. Време за разбиване с Brute-force: няколко седмици.';
      } else {
        pwdBar.style.background = '#22c55e';
        pwdFeedback.style.color = '#86efac';
        pwdFeedback.textContent = 'Сила: Много добра / Силна парола! Време за разбиване: хиляди години.';
      }
    });
  }

  // 4b. Firewall Interactive Engine
  const fwPorts = root.querySelectorAll('.fw-port');
  const fwFeedback = root.querySelector('.fw-feedback');
  const fwStatusBadge = root.querySelector('.fw-status-badge');

  function updateFirewallState() {
    if (!fwFeedback) return;
    const p443 = root.querySelector('.fw-port[data-port="443"]')?.checked;
    const p80 = root.querySelector('.fw-port[data-port="80"]')?.checked;
    const p22 = root.querySelector('.fw-port[data-port="22"]')?.checked;

    const lbl443 = root.querySelector('.fw-port-label-443');
    const lbl80 = root.querySelector('.fw-port-label-80');
    const lbl22 = root.querySelector('.fw-port-label-22');

    if (lbl443) lbl443.style.color = p443 ? '#4ade80' : '#f87171';
    if (lbl80) lbl80.style.color = p80 ? '#4ade80' : '#f87171';
    if (lbl22) lbl22.style.color = p22 ? '#f59e0b' : '#94a3b8';

    const messages = [];

    if (!p443 && !p80) {
      messages.push('<strong style="color:#ef4444;">[Уеб трафикът е блокиран]:</strong> Портове 80 и 443 са изключени. Браузърите в мрежата нямат достъп до уеб сайтове.');
    } else if (!p443) {
      messages.push('<strong style="color:#f59e0b;">[Частична забрана]:</strong> Порт 443 (HTTPS) е блокиран. Защитените сайтове не могат да се отворят.');
    } else if (!p80) {
      messages.push('<strong style="color:#38bdf8;">[Повишена сигурност]:</strong> Нешифрованият HTTP (80) е спрян, разрешен е само криптиран HTTPS (443).');
    } else {
      messages.push('<strong style="color:#4ade80;">[Стандартен уеб достъп]:</strong> Портове 80 и 443 са разрешени (HTTP & HTTPS уеб страниците се зареждат).');
    }

    if (p22) {
      messages.push('<strong style="color:#f59e0b;">[Риск за сигурността]:</strong> Порт 22 (SSH) е ОТВОРЕН! Системата е открита за отдалечени администраторски опити за вход.');
    } else {
      messages.push('<span style="color:#94a3b8;">Порт 22 (SSH) е блокиран – защита срещу отдалечен неоторизиран достъп.</span>');
    }

    fwFeedback.innerHTML = messages.join('<br>');

    if (fwStatusBadge) {
      if (!p443 && !p80) {
        fwStatusBadge.style.background = '#dc2626';
        fwStatusBadge.textContent = 'Уеб трафикът е спрян';
      } else if (p22) {
        fwStatusBadge.style.background = '#d97706';
        fwStatusBadge.textContent = 'Внимание: Отворен порт 22';
      } else {
        fwStatusBadge.style.background = '#16a34a';
        fwStatusBadge.textContent = 'Филтрирането е активно';
      }
    }
  }

  fwPorts.forEach(cb => {
    cb.addEventListener('change', updateFirewallState);
  });
  updateFirewallState();

  // 5. Excel Table Demo Data & COUNTIF Engine
  const excelData = [
    { id: 1, name: 'Александър Иванов', grade: '10а', spec: 'ИТ', score9: 5.50, points: 28, status: 'Отличен' },
    { id: 2, name: 'Божидар Георгиев', grade: '10а', spec: 'ИТ', score9: 4.25, points: 21, status: 'Добър' },
    { id: 3, name: 'Виктория Димитрова', grade: '10б', spec: 'Езиков', score9: 6.00, points: 30, status: 'Отличен' },
    { id: 4, name: 'Георги Стоянов', grade: '10а', spec: 'ИТ', score9: 3.50, points: 14, status: 'Преговор' },
    { id: 5, name: 'Десислава Петрова', grade: '10в', spec: 'Математически', score9: 5.75, points: 27, status: 'Отличен' },
    { id: 6, name: 'Емил Тодоров', grade: '10б', spec: 'Езиков', score9: 4.00, points: 18, status: 'Среден' },
    { id: 7, name: 'Златина Николова', grade: '10а', spec: 'ИТ', score9: 5.25, points: 24, status: 'Мн. добър' },
    { id: 8, name: 'Калоян Василев', grade: '10в', spec: 'Математически', score9: 3.00, points: 12, status: 'Преговор' }
  ];

  const tableBody = root.querySelector('.excel-table-body');
  const criteriaSelect = root.querySelector('.excel-criteria-select');
  const calcBtn = root.querySelector('.excel-calc-btn');
  const sortBtn = root.querySelector('.excel-sort-btn');
  const resultDisplay = root.querySelector('.excel-result-display');

  let currentRows = [...excelData];

  function renderExcelRows(highlightFilter = null) {
    if (!tableBody) return;
    tableBody.innerHTML = currentRows.map((r, i) => {
      let isHighlighted = false;
      if (highlightFilter) {
        if (highlightFilter === '>=25' && r.points >= 25) isHighlighted = true;
        if (highlightFilter === '<15' && r.points < 15) isHighlighted = true;
        if (highlightFilter === '>=21' && r.points >= 21) isHighlighted = true;
        if (highlightFilter === 'ИТ' && r.spec === 'ИТ') isHighlighted = true;
      }

      const rowBg = isHighlighted ? 'background: #14532d; font-weight: 600;' : (i % 2 === 0 ? 'background: #0f172a;' : 'background: #1e293b;');
      return `
        <tr style="${rowBg} border-bottom: 1px solid #334155;">
          <td style="padding: 7px 10px; border-right: 1px solid #334155; color: #64748b; font-family: monospace;">${i + 2}</td>
          <td style="padding: 7px 10px; border-right: 1px solid #334155; color: #f8fafc; font-weight: 600;">${esc(r.name)}</td>
          <td style="padding: 7px 10px; border-right: 1px solid #334155; color: #cbd5e1;">${esc(r.grade)}</td>
          <td style="padding: 7px 10px; border-right: 1px solid #334155; color: #cbd5e1;">${esc(r.spec)}</td>
          <td style="padding: 7px 10px; border-right: 1px solid #334155; color: #94a3b8; font-family: monospace;">${r.score9.toFixed(2)}</td>
          <td style="padding: 7px 10px; border-right: 1px solid #334155; color: ${r.points >= 25 ? '#4ade80' : (r.points < 15 ? '#f87171' : '#60a5fa')}; font-weight: bold; font-family: monospace;">${r.points} т.</td>
          <td style="padding: 7px 10px; color: #cbd5e1;">${esc(r.status)}</td>
        </tr>
      `;
    }).join('');
  }

  renderExcelRows();

  if (calcBtn && criteriaSelect && resultDisplay) {
    calcBtn.addEventListener('click', () => {
      const crit = criteriaSelect.value;
      let count = 0;
      let explanation = '';

      if (crit === '>=25') {
        count = currentRows.filter(r => r.points >= 25).length;
        explanation = `=COUNTIF(F2:F9; ">=25") -> Резултат: ${count} ученици с резултат 25 и повече точки.`;
      } else if (crit === '<15') {
        count = currentRows.filter(r => r.points < 15).length;
        explanation = `=COUNTIF(F2:F9; "<15") -> Резултат: ${count} ученици с резултат под 15 точки (нужда от преговор).`;
      } else if (crit === '>=21') {
        count = currentRows.filter(r => r.points >= 21).length;
        explanation = `=COUNTIF(F2:F9; ">=21") -> Резултат: ${count} ученици постигат добра или отлична подготовка.`;
      } else if (crit === 'ИТ') {
        count = currentRows.filter(r => r.spec === 'ИТ').length;
        explanation = `=COUNTIF(D2:D9; "ИТ") -> Резултат: ${count} ученици изучават профил ИТ.`;
      }

      resultDisplay.textContent = explanation;
      renderExcelRows(crit);
    });
  }

  let sortAscending = false;
  if (sortBtn) {
    sortBtn.addEventListener('click', () => {
      sortAscending = !sortAscending;
      currentRows.sort((a, b) => sortAscending ? (a.points - b.points) : (b.points - a.points));
      sortBtn.innerHTML = sortAscending 
        ? '<i class="fa-solid fa-arrow-up-short-wide"></i> Custom Sort (Точки ↑)'
        : '<i class="fa-solid fa-arrow-down-short-wide"></i> Custom Sort (Точки ↓)';
      renderExcelRows(criteriaSelect ? criteriaSelect.value : null);
    });
  }
}
