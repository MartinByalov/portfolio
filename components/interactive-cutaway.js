export function render(comp) {
  const hotspots = comp.interaction?.hotspots || comp.hotspots || [
    { label: "Склад", modernEquivalent: "Памет (RAM / Storage)", explanation: "Съхранява числови данни и междинни резултати.", icon: "fas fa-warehouse", color: "#3b82f6" },
    { label: "Мелница", modernEquivalent: "Процесор (CPU ALU)", explanation: "Извършва аритметичните и логическите действия.", icon: "fas fa-cogs", color: "#ef4444" },
    { label: "Управление", modernEquivalent: "Управляващо устройство (CU)", explanation: "Определя последователността от операции по програмата.", icon: "fas fa-sliders-h", color: "#8b5cf6" },
    { label: "Вход", modernEquivalent: "Входни устройства (Перфокарти)", explanation: "Получава данни и инструкции с дупчени карти.", icon: "fas fa-sign-in-alt", color: "#10b981" },
    { label: "Изход", modernEquivalent: "Изходни устройства (Принтер)", explanation: "Отпечатва резултатите на хартия или плочи.", icon: "fas fa-print", color: "#f59e0b" }
  ];

  const hsButtonsHtml = hotspots.map((hs, idx) => `
    <button class="cutaway-hs-btn ${idx === 0 ? 'active' : ''}" data-idx="${idx}" style="padding: 0.85rem 1.25rem; border-radius: 10px; border: 2px solid ${idx === 0 ? (hs.color || '#3b82f6') : 'var(--border-color, #e2e8f0)'}; background: ${idx === 0 ? '#eff6ff' : 'var(--surface, #ffffff)'}; cursor: pointer; text-align: left; transition: all 0.2s; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <i class="${hs.icon || 'fas fa-dot-circle'}" style="color: ${hs.color || '#3b82f6'}; font-size: 1.1rem;"></i>
        <strong style="font-size: 0.95rem; color: var(--text-color);">${hs.label}</strong>
      </div>
      <span style="font-size: 0.8rem; background: #f1f5f9; color: #475569; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 600;">${hs.modernEquivalent}</span>
    </button>
  `).join('');

  return `
    <div id="${comp.id}" class="interactive-cutaway-container" style="margin: 3rem 0; padding: 2.25rem; background: var(--surface-alt, #f8fafc); border-radius: 16px; border: 1px solid var(--border-color, #e2e8f0);">
      <div style="text-align: center; max-width: 750px; margin: 0 auto 2rem auto;">
        <span style="background: #e0e7ff; color: #4338ca; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">Анатомия на първия компютър</span>
        <h3 style="margin: 0.5rem 0 0.25rem 0; font-size: 1.6rem; color: var(--text-color);">${comp.title || 'Компютът, който съществува първо на хартия'}</h3>
        ${comp.subtitle ? `<p style="margin: 0; color: #64748b; font-size: 1rem;">${comp.subtitle}</p>` : ''}
      </div>

      <!-- Hotspots Panel -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        ${hsButtonsHtml}
      </div>

      <!-- Detail Showcase Box -->
      <div class="cutaway-detail-card" style="background: #ffffff; border-radius: 12px; padding: 2rem; border: 2px solid ${hotspots[0].color || '#3b82f6'}; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 1rem; margin-bottom: 1rem;">
          <h4 class="cutaway-detail-title" style="margin: 0; font-size: 1.3rem; color: var(--text-color); display: flex; align-items: center; gap: 0.6rem;">
            <i class="${hotspots[0].icon}" style="color: ${hotspots[0].color || '#3b82f6'};"></i>
            <span>Модул: ${hotspots[0].label}</span>
          </h4>
          <span class="cutaway-detail-equiv" style="background: #dbeafe; color: #1e40af; font-weight: 700; padding: 0.3rem 0.8rem; border-radius: 6px; font-size: 0.9rem;">
            Съвременен еквивалент: ${hotspots[0].modernEquivalent}
          </span>
        </div>
        <p class="cutaway-detail-text" style="font-size: 1.1rem; line-height: 1.6; color: #334155; margin: 0;">
          ${hotspots[0].explanation}
        </p>
      </div>

      ${comp.conclusion ? `
        <div style="margin-top: 1.5rem; padding: 1rem 1.25rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; color: #166534; font-weight: 500; font-size: 0.95rem; display: flex; align-items: center; gap: 0.75rem;">
          <i class="fas fa-info-circle" style="font-size: 1.2rem; color: #22c55e;"></i>
          <span>${comp.conclusion}</span>
        </div>
      ` : ''}
    </div>
  `;
}

export function init(comp) {
  const container = document.getElementById(comp.id);
  if (!container) return;

  const hotspots = comp.interaction?.hotspots || comp.hotspots || [
    { label: "Склад", modernEquivalent: "Памет (RAM / Storage)", explanation: "Съхранява числови данни и междинни резултати.", icon: "fas fa-warehouse", color: "#3b82f6" },
    { label: "Мелница", modernEquivalent: "Процесор (CPU ALU)", explanation: "Извършва аритметичните и логическите действия.", icon: "fas fa-cogs", color: "#ef4444" },
    { label: "Управление", modernEquivalent: "Управляващо устройство (CU)", explanation: "Определя последователността от операции по програмата.", icon: "fas fa-sliders-h", color: "#8b5cf6" },
    { label: "Вход", modernEquivalent: "Входни устройства (Перфокарти)", explanation: "Получава данни и инструкции с дупчени карти.", icon: "fas fa-sign-in-alt", color: "#10b981" },
    { label: "Изход", modernEquivalent: "Изходни устройства (Принтер)", explanation: "Отпечатва резултатите на хартия или плочи.", icon: "fas fa-print", color: "#f59e0b" }
  ];

  const btns = container.querySelectorAll('.cutaway-hs-btn');
  const title = container.querySelector('.cutaway-detail-title');
  const equiv = container.querySelector('.cutaway-detail-equiv');
  const text = container.querySelector('.cutaway-detail-text');
  const card = container.querySelector('.cutaway-detail-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      const hs = hotspots[idx];
      if (!hs) return;

      btns.forEach(b => {
        b.style.borderColor = 'var(--border-color, #e2e8f0)';
        b.style.background = 'var(--surface, #ffffff)';
      });

      btn.style.borderColor = hs.color || '#3b82f6';
      btn.style.background = '#eff6ff';

      if (title) title.innerHTML = `<i class="${hs.icon || 'fas fa-dot-circle'}" style="color: ${hs.color || '#3b82f6'};"></i><span>Модул: ${hs.label}</span>`;
      if (equiv) equiv.textContent = `Съвременен еквивалент: ${hs.modernEquivalent}`;
      if (text) text.textContent = hs.explanation;
      if (card) card.style.borderColor = hs.color || '#3b82f6';
    });
  });
}
