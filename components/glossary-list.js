export function render(comp) {
  const items = comp.items || [];

  const itemsHtml = items.map(it => `
    <div class="glossary-row">
      <strong class="glossary-row-term">${it.term}</strong>
      <span class="glossary-row-def">${it.definition}</span>
    </div>
  `).join('');

  return `
    <div id="${comp.id}" class="glossary-list-container">
      <div class="glossary-list">
        ${itemsHtml}
      </div>
    </div>
  `;
}

export function init(comp) {
  // Static view
}
