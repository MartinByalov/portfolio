// Step Header Component (Blog / Tutorial Style)

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const badgeClass = comp.badgeClass || (comp.tone ? `bg-${comp.tone}` : 'bg-blue');
  const badgeText = comp.badgeText || comp.badge || 'СТЪПКА';

  return `
    <section class="component step-header-wrapper" style="margin-top: 36px; margin-bottom: 16px;">
      <div class="sh" ${comp.id ? `id="${esc(comp.id)}"` : ''}>
        <span class="sh-badge ${esc(badgeClass)}">${esc(badgeText)}</span>
        <h2>${esc(comp.title || comp.heading || '')}</h2>
        <div class="line"></div>
      </div>
    </section>
  `;
}

export function init(comp) {}
