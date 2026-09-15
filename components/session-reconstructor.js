// Reconstruct a completed computer task backwards to expose operating-system dependencies.

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

export function render(comp) {
  const stages = comp.stages || [];
  return `<section class="session-reconstructor" id="${esc(comp.id)}"><header><h3>${esc(comp.title)}</h3><p>${esc(comp.instruction || '')}</p></header><div class="sr-timeline">${stages.map((stage, index) => `<article class="sr-stage" data-answer="${esc(stage.correct)}"><div class="sr-stage-head"><span>${stages.length - index}</span><div><strong>${esc(stage.evidence)}</strong><small>${esc(stage.visible)}</small></div></div><p>${esc(stage.question)}</p><fieldset><legend>Коя зависимост трябва да възстановим?</legend>${(stage.options || []).map(option => `<label><input type="radio" name="${esc(comp.id)}-${index}" value="${esc(option.id)}"><span>${esc(option.text)}</span></label>`).join('')}</fieldset><div class="sr-feedback" hidden></div></article>`).join('')}</div><div class="sr-actions"><button type="button" class="btn-activity sr-check">Провери</button><button type="button" class="btn-activity sr-reset" hidden>Нов опит</button><div class="sr-result" hidden aria-live="polite"></div></div></section>`;
}

export function init(comp) {
  const root = document.getElementById(comp.id);
  if (!root) return;
  const stages = comp.stages || [];
  const cards = [...root.querySelectorAll('.sr-stage')];
  const check = root.querySelector('.sr-check');
  const reset = root.querySelector('.sr-reset');
  const result = root.querySelector('.sr-result');
  check?.addEventListener('click', () => {
    const selections = cards.map(card => card.querySelector('input:checked'));
    if (selections.some(choice => !choice)) {
      result.hidden = false; result.className = 'sr-result info'; result.textContent = 'Изберете зависимост за всеки етап от реконструкцията.'; return;
    }
    let score = 0;
    cards.forEach((card, index) => {
      const stage = stages[index];
      const selected = card.querySelector('input:checked').value;
      const option = stage.options.find(item => item.id === selected);
      const correct = selected === stage.correct;
      if (correct) score++;
      card.classList.toggle('correct', correct);
      card.classList.toggle('incorrect', !correct);
      card.querySelectorAll('input').forEach(input => { input.disabled = true; });
      const feedback = card.querySelector('.sr-feedback');
      if (feedback) { feedback.hidden = false; feedback.textContent = option?.feedback || ''; }
    });
    result.hidden = false; result.className = `sr-result ${score === cards.length ? 'success' : 'info'}`; result.textContent = `Резултат ${score} от ${cards.length}`;
    check.hidden = true; reset.hidden = false;
  });
  reset?.addEventListener('click', () => {
    cards.forEach(card => { card.classList.remove('correct', 'incorrect'); card.querySelectorAll('input').forEach(input => { input.checked = false; input.disabled = false; }); card.querySelector('.sr-feedback').hidden = true; });
    result.hidden = true; check.hidden = false; reset.hidden = true;
  });
}