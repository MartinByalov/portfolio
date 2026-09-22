// Scenario-based port selection for peripheral devices.

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

export function render(comp) {
  const ports = comp.ports || [];
  return `
    <section id="${esc(comp.id || 'port-selection-challenge')}" class="component port-selection-challenge">
      <header class="psc-header">
        <h3>${esc(comp.title || 'Къде ще го включиш?')}</h3>
        <p>${esc(comp.instruction || '')}</p>
      </header>
      <div class="psc-scenario" aria-live="polite"></div>
      <div class="psc-panel" role="group" aria-label="Изберете порт">
        ${ports.map(port => `<button type="button" class="psc-port" data-port-id="${esc(port.id)}"><i class="${esc(port.icon || 'fas fa-plug')}" aria-hidden="true"></i><span>${esc(port.name)}</span></button>`).join('')}
      </div>
      <div class="psc-feedback" aria-live="polite"></div>
      <button type="button" class="psc-reset">Започни отново</button>
    </section>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id || 'port-selection-challenge');
  if (!root) return;

  const scenarios = comp.scenarios || [];
  const scenarioEl = root.querySelector('.psc-scenario');
  const feedback = root.querySelector('.psc-feedback');
  const reset = root.querySelector('.psc-reset');
  const buttons = [...root.querySelectorAll('.psc-port')];
  let current = 0;
  let score = 0;
  let locked = false;

  function showScenario() {
    const scenario = scenarios[current];
    locked = false;
    feedback.className = 'psc-feedback';
    feedback.textContent = '';
    buttons.forEach(button => {
      button.disabled = false;
      button.classList.remove('correct', 'incorrect');
    });
    scenarioEl.innerHTML = scenario
      ? `<span class="psc-progress">Ситуация ${current + 1} от ${scenarios.length}</span><div class="psc-device"><i class="${esc(scenario.icon || 'fas fa-plug')}" aria-hidden="true"></i><div><strong>${esc(scenario.device)}</strong><span>${esc(scenario.prompt || 'Към кой порт ще го свържеш?')}</span></div></div>`
      : `<div class="psc-complete"><i class="fas fa-circle-check" aria-hidden="true"></i><strong>Резултат ${score} от ${scenarios.length}</strong><span>Разпознаваш подходящите портове за тези устройства.</span></div>`;
    root.querySelector('.psc-panel').style.display = scenario ? '' : 'none';
    reset.style.display = scenario ? 'none' : 'inline-flex';
  }

  buttons.forEach(button => button.addEventListener('click', () => {
    if (locked || !scenarios[current]) return;
    const scenario = scenarios[current];
    const selected = button.dataset.portId;
    if (selected !== scenario.portId) {
      button.classList.add('incorrect');
      feedback.className = 'psc-feedback incorrect';
      feedback.textContent = scenario.incorrectFeedback || 'Този порт не е предназначен за това свързване. Избери друг порт.';
      return;
    }
    locked = true;
    score++;
    button.classList.add('correct');
    buttons.forEach(item => { item.disabled = true; });
    feedback.className = 'psc-feedback correct';
    feedback.textContent = scenario.feedback || 'Това е подходящият порт.';
    window.setTimeout(() => {
      current++;
      showScenario();
    }, 900);
  }));

  reset.addEventListener('click', () => {
    current = 0;
    score = 0;
    showScenario();
  });

  showScenario();
}