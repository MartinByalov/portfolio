export function render(comp) {
  const devices = comp.devices || [
    { name: "Табулатор (1889)", inventor: "Херман Холерит", tech: "Електрически перфокарти", note: "Спестява 7 години за преброяване на населението в САЩ." },
    { name: "Z1 (1938–1941)", inventor: "Конрад Цузе", tech: "Електромеханични релета", note: "Първият двоичен програмируем компютър в света." },
    { name: "MARK I (1944)", inventor: "Хауърд Айкън", tech: "Релета & Перфолента", note: "5 тона тегло, изчислява математически таблици." },
    { name: "ABC (1937–1942)", inventor: "Джон Атанасов & Клифърд Бери", tech: "Електронни вакуумни лампи", note: "Първият електронен дигитален компютър." },
    { name: "Colossus (1943)", inventor: "Алън Тюринг & екип", tech: "Електронни лампи", note: "Разбива военните шифри на германската армия." },
    { name: "ENIAC (1946)", inventor: "Джон Моучли & Джон Екерт", tech: "17 000 вакуумни лампи", note: "Първият универсален програмируем електронен компютър." }
  ];

  const devicesHtml = devices.map(d => `
    <div style="background: var(--surface, #ffffff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
          <h4 style="margin: 0; font-size: 1.05rem; color: var(--text-color);">${d.name}</h4>
          <span style="font-size: 0.75rem; background: #e0f2fe; color: #0369a1; padding: 0.15rem 0.5rem; border-radius: 4px; font-weight: bold;">${d.tech}</span>
        </div>
        <div style="font-size: 0.85rem; color: #3b82f6; font-weight: 600; margin-bottom: 0.5rem;">
          <i class="fas fa-user-circle" style="margin-right: 0.3rem;"></i> ${d.inventor}
        </div>
        <p style="margin: 0; font-size: 0.85rem; color: #64748b; line-height: 1.4;">${d.note}</p>
      </div>
    </div>
  `).join('');

  return `
    <div id="${comp.id}" class="technology-comparison-container" style="margin: 3rem 0; padding: 2.25rem; background: var(--surface-alt, #f8fafc); border-radius: 16px; border: 1px solid var(--border-color, #e2e8f0);">
      <div style="text-align: center; max-width: 750px; margin: 0 auto 2rem auto;">
        <span style="background: #fef3c7; color: #b45309; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">Скоростен скок</span>
        <h3 style="margin: 0.5rem 0 0.25rem 0; font-size: 1.6rem; color: var(--text-color);">${comp.title || 'Когато механиката вече не е достатъчна'}</h3>
        <p style="margin: 0; color: #64748b; font-size: 0.95rem;">Вижте симулацията на скоростта между различните технологии за изчисление:</p>
      </div>

      <!-- Speed Simulator -->
      <div style="background: #ffffff; border-radius: 12px; padding: 1.75rem; border: 1px solid #cbd5e1; margin-bottom: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.03);">
        <h4 style="margin: 0 0 1rem 0; font-size: 1.1rem; color: var(--text-color); display: flex; align-items: center; gap: 0.5rem;">
          <i class="fas fa-tachometer-alt" style="color: #ef4444;"></i> Симулатор на изчислителна скорост (1,000 изчисления)
        </h4>

        <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
          <!-- Track 1: Mechanical -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 0.25rem;">
              <span>1. Механично зъбно колело (Паскалин)</span>
              <span>1 оп/сек (1,000 сек)</span>
            </div>
            <div style="height: 12px; background: #e2e8f0; border-radius: 6px; overflow: hidden;">
              <div class="sim-bar-1" style="height: 100%; width: 2%; background: #64748b; transition: width 3s linear;"></div>
            </div>
          </div>

          <!-- Track 2: Relay -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 0.25rem;">
              <span>2. Електромеханично реле (Z1 / MARK I)</span>
              <span>100 оп/сек (10 сек)</span>
            </div>
            <div style="height: 12px; background: #e2e8f0; border-radius: 6px; overflow: hidden;">
              <div class="sim-bar-2" style="height: 100%; width: 10%; background: #f59e0b; transition: width 2s linear;"></div>
            </div>
          </div>

          <!-- Track 3: Vacuum Tube -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 0.25rem;">
              <span>3. Електронна вакуумна лампа (ABC / ENIAC)</span>
              <span>5,000 оп/сек (0.2 сек!)</span>
            </div>
            <div style="height: 12px; background: #e2e8f0; border-radius: 6px; overflow: hidden;">
              <div class="sim-bar-3" style="height: 100%; width: 0%; background: #10b981; transition: width 0.3s ease-out;"></div>
            </div>
          </div>
        </div>

        <button class="run-sim-btn" style="background: #2563eb; color: white; border: none; padding: 0.65rem 1.25rem; border-radius: 8px; font-weight: bold; font-size: 0.95rem; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem;">
          <i class="fas fa-play"></i> Стартирай теста за скорост
        </button>
      </div>

      <!-- Device Grid -->
      <h4 style="margin: 0 0 1rem 0; font-size: 1.1rem; color: var(--text-color);">Пионерите от преходния и електронния период:</h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
        ${devicesHtml}
      </div>
    </div>
  `;
}

export function init(comp) {
  const container = document.getElementById(comp.id);
  if (!container) return;

  const btn = container.querySelector('.run-sim-btn');
  const bar1 = container.querySelector('.sim-bar-1');
  const bar2 = container.querySelector('.sim-bar-2');
  const bar3 = container.querySelector('.sim-bar-3');

  if (btn && bar1 && bar2 && bar3) {
    btn.addEventListener('click', () => {
      bar1.style.width = '2%';
      bar2.style.width = '0%';
      bar3.style.width = '0%';

      setTimeout(() => {
        bar1.style.width = '5%';
        bar2.style.width = '35%';
        bar3.style.width = '100%';
      }, 50);
    });
  }
}
