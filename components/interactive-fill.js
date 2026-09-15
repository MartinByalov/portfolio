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

  const inputType = comp.inputType || 'select';
  const optHtml = `<option value="">-- Изберете термин --</option>`
    + sortedOptions.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('');
  const rows = sentences.map((item, idx) => {
    let inputControl = '';
    if (inputType === 'text') {
      inputControl = `<input type="text" class="fill-input-text fill-select" aria-label="Термин ${idx + 1}" placeholder="Въведете тук...">`;
    } else {
      inputControl = `<select class="fill-select" aria-label="Термин ${idx + 1}">${optHtml}</select>`;
    }
    const dropWrap = `<span class="fill-drop-wrap">${inputControl}<span class="fill-status-ico"></span></span>`;
    
    let contentHtml = '';
    if (item.text.includes('[blank]')) {
      contentHtml = esc(item.text).replace('\[blank\]', dropWrap);
      if (item.prefix) contentHtml = `<span class="fill-prefix">${esc(item.prefix)} </span>` + contentHtml;
      if (item.suffix) contentHtml = contentHtml + `<span class="fill-suffix"> ${esc(item.suffix)}</span>`;
    } else {
      contentHtml = (item.prefix ? `<span class="fill-prefix">${esc(item.prefix)} </span>` : '') +
                    dropWrap +
                    `<span class="fill-text"> ${esc(item.text)}</span>` +
                    (item.suffix ? `<span class="fill-suffix"> ${esc(item.suffix)}</span>` : '');
    }

    return `
      <div class="fill-sentence-row" data-answer="${esc(item.answer)}">
        <span class="fill-item-num">${idx + 1}.</span>
        <span class="fill-text-wrapper">${contentHtml}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="interactive-fill-card" id="${id}">
      <header class="interactive-fill-header">
        <h3>${esc(title)}</h3>
      </header>
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

    if (answered === 0) {
      feedback.innerHTML = '<i class="fas fa-circle-exclamation"></i> Моля, попълнете поне едно изречение!';
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
      const val = sel.value.trim().toLowerCase();
      if (val === '') {
        // If it's empty, we just skip styling for incorrect/correct, but we disable it
        r.classList.remove('fill-correct', 'fill-incorrect');
        
      } else if (val === target.trim().toLowerCase()) {
        score++;
        r.classList.add('fill-correct');
        r.classList.remove('fill-incorrect');
        
      } else {
        r.classList.add('fill-incorrect');
        r.classList.remove('fill-correct');
        
        if (sel.tagName.toUpperCase() === 'INPUT') {
          sel.value = target;
        }
      }
    });

    feedback.textContent = `Резултат ${score} от ${rows.length}`;
    feedback.className = `fill-feedback ${score === rows.length ? 'feedback-success' : 'feedback-info'}`;
    feedback.style.display = 'block';
    submitBtn.style.display = 'none';
    resetBtn.style.display = 'inline-flex';
  });

  resetBtn.addEventListener('click', () => {
    let allCorrect = true;
    rows.forEach(r => {
      if (!r.classList.contains('fill-correct')) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      // If everything was correct and they clicked reset, they probably want to restart the whole task
      rows.forEach(r => {
        r.classList.remove('fill-correct', 'fill-incorrect');
        const sel = r.querySelector('.fill-select');
        if (sel) { sel.value = ''; sel.disabled = false; }
      });
    } else {
      // Partially correct, just keep the correct ones
      rows.forEach(r => {
        const isCorrect = r.classList.contains('fill-correct');
        const sel = r.querySelector('.fill-select');
        if (!isCorrect) {
          r.classList.remove('fill-correct', 'fill-incorrect');
          if (sel) { sel.value = ''; sel.disabled = false; }
        }
      });
    }

    feedback.style.display = 'none';
    submitBtn.style.display = 'inline-flex';
    resetBtn.style.display = 'none';
  });
}
