// Interactive Fill component
// Lets students complete sentences by choosing appropriate concepts

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

function extractSentences(comp) {
  if (comp.sentences && Array.isArray(comp.sentences)) {
    return comp.sentences.map(s => ({
      text: s.text || s.sentence || '',
      answer: s.answer || '',
      prefix: s.prefix || '',
      suffix: s.suffix || ''
    }));
  }

  const items = [];
  for (let i = 1; i <= 20; i++) {
    const sKey = `sentence${i}`;
    const aKey = `answer${i}`;
    if (comp[sKey] !== undefined || comp[aKey] !== undefined) {
      items.push({
        text: comp[sKey] || '',
        answer: comp[aKey] || '',
        prefix: comp[`prefix${i}`] || '',
        suffix: comp[`suffix${i}`] || ''
      });
    }
  }

  if (items.length === 0) {
    items.push(
      { text: comp.sentence1 || '', answer: comp.answer1 || 'Асинхронното' },
      { text: comp.sentence2 || '', answer: comp.answer2 || 'Синхронното' }
    );
  }
  return items;
}

export function render(comp) {
  const id = comp.id || 'interactive-fill';
  const title = comp.title || 'Попълнете липсващата дума';
  const sentences = extractSentences(comp);

  const rawOptions = comp.options || Array.from(new Set(sentences.map(s => s.answer).filter(Boolean)));
  const sortedOptions = rawOptions.slice().sort();

  const optHtml = `<option value="">-- Изберете термин --</option>`
    + sortedOptions.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('');

  const rows = sentences.map((item, idx) => {
    // If text contains a blank indicator or starts with text
    return `
      <div class="fill-sentence-row" data-answer="${esc(item.answer)}">
        <span class="fill-item-num">${idx + 1}.</span>
        ${item.prefix ? `<span class="fill-prefix">${esc(item.prefix)} </span>` : ''}
        <span class="fill-drop-wrap">
          <select class="fill-select" aria-label="Термин ${idx + 1}">${optHtml}</select>
          <span class="fill-status-ico"></span>
        </span>
        <span class="fill-text"> ${esc(item.text)}</span>
        ${item.suffix ? `<span class="fill-suffix"> ${esc(item.suffix)}</span>` : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="interactive-fill-card" id="${id}">
      <div class="interactive-card-header">
        <div class="interactive-card-badge">
          <span>${esc(title)}</span>
        </div>
      </div>
      <div class="fill-sentences-wrap">
        ${rows}
      </div>
      <div class="fill-actions">
        <button type="button" class="btn-activity fill-submit">
          Провери
        </button>
        <button type="button" class="btn-activity fill-reset" style="display:none;">
          Нов опит
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
      feedback.innerHTML = `<i class="fas fa-circle-check"></i> Браво! Всички ${rows.length} изречения са попълнени напълно вярно!`;
      feedback.className = 'fill-feedback feedback-success';
    } else {
      feedback.innerHTML = `<i class="fas fa-triangle-exclamation"></i> Резултат: ${score} от ${rows.length} верни.`;
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
