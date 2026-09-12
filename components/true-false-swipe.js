// True/False swipe — swipe-style check of collaboration rules

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const id = comp.id || 'true-false-swipe';
  const title = comp.title || 'Вярно или Лъжа';
  const cards = comp.cards || [];

  const list = cards.map((c, i) =>
    '<div class="swipe-card" data-correct="' + (c.isTrue ? 'true' : 'false') + '">'
    + '<p class="swipe-statement"><span class="swipe-num">' + (i + 1) + '</span> ' + esc(c.statement || '') + '</p>'
    + '<div class="swipe-buttons">'
    + '<button type="button" class="btn-activity swipe-btn swipe-true" data-val="true"><i class="fas fa-check"></i> Вярно</button>'
    + '<button type="button" class="btn-activity swipe-btn swipe-false" data-val="false"><i class="fas fa-xmark"></i> Лъжа</button>'
    + '</div>'
    + '<div class="swipe-expl" style="display:none;"><i class="fas fa-lightbulb"></i> <span>' + esc(c.explanation || '') + '</span></div>'
    + '</div>'
  ).join('');

  return '<div class="true-false-swipe-card" id="' + esc(id) + '">'
    + '<div class="interactive-card-header">'
    + '<div class="interactive-card-badge"><i class="fas fa-arrows-left-right"></i><span>' + esc(title) + '</span></div>'
    + '</div>'
    + '<div class="swipe-list">' + list + '</div>'
    + '<div class="swipe-score"><span class="swipe-score-counter">Резултат: 0 от ' + cards.length + '</span></div>'
    + '</div>';
}

export function init(comp) {
  const id = comp.id || 'true-false-swipe';
  const root = document.getElementById(id);
  if (!root) return;
  const cards = root.querySelectorAll('.swipe-card');
  const scoreEl = root.querySelector('.swipe-score-counter');

  function refresh() {
    let score = 0, answered = 0;
    cards.forEach(c => {
      if (c.classList.contains('answered-ok')) { score++; answered++; }
      else if (c.classList.contains('answered-bad')) { answered++; }
    });
    if (scoreEl) scoreEl.textContent = 'Резултат: ' + score + ' от ' + cards.length + ' верни.';
  }

  cards.forEach(card => {
    const correct = card.getAttribute('data-correct');
    const expl = card.querySelector('.swipe-expl');
    card.querySelectorAll('.swipe-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-val');
        const ok = val === correct;
        card.classList.remove('answered-ok', 'answered-bad');
        card.classList.add(ok ? 'answered-ok' : 'answered-bad');
        card.querySelectorAll('.swipe-btn').forEach(b => b.classList.remove('picked'));
        btn.classList.add('picked');
        if (expl) expl.style.display = 'block';
        refresh();
      });
    });
  });
  refresh();
}
