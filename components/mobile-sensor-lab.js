// Component: mobile-sensor-lab
// Interactive sensory laboratory simulating mobile hardware sensors

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const id = comp.id || 'comp-mobile-sensor-' + Math.random().toString(36).substr(2, 9);
  const title = comp.title || '';
  const subtitle = comp.subtitle || '';

  return `
    <div id="${esc(id)}" class="mobile-sensor-lab-wrapper" style="margin: 1.5rem 0; background: var(--surface-alt, #f8fafc); border: 1px solid var(--border-color, #e2e8f0); border-radius: 16px; padding: 1.5rem;">
      ${(title || subtitle) ? `
        <div style="margin-bottom: 1.25rem;">
          ${title ? `<h3 style="margin: 0 0 0.4rem 0; font-size: 1.25rem; color: var(--text-color, #1e293b); font-weight: 700;">${esc(title)}</h3>` : ''}
          ${subtitle ? `<p style="margin: 0; font-size: 0.95rem; color: var(--text-muted, #64748b); line-height: 1.5;">${esc(subtitle)}</p>` : ''}
        </div>
      ` : ''}

      <!-- Sensor Tab Selection -->
      <div style="margin-bottom: 1.5rem;">
        <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted, #64748b); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
          Изберете хардуерен сензор:
        </div>
        <div class="sensor-tabs" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem;">
          <button type="button" class="sensor-tab-btn active" data-sensor="accel" style="padding: 0.55rem 0.4rem; border-radius: 10px; border: 1.5px solid var(--accent-blue, #3b82f6); background: #eff6ff; color: #1d4ed8; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: all 0.2s ease; white-space: nowrap; text-align: center;">
            <i class="fas fa-rotate"></i>
            <span>Акселерометър</span>
          </button>
          <button type="button" class="sensor-tab-btn" data-sensor="proximity" style="padding: 0.55rem 0.4rem; border-radius: 10px; border: 1.5px solid var(--border-color, #e2e8f0); background: #ffffff; color: var(--text-color, #1e293b); font-size: 0.8rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: all 0.2s ease; white-space: nowrap; text-align: center;">
            <i class="fas fa-hand"></i>
            <span>Сензор за близост</span>
          </button>
          <button type="button" class="sensor-tab-btn" data-sensor="light" style="padding: 0.55rem 0.4rem; border-radius: 10px; border: 1.5px solid var(--border-color, #e2e8f0); background: #ffffff; color: var(--text-color, #1e293b); font-size: 0.8rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: all 0.2s ease; white-space: nowrap; text-align: center;">
            <i class="fas fa-sun"></i>
            <span>Околна светлина</span>
          </button>
          <button type="button" class="sensor-tab-btn" data-sensor="gps" style="padding: 0.55rem 0.4rem; border-radius: 10px; border: 1.5px solid var(--border-color, #e2e8f0); background: #ffffff; color: var(--text-color, #1e293b); font-size: 0.8rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: all 0.2s ease; white-space: nowrap; text-align: center;">
            <i class="fas fa-location-crosshairs"></i>
            <span>GPS & Компас</span>
          </button>
        </div>
      </div>

      <!-- Main Interactive Sensory Stage (Styled after Sandbox SoC Dual Windows) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; align-items: stretch;">
        <!-- Left: Virtual Phone Display Window -->
        <div class="os-cli-window" style="background: #0f172a; border-radius: 12px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.25); display: flex; flex-direction: column;">
          <div class="os-window-titlebar dark" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 1rem; background: #1e293b; color: #f1f5f9; border-bottom: 1px solid #334155;">
            <div class="os-win-dots" style="display: flex; gap: 6px;">
              <span class="win-dot red" style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444; display: inline-block;"></span>
              <span class="win-dot yellow" style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b; display: inline-block;"></span>
              <span class="win-dot green" style="width: 10px; height: 10px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
            </div>
            <div class="os-win-title" style="font-size: 0.82rem; font-family: monospace; letter-spacing: 0.05em; color: #94a3b8; font-weight: 600;">
              <i class="fas fa-mobile-screen" style="color: #38bdf8; margin-right: 0.35rem;"></i> VIRTUAL HARDWARE SIMULATOR
            </div>
          </div>
          
          <div style="padding: 1.5rem; display: flex; align-items: center; justify-content: center; min-height: 310px; flex-grow: 1;">
            <!-- Virtual Phone Bezel -->
            <div id="${esc(id)}-virtual-phone" style="width: 170px; height: 260px; background: #1e293b; border-radius: 24px; border: 4px solid #475569; position: relative; display: flex; flex-direction: column; justify-content: space-between; padding: 10px; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); transform: rotate(0deg); box-shadow: 0 15px 30px rgba(0,0,0,0.5);">
              <!-- Speaker & Proximity dot -->
              <div style="display: flex; justify-content: center; align-items: center; gap: 6px; margin-bottom: 4px;">
                <div id="${esc(id)}-proximity-sensor-dot" style="width: 6px; height: 6px; border-radius: 50%; background: #64748b; transition: all 0.3s ease;"></div>
                <div style="width: 32px; height: 4px; background: #334155; border-radius: 4px;"></div>
                <div style="width: 6px; height: 6px; border-radius: 50%; background: #0284c7;"></div>
              </div>

              <!-- Screen Area -->
              <div id="${esc(id)}-phone-screen" style="flex-grow: 1; background: #0284c7; border-radius: 14px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 8px; color: #ffffff; text-align: center; transition: all 0.3s ease; overflow: hidden; position: relative;">
                <div id="${esc(id)}-screen-inner" style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 100%; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); transform: rotate(0deg);">
                  <div id="${esc(id)}-screen-icon" style="font-size: 2rem; margin-bottom: 0.4rem;">
                    <i class="fas fa-mobile-screen"></i>
                  </div>
                  <div id="${esc(id)}-screen-text" style="font-size: 0.85rem; font-weight: 700; line-height: 1.3;">
                    Портретен режим
                  </div>
                  <div id="${esc(id)}-screen-sub" style="font-size: 0.7rem; opacity: 0.85; margin-top: 0.2rem;">
                    X: 0.0g · Y: 9.8g
                  </div>
                </div>
              </div>

              <!-- Home Bar -->
              <div style="display: flex; justify-content: center; margin-top: 4px;">
                <div style="width: 40px; height: 4px; background: #64748b; border-radius: 4px;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Sensor Controls & Telemetry Window -->
        <div class="os-gui-window" style="background: #ffffff; border-radius: 12px; border: 1px solid var(--border-color, #e2e8f0); overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);">
          <div class="os-window-titlebar light" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 1rem; background: #f1f5f9; color: #334155; border-bottom: 1px solid #e2e8f0;">
            <div class="os-win-dots" style="display: flex; gap: 6px;">
              <span class="win-dot" style="width: 10px; height: 10px; border-radius: 50%; background: #cbd5e1; display: inline-block;"></span>
              <span class="win-dot" style="width: 10px; height: 10px; border-radius: 50%; background: #cbd5e1; display: inline-block;"></span>
              <span class="win-dot" style="width: 10px; height: 10px; border-radius: 50%; background: #cbd5e1; display: inline-block;"></span>
            </div>
            <div class="os-win-title" style="font-size: 0.82rem; font-weight: 600; color: #475569;">
              <i class="fas fa-sliders" style="color: #3b82f6; margin-right: 0.35rem;"></i> Контрол и показания на сензора
            </div>
          </div>

          <div style="padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between; flex-grow: 1;">
            <div id="${esc(id)}-controls-panel">
              <!-- Dynamic Controls based on selected sensor -->
            </div>

            <div style="margin-top: 1rem; padding: 0.85rem; background: var(--surface-alt, #f8fafc); border-radius: 10px; border-left: 4px solid var(--accent-blue, #3b82f6);">
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-color, #1e293b); margin-bottom: 0.25rem;">
                Как работи този сензор?
              </div>
              <div id="${esc(id)}-explanation-text" style="font-size: 0.85rem; color: var(--text-color, #334155); line-height: 1.5;">
                Акселерометърът измерва силата на земното притегляне и линейното ускорение по три оси (X, Y, Z). Когато завъртите устройството, софтуерът засича промяната на гравитационния вектор и автоматично завърта съдържанието на екрана.
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

  const phoneEl = root.querySelector(`[id$="-virtual-phone"]`);
  const screenEl = root.querySelector(`[id$="-phone-screen"]`);
  const screenInner = root.querySelector(`[id$="-screen-inner"]`);
  const iconEl = root.querySelector(`[id$="-screen-icon"]`);
  const textEl = root.querySelector(`[id$="-screen-text"]`);
  const subEl = root.querySelector(`[id$="-screen-sub"]`);
  const proxDot = root.querySelector(`[id$="-proximity-sensor-dot"]`);
  const controlsPanel = root.querySelector(`[id$="-controls-panel"]`);
  const explanationEl = root.querySelector(`[id$="-explanation-text"]`);
  const tabButtons = root.querySelectorAll('.sensor-tab-btn');

  let activeSensor = 'accel';

  const sensorConfigs = {
    accel: {
      renderControls: () => `
        <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted, #64748b); text-transform: uppercase; margin-bottom: 0.85rem;">
          Управление на пространствената ориентация
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div style="display: flex; gap: 0.5rem;">
            <button type="button" id="btn-rotate-portrait" style="flex: 1; padding: 0.6rem 0.75rem; border-radius: 8px; border: 1px solid #3b82f6; background: #eff6ff; color: #1d4ed8; font-weight: 700; font-size: 0.85rem; cursor: pointer;">
              <i class="fas fa-arrows-up-down" style="margin-right: 0.3rem;"></i> Портрет (0°)
            </button>
            <button type="button" id="btn-rotate-landscape" style="flex: 1; padding: 0.6rem 0.75rem; border-radius: 8px; border: 1px solid var(--border-color, #e2e8f0); background: #ffffff; color: var(--text-color, #1e293b); font-weight: 700; font-size: 0.85rem; cursor: pointer;">
              <i class="fas fa-arrows-left-right" style="margin-right: 0.3rem;"></i> Пейзаж (90°)
            </button>
          </div>
          <div>
            <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-color, #1e293b); display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
              <span>Наклон по ос X (Тилт):</span>
              <span id="label-tilt-val" style="font-family: monospace; font-weight: 700; color: #2563eb;">0°</span>
            </label>
            <input type="range" id="slider-tilt" min="-45" max="45" value="0" style="width: 100%; cursor: pointer;">
          </div>
        </div>
      `,
      explanation: 'Акселерометърът използва микроелектромеханични структури (MEMS) с микроскопична маса на пружини. Жироскопът измерва ъгловата скорост при въртене, което позволява прецизен контрол в 3D мобилни игри и стабилизация на видеозаписа.',
      setupEvents: () => {
        const btnP = root.querySelector('#btn-rotate-portrait');
        const btnL = root.querySelector('#btn-rotate-landscape');
        const slider = root.querySelector('#slider-tilt');
        const labelVal = root.querySelector('#label-tilt-val');

        if (btnP && btnL) {
          btnP.addEventListener('click', () => {
            if (phoneEl) phoneEl.style.transform = 'rotate(0deg)';
            if (screenInner) {
              screenInner.style.transform = 'rotate(0deg)';
              screenInner.style.width = '100%';
              screenInner.style.height = '100%';
            }
            if (iconEl) iconEl.innerHTML = '<i class="fas fa-mobile-screen"></i>';
            if (textEl) textEl.textContent = 'Портретен режим';
            if (subEl) subEl.textContent = 'X: 0.0g · Y: 9.8g (Вертикално)';
            btnP.style.background = '#eff6ff';
            btnP.style.borderColor = '#3b82f6';
            btnP.style.color = '#1d4ed8';
            btnL.style.background = '#ffffff';
            btnL.style.borderColor = 'var(--border-color, #e2e8f0)';
            btnL.style.color = 'var(--text-color, #1e293b)';
          });
          btnL.addEventListener('click', () => {
            if (phoneEl) phoneEl.style.transform = 'rotate(90deg)';
            if (screenInner) {
              screenInner.style.transform = 'rotate(-90deg)';
              screenInner.style.width = '180px';
              screenInner.style.height = '120px';
            }
            if (iconEl) iconEl.innerHTML = '<i class="fas fa-film"></i>';
            if (textEl) textEl.textContent = 'Пейзажен режим (Видео)';
            if (subEl) subEl.textContent = 'X: 9.8g · Y: 0.0g (Хоризонтално)';
            btnL.style.background = '#eff6ff';
            btnL.style.borderColor = '#3b82f6';
            btnL.style.color = '#1d4ed8';
            btnP.style.background = '#ffffff';
            btnP.style.borderColor = 'var(--border-color, #e2e8f0)';
            btnP.style.color = 'var(--text-color, #1e293b)';
          });
        }
        if (slider && labelVal) {
          slider.addEventListener('input', (e) => {
            const val = e.target.value;
            labelVal.textContent = `${val}°`;
            if (phoneEl) phoneEl.style.transform = `rotate(${val}deg)`;
            if (subEl) subEl.textContent = `X: ${(val / 4.5).toFixed(1)}g · Ускорение`;
          });
        }
      }
    },
    proximity: {
      renderControls: () => `
        <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted, #64748b); text-transform: uppercase; margin-bottom: 0.85rem;">
          Телефонен разговор и близост
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <button type="button" id="btn-toggle-proximity" style="padding: 0.85rem 1rem; border-radius: 10px; border: 1.5px solid #059669; background: #ecfdf5; color: #065f46; font-weight: 700; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s ease;">
            <i class="fas fa-hand"></i>
            <span id="prox-btn-text">Приближи телефона към ухото (Сензор активен)</span>
          </button>
        </div>
      `,
      explanation: 'Сензорът за близост излъчва невидим инфрачервен лъч. Когато по време на разговор допрете телефона до ухото си, лъчът се отразява обратно, сензорът засича разстояние под 3-5 см и веднага изключва дисплея и тъчпада, за да предотврати случайно натискане с бузата и да пести батерия.',
      setupEvents: () => {
        let isClose = false;
        const btn = root.querySelector('#btn-toggle-proximity');
        const btnText = root.querySelector('#prox-btn-text');

        if (btn) {
          btn.addEventListener('click', () => {
            isClose = !isClose;
            if (isClose) {
              if (screenEl) {
                screenEl.style.background = '#000000';
                screenEl.style.opacity = '0.1';
              }
              if (proxDot) proxDot.style.background = '#ef4444';
              if (textEl) textEl.textContent = 'ЕКРАНЪТ Е ИЗКЛЮЧЕН';
              if (subEl) subEl.textContent = 'Разговор активен (Пестене на ток)';
              btn.style.background = '#fef2f2';
              btn.style.borderColor = '#ef4444';
              btn.style.color = '#991b1b';
              if (btnText) btnText.textContent = 'Отдалечи телефона (Възстанови екрана)';
            } else {
              if (screenEl) {
                screenEl.style.background = '#0284c7';
                screenEl.style.opacity = '1';
              }
              if (proxDot) proxDot.style.background = '#64748b';
              if (textEl) textEl.textContent = 'Дисплеят свети';
              if (subEl) subEl.textContent = 'Сензор: Няма обект наблизо (> 5 см)';
              btn.style.background = '#ecfdf5';
              btn.style.borderColor = '#059669';
              btn.style.color = '#065f46';
              if (btnText) btnText.textContent = 'Приближи телефона към ухото (Сензор активен)';
            }
          });
        }
      }
    },
    light: {
      renderControls: () => `
        <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted, #64748b); text-transform: uppercase; margin-bottom: 0.85rem;">
          Сензор за околна осветеност (Ambient Light)
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.45rem;">
              <span style="font-size: 0.82rem; font-weight: 600; color: var(--text-color, #1e293b);">Околна светлина (Луксове):</span>
              <span id="label-lux-val" style="font-family: monospace; font-weight: 700; color: #d97706; font-size: 0.82rem; background: #fef3c7; padding: 0.15rem 0.45rem; border-radius: 6px;">500 Lux (Стайна светлина)</span>
            </div>
            <input type="range" id="slider-lux" min="5" max="2000" value="500" style="width: 100%; cursor: pointer; margin-bottom: 0.45rem;">
          </div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.35rem; font-size: 0.75rem; color: var(--text-muted, #64748b); text-align: center;">
            <span style="background: var(--surface-alt, #f8fafc); padding: 0.3rem 0.2rem; border-radius: 6px; border: 1px solid var(--border-color, #e2e8f0); white-space: nowrap;">🌙 Тъмна стая (10 lx)</span>
            <span style="background: var(--surface-alt, #f8fafc); padding: 0.3rem 0.2rem; border-radius: 6px; border: 1px solid var(--border-color, #e2e8f0); white-space: nowrap;">💡 Офис (500 lx)</span>
            <span style="background: var(--surface-alt, #f8fafc); padding: 0.3rem 0.2rem; border-radius: 6px; border: 1px solid var(--border-color, #e2e8f0); white-space: nowrap;">☀️ Ярко слънце (2000+ lx)</span>
          </div>
        </div>
      `,
      explanation: 'Сензорът за околна светлина (фотодиод) постоянно измерва нивото на осветеност в луксове (Lux). Операционната система динамично увеличава яркостта при пряка слънчева светлина за четимост и я намалява в тъмна стая за щадене на зрението и намаляване на разхода на батерия.',
      setupEvents: () => {
        const slider = root.querySelector('#slider-lux');
        const label = root.querySelector('#label-lux-val');

        if (slider && label) {
          slider.addEventListener('input', (e) => {
            const lux = parseInt(e.target.value, 10);
            let desc = 'Стайна светлина';
            let brightness = 0.5;
            let bgColor = '#0284c7';

            if (lux < 50) {
              desc = 'Тъмна стая / Нощ';
              brightness = 0.25;
              bgColor = '#0f172a';
            } else if (lux < 800) {
              desc = 'Стайна светлина';
              brightness = 0.65;
              bgColor = '#0284c7';
            } else {
              desc = 'Ярко слънце';
              brightness = 1.0;
              bgColor = '#38bdf8';
            }

            label.textContent = `${lux} Lux (${desc})`;
            if (screenEl) {
              screenEl.style.background = bgColor;
              screenEl.style.filter = `brightness(${brightness})`;
            }
            if (textEl) textEl.textContent = `Яркост: ${Math.round(brightness * 100)}%`;
            if (subEl) subEl.textContent = `Осветеност: ${lux} lx`;
          });
        }
      }
    },
    gps: {
      renderControls: () => `
        <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted, #64748b); text-transform: uppercase; margin-bottom: 0.85rem;">
          Спътникова навигация (GPS) & Дигитален компас
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div style="display: flex; gap: 0.5rem;">
            <button type="button" id="btn-gps-lock" style="flex: 1; padding: 0.65rem 0.85rem; border-radius: 8px; border: 1px solid #10b981; background: #ecfdf5; color: #065f46; font-weight: 700; font-size: 0.85rem; cursor: pointer;">
              <i class="fas fa-satellite" style="margin-right: 0.3rem;"></i> Заключи GPS сигнал
            </button>
            <button type="button" id="btn-compass-turn" style="flex: 1; padding: 0.65rem 0.85rem; border-radius: 8px; border: 1px solid #3b82f6; background: #eff6ff; color: #1d4ed8; font-weight: 700; font-size: 0.85rem; cursor: pointer;">
              <i class="fas fa-compass" style="margin-right: 0.3rem;"></i> Завърти на Север (0°)
            </button>
          </div>
        </div>
      `,
      explanation: 'GPS/GNSS приемникът улавя радиосигнали от поне 4 сателита в орбита, за да изчисли точните географски координати (трилатерация) и надморска височина. Магнитометърът измерва магнитното поле на Земята и показва точната посока на движение на картата.',
      setupEvents: () => {
        const btnLock = root.querySelector('#btn-gps-lock');
        const btnCompass = root.querySelector('#btn-compass-turn');

        if (btnLock) {
          btnLock.addEventListener('click', () => {
            if (iconEl) iconEl.innerHTML = '<i class="fas fa-location-dot" style="color: #4ade80;"></i>';
            if (textEl) textEl.textContent = '42.6977° N, 23.3219° E';
            if (subEl) subEl.textContent = 'София, България · 6 сателита';
            if (screenEl) screenEl.style.background = '#065f46';
          });
        }
        if (btnCompass) {
          btnCompass.addEventListener('click', () => {
            if (iconEl) iconEl.innerHTML = '<i class="fas fa-compass" style="color: #f87171;"></i>';
            if (textEl) textEl.textContent = 'Север (0° N)';
            if (subEl) subEl.textContent = 'Магнитно поле: 48 µT';
            if (screenEl) screenEl.style.background = '#1e3a8a';
            if (phoneEl) phoneEl.style.transform = 'rotate(0deg)';
          });
        }
      }
    }
  };

  function switchTab(sensorId) {
    activeSensor = sensorId;
    tabButtons.forEach(btn => {
      const isTarget = btn.getAttribute('data-sensor') === sensorId;
      btn.style.borderColor = isTarget ? 'var(--accent-blue, #3b82f6)' : 'var(--border-color, #e2e8f0)';
      btn.style.background = isTarget ? '#eff6ff' : '#ffffff';
      btn.style.color = isTarget ? '#1d4ed8' : 'var(--text-color, #1e293b)';
    });

    const cfg = sensorConfigs[sensorId];
    if (cfg && controlsPanel && explanationEl) {
      controlsPanel.innerHTML = cfg.renderControls();
      explanationEl.textContent = cfg.explanation;
      cfg.setupEvents();
    }
    // Reset phone visual
    if (screenEl) {
      screenEl.style.background = '#0284c7';
      screenEl.style.opacity = '1';
      screenEl.style.filter = 'none';
    }
    if (phoneEl) phoneEl.style.transform = 'rotate(0deg)';
    if (screenInner) {
      screenInner.style.transform = 'rotate(0deg)';
      screenInner.style.width = '100%';
      screenInner.style.height = '100%';
    }
    if (proxDot) proxDot.style.background = '#64748b';
    if (iconEl) iconEl.innerHTML = '<i class="fas fa-mobile-screen"></i>';
    if (textEl) textEl.textContent = 'Сензорът е готов';
    if (subEl) subEl.textContent = 'Очаква входни данни...';
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const sId = btn.getAttribute('data-sensor');
      switchTab(sId);
    });
  });

  // Init default tab
  switchTab('accel');
}
