// Sequence Builder - arrange process steps and verify their order

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function shuffled(items) {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function stepsMarkup(steps) {
  return steps.map(step => `
    <li class="seq-step" data-step-id="${esc(step.id)}">
      <span class="seq-icon"><i class="${esc(step.icon)}"></i></span>
      <span><strong>${esc(step.label)}</strong><small>${esc(step.description)}</small></span>
      <span class="seq-controls"><button type="button" class="seq-up" aria-label="Премести нагоре"><i class="fas fa-arrow-up"></i></button><button type="button" class="seq-down" aria-label="Премести надолу"><i class="fas fa-arrow-down"></i></button></span>
    </li>`).join('');
}

export function render(comp) {
  const steps = comp.steps || [];
  const borderCls = comp.lightBorder ? ' lb-light-border' : '';
  const resetBtnMarkup = comp.hideReset ? '' : `<button type="button" class="btn-activity seq-reset">Нов опит</button>`;
  const instrMarkup = comp.instruction ? `<p>${esc(comp.instruction)}</p>` : '';
  return `
    <section class="sequence-builder${borderCls}" id="${esc(comp.id)}">
      <header class="seq-header"><h3>${esc(comp.title)}</h3>${instrMarkup}</header>
      <ol class="seq-list">${stepsMarkup(shuffled(steps))}</ol>
      <div class="seq-actions">
        <div class="seq-buttons-row">
          <button type="button" class="btn-activity seq-check">Провери</button>
          ${resetBtnMarkup}
        </div>
        <div class="seq-feedback" aria-live="polite"></div>
      </div>
    </section>`;
}

export function init(comp) {
  const root = document.getElementById(comp.id);
  if (!root) return;
  const list = root.querySelector('.seq-list');
  const feedback = root.querySelector('.seq-feedback');
  const expected = (comp.steps || []).map(step => String(step.id));

  function bindControls() {
    list.querySelectorAll('.seq-step').forEach(item => {
      item.querySelector('.seq-up').onclick = () => {
        if (item.previousElementSibling) list.insertBefore(item, item.previousElementSibling);
      };
      item.querySelector('.seq-down').onclick = () => {
        if (item.nextElementSibling) list.insertBefore(item.nextElementSibling, item);
      };
    });
  }
  const checkBtn = root.querySelector('.seq-check');
  if (checkBtn) {
    checkBtn.addEventListener('click', () => {
      const actual = [...list.querySelectorAll('.seq-step')].map(item => item.dataset.stepId);
      const correct = actual.filter((id, index) => id === expected[index]).length;
      list.querySelectorAll('.seq-step').forEach((item, index) => item.classList.toggle('correct', item.dataset.stepId === expected[index]));
      feedback.className = `seq-feedback ${correct === expected.length ? 'success' : 'info'}`;
      feedback.textContent = `Резултат ${correct} от ${expected.length}`;
    });
  }
  const resetBtn = root.querySelector('.seq-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      list.innerHTML = stepsMarkup(shuffled(comp.steps || []));
      feedback.textContent = '';
      list.querySelectorAll('.seq-step').forEach(item => item.classList.remove('correct'));
      bindControls();
    });
  }
  bindControls();
}