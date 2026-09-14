export function render(comp) {
  const steps = comp.steps || [
    {
      question: "1. Как ще представяте числата в машината?",
      options: [
        { label: "Десетична система (0-9)", feedback: "Изисква 10 състояния и прави машината изключително сложна за електронно изпълнение." },
        { label: "Двоична система (0 и 1)", feedback: "Отличен избор! Две състояния (включено/изключено) са перфектни за лампи и релета!", correct: true }
      ]
    },
    {
      question: "2. Каква технология ще използвате за превключване?",
      options: [
        { label: "Електромагнитни релета", feedback: "Надеждно, но механично и бавно (подобно на Z1 и MARK I)." },
        { label: "Електронни вакуумни лампи", feedback: "Брилянтно! Силно увеличава скоростта (подобно на ABC и ENIAC)!", correct: true }
      ]
    },
    {
      question: "3. Къде ще пазите програмата с инструкции?",
      options: [
        { label: "Препокриване на кабели и ключoве", feedback: "Пренастройването за нова задача отнема дни (както при ранния ENIAC)." },
        { label: "В оперативната памет заедно с данните", feedback: "Революция! Използвате принципа на Фон Нойман за съхранена програма!", correct: true }
      ]
    }
  ];

  const stepsHtml = steps.map((s, sIdx) => `
    <div class="mission-step-card" data-sidx="${sIdx}" style="background: var(--surface, #ffffff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem;">
      <h4 style="margin: 0 0 1rem 0; font-size: 1.05rem; color: var(--text-color);">${s.question}</h4>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        ${s.options.map((opt, oIdx) => `
          <button class="mission-opt-btn" data-sidx="${sIdx}" data-oidx="${oIdx}" style="background: #f8fafc; border: 2px solid #cbd5e1; border-radius: 8px; padding: 0.85rem 1rem; text-align: left; cursor: pointer; transition: all 0.2s; font-size: 0.95rem; font-weight: 600; color: #334155; display: flex; align-items: center; justify-content: space-between;">
            <span>${opt.label}</span>
            <i class="far fa-circle opt-icon" style="color: #94a3b8;"></i>
          </button>
        `).join('')}
      </div>
      <div class="mission-step-fb" style="display: none; margin-top: 1rem; padding: 0.85rem 1rem; border-radius: 8px; font-size: 0.9rem; line-height: 1.5;"></div>
    </div>
  `).join('');

  return `
    <div id="${comp.id}" class="mission-container" style="margin: 3rem 0; padding: 2.25rem; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; border-radius: 16px; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
      <div style="text-align: center; max-width: 750px; margin: 0 auto 2rem auto;">
        <span style="background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.4); padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">Мисия 1940 г.</span>
        <h3 style="margin: 0.5rem 0 0.5rem 0; font-size: 1.75rem; color: #ffffff;">${comp.title || 'Мисия: Построй компютър от миналото'}</h3>
        <p style="margin: 0; color: #cbd5e1; font-size: 1rem; line-height: 1.5;">${comp.scenario || 'Проектирайте вашата изчислителна машина, като направите инженерингови избори:'}</p>
      </div>

      <div style="max-width: 750px; margin: 0 auto;">
        ${stepsHtml}
      </div>

      <div class="mission-final-feedback" style="display: none; max-width: 750px; margin: 1.5rem auto 0 auto; background: rgba(16, 185, 129, 0.2); border: 2px solid #10b981; border-radius: 12px; padding: 1.5rem; text-align: center; color: #34d399;">
        <i class="fas fa-award" style="font-size: 2.5rem; margin-bottom: 0.5rem;"></i>
        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.3rem; color: #ffffff;">Мисията е изпълнена!</h4>
        <p style="margin: 0; font-size: 1rem; color: #e2e8f0; line-height: 1.5;">
          Вашият модел съвпада най-много с фундаменталната **Архитектура на Джон фон Нойман (EDSAC / EDVAC)** — съчетание на двоичен код, електронни лампи и съхранена програма в оперативната памет!
        </p>
      </div>
    </div>
  `;
}

export function init(comp) {
  const container = document.getElementById(comp.id);
  if (!container) return;

  const defaultSteps = [
    {
      question: "1. Как ще представяте числата в машината?",
      options: [
        { label: "Десетична система (0-9)", feedback: "Изисква 10 състояния и прави машината изключително сложна за електронно изпълнение." },
        { label: "Двоична система (0 и 1)", feedback: "Отличен избор! Две състояния (включено/изключено) са перфектни за лампи и релета!", correct: true }
      ]
    },
    {
      question: "2. Каква технология ще използвате за превключване?",
      options: [
        { label: "Електромагнитни релета", feedback: "Надеждно, но механично и бавно (подобно на Z1 и MARK I)." },
        { label: "Електронни вакуумни лампи", feedback: "Брилянтно! Силно увеличава скоростта (подобно на ABC и ENIAC)!", correct: true }
      ]
    },
    {
      question: "3. Къде ще пазите програмата с инструкции?",
      options: [
        { label: "Препокриване на кабели и ключoве", feedback: "Пренастройването за нова задача отнема дни (както при ранния ENIAC)." },
        { label: "В оперативната памет заедно с данните", feedback: "Революция! Използвате принципа на Фон Нойман за съхранена програма!", correct: true }
      ]
    }
  ];

  const steps = comp.steps || defaultSteps;
  const stepCards = container.querySelectorAll('.mission-step-card');
  const finalFb = container.querySelector('.mission-final-feedback');
  let answeredCount = 0;

  stepCards.forEach((card, sIdx) => {
    const btns = card.querySelectorAll('.mission-opt-btn');
    const fbBox = card.querySelector('.mission-step-fb');

    btns.forEach((btn, oIdx) => {
      btn.addEventListener('click', () => {
        const step = steps[sIdx];
        const opt = step.options[oIdx];

        btns.forEach(b => {
          b.style.borderColor = '#cbd5e1';
          b.style.background = '#f8fafc';
          const ico = b.querySelector('.opt-icon');
          if (ico) ico.className = 'far fa-circle';
        });

        btn.style.borderColor = opt.correct ? '#10b981' : '#f59e0b';
        btn.style.background = opt.correct ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)';
        const ico = btn.querySelector('.opt-icon');
        if (ico) {
          ico.className = 'fas fa-check-circle';
          ico.style.color = opt.correct ? '#10b981' : '#f59e0b';
        }

        if (fbBox) {
          fbBox.style.display = 'block';
          fbBox.style.background = opt.correct ? '#f0fdf4' : '#fffbeb';
          fbBox.style.color = opt.correct ? '#166534' : '#92400e';
          fbBox.style.border = `1px solid ${opt.correct ? '#bbf7d0' : '#fef08a'}`;
          fbBox.textContent = opt.feedback;
        }

        if (!card.dataset.answered) {
          card.dataset.answered = 'true';
          answeredCount++;
        }

        if (answeredCount >= steps.length && finalFb) {
          finalFb.style.display = 'block';
        }
      });
    });
  });
}
