// Interactive Fill component
// Lets students complete sentences by choosing appropriate concepts

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const id = comp.id || 'interactive-fill';
  const title = comp.title || 'Попълнете липсващата дума';
  const options = ['Синхронното', 'Асинхронното'];
  const optHtml = `<option value="">-- Изберете термин --</option>`
    + options.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('');

  return `
    <div class="interactive-fill-card" id="${id}">
      <div class="interactive-card-header">
        <div class="interactive-card-badge">
          <span>${esc(title)}</span>
        </div>
        <p class="interactive-card-lead">Изберете точния термин от падащото меню, за да допълните всяко от изреченията:</p>
      </div>
      <div class="fill-sentences-wrap">
        <div class="fill-sentence-row" data-answer="${esc(comp.answer1 || 'Асинхронното')}">
          <span class="fill-drop-wrap">
            <select class="fill-select" aria-label="Термин 1">${optHtml}</select>
            <span class="fill-status-ico"></span>
          </span>
          <span class="fill-text"> ${esc(comp.sentence1 || '')}</span>
        </div>
        <div class="fill-sentence-row" data-answer="${esc(comp.answer2 || 'Синхронното')}">
          <span class="fill-drop-wrap">
            <select class="fill-select" aria-label="Термин 2">${optHtml}</select>
            <span class="fill-status-ico"></span>
          </span>
          <span class="fill-text"> ${esc(comp.sentence2 || '')}</span>
        </div>
      </div>
      <div class="fill-actions">
        <button type="button" class="btn-activity fill-submit">
          Провери
        </button>
        <button type="button" class="btn-activity fill-reset" style="display:none;">
          <i class="fas fa-rotate-left"></i> Опитай отново
        </button>
      </div>
      <div class="fill-feedback" style="display:none;"></div>
    </div>
  `;
}

export function init(comp) {
  const id = comp.id || 'interactive-fill';
  const root = document.getElementById(id);
  if (!root) return;

  const submitBtn = root.querySelector('.fill-submit');
  const resetBtn = root.querySelector('.fill-reset');
  const feedback = root.querySelector('.fill-feedback');
  const rows = root.querySelectorAll('.fill-sentence-row');
  if (!submitBtn || !resetBtn || !feedback) return;

  submitBtn.addEventListener('click', () => {
    let answered = 0;
    rows.forEach(r => {
      const sel = r.querySelector('.fill-select');
      if (sel && sel.value !== '') answered++;
    });

    if (answered < rows.length) {
      feedback.innerHTML = '<i class="fas fa-circle-exclamation"></i> Моля, изберете термин за всяко от изреченията!';
      feedback.className = 'fill-feedback feedback-error';
      feedback.style.display = 'block';
      return;
    }

    let score = 0;
    rows.forEach(r => {
      const target = r.getAttribute('data-answer') || '';
      const sel = r.querySelector('.fill-select');
      const ico = r.querySelector('.fill-status-ico');
      sel.disabled = true;
      if (sel.value.trim().toLowerCase() === target.trim().toLowerCase()) {
        score++;
        r.classList.add('fill-correct');
        r.classList.remove('fill-incorrect');
        if (ico) ico.innerHTML = '<i class="fas fa-circle-check text-emerald-600"></i>';
      } else {
        r.classList.add('fill-incorrect');
        r.classList.remove('fill-correct');
        if (ico) ico.innerHTML = '<i class="fas fa-circle-xmark text-rose-600"></i>';
      }
    });

    if (score === rows.length) {
      feedback.innerHTML = '<i class="fas fa-circle-check"></i> Браво! И двете изречения са попълнени напълно вярно!';
      feedback.className = 'fill-feedback feedback-success';
    } else {
      feedback.innerHTML = `<i class="fas fa-triangle-exclamation"></i> Резултат: ${score} от ${rows.length} верни. Припомнете си кое обучение се случва в реално време (на живо) и кое позволява индивидуален график.`;
      feedback.className = 'fill-feedback feedback-info';
    }
    feedback.style.display = 'block';
    submitBtn.style.display = 'none';
    resetBtn.style.display = 'inline-flex';
  });

  resetBtn.addEventListener('click', () => {
    rows.forEach(r => {
      r.classList.remove('fill-correct', 'fill-incorrect');
      const sel = r.querySelector('.fill-select');
      if (sel) { sel.value = ''; sel.disabled = false; }
      const ico = r.querySelector('.fill-status-ico');
      if (ico) ico.innerHTML = '';
    });
    feedback.style.display = 'none';
    submitBtn.style.display = 'inline-flex';
    resetBtn.style.display = 'none';
  });
}
