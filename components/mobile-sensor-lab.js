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
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; align-items: start;">
        <!-- Left: Virtual Phone Display Window -->
        <div class="os-cli-window" style="background: #0f172a; border-radius: 12px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.25); display: flex; flex-direction: column;">
          <div class="os-window-titlebar dark" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 1rem; background: #1e293b; color: #f1f5f9; border-bottom: 1px solid #334155;">
            <div class="os-win-dots" style="display: flex; gap: 6px;">
              <span class="win-dot red" style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444; display: inline-block;"></span>
              <span class="win-dot yellow" style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b; display: inline-block;"></span>
              <span class="win-dot green" style="width: 10px; height: 10px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
            </div>
            <div class="os-win-title" style="font-size: 0.82rem; font-family: monospace; letter-spacing: 0.05em; color: #94a3b8; font-weight: 600;">
              VIRTUAL HARDWARE
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
              Контрол и показания на сензора
            </div>
          </div>

          <div style="padding: 1.15rem; display: flex; flex-direction: column; gap: 1rem;">
            <div id="${esc(id)}-controls-panel">
              <!-- Dynamic Controls based on selected sensor -->
            </div>

            <div style="padding: 0.85rem; background: var(--surface-alt, #f8fafc); border-radius: 10px; border-left: 4px solid var(--accent-blue, #3b82f6);">
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-color, #1e293b); margin-bottom: 0.35rem;">
                Как работи този сензор?
              </div>
              <div id="${esc(id)}-explanation-text" style="font-size: 0.84rem; color: var(--text-color, #334155); line-height: 1.55; word-break: normal; overflow-wrap: break-word;">
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
          Сензор за близост и телефонен разговор
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.85rem;">
          <!-- Proximity Visual Status Box -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.75rem;">
            <div style="margin-bottom: 0.6rem;">
              <span style="font-size: 0.82rem; font-weight: 700; color: #0f172a;">
                <i class="fas fa-satellite-dish" style="color: #ef4444; margin-right: 0.35rem;"></i> Инфрачервен (IR) сензор
              </span>
            </div>

            <!-- Proximity Action Button -->
            <button type="button" id="btn-toggle-proximity" style="width: 100%; padding: 0.7rem 0.85rem; border-radius: 8px; border: 1.5px solid #059669; background: #ecfdf5; color: #065f46; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.25s ease;">
              <i class="fas fa-ear-listen" id="prox-btn-icon"></i>
              <span id="prox-btn-text">Приближи телефона към ухото</span>
            </button>
          </div>

          <!-- Distance Slider -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.75rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
              <span style="font-size: 0.8rem; font-weight: 600; color: #334155;">Разстояние до лицето/ухото:</span>
              <span id="label-prox-dist" style="font-family: monospace; font-weight: 700; color: #2563eb; font-size: 0.8rem;">8 cm</span>
            </div>
            <input type="range" id="slider-prox-dist" min="0" max="10" value="8" style="width: 100%; cursor: pointer;">
            <div style="display: flex; justify-content: space-between; font-size: 0.68rem; color: #64748b; margin-top: 0.3rem;">
              <span style="color: #ef4444; font-weight: 700;">0 cm (Допрян)</span>
              <span style="color: #f59e0b; font-weight: 600;">3-5 cm (Праг)</span>
              <span style="color: #10b981; font-weight: 600;">10 cm (Далеч)</span>
            </div>
          </div>
        </div>
      `,
      explanation: 'Сензорът за близост излъчва невидим за човешкото око инфрачервен (IR) лъч. Когато по време на разговор допрете телефона до ухото или бузата си (разстояние под 3–5 см), лъчът се отразява обратно в приемника. Системата моментално изключва подсветката на дисплея и сензорния слой, за да предотврати случайни докосвания с бузата и да спести електроенергия от батерията.',
      setupEvents: () => {
        let isClose = false;
        const btn = root.querySelector('#btn-toggle-proximity');
        const btnText = root.querySelector('#prox-btn-text');
        const btnIcon = root.querySelector('#prox-btn-icon');
        const sliderDist = root.querySelector('#slider-prox-dist');
        const labelDist = root.querySelector('#label-prox-dist');

        function setProximityState(close, distCm) {
          isClose = close;
          if (sliderDist) sliderDist.value = distCm;
          if (labelDist) labelDist.textContent = `${distCm} cm`;

          if (isClose) {
            if (screenEl) {
              screenEl.style.background = '#020617';
              screenEl.style.opacity = '0.08';
              screenEl.style.filter = 'grayscale(100%) brightness(20%)';
            }
            if (proxDot) {
              proxDot.style.background = '#ef4444';
              proxDot.style.boxShadow = '0 0 10px 3px rgba(239, 68, 68, 0.9)';
            }
            if (phoneEl) {
              phoneEl.style.transform = 'perspective(500px) rotateY(-12deg) scale(0.97)';
            }
            if (textEl) textEl.innerHTML = '<span style="color: #ef4444;">ЕКРАНЪТ Е ИЗКЛЮЧЕН</span>';
            if (subEl) subEl.textContent = '🔒 Защита от допир с бузата (IR отражение)';
            if (btn) {
              btn.style.background = '#fef2f2';
              btn.style.borderColor = '#ef4444';
              btn.style.color = '#991b1b';
            }
            if (btnIcon) btnIcon.className = 'fas fa-hand-holding-hand';
            if (btnText) btnText.textContent = 'Отдалечи телефона от ухото';
          } else {
            if (screenEl) {
              screenEl.style.background = '#0284c7';
              screenEl.style.opacity = '1';
              screenEl.style.filter = 'none';
            }
            if (proxDot) {
              proxDot.style.background = '#64748b';
              proxDot.style.boxShadow = 'none';
            }
            if (phoneEl) {
              phoneEl.style.transform = 'perspective(500px) rotateY(0deg) scale(1)';
            }
            if (iconEl) iconEl.innerHTML = '<i class="fas fa-phone-volume" style="font-size: 2rem; color: #ffffff;"></i>';
            if (textEl) textEl.textContent = 'Разговор: 00:42';
            if (subEl) subEl.textContent = 'Сензор: Няма обект наблизо (> 5 см)';
            if (btn) {
              btn.style.background = '#ecfdf5';
              btn.style.borderColor = '#059669';
              btn.style.color = '#065f46';
            }
            if (btnIcon) btnIcon.className = 'fas fa-ear-listen';
            if (btnText) btnText.textContent = 'Приближи телефона към ухото';
          }
        }

        if (btn) {
          btn.addEventListener('click', () => {
            setProximityState(!isClose, isClose ? 8 : 1);
          });
        }

        if (sliderDist) {
          sliderDist.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10);
            setProximityState(val <= 4, val);
          });
        }

        // Default initial state
        setProximityState(false, 8);
      }
    },
    light: {
      renderControls: () => `
        <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted, #64748b); text-transform: uppercase; margin-bottom: 0.85rem;">
          Сензор за околна осветеност
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.85rem;">
          <div>
            <div style="text-align: center; margin-bottom: 0.6rem;">
              <span id="label-lux-val" style="display: inline-block; font-family: monospace; font-weight: 700; color: #d97706; font-size: 0.75rem; background: #fef3c7; padding: 0.25rem 0.65rem; border-radius: 6px; border: 1px solid #fde68a;">500 Lux (Стайна светлина)</span>
            </div>
            <input type="range" id="slider-lux" min="5" max="2000" value="500" style="width: 100%; cursor: pointer;">
          </div>
        </div>
      `,
      explanation: 'Сензорът за околна светлина (фотодиод) постоянно измерва нивото на осветеност в луксове (Lux). Операционната система динамично увеличава яркостта при пряка слънчева светлина за четимост и я намалява в тъмна стая за щадене на зрението и намаляване на разхода на батерия.',
      setupEvents: () => {
        const slider = root.querySelector('#slider-lux');
        const label = root.querySelector('#label-lux-val');

        function updateLight(lux) {
          let desc = 'Стайна светлина';
          let brightness = 0.65;
          let bgColor = '#0284c7';

          if (lux <= 30) {
            desc = 'Тъмна стая (10 lx)';
            brightness = 0.25;
            bgColor = '#0f172a';
          } else if (lux < 250) {
            desc = 'Приглушена светлина';
            brightness = 0.45;
            bgColor = '#1e293b';
          } else if (lux < 900) {
            desc = 'Офис / Стайна светлина (500 lx)';
            brightness = 0.65;
            bgColor = '#0284c7';
          } else if (lux < 1500) {
            desc = 'Дневна светлина на открито';
            brightness = 0.85;
            bgColor = '#0284c7';
          } else {
            desc = 'Ярко слънце (2000+ lx)';
            brightness = 1.0;
            bgColor = '#38bdf8';
          }

          if (label) label.textContent = `${lux} Lux (${desc})`;
          if (screenEl) {
            screenEl.style.background = bgColor;
            screenEl.style.filter = `brightness(${brightness})`;
          }
          if (iconEl) iconEl.innerHTML = '<i class="fas fa-sun" style="font-size: 2rem; color: #fbbf24;"></i>';
          if (textEl) textEl.textContent = `Яркост: ${Math.round(brightness * 100)}%`;
          if (subEl) subEl.textContent = `Осветеност: ${lux} lx`;
        }

        if (slider) {
          slider.addEventListener('input', (e) => {
            const lux = parseInt(e.target.value, 10);
            updateLight(lux);
          });
          updateLight(parseInt(slider.value, 10));
        }
      }
    },
    gps: {
      renderControls: () => `
        <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted, #64748b); text-transform: uppercase; margin-bottom: 0.85rem;">
          Спътникова навигация и Дигитален компас
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.85rem;">
          <!-- GPS Satellite Lock Section -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.75rem;">
            <div style="margin-bottom: 0.5rem;">
              <span style="font-size: 0.82rem; font-weight: 700; color: #0f172a;">
                <i class="fas fa-satellite" style="color: #10b981; margin-right: 0.35rem;"></i> GPS Трилатерация
              </span>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button type="button" id="btn-gps-search-lock" style="flex: 1; min-width: 0; padding: 0.55rem 0.5rem; border-radius: 8px; border: 1.5px solid #10b981; background: #ecfdf5; color: #065f46; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.35rem; white-space: nowrap; transition: all 0.2s ease;">
                <i class="fas fa-satellite-dish"></i>
                <span id="btn-gps-lock-text">Сканирай</span>
              </button>
              <button type="button" id="btn-gps-drive" style="flex: 1; min-width: 0; padding: 0.55rem 0.5rem; border-radius: 8px; border: 1px solid #cbd5e1; background: #ffffff; color: #334155; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.35rem; white-space: nowrap;">
                <i class="fas fa-car"></i>
                <span>Движение</span>
              </button>
            </div>
          </div>

          <!-- Compass & Tilt Section -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.75rem;">
            <div style="text-align: center; margin-bottom: 0.6rem;">
              <span id="label-heading-val" style="display: inline-block; font-size: 0.8rem; font-weight: 700; font-family: monospace; color: #1d4ed8; background: #dbeafe; padding: 0.2rem 0.7rem; border-radius: 6px;">
                0° СЕВЕР
              </span>
            </div>

            <!-- Quick Direction Buttons (2 lines text) -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.35rem; margin-bottom: 0.65rem;">
              <button type="button" class="btn-quick-dir" data-deg="0" style="padding: 0.4rem 0.15rem; border-radius: 6px; border: 1px solid #3b82f6; background: #eff6ff; color: #1d4ed8; font-weight: 700; font-size: 0.75rem; line-height: 1.2; text-align: center; cursor: pointer;">
                Север<br><span style="font-size: 0.68rem; font-weight: 600; opacity: 0.85;">(0°)</span>
              </button>
              <button type="button" class="btn-quick-dir" data-deg="90" style="padding: 0.4rem 0.15rem; border-radius: 6px; border: 1px solid #e2e8f0; background: #ffffff; color: #475569; font-weight: 700; font-size: 0.75rem; line-height: 1.2; text-align: center; cursor: pointer;">
                Изток<br><span style="font-size: 0.68rem; font-weight: 600; opacity: 0.85;">(90°)</span>
              </button>
              <button type="button" class="btn-quick-dir" data-deg="180" style="padding: 0.4rem 0.15rem; border-radius: 6px; border: 1px solid #e2e8f0; background: #ffffff; color: #475569; font-weight: 700; font-size: 0.75rem; line-height: 1.2; text-align: center; cursor: pointer;">
                Юг<br><span style="font-size: 0.68rem; font-weight: 600; opacity: 0.85;">(180°)</span>
              </button>
              <button type="button" class="btn-quick-dir" data-deg="270" style="padding: 0.4rem 0.15rem; border-radius: 6px; border: 1px solid #e2e8f0; background: #ffffff; color: #475569; font-weight: 700; font-size: 0.75rem; line-height: 1.2; text-align: center; cursor: pointer;">
                Запад<br><span style="font-size: 0.68rem; font-weight: 600; opacity: 0.85;">(270°)</span>
              </button>
            </div>

            <!-- Heading Slider (Without label above) -->
            <div style="margin-bottom: 0.65rem;">
              <input type="range" id="slider-heading" min="0" max="360" value="0" style="width: 100%; cursor: pointer;">
            </div>

            <!-- 3D Tilt Slider -->
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #64748b; margin-bottom: 0.2rem;">
                <span>3D Наклон на устройството (Tilt / Pitch):</span>
                <span id="label-gps-tilt" style="font-family: monospace; font-weight: 600; color: #ea580c;">0°</span>
              </div>
              <input type="range" id="slider-gps-tilt" min="-40" max="40" value="0" style="width: 100%; cursor: pointer;">
            </div>
          </div>
        </div>
      `,
      explanation: 'GPS/GNSS приемникът изисква радиосигнал от най-малко 4 спътника в околоземна орбита, за да извърши математическа трилатерация (изчислява X, Y, Z координати и точен времеви синхрон). Вграденият магнитометър засича земното магнитно поле, за да ориентира картата право на Север при завъртане или накланяне (Tilt) на телефона.',
      setupEvents: () => {
        const btnLock = root.querySelector('#btn-gps-search-lock');
        const btnLockText = root.querySelector('#btn-gps-lock-text');
        const btnDrive = root.querySelector('#btn-gps-drive');
        const sliderHead = root.querySelector('#slider-heading');
        const headVal = root.querySelector('#label-heading-val');
        const sliderTilt = root.querySelector('#slider-gps-tilt');
        const tiltLabel = root.querySelector('#label-gps-tilt');
        const dirButtons = root.querySelectorAll('.btn-quick-dir');

        let isLocked = false;
        let driveInterval = null;
        let isDriving = false;
        let currentHeading = 0;
        let currentTilt = 0;
        let lat = 42.6977;
        let lon = 23.3219;

        function updateScreenCompass() {
          if (screenInner) {
            let cardinal = 'СЕВЕР';
            if (currentHeading >= 23 && currentHeading < 68) cardinal = 'СЕВЕРОИЗТОК';
            else if (currentHeading >= 68 && currentHeading < 113) cardinal = 'ИЗТОК';
            else if (currentHeading >= 113 && currentHeading < 158) cardinal = 'ЮГОИЗТОК';
            else if (currentHeading >= 158 && currentHeading < 203) cardinal = 'ЮГ';
            else if (currentHeading >= 203 && currentHeading < 248) cardinal = 'ЮГОЗАПАД';
            else if (currentHeading >= 248 && currentHeading < 293) cardinal = 'ЗАПАД';
            else if (currentHeading >= 293 && currentHeading < 338) cardinal = 'СЕВЕРОЗАПАД';

            if (!isLocked) {
              if (screenEl) screenEl.style.background = '#0f172a';
              if (iconEl) {
                iconEl.innerHTML = `
                  <div style="width: 76px; height: 76px; border-radius: 50%; border: 2px dashed rgba(255,255,255,0.4); display: flex; align-items: center; justify-content: center; position: relative; margin: 0 auto; box-shadow: inset 0 0 15px rgba(0,0,0,0.5);">
                    <div style="position: absolute; top: 2px; font-size: 0.65rem; font-weight: 800; color: #ef4444;">N</div>
                    <div style="position: absolute; bottom: 2px; font-size: 0.65rem; font-weight: 700; color: #94a3b8;">S</div>
                    <div style="position: absolute; left: 4px; font-size: 0.65rem; font-weight: 700; color: #94a3b8;">W</div>
                    <div style="position: absolute; right: 4px; font-size: 0.65rem; font-weight: 700; color: #94a3b8;">E</div>
                    <div style="width: 6px; height: 48px; position: relative; transform: rotate(${currentHeading}deg); transition: transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1);">
                      <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom: 24px solid #ef4444; position: absolute; top: 0; left: -2px;"></div>
                      <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 24px solid #f8fafc; position: absolute; bottom: 0; left: -2px;"></div>
                    </div>
                  </div>
                `;
              }
              if (textEl) textEl.innerHTML = `<span style="color: #38bdf8; font-size: 1rem;">${currentHeading}°</span> ${cardinal}`;
              if (subEl) subEl.innerHTML = `GPS: Изключен (няма фиксация)<br><span style="font-size: 0.68rem; color: #94a3b8;">Магнитометър: 48 µT · Наклон: ${currentTilt}°</span>`;
            } else {
              // Locked Navigation Mode
              if (screenEl) screenEl.style.background = '#065f46';
              if (iconEl) {
                iconEl.innerHTML = `
                  <div style="display: flex; flex-direction: column; align-items: center; gap: 0.2rem;">
                    <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(16,185,129,0.25); border: 2px solid #34d399; display: flex; align-items: center; justify-content: center; position: relative;">
                      <i class="fas fa-location-arrow" style="font-size: 1.4rem; color: #ffffff; transform: rotate(${currentHeading - 45}deg); transition: transform 0.2s ease;"></i>
                    </div>
                  </div>
                `;
              }
              if (textEl) textEl.innerHTML = `<span style="color: #a7f3d0; font-size: 0.8rem;">${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E</span>`;
              if (subEl) subEl.innerHTML = `София · 8 спътника · ${isDriving ? '60 km/h' : '0 km/h'}<br><span style="font-size: 0.65rem; color: #6ee7b7;">Курс: ${currentHeading}° (${cardinal})</span>`;
            }
          }

          // Apply 3D Perspective and Tilt to Virtual Phone
          if (phoneEl) {
            phoneEl.style.transform = `perspective(600px) rotateX(${currentTilt}deg) rotateZ(${(currentHeading / 12).toFixed(1)}deg)`;
          }
        }

        function setHeading(deg) {
          currentHeading = deg;
          if (sliderHead) sliderHead.value = deg;
          if (headVal) {
            let card = 'СЕВЕР';
            if (deg >= 23 && deg < 68) card = 'СЕВЕРОИЗТОК';
            else if (deg >= 68 && deg < 113) card = 'ИЗТОК';
            else if (deg >= 113 && deg < 158) card = 'ЮГОИЗТОК';
            else if (deg >= 158 && deg < 203) card = 'ЮГ';
            else if (deg >= 203 && deg < 248) card = 'ЮГОЗАПАД';
            else if (deg >= 248 && deg < 293) card = 'ЗАПАД';
            else if (deg >= 293 && deg < 338) card = 'СЕВЕРОЗАПАД';
            headVal.textContent = `${deg}° ${card}`;
          }
          dirButtons.forEach(b => {
            const bDeg = parseInt(b.getAttribute('data-deg'), 10);
            const isMatch = Math.abs(bDeg - deg) < 15;
            b.style.borderColor = isMatch ? '#3b82f6' : '#e2e8f0';
            b.style.background = isMatch ? '#eff6ff' : '#ffffff';
            b.style.color = isMatch ? '#1d4ed8' : '#475569';
          });
          updateScreenCompass();
        }

        if (sliderHead) {
          sliderHead.addEventListener('input', (e) => {
            setHeading(parseInt(e.target.value, 10));
          });
        }

        if (sliderTilt && tiltLabel) {
          sliderTilt.addEventListener('input', (e) => {
            currentTilt = parseInt(e.target.value, 10);
            tiltLabel.textContent = `${currentTilt}°`;
            updateScreenCompass();
          });
        }

        dirButtons.forEach(btn => {
          btn.addEventListener('click', () => {
            const deg = parseInt(btn.getAttribute('data-deg'), 10);
            setHeading(deg);
          });
        });

        if (btnLock) {
          btnLock.addEventListener('click', () => {
            if (isLocked) {
              isLocked = false;
              if (driveInterval) {
                clearInterval(driveInterval);
                driveInterval = null;
              }
              isDriving = false;
              lat = 42.6977;
              lon = 23.3219;
              if (btnLockText) btnLockText.textContent = 'Сканирай';
              if (btnLock) {
                btnLock.style.borderColor = '#10b981';
                btnLock.style.background = '#ecfdf5';
                btnLock.style.color = '#065f46';
              }
              if (btnDrive) {
                btnDrive.style.background = '#ffffff';
                btnDrive.style.borderColor = '#cbd5e1';
                btnDrive.style.color = '#334155';
              }
              updateScreenCompass();
              return;
            }

            // Start simulated satellite search sequence
            btnLock.disabled = true;
            if (btnLockText) btnLockText.textContent = 'Търсене...';
            if (screenEl) screenEl.style.background = '#1e293b';
            if (iconEl) iconEl.innerHTML = '<i class="fas fa-satellite fa-spin" style="font-size: 2rem; color: #38bdf8;"></i>';
            if (textEl) textEl.textContent = 'Търсене на GNSS орбита...';
            if (subEl) subEl.textContent = 'Приемане на алманах и ефемериди';

            setTimeout(() => {
              isLocked = true;
              btnLock.disabled = false;
              if (btnLockText) btnLockText.textContent = 'Освободи';
              if (btnLock) {
                btnLock.style.borderColor = '#ef4444';
                btnLock.style.background = '#fef2f2';
                btnLock.style.color = '#991b1b';
              }
              updateScreenCompass();
            }, 1000);
          });
        }

        if (btnDrive) {
          btnDrive.addEventListener('click', () => {
            if (!isLocked) {
              // Auto lock GPS first if not locked
              if (btnLock) btnLock.click();
              setTimeout(() => {
                startDriving();
              }, 1100);
              return;
            }
            startDriving();
          });
        }

        function startDriving() {
          isDriving = !isDriving;
          if (isDriving) {
            btnDrive.style.background = '#dbeafe';
            btnDrive.style.borderColor = '#3b82f6';
            btnDrive.style.color = '#1d4ed8';
            driveInterval = setInterval(() => {
              lat += 0.0003;
              lon += 0.0002;
              currentHeading = (currentHeading + 2) % 360;
              setHeading(currentHeading);
            }, 300);
          } else {
            btnDrive.style.background = '#ffffff';
            btnDrive.style.borderColor = '#cbd5e1';
            btnDrive.style.color = '#334155';
            if (driveInterval) {
              clearInterval(driveInterval);
              driveInterval = null;
            }
            updateScreenCompass();
          }
        }

        // Initialize compass view
        setHeading(0);
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
