// Overview Cards Grid Component (Blog / Tutorial Style)

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const cards = (comp.cards || []).map(card => {
    const iconHtml = card.iconHtml 
      ? card.iconHtml 
      : (card.icon && card.icon.startsWith('fa') ? `<i class="${esc(card.icon)}"></i>` : esc(card.icon || '📌'));

    return `
      <div class="ov-card" ${card.id ? `id="${esc(card.id)}"` : ''}>
        <div class="icon">${iconHtml}</div>
        <h3>${esc(card.title)}</h3>
        <p>${esc(card.desc || card.description || '')}</p>
        ${card.badge ? `<span style="display:inline-block; margin-top:8px; font-size:11px; padding:2px 8px; border-radius:12px; background:var(--tut-light, #f1f5f9); color:var(--tut-muted, #64748b); font-weight:700;">${esc(card.badge)}</span>` : ''}
      </div>
    `;
  }).join('');

  return `
    <section class="component overview-container" ${comp.id ? `id="${esc(comp.id)}"` : ''} style="margin: 20px 0 32px 0;">
      <div class="overview">
        ${cards}
      </div>
    </section>
  `;
}

export function init(comp) {
  // Overview cards are static interactive hover elements
}
