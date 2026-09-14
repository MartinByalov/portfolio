export function render(comp) {
  const defaultStages = [
    { id: "premechanical", title: "Предмеханичен", period: "до XV век", core: "Човекът използва пръсти, камъчета, възли и абак.", icon: "fas fa-hand-point-up", color: "#8b5cf6", details: "Пръстови системи (Беда Достопочтени), палочки и плочки с нарези, възли Кипу, древният абак (3000 г. пр.Хр.) и арабско-европейското сметало." },
    { id: "mechanical", title: "Механичен", period: "XVI–XIX век", core: "Зъбни колела и механизми започват да извършват изчисления.", icon: "fas fa-cogs", color: "#3b82f6", details: "Логаритмите на Непер (1614), Паскалин на Блез Паскал (1642), Аритмометър и двоичен код на Лайбниц (1673), Перфокартите на Жакард (1804), Аналитичната машина на Чарлз Бабидж и Ада Лъвлейс." },
    { id: "electromechanical", title: "Електромеханичен", period: "края на XIX – средата на XX в.", core: "Електричеството и релетата автоматизират изчисленията.", icon: "fas fa-bolt", color: "#10b981", details: "Табулаторът на Херман Холерит (1889), компютърът Z1 на Конрад Цузе (1938–1941) и MARK I на Хауърд Айкън (1944)." },
    { id: "electronic", title: "Електронен", period: "от 1940-те до днес", core: "Електронните елементи правят компютрите бързи, програмируеми и все по-малки.", icon: "fas fa-microchip", color: "#ef4444", details: "ABC на Джон Атанасов и Бери (1937–1942), Colossus (1943), ENIAC (1946), Архитектурата на Фон Нойман (EDVAC, EDSAC), транзистори, интегрални схеми и микропроцесори." }
  ];

  const stages = comp.stages || defaultStages;

  const tabsHtml = stages.map((stg, idx) => `
    <button class="evo-tab-btn ${idx === 0 ? 'active' : ''}" data-idx="${idx}" style="flex: 1; min-width: 140px; padding: 1rem 0.5rem; border: none; background: ${idx === 0 ? 'var(--surface, #ffffff)' : 'rgba(241, 245, 249, 0.7)'}; border-radius: 12px; cursor: pointer; transition: all 0.25s; text-align: center; box-shadow: ${idx === 0 ? '0 4px 12px rgba(0,0,0,0.08)' : 'none'}; border-bottom: 3px solid ${idx === 0 ? (stg.color || '#3b82f6') : 'transparent'};">
      <div style="font-size: 1.5rem; color: ${stg.color || '#3b82f6'}; margin-bottom: 0.35rem;">
        <i class="${stg.icon || 'fas fa-layer-group'}"></i>
      </div>
      <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-color, #1e293b);">${stg.title}</div>
      <div style="font-size: 0.8rem; color: #64748b; font-weight: 500; margin-top: 0.15rem;">${stg.period}</div>
    </button>
  `).join('');

  return `
    <div id="${comp.id}" class="interactive-evolution-map-container" style="margin: 3rem 0; background: var(--surface-alt, #f8fafc); border-radius: 20px; padding: 2rem; border: 1px solid var(--border-color, #e2e8f0);">
      <div style="text-align: center; max-width: 700px; margin: 0 auto 2rem auto;">
        <span style="background: #e0f2fe; color: #0284c7; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">Четирите етапа</span>
        <h3 style="margin: 0.5rem 0 0.5rem 0; font-size: 1.75rem; color: var(--text-color);">${comp.title || 'Четири големи скока'}</h3>
        <p style="margin: 0; color: #64748b; font-size: 0.95rem;">Изберете етап от хронологичната лента, за да откриете същността и ключовите изобретения:</p>
      </div>

      <!-- Navigation Tabs -->
      <div class="evo-tabs-wrapper" style="display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 0.5rem; margin-bottom: 1.5rem;">
        ${tabsHtml}
      </div>

      <!-- Content Viewer -->
      <div class="evo-content-card" style="background: var(--surface, #ffffff); border-radius: 16px; padding: 2rem; border: 1px solid var(--border-color, #e2e8f0); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); min-height: 180px;">
        <div class="evo-stage-display">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <div class="evo-display-icon" style="width: 50px; height: 50px; border-radius: 12px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #3b82f6;">
              <i class="${stages[0].icon || 'fas fa-star'}"></i>
            </div>
            <div>
              <h4 class="evo-display-title" style="margin: 0; font-size: 1.3rem; color: var(--text-color);">${stages[0].title} етап</h4>
              <span class="evo-display-period" style="font-size: 0.85rem; color: #64748b; font-weight: 600;">${stages[0].period}</span>
            </div>
          </div>
          <p class="evo-display-core" style="font-size: 1.1rem; line-height: 1.6; color: var(--text-color); font-weight: 500; margin-bottom: 1rem; border-left: 4px solid #3b82f6; padding-left: 1rem;">
            ${stages[0].core}
          </p>
          <div style="background: #f8fafc; border-radius: 10px; padding: 1rem; border: 1px dashed #cbd5e1;">
            <strong style="color: #475569; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 0.3rem;">Ключови технологии и личности:</strong>
            <span class="evo-display-details" style="color: #334155; font-size: 0.95rem; line-height: 1.5;">${stages[0].details || stages[0].core}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function init(comp) {
  const container = document.getElementById(comp.id);
  if (!container) return;

  const defaultStages = [
    { id: "premechanical", title: "Предмеханичен", period: "до XV век", core: "Човекът използва пръсти, камъчета, възли и абак.", icon: "fas fa-hand-point-up", color: "#8b5cf6", details: "Пръстови системи (Беда Достопочтени), палочки и плочки с нарези, възли Кипу, древният абак (3000 г. пр.Хр.) и арабско-европейското сметало." },
    { id: "mechanical", title: "Механичен", period: "XVI–XIX век", core: "Зъбни колела и механизми започват да извършват изчисления.", icon: "fas fa-cogs", color: "#3b82f6", details: "Логаритмите на Непер (1614), Паскалин на Блез Паскал (1642), Аритмометър и двоичен код на Лайбниц (1673), Перфокартите на Жакард (1804), Аналитичната машина на Чарлз Бабидж и Ада Лъвлейс." },
    { id: "electromechanical", title: "Електромеханичен", period: "края на XIX – средата на XX в.", core: "Електричеството и релетата автоматизират изчисленията.", icon: "fas fa-bolt", color: "#10b981", details: "Табулаторът на Херман Холерит (1889), компютърът Z1 на Конрад Цузе (1938–1941) и MARK I на Хауърд Айкън (1944)." },
    { id: "electronic", title: "Електронен", period: "от 1940-те до днес", core: "Електронните елементи правят компютрите бързи, програмируеми и все по-малки.", icon: "fas fa-microchip", color: "#ef4444", details: "ABC на Джон Атанасов и Бери (1937–1942), Colossus (1943), ENIAC (1946), Архитектурата на Фон Нойман (EDVAC, EDSAC), транзистори, интегрални схеми и микропроцесори." }
  ];

  const stages = comp.stages || defaultStages;
  const tabBtns = container.querySelectorAll('.evo-tab-btn');
  const displayTitle = container.querySelector('.evo-display-title');
  const displayPeriod = container.querySelector('.evo-display-period');
  const displayCore = container.querySelector('.evo-display-core');
  const displayDetails = container.querySelector('.evo-display-details');
  const displayIcon = container.querySelector('.evo-display-icon');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      const stg = stages[idx];
      if (!stg) return;

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.style.background = 'rgba(241, 245, 249, 0.7)';
        b.style.boxShadow = 'none';
        b.style.borderBottomColor = 'transparent';
      });

      btn.classList.add('active');
      btn.style.background = 'var(--surface, #ffffff)';
      btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
      btn.style.borderBottomColor = stg.color || '#3b82f6';

      if (displayTitle) displayTitle.textContent = `${stg.title} етап`;
      if (displayPeriod) displayPeriod.textContent = stg.period;
      if (displayCore) {
        displayCore.textContent = stg.core;
        displayCore.style.borderLeftColor = stg.color || '#3b82f6';
      }
      if (displayDetails) displayDetails.textContent = stg.details || stg.core;
      if (displayIcon) {
        displayIcon.innerHTML = `<i class="${stg.icon || 'fas fa-star'}"></i>`;
        displayIcon.style.color = stg.color || '#3b82f6';
      }
    });
  });
}
