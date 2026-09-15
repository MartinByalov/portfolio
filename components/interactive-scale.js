export function render(comp) {
  const generations = comp.generations || [
    { gen: "0 поколение (до 1940)", tech: "Електромагнитни релета", size: "Огромни шкафове", speed: "10–100 оп/сек", reliability: "Чести механични повреди", power: "Висока", example: "Z1, MARK I", color: "#64748b" },
    { gen: "1 поколение (1940–1955)", tech: "Електронни вакуумни лампи", size: "Заемат цели стаи (30 тона)", speed: "5,000 operations/sec", reliability: "Лампите изгарят постоянно", power: "Огромно греене (150 kW)", example: "ABC, ENIAC, EDVAC", color: "#ef4444" },
    { gen: "2 поколение (1955–1965)", tech: "Транзистори (Полупроводници)", size: "По-малки шкафове", speed: "100,000 operations/sec", reliability: "Висока надеждност", power: "Ниско греене", example: "IBM 7090, Минск", color: "#f59e0b" },
    { gen: "3 поколение (1965–1975)", tech: "Интегрални схеми (ИС)", size: "Настолни мини-компютри", speed: "Милиони операции/сек", reliability: "Много висока", power: "Минимална", example: "IBM System/360, ИЗОТ 310", color: "#10b981" },
    { gen: "4 поколение (1975–днес)", tech: "Микропроцесори (LSI / VLSI)", size: "Персонални компютри & лаптопи", speed: "Милиарди операции/сек (GHz)", reliability: "Изключителна", power: "Микроскопична", example: "Apple II, Правец 82, Смартфони", color: "#3b82f6" },
    { gen: "5 поколение (Днес & Бъдеще)", tech: "Изкуствен интелект & Кванти", size: "Мобилни & облачни системи", speed: "Паралелна супер-обработка", reliability: "Автономна самодиагностика", power: "Оптимизирана", example: "AI асистенти, квантови чипове", color: "#8b5cf6" }
  ];

  const genButtonsHtml = generations.map((g, idx) => `
    <button class="gen-step-btn ${idx === 0 ? 'active' : ''}" data-idx="${idx}" style="flex: 1; padding: 0.65rem 0.25rem; border: none; background: ${idx === 0 ? (g.color || '#3b82f6') : '#e2e8f0'}; color: ${idx === 0 ? 'white' : '#475569'}; border-radius: 8px; font-weight: bold; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;">
      ${idx}
    </button>
  `).join('');

  return `
    <div id="${comp.id}" class="interactive-scale-container" style="margin: 3rem 0; padding: 2.25rem; background: var(--surface-alt, #f8fafc); border-radius: 16px; border: 1px solid var(--border-color, #e2e8f0);">
      <div style="text-align: center; max-width: 750px; margin: 0 auto 2rem auto;">
        <span style="background: #e0e7ff; color: #4338ca; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">Еволюция на хардуера</span>
        <h3 style="margin: 0.5rem 0 0.25rem 0; font-size: 1.6rem; color: var(--text-color);">${comp.title || 'Пет поколения - една огромна промяна'}</h3>
        <p style="margin: 0; color: #64748b; font-size: 0.95rem;">Превключвайте през поколенията, за да проследите технологичния скок:</p>
      </div>

      <!-- Stepper Selector -->
      <div style="display: flex; gap: 0.5rem; max-width: 600px; margin: 0 auto 1.5rem auto;">
        ${genButtonsHtml}
      </div>

      <!-- Main Generation Card -->
      <div class="gen-main-card" style="background: #ffffff; border-radius: 16px; padding: 2rem; border: 2px solid ${generations[0].color}; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 1rem; margin-bottom: 1.5rem;">
          <div>
            <h4 class="gen-title" style="margin: 0 0 0.25rem 0; font-size: 1.4rem; color: var(--text-color);">${generations[0].gen}</h4>
            <div class="gen-tech" style="font-size: 1.05rem; font-weight: 700; color: ${generations[0].color};">Ключов елемент: ${generations[0].tech}</div>
          </div>
          <span class="gen-badge" style="background: ${generations[0].color}; color: white; padding: 0.4rem 1rem; border-radius: 20px; font-weight: bold; font-size: 0.9rem;">
            Поколение 0
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div style="background: #f8fafc; padding: 1rem; border-radius: 10px;">
            <div style="font-size: 0.8rem; color: #64748b; font-weight: bold; text-transform: uppercase;">Размер & Тегло</div>
            <div class="gen-size" style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-top: 0.25rem;">${generations[0].size}</div>
          </div>
          <div style="background: #f8fafc; padding: 1rem; border-radius: 10px;">
            <div style="font-size: 0.8rem; color: #64748b; font-weight: bold; text-transform: uppercase;">Скорост</div>
            <div class="gen-speed" style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-top: 0.25rem;">${generations[0].speed}</div>
          </div>
          <div style="background: #f8fafc; padding: 1rem; border-radius: 10px;">
            <div style="font-size: 0.8rem; color: #64748b; font-weight: bold; text-transform: uppercase;">Надеждност & Ток</div>
            <div class="gen-rel" style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-top: 0.25rem;">${generations[0].reliability} (${generations[0].power})</div>
          </div>
          <div style="background: #f8fafc; padding: 1rem; border-radius: 10px;">
            <div style="font-size: 0.8rem; color: #64748b; font-weight: bold; text-transform: uppercase;">Примери</div>
            <div class="gen-ex" style="font-size: 1rem; font-weight: 600; color: #1e293b; margin-top: 0.25rem;">${generations[0].example}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function init(comp) {
  const container = document.getElementById(comp.id);
  if (!container) return;

  const defaultGens = [
    { gen: "0 поколение (до 1940)", tech: "Електромагнитни релета", size: "Огромни шкафове", speed: "10–100 оп/сек", reliability: "Чести механични повреди", power: "Висока", example: "Z1, MARK I", color: "#64748b" },
    { gen: "1 поколение (1940–1955)", tech: "Електронни вакуумни лампи", size: "Заемат цели стаи (30 тона)", speed: "5,000 operations/sec", reliability: "Лампите изгарят постоянно", power: "Огромно греене (150 kW)", example: "ABC, ENIAC, EDVAC", color: "#ef4444" },
    { gen: "2 поколение (1955–1965)", tech: "Транзистори (Полупроводници)", size: "По-малки шкафове", speed: "100,000 operations/sec", reliability: "Висока надеждност", power: "Ниско греене", example: "IBM 7090, Минск", color: "#f59e0b" },
    { gen: "3 поколение (1965–1975)", tech: "Интегрални схеми (ИС)", size: "Настолни мини-компютри", speed: "Милиони операции/сек", reliability: "Много висока", power: "Минимална", example: "IBM System/360, ИЗОТ 310", color: "#10b981" },
    { gen: "4 поколение (1975–днес)", tech: "Микропроцесори (LSI / VLSI)", size: "Персонални компютри & лаптопи", speed: "Милиарди операции/сек (GHz)", reliability: "Изключителна", power: "Микроскопична", example: "Apple II, Правец 82, Смартфони", color: "#3b82f6" },
    { gen: "5 поколение (Днес & Бъдеще)", tech: "Изкуствен интелект & Кванти", size: "Мобилни & облачни системи", speed: "Паралелна супер-обработка", reliability: "Автономна самодиагностика", power: "Оптимизирана", example: "AI асистенти, квантови чипове", color: "#8b5cf6" }
  ];

  const generations = comp.generations || defaultGens;
  const btns = container.querySelectorAll('.gen-step-btn');
  const mainCard = container.querySelector('.gen-main-card');
  const genTitle = container.querySelector('.gen-title');
  const genTech = container.querySelector('.gen-tech');
  const genBadge = container.querySelector('.gen-badge');
  const genSize = container.querySelector('.gen-size');
  const genSpeed = container.querySelector('.gen-speed');
  const genRel = container.querySelector('.gen-rel');
  const genEx = container.querySelector('.gen-ex');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      const g = generations[idx];
      if (!g) return;

      btns.forEach(b => {
        b.style.background = '#e2e8f0';
        b.style.color = '#475569';
      });

      btn.style.background = g.color || '#3b82f6';
      btn.style.color = 'white';

      if (mainCard) mainCard.style.borderColor = g.color || '#3b82f6';
      if (genTitle) genTitle.textContent = g.gen;
      if (genTech) {
        genTech.textContent = `Ключов елемент: ${g.tech}`;
        genTech.style.color = g.color || '#3b82f6';
      }
      if (genBadge) {
        genBadge.textContent = `Поколение ${idx}`;
        genBadge.style.background = g.color || '#3b82f6';
      }
      if (genSize) genSize.textContent = g.size;
      if (genSpeed) genSpeed.textContent = g.speed;
      if (genRel) genRel.textContent = `${g.reliability} (${g.power})`;
      if (genEx) genEx.textContent = g.example;
    });
  });
}
