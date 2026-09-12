// Category Sorter Component
// Assigns items to corresponding categories with instant verification

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const id = comp.id || 'category-sorter';
  const title = comp.title || 'Разпределете елементите по категории';
  const categories = comp.categories || [];
  const items = comp.items || [];

  const categoryOptions = categories.map(cat =>
    `<option value="${esc(cat.id)}">${esc(cat.name)}</option>`
  ).join('');

  const rows = items.map((item, idx) => `
    <div class="category-sorter-row" data-target-category="${esc(item.categoryId)}">
      <div class="sorter-item-info">
        <span class="sorter-item-num">${idx + 1}.</span>
        <span class="sorter-item-text">${esc(item.text)}</span>
      </div>
      <div class="sorter-item-select-wrap">
        <select class="sorter-category-select" aria-label="Изберете категория за елемент ${idx + 1}">
          <option value="">-- Изберете филтър / категория --</option>
          ${categoryOptions}
        </select>
        <span class="sorter-status-ico"></span>
      </div>
    </div>
  `).join('');

  return `
    <div class="interactive-category-sorter-card" id="${esc(id)}">
      <div class="interactive-card-header">
        <div class="interactive-card-badge">
          <i class="fas fa-filter"></i>
          <span>${esc(title)}</span>
        </div>
      </div>

      <div class="category-sorter-rows-container">
        ${rows}
      </div>

      <div class="category-sorter-actions">
        <button type="button" class="btn-activity sorter-submit">Провери</button>
        <button type="button" class="btn-activity sorter-reset" style="display:none;">Нов опит</button>
      </div>

      <div class="category-sorter-feedback" style="display:none;"></div>
    </div>
  `;
}

export function init(comp) {
  const id = comp.id || 'category-sorter';
  const root = document.getElementById(id);
  if (!root) return;

  const submitBtn = root.querySelector('.sorter-submit');
  const resetBtn = root.querySelector('.sorter-reset');
  const feedback = root.querySelector('.category-sorter-feedback');
  const rows = root.querySelectorAll('.category-sorter-row');
  const selects = root.querySelectorAll('.sorter-category-select');

  if (!submitBtn || !resetBtn || !feedback) return;

  submitBtn.addEventListener('click', () => {
    let answered = 0;
    selects.forEach(s => { if (s.value !== '') answered++; });

    if (answered < selects.length) {
      feedback.innerHTML = '<i class="fas fa-circle-exclamation"></i> Моля, изберете категория за всяка от опциите преди проверка!';
      feedback.className = 'category-sorter-feedback feedback-error';
      feedback.style.display = 'block';
      return;
    }

    let score = 0;
    rows.forEach(r => {
      const target = r.getAttribute('data-target-category') || '';
      const sel = r.querySelector('.sorter-category-select');
      const ico = r.querySelector('.sorter-status-ico');
      sel.disabled = true;

      if (sel.value === target) {
        score++;
        r.classList.add('sorter-correct');
        r.classList.remove('sorter-incorrect');
        if (ico) ico.innerHTML = '<i class="fas fa-circle-check text-emerald-600"></i>';
      } else {
        r.classList.add('sorter-incorrect');
        r.classList.remove('sorter-correct');
        if (ico) ico.innerHTML = '<i class="fas fa-circle-xmark text-rose-600"></i>';
      }
    });

    if (score === rows.length) {
      feedback.innerHTML = `<i class="fas fa-circle-check"></i> Отлично! Всички ${rows.length} филтъра са разпределени правилно!`;
      feedback.className = 'category-sorter-feedback feedback-success';
    } else {
      feedback.innerHTML = `<i class="fas fa-triangle-exclamation"></i> Резултат: ${score} от ${rows.length} верни категории.`;
      feedback.className = 'category-sorter-feedback feedback-info';
    }
    feedback.style.display = 'block';
    submitBtn.style.display = 'none';
    resetBtn.style.display = 'inline-flex';
  });

  resetBtn.addEventListener('click', () => {
    rows.forEach(r => {
      r.classList.remove('sorter-correct', 'sorter-incorrect');
      const sel = r.querySelector('.sorter-category-select');
      if (sel) { sel.value = ''; sel.disabled = false; }
      const ico = r.querySelector('.sorter-status-ico');
      if (ico) ico.innerHTML = '';
    });
    feedback.style.display = 'none';
    submitBtn.style.display = 'inline-flex';
    resetBtn.style.display = 'none';
  });
}
