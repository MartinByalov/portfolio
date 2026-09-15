// OS Control Room - scenario-based operating-system diagnosis lab

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

export function render(comp) {
  const incidents = comp.incidents || [];
  const first = incidents[0] || {};
  const cards = incidents.map((incident, index) => `
    <article class="oscr-incident" data-answer="${esc(incident.correct)}">
      <div class="oscr-incident-head">
        <span class="oscr-incident-number">${String(index + 1).padStart(2, '0')}</span>
        <div><strong>${esc(incident.title)}</strong><span>${esc(incident.signal)}</span></div>
      </div>
      <p>${esc(incident.description)}</p>
      <label class="oscr-select-label" for="${esc(comp.id)}-choice-${index}">Изберете първата системна проверка:</label>
      <select id="${esc(comp.id)}-choice-${index}" class="oscr-choice">
        <option value="">Изберете действие</option>
        ${(incident.options || []).map(option => `<option value="${esc(option.id)}">${esc(option.text)}</option>`).join('')}
      </select>
      <div class="oscr-explanation" hidden></div>
    </article>
  `).join('');

  return `
    <section class="os-control-room" id="${esc(comp.id)}">
      <header class="oscr-header">
        <div>
          <h2>${esc(comp.title || 'OS Control Room')}</h2>
          <p>${esc(comp.intro || '')}</p>
        </div>
        <div class="oscr-status" aria-live="polite"><span class="oscr-status-light"></span><strong>Системата чака решение</strong></div>
      </header>
      <div class="oscr-dashboard">
        <div><span>Процеси</span><strong>5 активни</strong></div>
        <div><span>Памет</span><strong>68% използвана</strong></div>
        <div><span>Устройства</span><strong>1 предупреждение</strong></div>
        <div><span>Права</span><strong>Стандартен акаунт</strong></div>
      </div>
      <p class="oscr-instruction">Вие сте системният диспечер. Прочетете сигнала и изберете най-подходящата първа проверка. Не търсете най-драматичното действие - търсете причината.</p>
      <div class="oscr-grid">${cards}</div>
      <div class="oscr-actions">
        <button type="button" class="btn-activity oscr-check">Провери</button>
        <button type="button" class="btn-activity oscr-reset" hidden>Нов опит</button>
        <div class="oscr-result" hidden aria-live="polite"></div>
      </div>
      <p class="oscr-footnote">Диагностиката започва с наблюдение, а не с произволна промяна на системата.</p>
    </section>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id);
  if (!root) return;
  const incidents = comp.incidents || [];
  const choices = [...root.querySelectorAll('.oscr-choice')];
  const check = root.querySelector('.oscr-check');
  const reset = root.querySelector('.oscr-reset');
  const result = root.querySelector('.oscr-result');
  const status = root.querySelector('.oscr-status strong');

  check?.addEventListener('click', () => {
    if (choices.some(choice => !choice.value)) {
      result.hidden = false;
      result.className = 'oscr-result error';
      result.textContent = 'Изберете действие за всеки сигнал преди проверка.';
      return;
    }
    let score = 0;
    choices.forEach((choice, index) => {
      const incident = incidents[index] || {};
      const card = choice.closest('.oscr-incident');
      const explanation = card.querySelector('.oscr-explanation');
      const selected = (incident.options || []).find(option => option.id === choice.value);
      const correct = choice.value === incident.correct;
      if (correct) score++;
      card.classList.toggle('correct', correct);
      card.classList.toggle('incorrect', !correct);
      choice.disabled = true;
      explanation.hidden = false;
      explanation.textContent = selected?.feedback || (correct ? 'Подходяща първа проверка.' : 'Тази стъпка прескача диагностиката.');
    });
    result.hidden = false;
    result.className = `oscr-result ${score === choices.length ? 'success' : 'info'}`;
    result.textContent = `Резултат ${score} от ${choices.length}`;
    status.textContent = score === choices.length ? 'Системата е стабилизирана' : 'Нужен е втори диагностичен прочит';
    check.hidden = true;
    reset.hidden = false;
  });

  reset?.addEventListener('click', () => {
    choices.forEach(choice => {
      choice.value = '';
      choice.disabled = false;
      const card = choice.closest('.oscr-incident');
      card.classList.remove('correct', 'incorrect');
      card.querySelector('.oscr-explanation').hidden = true;
    });
    result.hidden = true;
    check.hidden = false;
    reset.hidden = true;
    status.textContent = 'Системата чака решение';
  });
}