// Interactive IT-10 Sandbox: Networks, Security, and Excel Simulation

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const compId = comp.id || 'it10-sandbox';

  return `
    <section class="component it10-sandbox-container" style="margin: 28px 0;">
      <div class="live-sandbox-block" id="${esc(compId)}">
        <div class="sandbox-header">
          <div class="sandbox-title">
            <i class="fa-solid fa-microchip" style="color: #60a5fa;"></i>
            <span>${esc(comp.title || 'Интерактивна лаборатория: Мрежи, Сигурност & Excel')}</span>
          </div>
          <div class="sandbox-tabs">
            <button type="button" class="sandbox-tab-btn active" data-tab="tab-networks">
              <i class="fa-solid fa-network-wired"></i> 1. Топологии & Кабели
            </button>
            <button type="button" class="sandbox-tab-btn" data-tab="tab-security">
              <i class="fa-solid fa-shield-halved"></i> 2. IP, DNS & Защитна стена
            </button>
            <button type="button" class="sandbox-tab-btn" data-tab="tab-excel">
              <i class="fa-solid fa-file-excel"></i> 3. Excel COUNTIF & Валидиране
            </button>
          </div>
        </div>

        <!-- TAB 1: NETWORKS & TOPOLOGY -->
        <div class="sandbox-tab-content active" id="${esc(compId)}-tab-networks">
          <div style="display: grid; grid-template-columns: 280px 1fr; gap: 20px;" class="sandbox-grid-responsive">
            <div style="background: #161b22; border: 1px solid #30363d; border-radius: 10px; padding: 16px;">
              <h4 style="margin: 0 0 12px 0; font-size: 14px; color: #58a6ff; text-transform: uppercase; letter-spacing: 0.5px;">Конфигурация на мрежа</h4>
              
              <label style="display: block; font-size: 13px; color: #8b949e; margin-bottom: 6px;">Мрежова топология:</label>
              <select class="net-topology-select" style="width: 100%; background: #0d1117; border: 1px solid #30363d; color: #c9d1d9; padding: 8px 10px; border-radius: 6px; font-size: 13px; margin-bottom: 14px;">
                <option value="star">Звезда (Star - с централен комутатор/Switch)</option>
                <option value="ring">Кръг (Ring - пръстенна последователност)</option>
                <option value="bus">Шина (Bus - общ преносен канал с терминатори)</option>
                <option value="tree">Дървовидна (Tree - йерархична)</option>
              </select>

              <label style="display: block; font-size: 13px; color: #8b949e; margin-bottom: 6px;">Преносна среда (Кабел):</label>
              <select class="net-cable-select" style="width: 100%; background: #0d1117; border: 1px solid #30363d; color: #c9d1d9; padding: 8px 10px; border-radius: 6px; font-size: 13px; margin-bottom: 16px;">
                <option value="twisted">Усукана двойка (UTP/STP Cat 6e - 1 Gb/s, до 100 m)</option>
                <option value="fiber">Оптичен кабел (Single-Mode Fiber - 10+ Gb/s, до 40 km)</option>
                <option value="coax">Коаксиален кабел (RG-58 - 10 Mb/s, исторически)</option>
              </select>

              <div style="margin-bottom: 16px; padding: 12px; background: #0d1117; border-radius: 6px; border: 1px solid #21262d; font-size: 12.5px;" class="net-metrics-panel">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                  <span style="color:#8b949e;">Макс. скорост:</span>
                  <strong style="color:#3fb950;" class="net-speed-val">1 Gb/s (1000 Mb/s)</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                  <span style="color:#8b949e;">Макс. сегмент:</span>
                  <strong style="color:#58a6ff;" class="net-dist-val">100 метра</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                  <span style="color:#8b949e;">Устойчивост на шум:</span>
                  <strong style="color:#d29922;" class="net-noise-val">Средна</strong>
                </div>
              </div>

              <button type="button" class="net-simulate-fail-btn" style="width: 100%; background: #21262d; border: 1px solid #f85149; color: #ff7b72; padding: 8px 12px; border-radius: 6px; font-size: 13px; cursor: pointer; font-weight: 600; display:flex; align-items:center; justify-content:center; gap:8px;">
                <i class="fa-solid fa-triangle-exclamation"></i> Симулирай прекъснат кабел
              </button>
            </div>

            <div style="background: #161b22; border: 1px solid #30363d; border-radius: 10px; padding: 16px; display:flex; flex-direction:column;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 13px; font-weight: 700; color: #c9d1d9;">Интерактивна схема на предаване на пакети</span>
                <span class="net-status-badge" style="font-size: 11px; padding: 3px 8px; border-radius: 10px; background: #238636; color: #fff; font-weight:700;">Мрежата е активна (100%)</span>
              </div>
              <div class="net-canvas-container" style="flex:1; min-height: 250px; background: #0d1117; border-radius: 8px; border: 1px solid #21262d; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center;">
                <svg class="net-topology-svg" width="100%" height="250" viewBox="0 0 500 250"></svg>
              </div>
              <p class="net-explanation-text" style="font-size: 12.5px; color: #8b949e; margin: 10px 0 0 0; line-height: 1.5;">
                В топология <strong>Звезда</strong> всички компютри са свързани към централен комутатор (Switch). Ако единичен кабел към клиент прекъсне, останалите компютри продължават да комуникират без прекъсване.
              </p>
            </div>
          </div>
        </div>

        <!-- TAB 2: SECURITY, DNS & IP -->
        <div class="sandbox-tab-content" id="${esc(compId)}-tab-security" style="display:none;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;" class="sandbox-grid-responsive">
            
            <!-- DNS & IP Lookup -->
            <div style="background: #161b22; border: 1px solid #30363d; border-radius: 10px; padding: 16px;">
              <h4 style="margin: 0 0 12px 0; font-size: 14px; color: #58a6ff; text-transform: uppercase;">
                <i class="fa-solid fa-earth-americas"></i> Симулация на DNS преобразуване
              </h4>
              <p style="font-size: 13px; color: #8b949e; margin-bottom: 12px;">
                DNS превежда лесно запомнящите се домейн имена в машинно-четими IP адреси (IPv4 / IPv6).
              </p>
              <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                <input type="text" class="dns-input" value="egvt.alle.bg" style="flex:1; background: #0d1117; border: 1px solid #30363d; color: #58a6ff; padding: 8px 12px; border-radius: 6px; font-family: monospace; font-size: 13px;">
                <button type="button" class="dns-resolve-btn" style="background: #238636; border: 1px solid #2ea043; color: #fff; padding: 8px 14px; border-radius: 6px; font-size: 13px; font-weight:600; cursor:pointer;">
                  DNS Търсене
                </button>
              </div>
              <div class="dns-trace-box" style="background: #0d1117; border: 1px solid #21262d; border-radius: 6px; padding: 12px; font-family: monospace; font-size: 12px; color: #c9d1d9; min-height: 110px;">
                <div style="color: #8b949e;">[Готовност за DNS заявка]</div>
                <div>Натиснете "DNS Търсене", за да проследите резолвера.</div>
              </div>
            </div>

            <!-- Firewall & Password Security -->
            <div style="background: #161b22; border: 1px solid #30363d; border-radius: 10px; padding: 16px;">
              <h4 style="margin: 0 0 12px 0; font-size: 14px; color: #3fb950; text-transform: uppercase;">
                <i class="fa-solid fa-lock"></i> Тестер за сигурност на парола & Защитна стена
              </h4>
              <label style="display: block; font-size: 13px; color: #8b949e; margin-bottom: 6px;">Тествай парола за вход:</label>
              <input type="text" class="pwd-input" placeholder="Въведете парола..." value="Parola123!" style="width: 100%; box-sizing: border-box; background: #0d1117; border: 1px solid #30363d; color: #c9d1d9; padding: 8px 12px; border-radius: 6px; font-family: monospace; font-size: 13px; margin-bottom: 8px;">
              
              <div style="background: #0d1117; border-radius: 6px; height: 8px; width: 100%; overflow: hidden; margin-bottom: 8px;">
                <div class="pwd-strength-bar" style="height: 100%; width: 60%; background: #d29922; transition: all 0.3s;"></div>
              </div>
              <div class="pwd-feedback" style="font-size: 12px; color: #d29922; margin-bottom: 14px;">
                Сила: Средна. Време за разбиване с Brute-force: около 3 дни.
              </div>

              <div style="padding-top: 10px; border-top: 1px solid #21262d;">
                <span style="font-size: 12.5px; color: #8b949e; display:block; margin-bottom:6px;">Защитна стена (Firewall) правила:</span>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                  <label style="font-size:12px; color:#c9d1d9; display:flex; align-items:center; gap:4px;">
                    <input type="checkbox" checked class="fw-port" value="443"> Порт 443 (HTTPS)
                  </label>
                  <label style="font-size:12px; color:#c9d1d9; display:flex; align-items:center; gap:4px;">
                    <input type="checkbox" checked class="fw-port" value="80"> Порт 80 (HTTP)
                  </label>
                  <label style="font-size:12px; color:#c9d1d9; display:flex; align-items:center; gap:4px;">
                    <input type="checkbox" class="fw-port" value="22"> Порт 22 (SSH - Блокиран)
                  </label>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- TAB 3: EXCEL FORMULAS & VALIDATION -->
        <div class="sandbox-tab-content" id="${esc(compId)}-tab-excel" style="display:none;">
          <div style="background: #161b22; border: 1px solid #30363d; border-radius: 10px; padding: 16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom: 14px;">
              <div>
                <h4 style="margin:0; font-size: 14.5px; color: #58a6ff;">
                  <i class="fa-solid fa-table"></i> Таблица за входящо ниво: Анализ с COUNTIF & Data Validation
                </h4>
                <p style="margin:4px 0 0 0; font-size:12.5px; color:#8b949e;">
                  Диапазон: <code>B2:B9</code> (Точки). Изпробвайте функцията <code>COUNTIF(диапазон; критерий)</code> и сортирането.
                </p>
              </div>

              <!-- Controls -->
              <div style="display:flex; gap:8px; align-items:center;">
                <select class="excel-criteria-select" style="background:#0d1117; border:1px solid #30363d; color:#58a6ff; padding:6px 10px; border-radius:6px; font-family:monospace; font-size:12.5px;">
                  <option value=">=25">=COUNTIF(F2:F9; ">=25")  [Отличници: 25-30 т.]</option>
                  <option value="<15">=COUNTIF(F2:F9; "&lt;15")   [Слаби резултати: &lt;15 т.]</option>
                  <option value=">=21">=COUNTIF(F2:F9; ">=21")  [Добра + Мн. добра: >=21 т.]</option>
                  <option value="ИТ">=COUNTIF(D2:D9; "ИТ")    [Специалност "ИТ"]</option>
                </select>
                <button type="button" class="excel-calc-btn" style="background:#238636; border:1px solid #2ea043; color:#fff; padding:6px 12px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer;">
                  Изчисли
                </button>
                <button type="button" class="excel-sort-btn" style="background:#1f293d; border:1px solid #30363d; color:#c9d1d9; padding:6px 12px; border-radius:6px; font-size:12.5px; cursor:pointer;">
                  <i class="fa-solid fa-arrow-down-short-wide"></i> Custom Sort (Точки ↓)
                </button>
              </div>
            </div>

            <!-- Excel Table Display -->
            <div style="overflow-x:auto; margin-bottom: 12px;">
              <table class="excel-grid-table" style="width: 100%; border-collapse: collapse; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <thead>
                  <tr style="background: #21262d; color: #c9d1d9; text-align: left;">
                    <th style="padding: 8px 10px; border: 1px solid #30363d; width: 40px;">#</th>
                    <th style="padding: 8px 10px; border: 1px solid #30363d;">A: Име на ученик</th>
                    <th style="padding: 8px 10px; border: 1px solid #30363d;">B: Клас</th>
                    <th style="padding: 8px 10px; border: 1px solid #30363d;">C: Специалност</th>
                    <th style="padding: 8px 10px; border: 1px solid #30363d;">D: Оценка 9. клас</th>
                    <th style="padding: 8px 10px; border: 1px solid #30363d; color: #58a6ff;">F: Входно ниво точки (0-30)</th>
                    <th style="padding: 8px 10px; border: 1px solid #30363d;">Статус</th>
                  </tr>
                </thead>
                <tbody class="excel-table-body">
                  <!-- Generated dynamically in init -->
                </tbody>
              </table>
            </div>

            <!-- Result bar -->
            <div style="display:flex; justify-content:space-between; align-items:center; background:#0d1117; border:1px solid #21262d; border-radius:6px; padding:10px 14px;">
              <span style="font-size:13px; color:#8b949e;">Резултат от формулата:</span>
              <span class="excel-result-display" style="font-family:monospace; font-size:14px; color:#3fb950; font-weight:700;">Натиснете "Изчисли", за да изпълните формулата.</span>
            </div>

            <!-- Validation simulation dialog -->
            <div style="margin-top:12px; padding:10px 14px; background:rgba(56, 139, 253, 0.1); border-left:4px solid #388bfd; border-radius:4px; font-size:12.5px; color:#c9d1d9;">
              <strong>Data Validation правило за колона F:</strong> Разрешени стойности: <code>Whole number (цяло число) между 0 и 30</code>. При въвеждане на некоректна стойност (напр. 35 или текст), Excel показва предупредителен прозорец <code>Error Alert: Stop</code>.
            </div>

          </div>
        </div>

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
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => {
        c.style.display = 'none';
        c.classList.remove('active');
      });
      btn.classList.add('active');
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
    fiber: { speed: '10+ Gb/s', dist: 'до 40 км', noise: 'Отлична (Имунна на смущения)' },
    coax: { speed: '10 Mb/s', dist: 'до 500 метра', noise: 'Ниска (загуба на сигнал)' }
  };

  function updateCableSpecs() {
    const spec = cableSpecs[cableSelect.value] || cableSpecs.twisted;
    speedVal.textContent = spec.speed;
    distVal.textContent = spec.dist;
    noiseVal.textContent = spec.noise;
  }

  if (cableSelect) {
    cableSelect.addEventListener('change', updateCableSpecs);
  }

  function drawTopology() {
    const topo = topologySelect ? topologySelect.value : 'star';
    if (!svg) return;

    let html = '';
    const nodeColor = isCableBroken ? '#f85149' : '#58a6ff';
    const strokeColor = isCableBroken ? '#da3633' : '#30363d';
    const activeStroke = isCableBroken ? '#f85149' : '#238636';

    if (topo === 'star') {
      // Switch at center (250, 125), 5 PCs around
      html += `<circle cx="250" cy="125" r="22" fill="#1f6feb" stroke="#58a6ff" stroke-width="2"/>`;
      html += `<text x="250" y="129" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">SWITCH</text>`;

      const clients = [
        { x: 100, y: 50, name: 'PC-1' },
        { x: 400, y: 50, name: 'PC-2' },
        { x: 80, y: 190, name: 'PC-3' },
        { x: 420, y: 190, name: 'PC-4' },
        { x: 250, y: 220, name: 'Server' }
      ];

      clients.forEach((c, idx) => {
        const isBrokenNode = isCableBroken && idx === 1;
        const lineCol = isBrokenNode ? '#f85149' : (isCableBroken ? '#388bfd' : activeStroke);
        const lineDash = isBrokenNode ? 'stroke-dasharray="4"' : '';
        html += `<line x1="250" y1="125" x2="${c.x}" y2="${c.y}" stroke="${lineCol}" stroke-width="2.5" ${lineDash}/>`;
        html += `<rect x="${c.x - 22}" y="${c.y - 14}" width="44" height="28" rx="4" fill="#161b22" stroke="${isBrokenNode ? '#f85149' : '#30363d'}" stroke-width="1.5"/>`;
        html += `<text x="${c.x}" y="${c.y + 4}" fill="${isBrokenNode ? '#ff7b72' : '#c9d1d9'}" font-size="11" text-anchor="middle" font-weight="600">${c.name}</text>`;
      });

      if (explanationText) {
        explanationText.innerHTML = isCableBroken
          ? `<span style="color:#ff7b72;">[Диагностика]: Кабелът към PC-2 е прекъснат!</span> Въпреки това, централният Switch изолира повредата – всички останали компютри (PC-1, PC-3, PC-4 и Сървърът) запазват пълна мрежова свързаност.`
          : `В топология <strong>Звезда</strong> всички компютри са свързани директно към централен суич (Switch). Ако единичен кабел към клиент прекъсне, останалите компютри продължават комуникацията без смущения.`;
      }
    } else if (topo === 'ring') {
      // Ring with 5 nodes
      const ringNodes = [
        { x: 250, y: 40, name: 'Възел 1' },
        { x: 400, y: 110, name: 'Възел 2' },
        { x: 340, y: 210, name: 'Възел 3' },
        { x: 160, y: 210, name: 'Възел 4' },
        { x: 100, y: 110, name: 'Възел 5' }
      ];

      for (let i = 0; i < ringNodes.length; i++) {
        const n1 = ringNodes[i];
        const n2 = ringNodes[(i + 1) % ringNodes.length];
        const isBroken = isCableBroken && i === 1;
        html += `<line x1="${n1.x}" y1="${n1.y}" x2="${n2.x}" y2="${n2.y}" stroke="${isBroken ? '#f85149' : (isCableBroken ? '#8b949e' : activeStroke)}" stroke-width="2.5" ${isBroken ? 'stroke-dasharray="5"' : ''}/>`;
      }

      ringNodes.forEach((n, idx) => {
        html += `<circle cx="${n.x}" cy="${n.y}" r="18" fill="#161b22" stroke="${isCableBroken ? '#f85149' : '#58a6ff'}" stroke-width="2"/>`;
        html += `<text x="${n.x}" y="${n.y + 4}" fill="#c9d1d9" font-size="10" text-anchor="middle">${n.name}</text>`;
      });

      if (explanationText) {
        explanationText.innerHTML = isCableBroken
          ? `<span style="color:#ff7b72;">[Критична повреда]: Прекъсване в пръстена!</span> При класическия Кръг прекъсването на една линия нарушава циркулацията на токена/пакета и цялата мрежа спира работа.`
          : `В топология <strong>Кръг (Ring)</strong> всеки възел е свързан точно с два съседни. Сигналът се предава еднопосочно от компютър на компютър под формата на електронен маркер (токен).`;
      }
    } else if (topo === 'bus') {
      // Common bus line with terminators
      const busY = 125;
      html += `<line x1="50" y1="${busY}" x2="450" y2="${busY}" stroke="${isCableBroken ? '#f85149' : '#58a6ff'}" stroke-width="4" ${isCableBroken ? 'stroke-dasharray="6"' : ''}/>`;
      // Terminators
      html += `<rect x="40" y="${busY - 10}" width="10" height="20" fill="#f0883e"/>`;
      html += `<rect x="450" y="${busY - 10}" width="10" height="20" fill="#f0883e"/>`;

      const busClients = [
        { x: 110, y: 60, name: 'Работна станция 1' },
        { x: 230, y: 60, name: 'Работна станция 2' },
        { x: 350, y: 60, name: 'Работна станция 3' },
        { x: 170, y: 190, name: 'Мрежов принтер' },
        { x: 290, y: 190, name: 'Файлов сървър' }
      ];

      busClients.forEach(c => {
        html += `<line x1="${c.x}" y1="${busY}" x2="${c.x}" y2="${c.y}" stroke="#30363d" stroke-width="2"/>`;
        html += `<rect x="${c.x - 30}" y="${c.y - 12}" width="60" height="24" rx="4" fill="#161b22" stroke="#30363d" stroke-width="1"/>`;
        html += `<text x="${c.x}" y="${c.y + 4}" fill="#c9d1d9" font-size="9" text-anchor="middle">${c.name}</text>`;
      });

      if (explanationText) {
        explanationText.innerHTML = isCableBroken
          ? `<span style="color:#ff7b72;">[Срив на магистралата]:</span> Кабелът на шината е прекъснат. Сигналът се отразява обратно (липсва заземяване от терминатора) и цялата комуникация по шината прекъсва.`
          : `В топология <strong>Шина (Bus)</strong> всички устройства ползват един общ комуникационен канал (коаксиален кабел), завършващ с терминатори в двата края.`;
      }
    } else if (topo === 'tree') {
      // Tree / Hierarchical
      html += `<circle cx="250" cy="40" r="18" fill="#1f6feb" stroke="#58a6ff" stroke-width="2"/>`;
      html += `<text x="250" y="44" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle">Root</text>`;

      html += `<line x1="250" y1="40" x2="160" y2="120" stroke="#388bfd" stroke-width="2"/>`;
      html += `<line x1="250" y1="40" x2="340" y2="120" stroke="${isCableBroken ? '#f85149' : '#388bfd'}" stroke-width="2" ${isCableBroken ? 'stroke-dasharray="4"' : ''}/>`;

      html += `<circle cx="160" cy="120" r="14" fill="#238636"/>`;
      html += `<circle cx="340" cy="120" r="14" fill="${isCableBroken ? '#da3633' : '#238636'}"/>`;

      html += `<line x1="160" y1="120" x2="110" y2="200" stroke="#30363d" stroke-width="1.5"/>`;
      html += `<line x1="160" y1="120" x2="210" y2="200" stroke="#30363d" stroke-width="1.5"/>`;
      html += `<line x1="340" y1="120" x2="290" y2="200" stroke="${isCableBroken ? '#f85149' : '#30363d'}" stroke-width="1.5"/>`;
      html += `<line x1="340" y1="120" x2="390" y2="200" stroke="${isCableBroken ? '#f85149' : '#30363d'}" stroke-width="1.5"/>`;

      [110, 210, 290, 390].forEach((x, i) => {
        const isDown = isCableBroken && (x === 290 || x === 390);
        html += `<rect x="${x - 18}" y="190" width="36" height="20" rx="3" fill="#161b22" stroke="${isDown ? '#f85149' : '#30363d'}"/>`;
        html += `<text x="${x}" y="204" fill="${isDown ? '#ff7b72' : '#8b949e'}" font-size="9" text-anchor="middle">L${i + 1}</text>`;
      });

      if (explanationText) {
        explanationText.innerHTML = isCableBroken
          ? `<span style="color:#ff7b72;">[Изолиран клон]:</span> Връзката към десния разпределител прекъсна. Неговите подвъзли L3 и L4 губят контакт с главния сървър, но левият клон (L1, L2) остава напълно функциониращ!`
          : `В <strong>Дървовидната топология</strong> има йерархично групиране на комутаторите. Широко се използва в големи училищни и университетски сгради (Campus LAN).`;
      }
    }

    svg.innerHTML = html;
  }

  if (topologySelect) {
    topologySelect.addEventListener('change', () => {
      isCableBroken = false;
      if (statusBadge) {
        statusBadge.style.background = '#238636';
        statusBadge.textContent = 'Мрежата е активна (100%)';
      }
      if (failBtn) {
        failBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Симулирай прекъснат кабел';
      }
      drawTopology();
    });
  }

  if (failBtn) {
    failBtn.addEventListener('click', () => {
      isCableBroken = !isCableBroken;
      if (isCableBroken) {
        failBtn.innerHTML = '<i class="fa-solid fa-rotate-left"></i> Възстанови кабела';
        if (statusBadge) {
          statusBadge.style.background = '#da3633';
          statusBadge.textContent = 'Открит дефект в трасето!';
        }
      } else {
        failBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Симулирай прекъснат кабел';
        if (statusBadge) {
          statusBadge.style.background = '#238636';
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
    'egvt.alle.bg': '212.122.187.42',
    'mon.bg': '193.109.55.12',
    'cloud.google.com': '142.250.187.142',
    'drive.microsoft.com': '13.107.42.12',
    'wikipedia.org': '208.80.154.224'
  };

  if (dnsBtn && dnsInput && dnsTrace) {
    dnsBtn.addEventListener('click', () => {
      const domain = (dnsInput.value || '').trim().toLowerCase();
      const ip = domainIpMap[domain] || '94.23.180.88';

      dnsTrace.innerHTML = `<div style="color: #58a6ff;">[Заявка стартирана] Преобразуване на: ${esc(domain)}...</div>`;
      
      setTimeout(() => {
        dnsTrace.innerHTML += `<div style="color: #8b949e;">1. Проверка в локален кеш (Client Cache) -> Не е намерено</div>`;
      }, 250);

      setTimeout(() => {
        dnsTrace.innerHTML += `<div style="color: #8b949e;">2. Запитване към ISP DNS Resolver (8.8.8.8)...</div>`;
      }, 500);

      setTimeout(() => {
        dnsTrace.innerHTML += `
          <div style="color: #8b949e;">3. Root TLD (.bg) -> Authoritative Nameserver</div>
          <div style="color: #3fb950; font-weight: bold; margin-top: 6px;">
            ✓ УСПЕШЕН ОТГОВОР: ${esc(domain)} -> IPv4 [${ip}]
          </div>
        `;
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
        pwdBar.style.background = '#f85149';
        pwdFeedback.style.color = '#ff7b72';
        pwdFeedback.textContent = 'Сила: Слаба! Разбива се за секунди. Добавете повече символи, главни букви и знаци.';
      } else if (score < 75) {
        pwdBar.style.background = '#d29922';
        pwdFeedback.style.color = '#d29922';
        pwdFeedback.textContent = 'Сила: Средна. Време за разбиване с Brute-force: няколко седмици.';
      } else {
        pwdBar.style.background = '#238636';
        pwdFeedback.style.color = '#3fb950';
        pwdFeedback.textContent = 'Сила: Много добра / Силна парола! Време за разбиване: хиляди години.';
      }
    });
  }

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

      const rowBg = isHighlighted ? 'background: rgba(46, 160, 67, 0.2); border-left: 3px solid #3fb950;' : (i % 2 === 0 ? 'background: #0d1117;' : 'background: #161b22;');
      return `
        <tr style="${rowBg} border-bottom: 1px solid #21262d;">
          <td style="padding: 7px 10px; border: 1px solid #30363d; color: #8b949e; font-family: monospace;">${i + 2}</td>
          <td style="padding: 7px 10px; border: 1px solid #30363d; color: #c9d1d9; font-weight: 600;">${esc(r.name)}</td>
          <td style="padding: 7px 10px; border: 1px solid #30363d; color: #8b949e;">${esc(r.grade)}</td>
          <td style="padding: 7px 10px; border: 1px solid #30363d; color: #8b949e;">${esc(r.spec)}</td>
          <td style="padding: 7px 10px; border: 1px solid #30363d; color: #8b949e; font-family: monospace;">${r.score9.toFixed(2)}</td>
          <td style="padding: 7px 10px; border: 1px solid #30363d; color: ${r.points >= 25 ? '#3fb950' : (r.points < 15 ? '#ff7b72' : '#58a6ff')}; font-weight: bold; font-family: monospace;">${r.points} т.</td>
          <td style="padding: 7px 10px; border: 1px solid #30363d; color: #8b949e;">${esc(r.status)}</td>
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
