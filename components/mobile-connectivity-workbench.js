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
    { id: 'nfc', name: 'NFC', icon: 'fas fa-id-card', color: '#ec4899', range: 'до 4 см', speed: '424 kbps', power: 'Минимална', use: 'Безконтактни плащания (Google/Apple Pay), бързо сдвояване, карти.' },
    { id: 'bt', name: 'Bluetooth 5.x', icon: 'fab fa-bluetooth-b', color: '#3b82f6', range: '10 – 100 м', speed: '2 – 3 Mbps', power: 'Много ниска', use: 'Слушалки, смарт часовници, фитнес гривни и периферия.' },
    { id: 'wifi', name: 'Wi-Fi 6', icon: 'fas fa-wifi', color: '#8b5cf6', range: '30 – 100 м', speed: 'до 9.6 Gbps', power: 'Средна', use: 'Домашни и училищни мрежи, бърз интернет, 4K/8K видео в сгради.' },
    { id: 'cell', name: '5G Мрежа', icon: 'fas fa-tower-cell', color: '#10b981', range: '1 – 10+ км', speed: 'до 10 Gbps', power: 'Динамична', use: 'Глобална мобилност навсякъде, HD видеоразговори и IoT.' }
  ];

  return `
    <div id="${esc(id)}" class="mobile-connectivity-workbench-wrapper" style="margin: 1.5rem 0; background: var(--surface-alt, #f8fafc); border: 1px solid var(--border-color, #e2e8f0); border-radius: 16px; padding: 1.5rem;">
      ${(title || subtitle) ? `
        <div style="margin-bottom: 1.25rem;">
          ${title ? `<h3 style="margin: 0 0 0.4rem 0; font-size: 1.25rem; color: var(--text-color, #1e293b); font-weight: 700;">${esc(title)}</h3>` : ''}
          ${subtitle ? `<p style="margin: 0; font-size: 0.95rem; color: var(--text-muted, #64748b); line-height: 1.5;">${esc(subtitle)}</p>` : ''}
        </div>
      ` : ''}

      <!-- Part 1: Cellular Handover Simulator Stage (Dark OS CLI Window style) -->
      <div class="os-cli-window" style="background: #0f172a; border-radius: 12px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.25); margin-bottom: 1.25rem;">
        <div class="os-window-titlebar dark" style="display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1rem; background: #1e293b; color: #f1f5f9; border-bottom: 1px solid #334155;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="os-win-dots" style="display: flex; gap: 6px;">
              <span class="win-dot red" style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444; display: inline-block;"></span>
              <span class="win-dot yellow" style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b; display: inline-block;"></span>
              <span class="win-dot green" style="width: 10px; height: 10px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
            </div>
            <div class="os-win-title" style="font-size: 0.82rem; font-family: monospace; letter-spacing: 0.05em; color: #94a3b8; font-weight: 600;">
              КЛЕТЪЧЕН HANDOVER
            </div>
          </div>
          <span id="${esc(id)}-handover-status" style="font-size: 0.78rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 6px; background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);">
            Свързан към: Клетка А
          </span>
        </div>

        <div style="padding: 1.25rem;">
          <!-- Cells Visual Map -->
          <div style="position: relative; height: 160px; background: #1e293b; border-radius: 10px; border: 1px solid #334155; overflow: hidden; display: flex; align-items: center; justify-content: space-around; padding: 0 20px;">
            <!-- Tower A -->
            <div id="${esc(id)}-tower-a" style="display: flex; flex-direction: column; align-items: center; z-index: 2; transition: all 0.3s ease;">
              <div style="width: 44px; height: 44px; border-radius: 50%; background: #3b82f6; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 1.2rem; box-shadow: 0 0 20px rgba(59,130,246,0.6); transition: all 0.3s ease;">
                <i class="fas fa-tower-cell"></i>
              </div>
              <span style="color: #f8fafc; font-size: 0.75rem; font-weight: 700; margin-top: 0.3rem;">Клетка А</span>
              <span id="${esc(id)}-signal-a" style="color: #60a5fa; font-size: 0.7rem; font-family: monospace; font-weight: 700;">-65 dBm (95%)</span>
            </div>

            <!-- Handover Midpoint Marker -->
            <div style="position: absolute; top: 15px; bottom: 35px; left: 50%; width: 1px; border-left: 1px dashed rgba(148, 163, 184, 0.35); display: flex; flex-direction: column; align-items: center; justify-content: flex-start; z-index: 1;">
              <span style="font-size: 0.65rem; color: #94a3b8; font-family: monospace; background: #0f172a; padding: 0.1rem 0.35rem; border-radius: 4px; border: 1px solid #334155; white-space: nowrap;">
                Handover праг (-85 dBm)
              </span>
            </div>

            <!-- Tower B -->
            <div id="${esc(id)}-tower-b" style="display: flex; flex-direction: column; align-items: center; z-index: 2; transition: all 0.3s ease;">
              <div style="width: 44px; height: 44px; border-radius: 50%; background: #475569; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 1.2rem; transition: all 0.3s ease;">
                <i class="fas fa-tower-cell"></i>
              </div>
              <span style="color: #94a3b8; font-size: 0.75rem; font-weight: 700; margin-top: 0.3rem;">Клетка Б</span>
              <span id="${esc(id)}-signal-b" style="color: #94a3b8; font-size: 0.7rem; font-family: monospace; font-weight: 700;">-105 dBm (10%)</span>
            </div>

            <!-- Road Track & Moving Car/Phone -->
            <div style="position: absolute; bottom: 20px; left: 40px; right: 40px; height: 6px; background: #334155; border-radius: 3px; z-index: 1;">
              <div id="${esc(id)}-moving-car" style="position: absolute; top: -14px; left: 10%; width: 34px; height: 34px; border-radius: 50%; background: #f59e0b; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 0.95rem; box-shadow: 0 0 15px #f59e0b; transition: left 0.1s linear; transform: translateX(-50%);">
                <i class="fas fa-car"></i>
              </div>
            </div>
          </div>

          <!-- Position Control & Status -->
          <div style="margin-top: 1rem; background: rgba(30, 41, 59, 0.7); border: 1px solid #334155; border-radius: 10px; padding: 0.85rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.45rem;">
              <span style="font-size: 0.82rem; font-weight: 600; color: #94a3b8;">Позиция на автомобила по пътя:</span>
              <span id="${esc(id)}-pos-label" style="color: #38bdf8; font-family: monospace; font-weight: 700; font-size: 0.82rem; background: rgba(56, 189, 248, 0.1); padding: 0.15rem 0.5rem; border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.25);">
                1.0 km (Зона на Кула А)
              </span>
            </div>
            <input type="range" id="${esc(id)}-car-slider" min="0" max="100" value="10" style="width: 100%; cursor: pointer; margin-bottom: 0.65rem;">
            
            <div style="display: flex; gap: 0.5rem;">
              <button type="button" id="${esc(id)}-btn-drive" style="flex: 1; padding: 0.55rem 0.75rem; border-radius: 8px; border: 1.5px solid #ea580c; background: #f97316; color: #ffffff; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(249, 115, 22, 0.35);">
                <i class="fas fa-play" id="${esc(id)}-btn-drive-icon"></i>
                <span id="${esc(id)}-btn-drive-text">Автоматично движение</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Part 2: Wireless Standards Comparator (2x2 Grid with SoC Palette) -->
      <div class="os-gui-window" style="background: #ffffff; border-radius: 12px; border: 1px solid var(--border-color, #e2e8f0); overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);">
        <div class="os-window-titlebar light" style="display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1rem; background: #f1f5f9; color: #334155; border-bottom: 1px solid #e2e8f0;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="os-win-dots" style="display: flex; gap: 6px;">
              <span class="win-dot" style="width: 10px; height: 10px; border-radius: 50%; background: #cbd5e1; display: inline-block;"></span>
              <span class="win-dot" style="width: 10px; height: 10px; border-radius: 50%; background: #cbd5e1; display: inline-block;"></span>
              <span class="win-dot" style="width: 10px; height: 10px; border-radius: 50%; background: #cbd5e1; display: inline-block;"></span>
            </div>
            <div class="os-win-title" style="font-size: 0.82rem; font-weight: 600; color: #475569;">
              Сравнение на безжичните технологии за свързаност
            </div>
          </div>
        </div>

        <div style="padding: 1.25rem;">
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.85rem;">
            ${techComparison.map(t => `
              <div style="background: var(--surface-alt, #f8fafc); border-radius: 10px; border: 1px solid var(--border-color, #e2e8f0); padding: 1rem; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.2s ease;">
                <div>
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.45rem;">
                    <span style="font-size: 0.95rem; font-weight: 700; color: var(--text-color, #1e293b);">${esc(t.name)}</span>
                  </div>
                  <div style="font-size: 0.78rem; color: var(--text-muted, #64748b); margin-bottom: 0.3rem;">
                    <strong>Обхват:</strong> <span style="color: #2563eb; font-weight: 600;">${esc(t.range)}</span> · <strong>Скорост:</strong> <span style="color: #059669; font-weight: 600;">${esc(t.speed)}</span>
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
  const btnDrive = root.querySelector(`[id$="-btn-drive"]`);
  const btnDriveText = root.querySelector(`[id$="-btn-drive-text"]`);
  const btnDriveIcon = root.querySelector(`[id$="-btn-drive-icon"]`);

  let driveTimer = null;

  function updatePosition(pos) {
    if (carEl) carEl.style.left = `${pos}%`;

    // Calculate signals (Tower A at 15%, Tower B at 85%)
    const distA = Math.abs(pos - 15);
    const distB = Math.abs(pos - 85);

    const strengthA = Math.max(5, Math.min(99, Math.round(100 - distA * 1.3)));
    const strengthB = Math.max(5, Math.min(99, Math.round(100 - distB * 1.3)));

    if (sigA) sigA.textContent = `-${Math.round(52 + distA * 0.7)} dBm (${strengthA}%)`;
    if (sigB) sigB.textContent = `-${Math.round(52 + distB * 0.7)} dBm (${strengthB}%)`;

    const iconBoxA = towerA ? towerA.querySelector('div') : null;
    const iconBoxB = towerB ? towerB.querySelector('div') : null;

    const kmPos = (pos / 10).toFixed(1);

    if (pos < 50) {
      // Connected to A
      if (statusEl) {
        statusEl.textContent = 'Клетка А (Активна)';
        statusEl.style.background = 'rgba(16, 185, 129, 0.2)';
        statusEl.style.color = '#34d399';
        statusEl.style.borderColor = 'rgba(16, 185, 129, 0.3)';
      }
      if (posLabel) posLabel.textContent = `${kmPos} km (Обслужва: Кула А)`;
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
        statusEl.textContent = 'HANDOVER: Клетка Б';
        statusEl.style.background = 'rgba(59, 130, 246, 0.25)';
        statusEl.style.color = '#60a5fa';
        statusEl.style.borderColor = 'rgba(59, 130, 246, 0.4)';
      }
      if (posLabel) posLabel.textContent = `${kmPos} km (Handover: Кула Б)`;
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
  }

  if (slider) {
    slider.addEventListener('input', (e) => {
      const pos = parseInt(e.target.value, 10);
      updatePosition(pos);
    });
  }

  if (btnDrive) {
    btnDrive.addEventListener('click', () => {
      if (driveTimer) {
        clearInterval(driveTimer);
        driveTimer = null;
        if (btnDriveText) btnDriveText.textContent = 'Автоматично движение';
        if (btnDriveIcon) btnDriveIcon.className = 'fas fa-play';
        return;
      }

      if (btnDriveText) btnDriveText.textContent = 'Спри движението';
      if (btnDriveIcon) btnDriveIcon.className = 'fas fa-pause';

      let currentPos = slider ? parseInt(slider.value, 10) : 10;
      let forward = true;

      driveTimer = setInterval(() => {
        if (forward) {
          currentPos += 2;
          if (currentPos >= 90) forward = false;
        } else {
          currentPos -= 2;
          if (currentPos <= 10) forward = true;
        }

        if (slider) slider.value = currentPos;
        updatePosition(currentPos);
      }, 70);
    });
  }

  // Initial call
  updatePosition(10);
}
