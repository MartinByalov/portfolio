export function render(comp) {
  const figures = comp.figures || [
    { name: "Джон Непер", contribution: "Логаритми", year: "1614 г.", desc: "Свежда трудното умножение до събиране; ражда се логаритмичната линийка.", icon: "fas fa-ruler-combined", color: "#8b5cf6" },
    { name: "Блез Паскал", contribution: "Паскалин (Зъбни колела)", year: "1642 г.", desc: "Първата реална механична машина; събира и изважда с пренос на десетиците.", icon: "fas fa-cog", color: "#3b82f6" },
    { name: "Готфрид Лайбниц", contribution: "Аритмометър & Двоичен код", year: "1673 г.", desc: "Добавя умножение и деление; първи описва двоичната бройна система (0 и 1).", icon: "fas fa-calculator", color: "#10b981" },
    { name: "Жозеф-Мари Жакард", contribution: "Перфокарти & Програма", year: "1804 г.", desc: "Управлява стан с дупчени карти; машина за първи път следва готова програма!", icon: "fas fa-file-alt", color: "#f59e0b" }
  ];

  const figuresHtml = figures.map((fig, idx) => `
    <button class="workbench-fig-btn ${idx === 0 ? 'active' : ''}" data-idx="${idx}" style="background: var(--surface, #ffffff); border: 2px solid ${idx === 0 ? (fig.color || '#3b82f6') : 'var(--border-color, #e2e8f0)'}; border-radius: 12px; padding: 1rem; cursor: pointer; text-align: left; transition: all 0.2s; display: flex; align-items: flex-start; gap: 0.75rem;">
      <div style="width: 36px; height: 36px; border-radius: 50%; background: ${fig.color || '#3b82f6'}; color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1rem;">
        <i class="${fig.icon || 'fas fa-user-astronaut'}"></i>
      </div>
      <div>
        <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-color);">${fig.name}</div>
        <div style="font-size: 0.8rem; color: #64748b;">${fig.contribution || fig.year}</div>
      </div>
    </button>
  `).join('');

  return `
    <div id="${comp.id}" class="interactive-workbench-container" style="margin: 3rem 0; padding: 2rem; background: var(--surface-alt, #f8fafc); border-radius: 16px; border: 1px solid var(--border-color, #e2e8f0);">
      <div style="text-align: center; max-width: 700px; margin: 0 auto 2rem auto;">
        <span style="background: #fef3c7; color: #b45309; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">Работилница за надграждане</span>
        <h3 style="margin: 0.5rem 0 0.5rem 0; font-size: 1.6rem; color: var(--text-color);">${comp.title || 'Механичната революция'}</h3>
        <p style="margin: 0; color: #64748b; font-size: 0.95rem;">Кликнете върху учения, за да го "монтирате" в развитието на механичния компютър:</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        ${figuresHtml}
      </div>

      <!-- Upgrade Status Box -->
      <div class="workbench-status-card" style="background: #ffffff; border-radius: 12px; padding: 1.75rem; border: 2px solid #3b82f6; box-shadow: 0 4px 10px rgba(0,0,0,0.05); display: flex; align-items: flex-start; gap: 1.25rem;">
        <div class="wb-status-icon" style="width: 56px; height: 56px; border-radius: 12px; background: #dbeafe; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; flex-shrink: 0;">
          <i class="${figures[0].icon}"></i>
        </div>
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <h4 class="wb-status-title" style="margin: 0; font-size: 1.2rem; color: var(--text-color);">${figures[0].name}</h4>
            <span class="wb-status-year" style="background: #f1f5f9; color: #475569; padding: 0.1rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">${figures[0].year || ''}</span>
          </div>
          <div class="wb-status-upgrade" style="font-weight: 700; color: #2563eb; font-size: 1rem; margin-bottom: 0.5rem;">
            Иновация: ${figures[0].contribution}
          </div>
          <p class="wb-status-desc" style="margin: 0; font-size: 0.95rem; color: #475569; line-height: 1.5;">
            ${figures[0].desc}
          </p>
        </div>
      </div>
    </div>
  `;
}

export function init(comp) {
  const container = document.getElementById(comp.id);
  if (!container) return;

  const defaultFigures = [
    { name: "Джон Непер", contribution: "Логаритми", year: "1614 г.", desc: "Свежда трудното умножение до събиране; ражда се логаритмичната линийка.", icon: "fas fa-ruler-combined", color: "#8b5cf6" },
    { name: "Блез Паскал", contribution: "Паскалин (Зъбни колела)", year: "1642 г.", desc: "Първата реална механична машина; събира и изважда с пренос на десетиците.", icon: "fas fa-cog", color: "#3b82f6" },
    { name: "Готфрид Лайбниц", contribution: "Аритмометър & Двоичен код", year: "1673 г.", desc: "Добавя умножение и деление; първи описва двоичната бройна система (0 и 1).", icon: "fas fa-calculator", color: "#10b981" },
    { name: "Жозеф-Мари Жакард", contribution: "Перфокарти & Програма", year: "1804 г.", desc: "Управлява стан с дупчени карти; машина за първи път следва готова програма!", icon: "fas fa-file-alt", color: "#f59e0b" }
  ];

  const figures = comp.figures || defaultFigures;
  const btns = container.querySelectorAll('.workbench-fig-btn');
  const title = container.querySelector('.wb-status-title');
  const year = container.querySelector('.wb-status-year');
  const upgrade = container.querySelector('.wb-status-upgrade');
  const desc = container.querySelector('.wb-status-desc');
  const icon = container.querySelector('.wb-status-icon');
  const statusCard = container.querySelector('.workbench-status-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      const fig = figures[idx];
      if (!fig) return;

      btns.forEach(b => {
        b.style.borderColor = 'var(--border-color, #e2e8f0)';
        b.style.transform = 'none';
      });

      btn.style.borderColor = fig.color || '#3b82f6';
      btn.style.transform = 'translateY(-2px)';

      if (title) title.textContent = fig.name;
      if (year) year.textContent = fig.year || '';
      if (upgrade) upgrade.textContent = `Иновация: ${fig.contribution || fig.upgrade}`;
      if (desc) desc.textContent = fig.desc || fig.contribution;
      if (icon) {
        icon.innerHTML = `<i class="${fig.icon || 'fas fa-cog'}"></i>`;
        icon.style.color = fig.color || '#3b82f6';
        icon.style.background = `${fig.color}20`;
      }
      if (statusCard) {
        statusCard.style.borderColor = fig.color || '#3b82f6';
      }
    });
  });
}
