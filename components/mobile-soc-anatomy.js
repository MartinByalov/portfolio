// Component: mobile-soc-anatomy
// Explores the System-on-a-Chip (SoC) microarchitecture and dynamic workload distribution

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const id = comp.id || 'comp-mobile-soc-' + Math.random().toString(36).substr(2, 9);
  const title = comp.title || '';
  const subtitle = comp.subtitle || '';

  const blocks = [
    { id: 'cpu', name: 'CPU (Централен процесор)', short: 'CPU', desc: 'Многоядрен процесор с архитектура big.LITTLE (високопроизводителни ядра за тежки задачи и енергоефективни ядра за фонова работа).', icon: 'fas fa-microchip', color: '#3b82f6' },
    { id: 'gpu', name: 'GPU (Графичен ускорител)', short: 'GPU', desc: 'Рендерира 3D графики за мобилни игри, анимации на потребителския интерфейс и обработва видео съдържание с висока честота на опресняване.', icon: 'fas fa-gamepad', color: '#8b5cf6' },
    { id: 'npu', name: 'NPU / AI Engine (Невронен процесор)', short: 'NPU / AI', desc: 'Специализиран хардуерен блок за невронни мрежи, машинно самообучение, разпознаване на лица, гласова обработка и изчислителна фотография в реално време.', icon: 'fas fa-brain', color: '#ec4899' },
    { id: 'isp', name: 'ISP (Процесор за изображения)', short: 'ISP Камера', desc: 'Обработва суровия оптичен сигнал от сензорите на камерата: премахва шум, коригира цветовете (HDR), фокусира и стабилизира кадрите със светкавична скорост.', icon: 'fas fa-camera', color: '#f59e0b' },
    { id: 'modem', name: '5G / 4G Клетъчен модем', short: '5G Модем', desc: 'Преобразува цифровите данни в радиосигнали и обратно, поддържайки високоскоростна връзка с клетъчните кули и сателитите за навигация (GPS).', icon: 'fas fa-tower-cell', color: '#10b981' },
    { id: 'ram', name: 'LPDDR RAM & Памет контролер', short: 'LPDDR RAM', desc: 'Свръхбърза оперативна памет с ниска консумация на напрежение (Low Power DDR), разположена директно върху или до кристала за максимална пропускателна способност.', icon: 'fas fa-memory', color: '#06b6d4' },
    { id: 'security', name: 'Secure Enclave (Защитен чип)', short: 'Сигурност', desc: 'Изолиран криптографски модул за съхранение на биометрични данни (пръстови отпечатъци, Face ID) и ключове за криптиране, недостъпен дори за операционната система.', icon: 'fas fa-shield-halved', color: '#64748b' },
    { id: 'pmu', name: 'PMU (Контролер на захранването)', short: 'PMU Енергия', desc: 'Динамично регулира напрежението и тактовата честота на всеки блок милиони пъти в секунда за удължаване на живота на батерията.', icon: 'fas fa-bolt', color: '#eab308' }
  ];

  const modes = [
    { id: 'photo', name: 'Нощна AI снимка', icon: 'fas fa-camera-retro', activeBlocks: ['isp', 'npu', 'cpu', 'ram', 'pmu'], energy: 'Средна', load: 'ISP 95%, NPU 90%, CPU 40%' },
    { id: 'gaming', name: '3D Игра (60+ FPS)', icon: 'fas fa-gamepad', activeBlocks: ['gpu', 'cpu', 'ram', 'pmu'], energy: 'Висока', load: 'GPU 98%, CPU 85%, RAM 75%' },
    { id: 'call', name: '5G Видеоразговор', icon: 'fas fa-video', activeBlocks: ['modem', 'isp', 'gpu', 'cpu', 'ram'], energy: 'Умерена', load: 'Modem 70%, ISP 60%, CPU 50%' },
    { id: 'idle', name: 'Покой', icon: 'fas fa-moon', activeBlocks: ['pmu', 'security'], energy: 'Минимална', load: 'PMU 5%, Малки ядра CPU 3%' }
  ];

  return `
    <div id="${esc(id)}" class="mobile-soc-anatomy-wrapper" style="margin: 1.5rem 0; background: var(--surface-alt, #f8fafc); border: 1px solid var(--border-color, #e2e8f0); border-radius: 16px; padding: 1.5rem;">
      ${(title || subtitle) ? `
        <div style="margin-bottom: 1.25rem;">
          ${title ? `<h3 style="margin: 0 0 0.4rem 0; font-size: 1.25rem; color: var(--text-color, #1e293b); font-weight: 700;">${esc(title)}</h3>` : ''}
          ${subtitle ? `<p style="margin: 0; font-size: 0.95rem; color: var(--text-muted, #64748b); line-height: 1.5;">${esc(subtitle)}</p>` : ''}
        </div>
      ` : ''}

      <!-- Mode Selector -->
      <div style="margin-bottom: 1.5rem;">
        <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted, #64748b); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
          Симулирай сценарий на натоварване:
        </div>
        <div class="soc-mode-tabs" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem;">
          ${modes.map((m, idx) => `
            <button type="button" class="soc-mode-btn ${idx === 0 ? 'active' : ''}" data-mode="${m.id}" style="padding: 0.55rem 0.5rem; border-radius: 10px; border: 1.5px solid ${idx === 0 ? 'var(--accent-blue, #3b82f6)' : 'var(--border-color, #e2e8f0)'}; background: ${idx === 0 ? '#eff6ff' : '#ffffff'}; color: ${idx === 0 ? '#1d4ed8' : 'var(--text-color, #1e293b)'}; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.45rem; transition: all 0.2s ease; white-space: nowrap;">
              <i class="${m.icon}"></i>
              <span>${esc(m.name)}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; align-items: start;">
        <!-- Left: SoC Silicon Chip Window (Theme styled after Sandbox Dual Windows) -->
        <div class="os-cli-window" style="background: #0f172a; border-radius: 12px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.25);">
          <div class="os-window-titlebar dark" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 1rem; background: #1e293b; color: #f1f5f9; border-bottom: 1px solid #334155;">
            <div class="os-win-dots" style="display: flex; gap: 6px;">
              <span class="win-dot red" style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444; display: inline-block;"></span>
              <span class="win-dot yellow" style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b; display: inline-block;"></span>
              <span class="win-dot green" style="width: 10px; height: 10px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
            </div>
            <div class="os-win-title" style="font-size: 0.82rem; font-family: monospace; letter-spacing: 0.05em; color: #94a3b8; font-weight: 600;">
              <i class="fas fa-microchip" style="color: #38bdf8; margin-right: 0.35rem;"></i> SYSTEM ON A CHIP (SoC) · 4nm
            </div>
          </div>

          <div style="padding: 1.15rem 1rem;">
            <div class="soc-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem;">
              ${blocks.map(b => {
                const isActive = modes[0].activeBlocks.includes(b.id);
                return `
                <div class="soc-chip-block ${isActive ? 'active' : ''}" data-block="${b.id}" style="background: ${isActive ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.8)'}; border: 1.5px solid ${isActive ? b.color : '#334155'}; border-radius: 10px; padding: 0.65rem 0.75rem; min-height: 68px; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; transition: all 0.25s ease; position: relative; box-sizing: border-box;">
                  <div style="display: flex; align-items: center; gap: 0.45rem; min-width: 0;">
                    <span style="display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background: ${b.color}22; color: ${b.color}; font-size: 0.85rem; flex-shrink: 0;">
                      <i class="${b.icon}"></i>
                    </span>
                    <span style="color: #f8fafc; font-weight: 700; font-size: 0.82rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2;">${esc(b.short)}</span>
                  </div>
                  <div class="soc-pulse-indicator" style="visibility: ${isActive ? 'visible' : 'hidden'}; height: 16px; font-size: 0.72rem; color: ${b.color}; font-weight: 600; display: flex; align-items: center; gap: 0.25rem; margin-top: 4px;">
                    <i class="fas fa-bolt" style="font-size: 0.68rem;"></i> Активен
                  </div>
                </div>
              `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Right: Block Information & Real-time Telemetry Window -->
        <div class="os-gui-window" style="background: #ffffff; border-radius: 12px; border: 1px solid var(--border-color, #e2e8f0); overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);">
          <div class="os-window-titlebar light" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 1rem; background: #f1f5f9; color: #334155; border-bottom: 1px solid #e2e8f0;">
            <div class="os-win-dots" style="display: flex; gap: 6px;">
              <span class="win-dot" style="width: 10px; height: 10px; border-radius: 50%; background: #cbd5e1; display: inline-block;"></span>
              <span class="win-dot" style="width: 10px; height: 10px; border-radius: 50%; background: #cbd5e1; display: inline-block;"></span>
              <span class="win-dot" style="width: 10px; height: 10px; border-radius: 50%; background: #cbd5e1; display: inline-block;"></span>
            </div>
            <div class="os-win-title" style="font-size: 0.82rem; font-weight: 600; color: #475569;">
              <i class="fas fa-circle-info" style="color: #3b82f6; margin-right: 0.35rem;"></i> Инспекция на компонента
            </div>
          </div>

          <div style="padding: 1.25rem; display: flex; flex-direction: column; flex-grow: 1;">
            <div id="${esc(id)}-detail-title" style="font-size: 1.15rem; font-weight: 700; color: var(--text-color, #1e293b); margin-bottom: 0.5rem;">
              ${esc(blocks[0].name)}
            </div>
            <p id="${esc(id)}-detail-desc" style="font-size: 0.95rem; color: var(--text-color, #334155); line-height: 1.6; margin: 0 0 1rem 0; flex-grow: 1;">
              ${esc(blocks[0].desc)}
            </p>

            <!-- Energy Consumption displayed before system load -->
            <div style="background: var(--surface-alt, #f8fafc); border-radius: 10px; padding: 0.75rem 0.85rem; border: 1px solid var(--border-color, #e2e8f0); margin-bottom: 0.65rem;">
              <div style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted, #64748b); margin-bottom: 0.25rem;">
                Енергийна консумация:
              </div>
              <div id="${esc(id)}-energy-badge" style="font-size: 0.9rem; font-weight: 700; color: #2563eb; display: inline-flex; align-items: center; gap: 0.35rem;">
                <i class="fas fa-bolt" style="color: #eab308;"></i> Консумация: ${modes[0].energy}
              </div>
            </div>

            <!-- Current System Load -->
            <div style="background: var(--surface-alt, #f8fafc); border-radius: 10px; padding: 0.75rem 0.85rem; border: 1px solid var(--border-color, #e2e8f0);">
              <div style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted, #64748b); margin-bottom: 0.25rem;">
                Текущо натоварване на системата:
              </div>
              <div id="${esc(id)}-load-info" style="font-size: 0.88rem; font-weight: 700; color: var(--text-color, #1e293b); font-family: monospace;">
                ${modes[0].load}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id);
  if (!root) return;

  const blocksData = {
    cpu: { name: 'CPU (Централен процесор)', desc: 'Многоядрен процесор с архитектура big.LITTLE (високопроизводителни ядра за тежки изчисления и енергоефективни ядра за фонови задачи). Осигурява плавна реакция на системата при минимален разход на енергия.' },
    gpu: { name: 'GPU (Графичен ускорител)', desc: 'Отговаря за изчисляването на милиони триъгълници и шейдъри в реално време при 3D мобилни игри, анимациите на интерфейса и видеообработката с висока резолюция.' },
    npu: { name: 'NPU / AI Engine (Невронен процесор)', desc: 'Специализиран микропроцесорен блок, оптимизиран за матрични изчисления и невронни мрежи. Обработва машинно самообучение на самото устройство (on-device AI), разпознаване на глас и лица без забавяне.' },
    isp: { name: 'ISP (Процесор за изображения)', desc: 'Специализиран сигнален чип за камерата: обработва светкавично оптичните данни, прави многокадрово обединяване (HDR), премахва цветен шум и прилага изчислителна фотография.' },
    modem: { name: '5G / 4G Клетъчен модем', desc: 'Управлява радиочестотните приемо-предаватели, агрегира честотни ленти за гигабитови скорости на сваляне и поддържа връзка с базовите станции и GPS сателитите.' },
    ram: { name: 'LPDDR RAM Контролер', desc: 'Енергоспестяваща оперативна памет (Low Power DDR), осигуряваща скоростен обмен на данни между процесора, графиката и невронния блок.' },
    security: { name: 'Secure Enclave (Защитен копроцесор)', desc: 'Хардуерно изолиран защитен сейф за криптиране на личните данни, съхранение на биометричните образци (пръстов отпечатък, Face ID) и банкови карти за безконтактни плащания.' },
    pmu: { name: 'PMU (Управление на захранването)', desc: 'Интелигентен микроконтролер, който измерва температурата на кристала и подава ток само към активните модули за максимална издръжливост на батерията.' }
  };

  const modesData = {
    photo: { active: ['isp', 'npu', 'cpu', 'ram', 'pmu'], energy: 'Средна', load: 'ISP 95%, NPU 90%, CPU 40%' },
    gaming: { active: ['gpu', 'cpu', 'ram', 'pmu'], energy: 'Висока', load: 'GPU 98%, CPU 85%, RAM 75%' },
    call: { active: ['modem', 'isp', 'gpu', 'cpu', 'ram'], energy: 'Умерена', load: 'Modem 70%, ISP 60%, CPU 50%' },
    idle: { active: ['pmu', 'security'], energy: 'Минимална', load: 'PMU 5%, Малки ядра CPU 3%' }
  };

  const modeButtons = root.querySelectorAll('.soc-mode-btn');
  const chipBlocks = root.querySelectorAll('.soc-chip-block');
  const titleEl = root.querySelector(`[id$="-detail-title"]`);
  const descEl = root.querySelector(`[id$="-detail-desc"]`);
  const loadEl = root.querySelector(`[id$="-load-info"]`);
  const energyBadge = root.querySelector(`[id$="-energy-badge"]`);

  function setBlockDetail(blockId) {
    const info = blocksData[blockId];
    if (info && titleEl && descEl) {
      titleEl.textContent = info.name;
      descEl.textContent = info.desc;
    }
  }

  function setMode(modeId) {
    const mode = modesData[modeId];
    if (!mode) return;

    modeButtons.forEach(btn => {
      const isActive = btn.getAttribute('data-mode') === modeId;
      btn.style.borderColor = isActive ? 'var(--accent-blue, #3b82f6)' : 'var(--border-color, #e2e8f0)';
      btn.style.background = isActive ? '#eff6ff' : '#ffffff';
      btn.style.color = isActive ? '#1d4ed8' : 'var(--text-color, #1e293b)';
    });

    chipBlocks.forEach(blk => {
      const bId = blk.getAttribute('data-block');
      const isActive = mode.active.includes(bId);
      const indicator = blk.querySelector('.soc-pulse-indicator');
      if (indicator) indicator.style.visibility = isActive ? 'visible' : 'hidden';
      blk.style.background = isActive ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.8)';
      blk.style.opacity = isActive ? '1' : '0.45';
    });

    if (loadEl) loadEl.textContent = mode.load;
    if (energyBadge) {
      let color = '#2563eb';
      if (mode.energy === 'Висока') color = '#dc2626';
      else if (mode.energy === 'Средна') color = '#d97706';
      else if (mode.energy === 'Минимална') color = '#059669';
      energyBadge.style.color = color;
      energyBadge.innerHTML = `<i class="fas fa-bolt" style="color: #eab308;"></i> Консумация: ${mode.energy}`;
    }
  }

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mId = btn.getAttribute('data-mode');
      setMode(mId);
    });
  });

  chipBlocks.forEach(blk => {
    blk.addEventListener('click', () => {
      const bId = blk.getAttribute('data-block');
      setBlockDetail(bId);
    });
  });
}
