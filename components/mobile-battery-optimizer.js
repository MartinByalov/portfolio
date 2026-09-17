// Component: mobile-battery-optimizer
// Interactive battery drain simulator, power tuning workbench, and storage optimizer

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt ancient;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const id = comp.id || 'comp-battery-opt-' + Math.random().toString(36).substr(2, 9);
  const title = comp.title || 'Енергиен баланс и оптимизация на батерията';
  const subtitle = comp.subtitle || 'Експериментирайте с настройките на дисплея, мрежата и сензорите, за да проследите консумацията на ток (mA) и прогнозираните часове автономност.';

  return `
    <div id="${esc(id)}" class="mobile-battery-opt-wrapper" style="margin: 1.5rem 0; background: var(--surface-alt, #f8fafc); border: 1px solid var(--border-color, #e2e8f0); border-radius: 16px; padding: 1.5rem;">
      <div style="margin-bottom: 1.25rem;">
        <h3 style="margin: 0 0 0.4rem 0; font-size: 1.25rem; color: var(--text-color, #1e293b); font-weight: 700;">
          ${esc(title)}
        </h3>
        ${subtitle ? `<p style="margin: 0; font-size: 0.95rem; color: var(--text-muted, #64748b); line-height: 1.5;">${esc(subtitle)}</p>` : ''}
      </div>

      <!-- Main Grid: Controls vs Live Battery Gauge -->
      <div class="battery-main-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; align-items: stretch;">
        
        <!-- Controls Column -->
        <div class="battery-controls-panel" style="background: #ffffff; border: 1px solid var(--border-color, #e2e8f0); border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; height: 100%;">
          
          <!-- Brightness -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
              <span style="font-size: 0.88rem; font-weight: 700; color: #1e293b;"><i class="fas fa-sun" style="color: #f59e0b; margin-right: 0.35rem;"></i>Яркост на дисплея:</span>
              <span id="opt-bright-val" style="font-size: 0.88rem; font-weight: 700; color: #0284c7; font-family: monospace;">70%</span>
            </div>
            <input type="range" id="opt-bright-slider" min="10" max="100" value="70" step="5" style="width: 100%; accent-color: #0284c7; cursor: pointer;">
            <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: #94a3b8; margin-top: 0.15rem;">
              <span>10% (Нощ)</span>
              <span>50% (Стая)</span>
              <span>100% (Слънце)</span>
            </div>
          </div>

          <!-- Refresh Rate -->
          <div>
            <div style="font-size: 0.88rem; font-weight: 700; color: #1e293b; margin-bottom: 0.4rem;">
              <i class="fas fa-film" style="color: #8b5cf6; margin-right: 0.35rem;"></i>Честота на опресняване:
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button type="button" class="opt-hz-btn" data-hz="60" style="flex: 1; padding: 0.45rem; border-radius: 8px; border: 1px solid #cbd5e1; background: #ffffff; color: #334155; font-size: 0.85rem; font-weight: 600; cursor: pointer;">60 Hz (Икономично)</button>
              <button type="button" class="opt-hz-btn active" data-hz="120" style="flex: 1; padding: 0.45rem; border-radius: 8px; border: 1px solid #3b82f6; background: #eff6ff; color: #1d4ed8; font-size: 0.85rem; font-weight: 600; cursor: pointer;">120 Hz (Свръхплавно)</button>
            </div>
          </div>

          <!-- Network Mode -->
          <div>
            <div style="font-size: 0.88rem; font-weight: 700; color: #1e293b; margin-bottom: 0.4rem;">
              <i class="fas fa-tower-cell" style="color: #10b981; margin-right: 0.35rem;"></i>Мрежова връзка:
            </div>
            <select id="opt-net-select" style="width: 100%; padding: 0.5rem; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.85rem; background: #ffffff; color: #334155; cursor: pointer;">
              <option value="wifi">Wi-Fi мрежа (Домашен / Училищен интернет - 30 mA)</option>
              <option value="lte" selected>4G LTE стабилен обхват (60 mA)</option>
              <option value="5g_weak">5G търсене при слаб сигнал в движение (180 mA - силен разход!)</option>
            </select>
          </div>

          <!-- GPS Location Mode -->
          <div>
            <div style="font-size: 0.88rem; font-weight: 700; color: #1e293b; margin-bottom: 0.4rem;">
              <i class="fas fa-location-dot" style="color: #ef4444; margin-right: 0.35rem;"></i>GPS и сателитно позициониране:
            </div>
            <select id="opt-gps-select" style="width: 100%; padding: 0.5rem; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.85rem; background: #ffffff; color: #334155; cursor: pointer;">
              <option value="off">Изключено (0 mA)</option>
              <option value="use" selected>Само при използване на карти (40 mA)</option>
              <option value="bg_high">Непрекъснато фоново 24/7 следене (140 mA!)</option>
            </select>
          </div>

          <!-- Toggles -->
          <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem;">
            <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
              <span style="color: #334155;"><i class="fas fa-clock" style="color: #64748b; margin-right: 0.35rem;"></i>Always-On Display (Часовник на загасен екран)</span>
              <input type="checkbox" id="opt-aod-toggle" checked style="width: 18px; height: 18px; accent-color: #3b82f6;">
            </label>
            <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
              <span style="color: #334155;"><i class="fas fa-rotate" style="color: #64748b; margin-right: 0.35rem;"></i>Фоново опресняване на приложения (Background Refresh)</span>
              <input type="checkbox" id="opt-bg-toggle" checked style="width: 18px; height: 18px; accent-color: #3b82f6;">
            </label>
            <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding-top: 0.4rem; border-top: 1px dashed #e2e8f0;">
              <span style="font-weight: 700; color: #b45309;"><i class="fas fa-leaf" style="color: #16a34a; margin-right: 0.35rem;"></i>Режим за пестене на батерия (Battery Saver)</span>
              <input type="checkbox" id="opt-saver-toggle" style="width: 18px; height: 18px; accent-color: #16a34a;">
            </label>
          </div>

        </div>

        <!-- Live Battery Gauge & Prediction Dashboard -->
        <div class="battery-gauge-panel" style="background: #0f172a; color: #ffffff; border-radius: 12px; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; min-height: 380px; height: 100%; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
          
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <span style="font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: #94a3b8;">Прогноза</span>
              <span style="font-size: 0.75rem; background: #1e293b; padding: 0.2rem 0.6rem; border-radius: 20px; color: #38bdf8; border: 1px solid #334155;">Капацитет: 5000 mAh</span>
            </div>

            <!-- Big Hours Display -->
            <div style="text-align: center; margin: 1.25rem 0;">
              <div id="opt-hours-num" style="font-size: 3.2rem; font-weight: 900; font-family: monospace; color: #38bdf8; line-height: 1;">
                9.5 ч.
              </div>
              <div style="font-size: 0.85rem; color: #94a3b8; margin-top: 0.4rem;">
                непрекъсната активна работа на екрана
              </div>
            </div>

            <!-- Battery Level Visual Bar -->
            <div style="margin-bottom: 1.25rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: #cbd5e1; margin-bottom: 0.35rem;">
                <span>Моментна консумация: <strong id="opt-ma-num" style="color: #f8fafc;">525 mA</strong></span>
                <span id="opt-status-badge" style="font-weight: 700; color: #fbbf24;">Умерена</span>
              </div>
              <div style="background: #1e293b; height: 16px; border-radius: 8px; overflow: hidden; border: 1px solid #334155; padding: 2px;">
                <div id="opt-gauge-bar" style="height: 100%; width: 45%; border-radius: 6px; background: linear-gradient(90deg, #38bdf8, #0284c7); transition: all 0.3s ease;"></div>
              </div>
            </div>

            <!-- Top Consumers Breakdown -->
            <div style="background: #1e293b; border-radius: 8px; padding: 0.85rem; font-size: 0.8rem; color: #cbd5e1; border: 1px solid #334155;">
              <div style="font-weight: 700; color: #f8fafc; margin-bottom: 0.35rem;">
                <i class="fas fa-fire" style="color: #ef4444; margin-right: 0.35rem;"></i>Основни консуматори в момента:
              </div>
              <div id="opt-breakdown-list" style="line-height: 1.5; color: #94a3b8;">
                <!-- Dynamically populated -->
              </div>
            </div>
          </div>

          <!-- Quick Preset Actions -->
          <div style="margin-top: 1.25rem; display: flex; gap: 0.5rem;">
            <button type="button" id="opt-preset-travel" style="flex: 1; padding: 0.55rem; border-radius: 8px; border: 1px solid #16a34a; background: #14532d; color: #bbf7d0; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.35rem; transition: background 0.15s ease;">
              <i class="fas fa-plane"></i>
              <span>Профил „Дълго пътуване“</span>
            </button>
            <button type="button" id="opt-preset-reset" style="padding: 0.55rem 0.85rem; border-radius: 8px; border: 1px solid #475569; background: #1e293b; color: #94a3b8; font-size: 0.82rem; font-weight: 600; cursor: pointer;">
              Нулирай
            </button>
          </div>

        </div>

      </div>
    </div>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id || 'comp-battery-opt');
  if (!root) return;

  const slider = root.querySelector('#opt-bright-slider');
  const brightVal = root.querySelector('#opt-bright-val');
  const hzBtns = root.querySelectorAll('.opt-hz-btn');
  const netSelect = root.querySelector('#opt-net-select');
  const gpsSelect = root.querySelector('#opt-gps-select');
  const aodToggle = root.querySelector('#opt-aod-toggle');
  const bgToggle = root.querySelector('#opt-bg-toggle');
  const saverToggle = root.querySelector('#opt-saver-toggle');

  const hoursNum = root.querySelector('#opt-hours-num');
  const maNum = root.querySelector('#opt-ma-num');
  const statusBadge = root.querySelector('#opt-status-badge');
  const gaugeBar = root.querySelector('#opt-gauge-bar');
  const breakdownList = root.querySelector('#opt-breakdown-list');

  let currentHz = 120;

  function calculatePower() {
    let brightness = parseInt(slider.value, 10);
    brightVal.textContent = `${brightness}%`;

    const isSaver = saverToggle.checked;

    // Base idle current of SoC + motherboard
    let baseMa = 100;

    // Screen power: 10% = 30mA, 100% = 300mA
    let screenMa = Math.round(30 + (brightness / 100) * 270);

    // Refresh rate: 120Hz adds ~80mA, 60Hz adds 0
    let hzMa = currentHz === 120 ? 80 : 0;

    // Network
    let netMa = 60;
    if (netSelect.value === 'wifi') netMa = 30;
    else if (netSelect.value === '5g_weak') netMa = 180;

    // GPS
    let gpsMa = 0;
    if (gpsSelect.value === 'use') gpsMa = 40;
    else if (gpsSelect.value === 'bg_high') gpsMa = 140;

    // AOD
    let aodMa = aodToggle.checked ? 40 : 0;

    // Background refresh
    let bgMa = bgToggle.checked ? 65 : 0;

    let totalMa = baseMa + screenMa + hzMa + netMa + gpsMa + aodMa + bgMa;

    // If battery saver is active, reduce total consumption by 35%
    if (isSaver) {
      totalMa = Math.round(totalMa * 0.65);
    }

    // Battery capacity = 5000 mAh
    const hours = (5000 / totalMa).toFixed(1);

    if (hoursNum) hoursNum.textContent = `${hours} ч.`;
    if (maNum) maNum.textContent = `${totalMa} mA`;

    // Gauge bar width and color
    // Max runtime ~25h, Min ~5h
    const ratio = Math.min(100, Math.max(15, (parseFloat(hours) / 24) * 100));
    if (gaugeBar) {
      gaugeBar.style.width = `${ratio}%`;
      if (hours >= 16) {
        gaugeBar.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
        statusBadge.textContent = 'Отлична автономност';
        statusBadge.style.color = '#34d399';
      } else if (hours >= 10) {
        gaugeBar.style.background = 'linear-gradient(90deg, #0284c7, #38bdf8)';
        statusBadge.textContent = 'Нормален разход';
        statusBadge.style.color = '#38bdf8';
      } else if (hours >= 7) {
        gaugeBar.style.background = 'linear-gradient(90deg, #d97706, #fbbf24)';
        statusBadge.textContent = 'Висок разход';
        statusBadge.style.color = '#fbbf24';
      } else {
        gaugeBar.style.background = 'linear-gradient(90deg, #dc2626, #f87171)';
        statusBadge.textContent = 'Критично бързо изтощаване!';
        statusBadge.style.color = '#f87171';
      }
    }

    if (breakdownList) {
      let topConsumers = [];
      topConsumers.push(`• Дисплей (${brightness}% яркост, ${currentHz}Hz): ~${screenMa + hzMa} mA`);
      if (netSelect.value === '5g_weak') topConsumers.push('• 5G търсене на сигнал в движение: ~180 mA (Много високо!)');
      if (gpsSelect.value === 'bg_high') topConsumers.push('• Постоянна сателитна GPS навигация: ~140 mA');
      if (bgToggle.checked) topConsumers.push('• Фоново опресняване на приложения: ~65 mA');
      if (aodToggle.checked) topConsumers.push('• Always-On Display часовник: ~40 mA');
      if (isSaver) topConsumers.push('• <strong style="color: #4ade80;">Включен режим за пестене: -35% общ разход</strong>');

      breakdownList.innerHTML = topConsumers.slice(0, 4).join('<br>');
    }
  }

  // Event Listeners
  if (slider) slider.addEventListener('input', calculatePower);

  hzBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      hzBtns.forEach(b => {
        b.style.borderColor = '#cbd5e1';
        b.style.background = '#ffffff';
        b.style.color = '#334155';
      });
      btn.style.borderColor = '#3b82f6';
      btn.style.background = '#eff6ff';
      btn.style.color = '#1d4ed8';

      currentHz = parseInt(btn.getAttribute('data-hz'), 10);
      calculatePower();
    });
  });

  if (netSelect) netSelect.addEventListener('change', calculatePower);
  if (gpsSelect) gpsSelect.addEventListener('change', calculatePower);
  if (aodToggle) aodToggle.addEventListener('change', calculatePower);
  if (bgToggle) bgToggle.addEventListener('change', calculatePower);
  if (saverToggle) saverToggle.addEventListener('change', calculatePower);

  // Preset travel
  const travelBtn = root.querySelector('#opt-preset-travel');
  if (travelBtn) {
    travelBtn.addEventListener('click', () => {
      slider.value = 35;
      currentHz = 60;
      hzBtns.forEach(b => {
        const is60 = b.getAttribute('data-hz') === '60';
        b.style.borderColor = is60 ? '#3b82f6' : '#cbd5e1';
        b.style.background = is60 ? '#eff6ff' : '#ffffff';
        b.style.color = is60 ? '#1d4ed8' : '#334155';
      });
      netSelect.value = 'wifi';
      gpsSelect.value = 'off';
      aodToggle.checked = false;
      bgToggle.checked = false;
      saverToggle.checked = true;
      calculatePower();
    });
  }

  // Reset
  const resetBtn = root.querySelector('#opt-preset-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      slider.value = 70;
      currentHz = 120;
      hzBtns.forEach(b => {
        const is120 = b.getAttribute('data-hz') === '120';
        b.style.borderColor = is120 ? '#3b82f6' : '#cbd5e1';
        b.style.background = is120 ? '#eff6ff' : '#ffffff';
        b.style.color = is120 ? '#1d4ed8' : '#334155';
      });
      netSelect.value = 'lte';
      gpsSelect.value = 'use';
      aodToggle.checked = true;
      bgToggle.checked = true;
      saverToggle.checked = false;
      calculatePower();
    });
  }

  calculatePower();
}
