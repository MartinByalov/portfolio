// Component: mobile-connectivity-workbench
// Interactive simulation of cellular base station handover and wireless connectivity standards

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const id = comp.id || 'comp-mobile-conn-' + Math.random().toString(36).substr(2, 9);
  const title = comp.title || '';
  const subtitle = comp.subtitle || '';

  const techComparison = [
    { id: 'nfc', name: 'NFC', icon: 'fas fa-id-card', range: 'до 4 см', speed: '424 kbps', power: 'Минимална', use: 'Безконтактни плащания (Google/Apple Pay), бързо докосване за сдвояване, електронни билети.' },
    { id: 'bt', name: 'Bluetooth 5.x', icon: 'fab fa-bluetooth-b', range: '10 – 100 м', speed: '2 – 3 Mbps (BLE)', power: 'Много ниска', use: 'Безжични слушалки, смарт часовници, гривни, клавиатури, мишки и локален трансфер.' },
    { id: 'wifi', name: 'Wi-Fi 6 (802.11ax)', icon: 'fas fa-wifi', range: '30 – 100 м', speed: 'до 9.6 Gbps', power: 'Средна', use: 'Домашни и училищни локални мрежи, бърз интернет, поточно 4K/8K видео в сгради.' },
    { id: 'cell', name: '5G Клетъчна мрежа', icon: 'fas fa-tower-cell', range: '1 – 10+ км', speed: 'до 10 Gbps', power: 'Динамична', use: 'Глобална мобилност навсякъде, HD видеоразговори в движение, свързване на автономни коли и IoT.' }
  ];

  return `
    <div id="${esc(id)}" class="mobile-connectivity-workbench-wrapper" style="margin: 1.5rem 0; background: var(--surface-alt, #f8fafc); border: 1px solid var(--border-color, #e2e8f0); border-radius: 16px; padding: 1.5rem;">
      ${(title || subtitle) ? `
        <div style="margin-bottom: 1.25rem;">
          ${title ? `<h3 style="margin: 0 0 0.4rem 0; font-size: 1.25rem; color: var(--text-color, #1e293b); font-weight: 700;">${esc(title)}</h3>` : ''}
          ${subtitle ? `<p style="margin: 0; font-size: 0.95rem; color: var(--text-muted, #64748b); line-height: 1.5;">${esc(subtitle)}</p>` : ''}
        </div>
      ` : ''}

      <!-- Part 1: Cellular Handover Simulator Stage (Styled after SoC Sandbox OS Window) -->
      <div class="os-cli-window" style="background: #0f172a; border-radius: 12px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.25); margin-bottom: 1.5rem;">
        <div class="os-window-titlebar dark" style="display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1rem; background: #1e293b; color: #f1f5f9; border-bottom: 1px solid #334155;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="os-win-dots" style="display: flex; gap: 6px;">
              <span class="win-dot red" style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444; display: inline-block;"></span>
              <span class="win-dot yellow" style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b; display: inline-block;"></span>
              <span class="win-dot green" style="width: 10px; height: 10px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
            </div>
            <div class="os-win-title" style="font-size: 0.82rem; font-family: monospace; letter-spacing: 0.05em; color: #94a3b8; font-weight: 600;">
              <i class="fas fa-tower-broadcast" style="color: #38bdf8; margin-right: 0.35rem;"></i> Превключване между клетки (Handover)
            </div>
          </div>
          <span id="${esc(id)}-handover-status" style="font-size: 0.78rem; padding: 0.2rem 0.6rem; border-radius: 6px; background: rgba(16, 185, 129, 0.2); color: #34d399; font-weight: 700; border: 1px solid rgba(16, 185, 129, 0.3);">
            Свързан към: Клетка А
          </span>
        </div>

        <div style="padding: 1.25rem;">
          <!-- Cells Visual Map -->
          <div style="position: relative; height: 160px; background: #1e293b; border-radius: 10px; border: 1px solid #334155; overflow: hidden; display: flex; align-items: center; justify-content: space-around; padding: 0 20px;">
            <!-- Tower A -->
            <div id="${esc(id)}-tower-a" style="display: flex; flex-direction: column; align-items: center; z-index: 2; transition: all 0.3s ease;">
              <div style="width: 44px; height: 44px; border-radius: 50%; background: #3b82f6; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 1.2rem; box-shadow: 0 0 20px rgba(59,130,246,0.6);">
                <i class="fas fa-tower-cell"></i>
              </div>
              <span style="color: #94a3b8; font-size: 0.75rem; font-weight: 700; margin-top: 0.3rem;">Клетка А</span>
              <span id="${esc(id)}-signal-a" style="color: #60a5fa; font-size: 0.7rem; font-family: monospace;">-65 dBm (95%)</span>
            </div>

            <!-- Tower B -->
            <div id="${esc(id)}-tower-b" style="display: flex; flex-direction: column; align-items: center; z-index: 2; transition: all 0.3s ease;">
              <div style="width: 44px; height: 44px; border-radius: 50%; background: #475569; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 1.2rem; transition: all 0.3s ease;">
                <i class="fas fa-tower-cell"></i>
              </div>
              <span style="color: #94a3b8; font-size: 0.75rem; font-weight: 700; margin-top: 0.3rem;">Клетка Б</span>
              <span id="${esc(id)}-signal-b" style="color: #94a3b8; font-size: 0.7rem; font-family: monospace;">-105 dBm (10%)</span>
            </div>

            <!-- Road Track & Moving Phone/Car -->
            <div style="position: absolute; bottom: 20px; left: 40px; right: 40px; height: 6px; background: #334155; border-radius: 3px; z-index: 1;">
              <div id="${esc(id)}-moving-car" style="position: absolute; top: -14px; left: 10%; width: 34px; height: 34px; border-radius: 50%; background: #f59e0b; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 0.95rem; box-shadow: 0 0 15px #f59e0b; transition: left 0.1s linear; transform: translateX(-50%);">
                <i class="fas fa-mobile-screen"></i>
              </div>
            </div>
          </div>

          <!-- Slider Track Controller -->
          <div style="margin-top: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.45rem;">
              <span style="font-size: 0.82rem; font-weight: 600; color: #94a3b8;">Позиция на потребителя по пътя:</span>
              <span id="${esc(id)}-pos-label" style="color: #38bdf8; font-family: monospace; font-weight: 700; font-size: 0.82rem; background: rgba(56, 189, 248, 0.1); padding: 0.15rem 0.5rem; border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.25);">10% (Зона А)</span>
            </div>
            <input type="range" id="${esc(id)}-car-slider" min="0" max="100" value="10" style="width: 100%; cursor: pointer;">
          </div>
        </div>
      </div>

      <!-- Part 2: Wireless Standards Interactive Comparator (2x2 Grid) -->
      <div class="os-gui-window" style="background: #ffffff; border-radius: 12px; border: 1px solid var(--border-color, #e2e8f0); overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);">
        <div class="os-window-titlebar light" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 1rem; background: #f1f5f9; color: #334155; border-bottom: 1px solid #e2e8f0;">
          <div class="os-win-dots" style="display: flex; gap: 6px;">
            <span class="win-dot" style="width: 10px; height: 10px; border-radius: 50%; background: #cbd5e1; display: inline-block;"></span>
            <span class="win-dot" style="width: 10px; height: 10px; border-radius: 50%; background: #cbd5e1; display: inline-block;"></span>
            <span class="win-dot" style="width: 10px; height: 10px; border-radius: 50%; background: #cbd5e1; display: inline-block;"></span>
          </div>
          <div class="os-win-title" style="font-size: 0.82rem; font-weight: 600; color: #475569;">
            Сравнение на безжичните технологии за свързаност
          </div>
        </div>

        <div style="padding: 1.25rem;">
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.85rem;">
            ${techComparison.map(t => `
              <div style="background: var(--surface-alt, #f8fafc); border-radius: 10px; border: 1px solid var(--border-color, #e2e8f0); padding: 1rem; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.2s ease;">
                <div>
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="font-size: 0.95rem; font-weight: 700; color: var(--text-color, #1e293b);">${esc(t.name)}</span>
                    <span style="width: 28px; height: 28px; border-radius: 6px; background: #eff6ff; color: var(--accent-blue, #3b82f6); display: flex; align-items: center; justify-content: center; font-size: 0.85rem;">
                      <i class="${t.icon}"></i>
                    </span>
                  </div>
                  <div style="font-size: 0.8rem; color: var(--text-muted, #64748b); margin-bottom: 0.35rem;">
                    <strong>Обхват:</strong> <span style="color: var(--accent-blue, #3b82f6); font-weight: 600;">${esc(t.range)}</span> · <strong>Скорост:</strong> ${esc(t.speed)}
                  </div>
                  <p style="font-size: 0.82rem; color: var(--text-color, #334155); line-height: 1.45; margin: 0 0 0.5rem 0;">
                    ${esc(t.use)}
                  </p>
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted, #64748b); padding-top: 0.4rem; border-top: 1px dashed var(--border-color, #e2e8f0);">
                  Консумация на ток: <strong>${esc(t.power)}</strong>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id);
  if (!root) return;

  const slider = root.querySelector(`[id$="-car-slider"]`);
  const carEl = root.querySelector(`[id$="-moving-car"]`);
  const towerA = root.querySelector(`[id$="-tower-a"]`);
  const towerB = root.querySelector(`[id$="-tower-b"]`);
  const sigA = root.querySelector(`[id$="-signal-a"]`);
  const sigB = root.querySelector(`[id$="-signal-b"]`);
  const statusEl = root.querySelector(`[id$="-handover-status"]`);
  const posLabel = root.querySelector(`[id$="-pos-label"]`);

  if (!slider) return;

  slider.addEventListener('input', (e) => {
    const pos = parseInt(e.target.value, 10);
    if (carEl) carEl.style.left = `${pos}%`;

    // Calculate signals
    // Tower A is at pos 20, Tower B is at pos 80
    const distA = Math.abs(pos - 20);
    const distB = Math.abs(pos - 80);

    const strengthA = Math.max(5, Math.round(100 - distA * 1.5));
    const strengthB = Math.max(5, Math.round(100 - distB * 1.5));

    if (sigA) sigA.textContent = `-${Math.round(50 + distA)} dBm (${strengthA}%)`;
    if (sigB) sigB.textContent = `-${Math.round(50 + distB)} dBm (${strengthB}%)`;

    const iconBoxA = towerA ? towerA.querySelector('div') : null;
    const iconBoxB = towerB ? towerB.querySelector('div') : null;

    if (pos < 50) {
      // Connected to A
      if (statusEl) {
        statusEl.textContent = 'Свързан към: Клетка А (Силен сигнал)';
        statusEl.style.background = 'rgba(16, 185, 129, 0.2)';
        statusEl.style.color = '#34d399';
      }
      if (posLabel) posLabel.textContent = `${pos}% (Обслужваща станция: Кула А)`;
      if (iconBoxA) {
        iconBoxA.style.background = '#3b82f6';
        iconBoxA.style.color = '#ffffff';
        iconBoxA.style.boxShadow = '0 0 20px rgba(59,130,246,0.6)';
      }
      if (iconBoxB) {
        iconBoxB.style.background = '#475569';
        iconBoxB.style.color = '#94a3b8';
        iconBoxB.style.boxShadow = 'none';
      }
    } else {
      // Connected to B (Handover executed)
      if (statusEl) {
        statusEl.textContent = 'HANDOVER: Прехвърлен към Клетка Б!';
        statusEl.style.background = 'rgba(59, 130, 246, 0.25)';
        statusEl.style.color = '#60a5fa';
      }
      if (posLabel) posLabel.textContent = `${pos}% (Handover активен: Кула Б)`;
      if (iconBoxB) {
        iconBoxB.style.background = '#10b981';
        iconBoxB.style.color = '#ffffff';
        iconBoxB.style.boxShadow = '0 0 20px rgba(16,185,129,0.6)';
      }
      if (iconBoxA) {
        iconBoxA.style.background = '#475569';
        iconBoxA.style.color = '#94a3b8';
        iconBoxA.style.boxShadow = 'none';
      }
    }
  });
}
