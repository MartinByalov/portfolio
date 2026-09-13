// Spot-the-bug — find collaboration mistakes in a shared document

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const id = comp.id || 'spot-the-bug';
  const title = comp.title || 'Разпознаване на грешка';
  const scenario = comp.scenarioDescription || '';
  const bugs = comp.bugsToFind || [];

  const cards = bugs.map((b, i) =>
    '<button type="button" class="bug-card" data-bug-idx="' + i + '">'
    + '<span class="bug-card-num">' + (i + 1) + '</span>'
    + '<span class="bug-card-title">' + esc(b.bugTitle || ('Ситуация ' + (i + 1))) + '</span>'
    + '<span class="bug-card-hint"><i class="fas fa-magnifying-glass"></i> Провери</span>'
    + '<span class="bug-card-expl" style="display:none;">' + esc(b.explanation || '') + '</span>'
    + '</button>'
  ).join('');

  return '<div class="spot-bug-card" id="' + esc(id) + '">'
    + '<div class="interactive-card-header">'
    + '<div class="interactive-card-badge"><span>' + esc(title) + '</span></div>'
    + (scenario ? '<p class="interactive-card-lead">' + esc(scenario) + '</p>' : '')
    + '</div>'
    + '<div class="bug-grid">' + cards + '</div>'
    + '</div>';
}

export function init(comp) {
  const id = comp.id || 'spot-the-bug';
  const root = document.getElementById(id);
  if (!root) return;
  const cards = root.querySelectorAll('.bug-card');
  cards.forEach(c => {
    c.addEventListener('click', () => {
      const expl = c.querySelector('.bug-card-expl');
      const isOpen = c.classList.contains('revealed');
      c.classList.toggle('revealed', !isOpen);
      if (expl) expl.style.display = isOpen ? 'none' : 'block';
    });
  });
}

