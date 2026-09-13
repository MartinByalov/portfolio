// Wildcard Visualizer Component (* and ?)
// Interactive component explaining wildcards in Windows 11 with live pattern tester

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const id = comp.id || 'wildcard-visualizer';
  const title = comp.title || 'Глобални символи при търсене (* и ?) в Windows 11';
  const symbols = comp.symbols || [];

  const cardsHtml = symbols.map((item, idx) => {
    const examples = (item.examples || []).map(ex => `<li><code>${esc(ex)}</code></li>`).join('');
    return `
      <div class="wildcard-card" style="border-top-color: ${esc(item.color || '#3B82F6')}">
        <div class="wildcard-header">
          <span class="wildcard-symbol-badge" style="background: ${esc(item.color || '#3B82F6')}">${esc(item.symbol)}</span>
        </div>
        <p class="wildcard-rule">${esc(item.rule)}</p>
        <div class="wildcard-examples-box">
          <span class="wildcard-examples-title"><i class="fas fa-terminal"></i> Примери:</span>
          <ul class="wildcard-examples-list">${examples}</ul>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="interactive-wildcard-card" id="${esc(id)}">
      <div class="interactive-card-header">
        <div class="interactive-card-badge">
          <span>${esc(title)}</span>
        </div>
      </div>
      <div class="wildcard-grid">
        ${cardsHtml}
      </div>
    </div>
  `;
}

export function init(comp) {
  // Static visualizer cards
}
