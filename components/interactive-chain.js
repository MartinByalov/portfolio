export function render(comp) {
  const cards = comp.cards || [
    { text: "1. Абак & Сметало", desc: "Нужда от механизирано смятане" },
    { text: "2. Двоична система (Лайбниц)", desc: "Кодиране с 0 и 1" },
    { text: "3. Перфокарти (Жакард)", desc: "Записване на инструкции за машина" },
    { text: "4. Булева алгебра (Бул)", desc: "Математическа логика (И/ИЛИ)" },
    { text: "5. Програма & Цикли (Ада Лъвлейс)", desc: "Алгоритмично управление" },
    { text: "6. Електронна лампа (Атанасов)", desc: "Бърза електронна схема" },
    { text: "7. Памет & Процесор (Фон Нойман)", desc: "Съхранена програма в оперативната памет" },
    { text: "8. Микропроцесор & AI", desc: "Микрочипове с милиарди елементи" }
  ];

  const cardsHtml = cards.map((c, idx) => `
    <div class="chain-node" style="background: var(--surface, #ffffff); border: 2px solid #3b82f6; border-radius: 12px; padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between; position: relative;">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span style="background: #3b82f6; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.9rem; flex-shrink: 0;">${idx + 1}</span>
        <div>
          <strong style="font-size: 0.95rem; color: var(--text-color); display: block;">${c.text || c}</strong>
          ${c.desc ? `<span style="font-size: 0.85rem; color: #64748b;">${c.desc}</span>` : ''}
        </div>
      </div>
      <i class="fas fa-link" style="color: #93c5fd; font-size: 1.1rem;"></i>
    </div>
  `).join('');

  return `
    <div id="${comp.id}" class="interactive-chain-container" style="margin: 3rem 0; padding: 2.25rem; background: var(--surface-alt, #f8fafc); border-radius: 16px; border: 1px solid var(--border-color, #e2e8f0);">
      <div style="text-align: center; max-width: 750px; margin: 0 auto 2rem auto;">
        <span style="background: #fef3c7; color: #b45309; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">Еволюция на идеите</span>
        <h3 style="margin: 0.5rem 0 0.25rem 0; font-size: 1.6rem; color: var(--text-color);">${comp.title || 'Нищо не започва от нулата'}</h3>
        <p style="margin: 0; color: #64748b; font-size: 0.95rem;">Всяко голямо откритие се гради върху идеите на предишното:</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
        ${cardsHtml}
      </div>
    </div>
  `;
}

export function init(comp) {
  // Static view for chain
}
