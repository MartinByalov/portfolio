export function render(comp) {
  const items = comp.questions || [
    {
      param: "Тегло и размер",
      factA: "ENIAC (1946): 30 тона тегло, заема зала от 167 кв. м",
      factB: "Смартфон (Днес): Под 200 грама, събира се в джоб",
      insight: "Смартфонът е над 150 000 пъти по-лек!"
    },
    {
      param: "Изчислителна мощ (Скорост)",
      factA: "ENIAC (1946): 5 000 събирания в секунда",
      factB: "Смартфон (Днес): Милиарди операции в секунда (GHz)",
      insight: "Днешният телефон е над 1 000 000 пъти по-бърз!"
    },
    {
      param: "Енергия и цена",
      factA: "ENIAC (1946): 150 kW ток (колкото фабрика), цена $500,000",
      factB: "Смартфон (Днес): Малка презареждаема батерия",
      insight: "ENIAC е изразходвал енергия за цял квартал!"
    }
  ];

  const itemsHtml = items.map((it, idx) => `
    <div class="scale-comp-card" data-idx="${idx}" style="background: var(--surface, #ffffff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.75rem; margin-bottom: 1rem;">
        <h4 style="margin: 0; font-size: 1.1rem; color: var(--text-color);">${it.param}</h4>
        <button class="reveal-comp-btn" style="background: #3b82f6; color: white; border: none; padding: 0.4rem 0.85rem; border-radius: 6px; font-weight: bold; font-size: 0.85rem; cursor: pointer;">
          <i class="fas fa-eye" style="margin-right: 0.3rem;"></i> Разкрий сравнението
        </button>
      </div>

      <div class="comp-facts-grid" style="display: none; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 1rem;">
          <strong style="color: #991b1b; display: block; margin-bottom: 0.25rem;">ENIAC (1946 г.)</strong>
          <span style="font-size: 0.95rem; color: #7f1d1d;">${it.factA}</span>
        </div>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1rem;">
          <strong style="color: #166534; display: block; margin-bottom: 0.25rem;">Смартфон (Днес)</strong>
          <span style="font-size: 0.95rem; color: #14532d;">${it.factB}</span>
        </div>
      </div>

      <div class="comp-insight-box" style="display: none; background: #f8fafc; border-left: 4px solid #3b82f6; padding: 0.75rem 1rem; border-radius: 0 8px 8px 0; font-weight: 600; color: #2563eb; font-size: 0.95rem;">
        <i class="fas fa-bolt" style="margin-right: 0.4rem;"></i> ${it.insight}
      </div>
    </div>
  `).join('');

  return `
    <div id="${comp.id}" class="scale-comparison-container" style="margin: 3rem 0; padding: 2.25rem; background: var(--surface-alt, #f8fafc); border-radius: 16px; border: 1px solid var(--border-color, #e2e8f0);">
      <div style="text-align: center; max-width: 750px; margin: 0 auto 2rem auto;">
        <span style="background: #fee2e2; color: #991b1b; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">Сравнение на мащаба</span>
        <h3 style="margin: 0.5rem 0 0.25rem 0; font-size: 1.6rem; color: var(--text-color);">${comp.title || 'ENIAC срещу устройство в джоба ти'}</h3>
        <p style="margin: 0; color: #64748b; font-size: 0.95rem;">Натиснете бутона на всяка категория, за да сравните параметрите:</p>
      </div>

      <div>
        ${itemsHtml}
      </div>
    </div>
  `;
}

export function init(comp) {
  const container = document.getElementById(comp.id);
  if (!container) return;

  const cards = container.querySelectorAll('.scale-comp-card');

  cards.forEach(card => {
    const btn = card.querySelector('.reveal-comp-btn');
    const grid = card.querySelector('.comp-facts-grid');
    const insight = card.querySelector('.comp-insight-box');

    if (btn && grid && insight) {
      btn.addEventListener('click', () => {
        grid.style.display = 'grid';
        insight.style.display = 'block';
        btn.style.display = 'none';
      });
    }
  });
}
