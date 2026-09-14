export function render(comp) {
  const items = comp.items || [];

  const itemsHtml = items.map(it => `
    <div style="background: var(--surface, #ffffff); border-left: 4px solid #3b82f6; border-radius: 0 10px 10px 0; padding: 1rem 1.25rem; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
      <strong style="color: #1e293b; font-size: 1.05rem; display: block; margin-bottom: 0.25rem;">${it.term}</strong>
      <span style="color: #475569; font-size: 0.95rem; line-height: 1.5;">${it.definition}</span>
    </div>
  `).join('');

  return `
    <div id="${comp.id}" class="glossary-list-container" style="margin: 3rem 0; padding: 2rem; background: var(--surface-alt, #f8fafc); border-radius: 16px; border: 1px solid var(--border-color, #e2e8f0);">
      <h3 style="margin: 0 0 1.5rem 0; font-size: 1.4rem; color: var(--text-color); display: flex; align-items: center; gap: 0.5rem;">
        <i class="fas fa-book-open" style="color: #3b82f6;"></i> ${comp.title || 'Ключови понятия'}
      </h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
        ${itemsHtml}
      </div>
    </div>
  `;
}

export function init(comp) {
  // Static view
}
