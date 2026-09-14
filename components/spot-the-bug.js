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
    '<div class="bug-card" data-bug-idx="' + i + '" tabindex="0" role="button" aria-expanded="false" style="cursor: pointer;">'
    + '<div class="bug-card-header" style="display: flex; align-items: center; justify-content: space-between; gap: 10px; width: 100%; flex-wrap: wrap;">'
    + '  <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 200px;">'
    + '    <span class="bug-card-num">' + (i + 1) + '</span>'
    + '    <span class="bug-card-title">' + esc(b.bugTitle || ('Ситуация ' + (i + 1))) + '</span>'
    + '  </div>'
    + '  <span class="bug-card-hint" style="white-space: nowrap;"><i class="fas fa-magnifying-glass"></i> Провери</span>'
    + '</div>'
    + '<div class="bug-card-expl" style="display:none; margin-top: 10px; border-left: 3px solid #f59e0b; padding-left: 12px; width: 100%; box-sizing: border-box;">'
    + esc(b.explanation || '')
    + '</div>'
    + '</div>'
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
  if (!root || root.dataset.initialized === 'true') return;
  root.dataset.initialized = 'true';

  const cards = root.querySelectorAll('.bug-card');
  cards.forEach(c => {
    const toggleCard = (e) => {
      if (e) e.preventDefault();
      const expl = c.querySelector('.bug-card-expl');
      const hint = c.querySelector('.bug-card-hint');
      const isOpen = c.classList.contains('revealed');
      c.classList.toggle('revealed', !isOpen);
      c.setAttribute('aria-expanded', String(!isOpen));
      if (expl) expl.style.display = isOpen ? 'none' : 'block';
      if (hint) {
        hint.innerHTML = isOpen
          ? '<i class="fas fa-magnifying-glass"></i> Провери'
          : '<i class="fas fa-check-circle"></i> Скрий';
      }
    };

    c.addEventListener('click', toggleCard);
    c.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCard(e);
      }
    });
  });
}


