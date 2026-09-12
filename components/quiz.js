// Multiple choice quiz component

export function render(comp) {
  const questions = (comp.questions || []).map((q, qi) => {
    const options = q.options.map((opt, oi) => `
      <label>
        <input type="radio" name="${comp.id}-q${qi}" value="${oi}">
        ${opt}
      </label>
    `).join('');

    return `
      <div class="quiz-question" data-correct="${q.correctIndex}">
        <p class="quiz-question-text">${qi + 1}. ${q.question}</p>
        <div class="quiz-options">${options}</div>
      </div>
    `;
  }).join('');

  return `
    <section class="component quiz" id="${comp.id || ''}">
      ${comp.heading ? `<h2 class="component-heading">${comp.heading}</h2>` : ''}
      <form class="quiz-form">
        ${questions}
        <div class="quiz-actions">
          <button type="button" class="btn-activity quiz-submit">Провери</button>
          <button type="button" class="btn-activity quiz-reset" style="display:none;"><i class="fas fa-rotate-left"></i> Нов опит</button>
        </div>
        <div class="quiz-result" style="display:none;"></div>
      </form>
    </section>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id);
  if (!root) return;

  const form = root.querySelector('.quiz-form');
  const submitBtn = root.querySelector('.quiz-submit');
  const resetBtn = root.querySelector('.quiz-reset');
  const resultBox = root.querySelector('.quiz-result');
  const questions = form.querySelectorAll('.quiz-question');

  submitBtn.addEventListener('click', () => {
    const formData = new FormData(form);
    let answered = 0;
    questions.forEach(q => {
      const name = q.querySelector('input').name;
      if (formData.has(name)) answered++;
    });

    if (answered < questions.length) {
      showResult('Моля, отговорете на всички въпроси преди проверка!', 'error');
      return;
    }

    let score = 0;
    questions.forEach(q => {
      const correct = q.dataset.correct;
      const name = q.querySelector('input').name;
      const userChoice = formData.get(name);

      q.querySelectorAll('label').forEach(label => {
        const input = label.querySelector('input');
        label.classList.remove('correct', 'incorrect');
        if (input.value === correct) label.classList.add('correct');
        if (input.checked && input.value !== correct) label.classList.add('incorrect');
        input.disabled = true;
      });

      if (userChoice === correct) score++;
    });

    showResult(`Резултат: ${score} от ${questions.length} верни отговора.`, 'info');
    submitBtn.style.display = 'none';
    resetBtn.style.display = 'inline-block';
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    questions.forEach(q => {
      q.querySelectorAll('label').forEach(label => {
        label.classList.remove('correct', 'incorrect');
        label.querySelector('input').disabled = false;
      });
    });
    resultBox.style.display = 'none';
    submitBtn.style.display = 'inline-block';
    resetBtn.style.display = 'none';
  });

  function showResult(text, type) {
    resultBox.textContent = text;
    resultBox.style.display = 'block';
    resultBox.className = `quiz-result quiz-result-${type}`;
  }
}
