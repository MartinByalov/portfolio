// Query Builder Component
// Interactive tool for assembling advanced search queries from building blocks

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const id = comp.id || 'query-builder';
  const title = comp.title || 'Конструктор на заявки: Сглобете точна търсеща заявка';
  const instruction = comp.instruction || 'Изберете и подредете блоковете в полето за търсене:';
  const blocks = comp.availableBlocks || [];

  const availableChips = blocks.map(b => `
    <button type="button" class="qb-block-chip qb-available-chip" data-block-id="${esc(b.id)}" data-block-text="${esc(b.text)}">
      <i class="fas fa-puzzle-piece"></i> <code>${esc(b.text)}</code>
    </button>
  `).join('');

  return `
    <div class="interactive-query-builder-card" id="${esc(id)}">
      <div class="interactive-card-header">
        <div class="interactive-card-badge">
          <i class="fas fa-layer-group"></i>
          <span>${esc(title)}</span>
        </div>
        <p class="interactive-card-lead">${esc(instruction)}</p>
      </div>

      <div class="qb-work-area">
        <div class="qb-target-search-bar">
          <div class="qb-search-bar-label"><i class="fas fa-magnifying-glass"></i> Търсещо поле (Вашата заявка):</div>
          <div class="qb-assembled-container" data-empty-hint="Кликнете върху блоковете отдолу, за да ги добавите тук...">
            <span class="qb-placeholder-text">Кликнете върху блоковете отдолу, за да ги добавите тук...</span>
          </div>
        </div>

        <div class="qb-palette-area">
          <div class="qb-palette-title"><i class="fas fa-cubes"></i> Налични оператори и термини:</div>
          <div class="qb-palette-chips">
            ${availableChips}
          </div>
        </div>

        <div class="qb-actions">
          <button type="button" class="btn-activity qb-check-btn">Провери заявката</button>
          <button type="button" class="btn-activity qb-clear-btn" style="background:#64748B;">Изчисти</button>
        </div>

        <div class="qb-feedback" style="display:none;"></div>
      </div>
    </div>
  `;
}

export function init(comp) {
  const id = comp.id || 'query-builder';
  const root = document.getElementById(id);
  if (!root) return;

  const assembledContainer = root.querySelector('.qb-assembled-container');
  const paletteContainer = root.querySelector('.qb-palette-chips');
  const checkBtn = root.querySelector('.qb-check-btn');
  const clearBtn = root.querySelector('.qb-clear-btn');
  const feedback = root.querySelector('.qb-feedback');
  const targetPattern = (comp.targetPattern || ['b1', 'b2', 'b3']).slice();
  const successMsg = comp.successMessage || 'Браво! Сглобихте точната заявка!';

  if (!assembledContainer || !paletteContainer || !checkBtn) return;

  function updatePlaceholder() {
    const chipsInAssembled = assembledContainer.querySelectorAll('.qb-block-chip');
    let placeholder = assembledContainer.querySelector('.qb-placeholder-text');
    if (chipsInAssembled.length === 0) {
      if (!placeholder) {
        placeholder = document.createElement('span');
        placeholder.className = 'qb-placeholder-text';
        placeholder.textContent = assembledContainer.dataset.emptyHint || 'Кликнете върху блоковете отдолу...';
        assembledContainer.appendChild(placeholder);
      }
    } else {
      if (placeholder) placeholder.remove();
    }
  }

  function attachChipEvents(chip) {
    chip.addEventListener('click', () => {
      const isInAssembled = chip.parentElement === assembledContainer;
      if (isInAssembled) {
        // Move back to palette
        chip.classList.remove('in-assembled');
        chip.classList.add('qb-available-chip');
        paletteContainer.appendChild(chip);
      } else {
        // Move to assembled
        chip.classList.remove('qb-available-chip');
        chip.classList.add('in-assembled');
        assembledContainer.appendChild(chip);
      }
      updatePlaceholder();
      if (feedback) feedback.style.display = 'none';
    });
  }

  root.querySelectorAll('.qb-block-chip').forEach(attachChipEvents);

  checkBtn.addEventListener('click', () => {
    const assembledChips = assembledContainer.querySelectorAll('.qb-block-chip');
    const currentIds = Array.prototype.slice.call(assembledChips).map(c => c.dataset.blockId);

    if (currentIds.length === 0) {
      feedback.innerHTML = '<i class="fas fa-circle-exclamation"></i> Моля, добавете поне един блок в полето за търсене.';
      feedback.className = 'qb-feedback feedback-error';
      feedback.style.display = 'block';
      return;
    }

    // Check if contains all required blocks and no unwanted ones
    const hasAllRequired = targetPattern.every(id => currentIds.includes(id));
    const hasNoExtra = currentIds.length === targetPattern.length;

    if (hasAllRequired && hasNoExtra) {
      feedback.innerHTML = `<i class="fas fa-circle-check"></i> ${esc(successMsg)}`;
      feedback.className = 'qb-feedback feedback-success';
    } else if (currentIds.includes('b4')) {
      feedback.innerHTML = '<i class="fas fa-triangle-exclamation"></i> Блокът <code>-футбол</code> не е необходим за търсене на учебни материали по киберсигурност.';
      feedback.className = 'qb-feedback feedback-error';
    } else {
      feedback.innerHTML = '<i class="fas fa-triangle-exclamation"></i> Заявката е непълна. Необходими са точната фраза за киберсигурност, домейнът на МОН и PDF разширението.';
      feedback.className = 'qb-feedback feedback-error';
    }
    feedback.style.display = 'block';
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const chips = assembledContainer.querySelectorAll('.qb-block-chip');
      chips.forEach(c => {
        c.classList.remove('in-assembled');
        c.classList.add('qb-available-chip');
        paletteContainer.appendChild(c);
      });
      updatePlaceholder();
      if (feedback) feedback.style.display = 'none';
    });
  }
}
