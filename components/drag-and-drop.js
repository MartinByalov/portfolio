// Swap-to-match card matching component
// Students reorder two independent columns (names <-> logos) by dragging cards.
// The check compares row-by-row: a name on row i must match the logo on row i.

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

// Normalise both supported data shapes into {id, text, image, alt} cards
function buildItems(comp) {
  if (comp.leftItems && comp.rightItems) {
    return {
      left: comp.leftItems.map(item => ({
        id: String(item.id),
        text: item.text || '',
        image: item.image || null,
        alt: item.alt || ''
      })),
      right: comp.rightItems.map(item => ({
        id: String(item.id),
        text: item.text || '',
        image: item.image || null,
        alt: item.alt || ''
      }))
    };
  }
  // pairs format: term <-> definition
  if (comp.pairs) {
    return {
      left: comp.pairs.map((p, i) => ({
        id: String(i),
        text: p.term || '',
        image: null,
        alt: ''
      })),
      right: comp.pairs.map((p, i) => ({
        id: String(i),
        text: p.definition || '',
        image: null,
        alt: ''
      }))
    };
  }
  return { left: [], right: [] };
}

function shuffle(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

function renderCard(item, col) {
  const img = item.image
    ? '<img src="' + esc(item.image) + '" alt="' + esc(item.alt) + '" class="dd-card-img" onerror="if(this.src.includes(\'cdn.jsdelivr.net\')){this.src=this.src.replace(\'cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/\',\'raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/\');}">'
    : '';
  const txt = item.text ? '<span class="dd-card-text">' + esc(item.text) + '</span>' : '';
  return '<div class="dd-card dd-draggable" draggable="true" data-dd-id="' + esc(item.id) + '" data-dd-col="' + esc(col) + '">'
    + img + txt
    + '</div>';
}

export function render(comp) {
  const id = comp.id || 'drag-and-drop';
  const title = comp.title || 'Свържете карти чрез размяна на места';
  const desc = comp.description || '';
  const items = buildItems(comp);

  const leftShuffled = shuffle(items.left);
  const rightShuffled = shuffle(items.right);

  const leftHtml = leftShuffled.map(c => renderCard(c, 'left')).join('');
  const rightHtml = rightShuffled.map(c => renderCard(c, 'right')).join('');
  const arrowsHtml = (items.left || []).map(() => '<div class="dd-arrow"><i class="fas fa-arrow-right"></i></div>').join('');

  return '<div class="interactive-dd-card" id="' + esc(id) + '">'
    + '<div class="interactive-card-header">'
    + '<div class="interactive-card-badge"><span>' + esc(title) + '</span></div>'
    + (desc ? '<p class="interactive-card-lead">' + esc(desc) + '</p>' : '')
    + '</div>'
    + '<div class="dd-board">'
    + '<div class="dd-column dd-left" data-dd-col="left">' + leftHtml + '</div>'
    + '<div class="dd-arrows">' + arrowsHtml + '</div>'
    + '<div class="dd-column dd-right" data-dd-col="right">' + rightHtml + '</div>'
    + '</div>'
    + '<div class="dd-actions">'
    + '<button type="button" class="btn-activity dd-submit">Провери</button>'
    + '<button type="button" class="btn-activity dd-reset" style="display:none;">Нов опит</button>'
    + '</div>'
    + '<div class="dd-feedback" style="display:none;"></div>'
    + '</div>';
}
function getDragAfterElement(column, y) {
  const els = Array.prototype.slice.call(column.querySelectorAll('.dd-card:not(.dd-dragging)'));
  let closest = { offset: -Infinity, element: null };
  els.forEach(el => {
    const box = el.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) closest = { offset: offset, element: el };
  });
  return closest.element;
}

export function init(comp) {
  const id = comp.id || 'drag-and-drop';
  const root = document.getElementById(id);
  if (!root) return;

  const submitBtn = root.querySelector('.dd-submit');
  const resetBtn = root.querySelector('.dd-reset');
  const feedback = root.querySelector('.dd-feedback');
  const columns = root.querySelectorAll('.dd-column');
  if (!submitBtn || !resetBtn || !feedback || !columns.length) return;

  // Reorder cards live while dragging, only inside their own column (swap positions).
  columns.forEach(col => {
    col.addEventListener('dragover', e => {
      e.preventDefault();
      const dragging = col.querySelector('.dd-dragging');
      if (!dragging || dragging.dataset.ddCol !== col.dataset.ddCol) return;
      const afterEl = getDragAfterElement(col, e.clientY);
      if (afterEl == null) col.appendChild(dragging);
      else col.insertBefore(dragging, afterEl);
    });
    col.addEventListener('drop', e => {
      e.preventDefault();
      const dragging = col.querySelector('.dd-dragging');
      if (dragging) dragging.classList.remove('dd-dragging');
    });
  });

  root.querySelectorAll('.dd-card').forEach(card => {
    card.addEventListener('dragstart', () => {
      card.classList.add('dd-dragging');
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dd-dragging');
    });
  });

  submitBtn.addEventListener('click', () => {
    const leftCards = root.querySelectorAll('.dd-column.dd-left .dd-card');
    const rightCards = root.querySelectorAll('.dd-column.dd-right .dd-card');
    let correct = 0;
    const total = Math.min(leftCards.length, rightCards.length);
    for (let i = 0; i < leftCards.length; i++) {
      const lc = leftCards[i];
      const rc = rightCards[i];
      if (!lc || !rc) continue;
      const ok = lc.dataset.ddId === rc.dataset.ddId;
      if (ok) correct++;
      lc.classList.remove(ok ? 'dd-wrong' : 'dd-correct');
      lc.classList.add(ok ? 'dd-correct' : 'dd-wrong');
      rc.classList.remove(ok ? 'dd-wrong' : 'dd-correct');
      rc.classList.add(ok ? 'dd-correct' : 'dd-wrong');
    }
    if (correct === total && total > 0) {
      feedback.innerHTML = '<i class="fas fa-circle-check"></i> Отлично!';
      feedback.className = 'dd-feedback feedback-success';
    } else {
      feedback.innerHTML = '<i class="fas fa-triangle-exclamation"></i> Резултат: ' + correct + ' от ' + total + ' верни.';
      feedback.className = 'dd-feedback feedback-info';
    }
    feedback.style.display = 'block';
    submitBtn.style.display = 'none';
    resetBtn.style.display = 'inline-flex';
  });

  resetBtn.addEventListener('click', () => {
    const leftCol = root.querySelector('.dd-left');
    const rightCol = root.querySelector('.dd-right');
    if (leftCol) {
      shuffle(Array.prototype.slice.call(leftCol.querySelectorAll('.dd-card'))).forEach(c => {
        c.classList.remove('dd-correct', 'dd-wrong');
        leftCol.appendChild(c);
      });
    }
    if (rightCol) {
      shuffle(Array.prototype.slice.call(rightCol.querySelectorAll('.dd-card'))).forEach(c => {
        c.classList.remove('dd-correct', 'dd-wrong');
        rightCol.appendChild(c);
      });
    }
    feedback.style.display = 'none';
    submitBtn.style.display = 'inline-flex';
    resetBtn.style.display = 'none';
  });
}