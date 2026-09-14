// Generation Hardware Sorter / Constructor Component
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(b) {
  const gens = b.generations || [];
  const id = b.id || 'generation-hardware-sorter';
  const title = b.title || 'Конструктор: Разпределете 5-те поколения компютри';

  const rowsHtml = gens.map((g, idx) => `
    <div class="ghs-row" id="${id}-gen-${idx}">
      <div class="ghs-gen-col">
        <span class="ghs-gen-num">${idx + 1}</span>
        <strong class="ghs-gen-title">${esc(g.gen)}</strong>
      </div>
      <div class="ghs-spec-col">
        <div class="ghs-chip element"><i class="fas fa-microchip"></i> <strong>Елемент:</strong> ${esc(g.element)}</div>
        <div class="ghs-chip speed"><i class="fas fa-tachometer-alt"></i> <strong>Скорост:</strong> ${esc(g.speed)}</div>
        <div class="ghs-chip size"><i class="fas fa-box"></i> <strong>Особености:</strong> ${esc(g.size)}</div>
      </div>
    </div>
  `).join('');

  return `
    <div class="ghs-container" id="${esc(id)}">
      <div class="ghs-header">
        <h3 class="ghs-main-title"><i class="fas fa-layer-group"></i> ${esc(title)}</h3>
        <p class="ghs-sub">Сравнете градивните елементи, бързодействието и размерите на 5-те поколения ЕИМ:</p>
      </div>
      <div class="ghs-table-wrap">
        ${rowsHtml}
      </div>
    </div>
  `;
}

export function init(b) {
  const root = document.getElementById(b.id || 'generation-hardware-sorter');
  if (!root) return;

  const rows = root.querySelectorAll('.ghs-row');
  rows.forEach(r => {
    r.addEventListener('mouseenter', () => {
      r.classList.add('ghs-row-active');
    });
    r.addEventListener('mouseleave', () => {
      r.classList.remove('ghs-row-active');
    });
  });
}
