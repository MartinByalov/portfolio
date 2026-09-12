// Interactive Matching component
// Allows students to match concepts with definitions

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const id = comp.id || 'interactive-matching';
  const pairs = comp.pairs || [];
  const title = comp.title || 'Свържете понятията с правилното определение';

  const conceptOptions = pairs.map((p, idx) =>
    `<option value="${idx}">${esc(p.concept)}</option>`
  ).join('');

  const rows = pairs.map((p, idx) => {
    return `
      <div class="matching-item" data-correct-index="${idx}">
        <div class="matching-def">
          <span class="matching-num">${idx + 1}</span>
          <span class="matching-def-text">${esc(p.definition)}</span>
        </div>
        <div class="matching-picker">
          <select class="matching-select" aria-label="Изберете съответстващо понятие">
            <option value="">-- Изберете понятие --</option>
            ${conceptOptions}
          </select>
          <span class="matching-status-ico"></span>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="interactive-matching-card" id="${id}">
      <div class="interactive-card-header">
        <div class="interactive-card-badge">
          <span>${esc(title)}</span>
        </div>
      </div>
      <div class="matching-list">
        ${rows}
      </div>
      <div class="matching-actions">
        <button type="button" class="btn-activity matching-submit">
          Провери
        </button>
        <button type="button" class="btn-activity matching-reset" style="display:none;">
          Нов опит
        </button>
      </div>
      <div class="matching-feedback" style="display:none;"></div>
    </div>
  `;
}

export function init(comp) {
  const id = comp.id || 'interactive-matching';
  const root = document.getElementById(id);
  if (!root) return;

  const submitBtn = root.querySelector('.matching-submit');
  const resetBtn = root.querySelector('.matching-reset');
  const feedback = root.querySelector('.matching-feedback');
  const items = root.querySelectorAll('.matching-item');
  const selects = root.querySelectorAll('.matching-select');
  if (!submitBtn || !resetBtn || !feedback) return;

  submitBtn.addEventListener('click', () => {
    let answered = 0;
    selects.forEach(s => { if (s.value !== '') answered++; });
    if (answered < selects.length) {
      feedback.innerHTML = '<i class="fas fa-circle-exclamation"></i> Моля, изберете понятие за всяко едно от определенията преди проверка!';
      feedback.className = 'matching-feedback feedback-error';
      feedback.style.display = 'block';
      return;
    }

    let correctCount = 0;
    items.forEach(item => {
      const correctIdx = item.getAttribute('data-correct-index');
      const sel = item.querySelector('.matching-select');
      const ico = item.querySelector('.matching-status-ico');
      sel.disabled = true;
      if (sel.value === correctIdx) {
        correctCount++;
        item.classList.add('match-correct');
        item.classList.remove('match-incorrect');
        if (ico) ico.innerHTML = '<i class="fas fa-circle-check text-emerald-600"></i>';
      } else {
        item.classList.add('match-incorrect');
        item.classList.remove('match-correct');
        if (ico) ico.innerHTML = '<i class="fas fa-circle-xmark text-rose-600"></i>';
      }
    });

    if (correctCount === items.length) {
      feedback.innerHTML = `<i class="fas fa-circle-check"></i> Отлично! Всички ${correctCount} понятия са свързани правилно с техните дефиниции!`;
      feedback.className = 'matching-feedback feedback-success';
    } else {
      feedback.innerHTML = `<i class="fas fa-triangle-exclamation"></i> Резултат: ${correctCount} от ${items.length} верни.`;
      feedback.className = 'matching-feedback feedback-info';
    }
    feedback.style.display = 'block';
    submitBtn.style.display = 'none';
    resetBtn.style.display = 'inline-flex';
  });

  resetBtn.addEventListener('click', () => {
    items.forEach(item => {
      item.classList.remove('match-correct', 'match-incorrect');
      const sel = item.querySelector('.matching-select');
      if (sel) { sel.value = ''; sel.disabled = false; }
      const ico = item.querySelector('.matching-status-ico');
      if (ico) ico.innerHTML = '';
    });
    feedback.style.display = 'none';
    submitBtn.style.display = 'inline-flex';
    resetBtn.style.display = 'none';
  });
}
