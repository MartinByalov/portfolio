// Mood Animal Generator reflection component
// Evaluates student answers to 3 reflection questions and generates an animal avatar

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const id = comp.id || 'mood-animal-generator';
  const title = comp.title || '🦁 Интерактивна рефлексия: Какво дигитално животно си днес?';
  const prompt = comp.prompt || 'Отговорете на 3 бързи въпроса за това как се справихте с урока и генерирайте своя дигитален аватар за деня!';
  const animals = comp.animals || [
    { title: "🦉 Мъдра сова", desc: "Овладя облачните среди и правилното задаване на права за достъп!" },
    { title: "🐆 Бърз гепард", desc: "Редактираше онлайн документите светкавично и без грешка!" },
    { title: "🐱 Предпазливо коте-детектив", desc: "Винаги проверява правата за достъп преди да сподели връзка!" }
  ];

  const isForms = (id && id.includes('forms')) ||
    (title && title.includes('Формуляр')) ||
    (prompt && prompt.includes('Формуляр'));

  const formsQuestions = [
    {
      q: '1. Как се справихте с конфигурирането на режим „Тест“ (Make this a quiz) и точкуването?',
      options: [
        { label: 'Оформих прецизно точните отговори, обясненията и точковата скала', animalIdx: 0 },
        { label: 'Вградих графичните файлове и оформих визуално въпросите', animalIdx: 1 },
        { label: 'Активирах бързо настройките и преминах към споделяне', animalIdx: 2 }
      ]
    },
    {
      q: '2. Как организирахте видовете въпроси (кратък текст, чекбоксове, мрежа)?',
      options: [
        { label: 'Подбрах точния тип въпрос според всяко отделно условие', animalIdx: 0 },
        { label: 'Изпипах формулировката и добавих мултимедия за нагледност', animalIdx: 1 },
        { label: 'Координирах екипната работа и тествах функционалността', animalIdx: 2 }
      ]
    },
    {
      q: '3. Коя роля в споделената работа с онлайн формуляри ви допада най-много?',
      options: [
        { label: 'Архитект на теста и правилата за сигурност (събиране на имейли)', animalIdx: 0 },
        { label: 'Дизайнер на съдържанието и медийните ресурси', animalIdx: 1 },
        { label: 'Анализатор на получените диаграми от раздела „Отговори“', animalIdx: 2 }
      ]
    }
  ];

  const defaultQuestions = [
    {
      q: '1. Как се справихте с новите понятия (LMS, облачни услуги, синхронно/асинхронно обучение)?',
      options: [
        { label: 'Разбрах концепциите и техните роли в дълбочина', animalIdx: 0 },
        { label: 'Усвоих ги светкавично и бързо преминах към практиката', animalIdx: 1 },
        { label: 'Анализирах внимателно всяка разлика и пример', animalIdx: 2 }
      ]
    },
    {
      q: '2. Как работихте по практическата задача за споделяне в Google Drive?',
      options: [
        { label: 'Осъзнах значението на всяко ниво на достъп (Viewer/Editor)', animalIdx: 0 },
        { label: 'Качих файла и го споделих за броени секунди', animalIdx: 1 },
        { label: 'Внимавах стриктно да не изложа лични данни или неволно редактиране', animalIdx: 2 }
      ]
    },
    {
      q: '3. Коя роля в дигиталния екип ви подхожда най-много днес?',
      options: [
        { label: 'Мъдър съветник, координатор и организатор', animalIdx: 0 },
        { label: 'Енергичен двигател, пишещ и създаващ в реално време', animalIdx: 1 },
        { label: 'Прецизен наблюдател, пазещ сигурността и версиите', animalIdx: 2 }
      ]
    }
  ];

  const questions = comp.questions || (isForms ? formsQuestions : defaultQuestions);

  const qHtml = questions.map((q, qi) => {
    const opts = q.options.map((opt, oi) => `
      <label class="mood-opt-label">
        <input type="radio" name="${id}-q${qi}" value="${opt.animalIdx}" ${oi === 0 ? 'checked' : ''}>
        <span class="mood-opt-text">${esc(opt.label)}</span>
      </label>
    `).join('');

    return `
      <div class="mood-question-box">
        <p class="mood-question-text">${esc(q.q)}</p>
        <div class="mood-options-group">${opts}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="mood-animal-card" id="${id}">
      <div class="interactive-card-header">
        <div class="interactive-card-badge">
          <i class="fas fa-paw"></i>
          <span>${esc(title)}</span>
        </div>
        <p class="interactive-card-lead">${esc(prompt)}</p>
      </div>

      <form class="mood-animal-form">
        ${qHtml}
        <div class="mood-actions">
          <button type="button" class="btn-activity btn-generate-avatar">
            <i class="fas fa-wand-magic-sparkles"></i> Генерирай моя дигитален аватар!
          </button>
        </div>
      </form>

      <div class="animal-result-display" style="display:none;" data-animals='${JSON.stringify(animals).replace(/'/g, "&apos;")}'>
        <div class="animal-avatar-halo">
          <div class="animal-avatar-icon"></div>
        </div>
        <h4 class="animal-avatar-title"></h4>
        <p class="animal-avatar-desc"></p>
        <div class="animal-traits-badges">
          <span class="trait-badge"><i class="fas fa-star text-amber-400"></i> ИТ Шампион на деня</span>
          <span class="trait-badge"><i class="fas fa-shield-halved text-blue-500"></i> Сигурност в облака</span>
        </div>
        <div class="animal-result-actions">
          <button type="button" class="btn-activity btn-restart-avatar">
            <i class="fas fa-rotate-left"></i> Избери отново
          </button>
        </div>
      </div>
    </div>
  `;
}

export function init(comp) {
  const id = comp.id || 'mood-animal-generator';
  const root = document.getElementById(id);
  if (!root) return;

  const btnGen = root.querySelector('.btn-generate-avatar');
  const btnRestart = root.querySelector('.btn-restart-avatar');
  const resultDisplay = root.querySelector('.animal-result-display');
  const form = root.querySelector('.mood-animal-form');
  const avatarIcon = root.querySelector('.animal-avatar-icon');
  const avatarTitle = root.querySelector('.animal-avatar-title');
  const avatarDesc = root.querySelector('.animal-avatar-desc');

  if (!btnGen || !resultDisplay || !form) return;

  let animalsList = comp.animals || [];
  if (!animalsList.length && resultDisplay.dataset.animals) {
    try {
      animalsList = JSON.parse(resultDisplay.dataset.animals);
    } catch (e) {
      animalsList = [];
    }
  }

  btnGen.addEventListener('click', () => {
    // Tally selections
    const formData = new FormData(form);
    const votes = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      const val = parseInt(formData.get(`${id}-q${i}`) || '0', 10);
      votes[val] = (votes[val] || 0) + 1;
    }

    let topAnimalIdx = 0;
    let maxVotes = -1;
    for (let i = 0; i < votes.length; i++) {
      if (votes[i] > maxVotes) {
        maxVotes = votes[i];
        topAnimalIdx = i;
      }
    }

    const animal = animalsList[topAnimalIdx] || animalsList[0] || {
      title: "🦉 Мъдра сова",
      desc: "Овладя облачните среди и правилното задаване на права за достъп!"
    };

    const emojiMatch = animal.title.match(/^([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|\p{Emoji})/u);
    const emoji = emojiMatch ? emojiMatch[0] : '🌟';
    const cleanTitle = animal.title.replace(emoji, '').trim();

    if (avatarIcon) avatarIcon.textContent = emoji;
    if (avatarTitle) avatarTitle.textContent = cleanTitle || animal.title;
    if (avatarDesc) avatarDesc.textContent = animal.desc;

    form.style.display = 'none';
    resultDisplay.style.display = 'block';
    resultDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      resultDisplay.style.display = 'none';
      form.style.display = 'block';
    });
  }
}
