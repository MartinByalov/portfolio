// Inventor Investigation Cards Component (Detective Case)
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(b) {
  const cases = b.cases || [];
  const id = b.id || 'investigation-cards';
  const title = b.title || 'Детективски казус: Кой е създателят на първия електронен компютър?';

  const cardsHtml = cases.map((c, idx) => `
    <div class="inv-card" id="${id}-card-${idx}">
      <div class="inv-card-header">
        <span class="inv-case-badge"><i class="fas fa-search"></i> Доказателствен лист #${idx + 1}</span>
        <h4 class="inv-case-title">${esc(c.title)}</h4>
        <div class="inv-inventors"><i class="fas fa-user-secret"></i> <strong>Изобрететел(и):</strong> ${esc(c.inventors)}</div>
      </div>
      <div class="inv-card-body">
        <p class="inv-evidence-text"><strong>Доказателства:</strong> ${esc(c.evidence)}</p>
        <div class="inv-verdict-box">
          <i class="fas fa-gavel"></i> <strong>Статут / Присъда:</strong> ${esc(c.status)}
        </div>
      </div>
    </div>
  `).join('');

  return `
    <div class="inv-container" id="${esc(id)}">
      <div class="inv-header">
        <h3 class="inv-main-title"><i class="fas fa-balance-scale"></i> ${esc(title)}</h3>
        <p class="inv-sub">Изследвайте фактите от историческия съдебен процес от 1973 г. и разкрийте истината за първия електронен компютър:</p>
      </div>
      <div class="inv-cards-grid">
        ${cardsHtml}
      </div>
    </div>
  `;
}

export function init(b) {
  // Static interactive card layout with highlight states
  const root = document.getElementById(b.id || 'investigation-cards');
  if (!root) return;

  const cards = root.querySelectorAll('.inv-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('inv-highlight'));
      card.classList.add('inv-highlight');
    });
  });
}
