// Scenario-based port selection for peripheral devices.

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function getPortSvg(port) {
  if (port.image || port.src) {
    return `<img src="${esc(port.image || port.src)}" alt="${esc(port.name || '')}" class="psc-port-img" style="max-height: 52px; width: auto; max-width: 100%; object-fit: contain;" />`;
  }
  const id = String(port.id || port.name || '').toLowerCase();

  if (id.includes('usb')) {
    return `<svg viewBox="0 0 120 70" width="100%" height="52" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="USB порт">
      <rect x="10" y="10" width="100" height="50" rx="6" fill="#1e293b" stroke="#94a3b8" stroke-width="3"/>
      <rect x="15" y="15" width="90" height="40" rx="3" fill="#0f172a" stroke="#475569" stroke-width="2"/>
      <rect x="19" y="19" width="82" height="16" fill="#2563eb" rx="2"/>
      <rect x="29" y="29" width="8" height="4" fill="#fbbf24" rx="1"/>
      <rect x="49" y="29" width="8" height="4" fill="#fbbf24" rx="1"/>
      <rect x="69" y="29" width="8" height="4" fill="#fbbf24" rx="1"/>
      <rect x="89" y="29" width="8" height="4" fill="#fbbf24" rx="1"/>
    </svg>`;
  }
  if (id.includes('video') || id.includes('hdmi') || id.includes('display')) {
    return `<svg viewBox="0 0 120 70" width="100%" height="52" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="HDMI / DisplayPort">
      <path d="M 15 15 L 105 15 Q 108 15 108 19 L 98 51 Q 96 55 92 55 L 28 55 Q 24 55 22 51 L 12 19 Q 12 15 15 15 Z" fill="#1e293b" stroke="#94a3b8" stroke-width="3"/>
      <path d="M 20 20 L 100 20 L 92 48 L 28 48 Z" fill="#0f172a"/>
      <rect x="30" y="30" width="60" height="8" rx="2" fill="#d97706"/>
      <circle cx="36" cy="34" r="1.5" fill="#fef08a"/>
      <circle cx="44" cy="34" r="1.5" fill="#fef08a"/>
      <circle cx="52" cy="34" r="1.5" fill="#fef08a"/>
      <circle cx="60" cy="34" r="1.5" fill="#fef08a"/>
      <circle cx="68" cy="34" r="1.5" fill="#fef08a"/>
      <circle cx="76" cy="34" r="1.5" fill="#fef08a"/>
      <circle cx="84" cy="34" r="1.5" fill="#fef08a"/>
    </svg>`;
  }
  if (id.includes('lan') || id.includes('net') || id.includes('rj')) {
    return `<svg viewBox="0 0 120 70" width="100%" height="52" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="LAN (RJ-45) порт">
      <rect x="20" y="10" width="80" height="50" rx="5" fill="#1e293b" stroke="#94a3b8" stroke-width="3"/>
      <path d="M 26 16 L 46 16 L 46 22 L 74 22 L 74 16 L 94 16 L 94 54 L 26 54 Z" fill="#0f172a" stroke="#475569" stroke-width="1.5"/>
      <line x1="34" y1="26" x2="34" y2="44" stroke="#fbbf24" stroke-width="2"/>
      <line x1="41" y1="26" x2="41" y2="44" stroke="#fbbf24" stroke-width="2"/>
      <line x1="48" y1="26" x2="48" y2="44" stroke="#fbbf24" stroke-width="2"/>
      <line x1="55" y1="26" x2="55" y2="44" stroke="#fbbf24" stroke-width="2"/>
      <line x1="62" y1="26" x2="62" y2="44" stroke="#fbbf24" stroke-width="2"/>
      <line x1="69" y1="26" x2="69" y2="44" stroke="#fbbf24" stroke-width="2"/>
      <line x1="76" y1="26" x2="76" y2="44" stroke="#fbbf24" stroke-width="2"/>
      <line x1="83" y1="26" x2="83" y2="44" stroke="#fbbf24" stroke-width="2"/>
    </svg>`;
  }
  if (id.includes('audio') || id.includes('sound') || id.includes('jack')) {
    return `<svg viewBox="0 0 120 70" width="100%" height="52" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Audio 3.5mm порт">
      <rect x="25" y="10" width="70" height="50" rx="6" fill="#1e293b" stroke="#94a3b8" stroke-width="3"/>
      <circle cx="60" cy="35" r="21" fill="#16a34a" stroke="#22c55e" stroke-width="3"/>
      <circle cx="60" cy="35" r="16" fill="#0f172a" stroke="#d1d5db" stroke-width="2"/>
      <circle cx="60" cy="35" r="8" fill="#020617"/>
      <circle cx="60" cy="35" r="4" fill="#fbbf24"/>
    </svg>`;
  }

  return `<svg viewBox="0 0 120 70" width="100%" height="52" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(port.name || 'Порт')}">
    <rect x="15" y="15" width="90" height="40" rx="5" fill="#1e293b" stroke="#94a3b8" stroke-width="3"/>
    <rect x="25" y="25" width="70" height="20" rx="3" fill="#0f172a"/>
  </svg>`;
}

export function render(comp) {
  const ports = comp.ports || [];
  return `
    <section id="${esc(comp.id || 'port-selection-challenge')}" class="component port-selection-challenge">
      <header class="psc-header">
        <h3>${esc(comp.title || 'Към кой порт ще го свържеш?')}</h3>
        <p>${esc(comp.instruction || '')}</p>
      </header>
      <div class="psc-scenario" aria-live="polite"></div>
      <div class="psc-panel" role="group" aria-label="Изберете порт">
        ${ports.map(port => `<button type="button" class="psc-port" data-port-id="${esc(port.id)}" title="${esc(port.name)}" aria-label="${esc(port.name)}">${getPortSvg(port)}</button>`).join('')}
      </div>
      <div class="psc-feedback" aria-live="polite"></div>
      <button type="button" class="psc-reset">Нов опит</button>
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
      ? `<span class="psc-progress">Ситуация ${current + 1} от ${scenarios.length}</span><div class="psc-device"><div><strong>${esc(scenario.device)}</strong>${scenario.prompt ? `<span>${esc(scenario.prompt)}</span>` : ''}</div></div>`
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
