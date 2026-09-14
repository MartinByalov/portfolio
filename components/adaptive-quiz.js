export function render(comp) {
  const questions = (comp.questions || []).map((q, qi) => {
    const options = q.options.map((opt, oi) => `
      <label style="display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1rem; border: 2px solid var(--border-color, #e2e8f0); border-radius: 8px; margin-bottom: 0.5rem; cursor: pointer; transition: all 0.2s; background: var(--surface, #ffffff);">
        <input type="radio" name="${comp.id}-q${qi}" value="${oi}" style="width: 18px; height: 18px; accent-color: #3b82f6;">
        <span style="font-size: 0.95rem; color: var(--text-color); font-weight: 500;">${opt}</span>
      </label>
    `).join('');

    return `
      <div class="quiz-question" data-correct="${q.correctIndex}" style="background: var(--surface-alt, #f8fafc); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid var(--border-color, #e2e8f0);">
        <h4 class="quiz-question-text" style="margin: 0 0 1rem 0; font-size: 1.1rem; color: var(--text-color); font-weight: 700;">${qi + 1}. ${q.question}</h4>
        <div class="quiz-options">${options}</div>
        ${q.explanation ? `<div class="quiz-exp-box" style="display: none; margin-top: 1rem; padding: 0.85rem 1rem; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 0 8px 8px 0; font-size: 0.9rem; color: #1e40af; line-height: 1.5;"><strong>Обяснение:</strong> ${q.explanation}</div>` : ''}
      </div>
    `;
  }).join('');

  return `
    <section class="adaptive-quiz-container" id="${comp.id || ''}" style="margin: 3rem 0; padding: 2rem; background: var(--surface, #ffffff); border-radius: 16px; border: 1px solid var(--border-color, #e2e8f0); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
      <div style="text-align: center; max-width: 700px; margin: 0 auto 2rem auto;">
        <span style="background: #e0f2fe; color: #0369a1; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">Проверка на знанията</span>
        <h3 style="margin: 0.5rem 0 0.25rem 0; font-size: 1.6rem; color: var(--text-color);">${comp.title || 'Провери какво остана в паметта'}</h3>
      </div>

      <form class="adaptive-quiz-form">
        ${questions}
        <div class="quiz-actions" style="text-align: center; margin-top: 1.5rem;">
          <button type="button" class="quiz-submit-btn" style="background: #2563eb; color: white; border: none; padding: 0.85rem 2rem; border-radius: 10px; font-weight: bold; font-size: 1rem; cursor: pointer;">Провери отговорите</button>
          <button type="button" class="quiz-reset-btn" style="display:none; background: #64748b; color: white; border: none; padding: 0.85rem 2rem; border-radius: 10px; font-weight: bold; font-size: 1rem; cursor: pointer; margin-left: 0.5rem;">Нов опит</button>
        </div>
        <div class="quiz-result-msg" style="display:none; margin-top: 1.5rem; padding: 1.25rem; border-radius: 10px; text-align: center; font-size: 1.1rem; font-weight: bold;"></div>
      </form>
    </section>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id);
  if (!root) return;

  const form = root.querySelector('.adaptive-quiz-form');
  const submitBtn = root.querySelector('.quiz-submit-btn');
  const resetBtn = root.querySelector('.quiz-reset-btn');
  const resultMsg = root.querySelector('.quiz-result-msg');
  const questions = form.querySelectorAll('.quiz-question');

  if (!submitBtn) return;

  submitBtn.addEventListener('click', () => {
    let answered = 0;
    questions.forEach(q => {
      const checked = q.querySelector('input:checked');
      if (checked) answered++;
    });

    if (answered < questions.length) {
      resultMsg.textContent = 'Моля, отговорете на всички въпроси преди проверка!';
      resultMsg.style.display = 'block';
      resultMsg.style.background = '#fef2f2';
      resultMsg.style.color = '#991b1b';
      resultMsg.style.border = '1px solid #fecaca';
      return;
    }

    let score = 0;
    questions.forEach(q => {
      const correct = q.dataset.correct;
      const checked = q.querySelector('input:checked');
      const expBox = q.querySelector('.quiz-exp-box');

      if (expBox) expBox.style.display = 'block';

      q.querySelectorAll('label').forEach(label => {
        const input = label.querySelector('input');
        if (input.value === correct) {
          label.style.borderColor = '#10b981';
          label.style.background = '#f0fdf4';
        } else if (input.checked && input.value !== correct) {
          label.style.borderColor = '#ef4444';
          label.style.background = '#fef2f2';
        }
        input.disabled = true;
      });

      if (checked && checked.value === correct) score++;
    });

    resultMsg.textContent = `Отлична работа! Вашият резултат: ${score} от ${questions.length} верни отговора!`;
    resultMsg.style.display = 'block';
    resultMsg.style.background = '#f0fdf4';
    resultMsg.style.color = '#166534';
    resultMsg.style.border = '1px solid #bbf7d0';

    submitBtn.style.display = 'none';
    resetBtn.style.display = 'inline-block';
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    questions.forEach(q => {
      const expBox = q.querySelector('.quiz-exp-box');
      if (expBox) expBox.style.display = 'none';

      q.querySelectorAll('label').forEach(label => {
        label.style.borderColor = 'var(--border-color, #e2e8f0)';
        label.style.background = 'var(--surface, #ffffff)';
        label.querySelector('input').disabled = false;
      });
    });
    resultMsg.style.display = 'none';
    submitBtn.style.display = 'inline-block';
    resetBtn.style.display = 'none';
  });
}
