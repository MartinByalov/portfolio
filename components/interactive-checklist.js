// Interactive checklist — pre-submission check before handing in the task

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const id = comp.id || 'interactive-checklist';
  const title = comp.title || 'Чек-лист преди предаване';
  const items = comp.checkItems || [];
  const bare = comp.bare === true;

  const list = items.map((t, idx) =>
    '<label class="step-check-item checklist-check-item" data-step-index="' + idx + '">'
    + '<input type="checkbox" class="step-checkbox checklist-checkbox">'
    + '<span class="step-custom-box"><i class="fas fa-check"></i></span>'
    + '<span class="step-text-label">' + esc(t) + '</span>'
    + '</label>'
  ).join('');

  const progress = '<div class="step-progress-wrapper">'
    + '<div class="step-progress-meta"><span>Готовност за предаване:</span>'
    + '<strong class="step-progress-counter">0 от ' + items.length + ' изпълнени</strong></div>'
    + '<div class="step-progress-track"><div class="step-progress-bar" style="width: 0%;"></div></div>'
    + '</div>';

  const result = '<div class="check-q-result checklist-result" style="display:none;"></div>';

  if (bare) {
    return '<div class="interactive-checklist-bare" id="' + esc(id) + '">'
      + '<div class="steps-checklist-box">' + list + '</div>'
      + progress
      + result
      + '</div>';
  }

  return '<div class="interactive-step-guide-card interactive-checklist-card" id="' + esc(id) + '">'
    + '<div class="interactive-card-header">'
    + '<div class="interactive-card-badge"><i class="fas fa-list-check"></i><span>' + esc(title) + '</span></div>'
    + '</div>'
    + '<div class="steps-checklist-box">' + list + '</div>'
    + progress
    + result
    + '</div>';
}

export function init(comp) {
  const id = comp.id || 'interactive-checklist';
  const root = document.getElementById(id);
  if (!root) return;
  const boxes = root.querySelectorAll('.checklist-checkbox');
  const bar = root.querySelector('.step-progress-bar');
  const counter = root.querySelector('.step-progress-counter');
  const result = root.querySelector('.checklist-result');

  function refresh() {
    let done = 0;
    boxes.forEach(b => { if (b.checked) done++; });
    const total = boxes.length || 1;
    const pct = Math.round((done / total) * 100);
    if (bar) bar.style.width = pct + '%';
    if (counter) counter.textContent = done + ' от ' + boxes.length + ' изпълнени';
    boxes.forEach(b => {
      const label = b.closest('.step-check-item');
      if (label) label.classList.toggle('done', b.checked);
    });
    if (result) {
      if (done === boxes.length && boxes.length > 0) {
        result.innerHTML = '<i class="fas fa-circle-check"></i> Отлично! Готови сте да предадете задачата — всички точки са изпълнени.';
        result.className = 'check-q-result checklist-result result-success';
        result.style.display = 'block';
      } else {
        result.style.display = 'none';
      }
    }
  }

  boxes.forEach(b => b.addEventListener('change', refresh));
  refresh();
}
