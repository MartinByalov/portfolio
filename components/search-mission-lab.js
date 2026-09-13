// Search Mission Lab Component
// Interactive lab based on real educational cases from Упражнение_1.docx

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

const MISSIONS = [
  {
    id: 'mission-1',
    title: 'Казус 1: Официален училищен правилник',
    badge: 'site: и filetype:',
    goal: 'Потърсете в интернет официалния „правилник за вътрешния ред“ на училището. Трябва да намерите само официалния документ в PDF формат, публикуван директно на сайта на училището.',
    targetSample: 'filetype:pdf site:spgke.com "правилник за вътрешния ред"',
    requiredOperators: ['site:', 'filetype:', '"'],
    hint: 'Използвайте site:[уебсайт], filetype:pdf и сложете фразата в кавички (" ").',
    sampleResult: {
      title: 'Правилник за устройството и дейността на училището (2025/2026)',
      url: 'https://spgke.com/docs/pravilnik_za_vatreshnia_red.pdf',
      snippet: 'Официален утвърден нормативен документ. Права, задължения и вътрешен ред за ученици, учители и родители.'
    },
    reflectionQuestion: 'Защо филтрирането по файлов тип и домейн е единственият начин да сте сигурни, че споделяте с класа актуална и достоверна информация, а не остаряла чернова?',
    expertAnswer: 'Домейнът (site:) гарантира, че информацията идва от официалния източник, а не от външни форуми или блогове. Файловият тип (filetype:pdf) филтрира директно оригиналните подписани документи, избягвайки междинни новинарски статии или остарели версии.'
  },
  {
    id: 'mission-2',
    title: 'Казус 2: Филтриране на хобита (Гейминг)',
    badge: '-минус и OR',
    goal: 'Потърсете информация за „нови игри“, но задължително изключете всички резултати за „мобилни“ (-тире), тъй като търсите само за компютър или конзола (OR).',
    targetSample: '"нови игри" -мобилни OR конзола',
    requiredOperators: ['-', 'or', '"'],
    hint: 'Сложете фразата "нови игри" в кавички, добавете -мобилни и оператор OR.',
    sampleResult: {
      title: 'Топ 10 нови игри за компютър и конзоли за сезона',
      url: 'https://pcgames-bg.com/reviews/new-games-pc-console',
      snippet: 'Подробен преглед на най-очакваните заглавия за PC и домашни конзоли, графични изисквания и геймплей.'
    },
    reflectionQuestion: 'Как изключването на нерелевантни думи (-дума) помага за ефективността и качеството на търсенето при съвместен проект?',
    expertAnswer: 'Знакът минус премахва хиляди рекламни резултати за смартфони, спестява време на екипа и фокусира съдържанието точно върху общата цел на разработката.'
  },
  {
    id: 'mission-3',
    title: 'Казус 3: Законно изтегляне на ресурси (Creative Commons)',
    badge: 'filetype: и NOT',
    goal: 'Намерете документи в DOCX или PDF формат за „отворен код“ и „Creative Commons“, като изключите всички страници от Уикипедия.',
    targetSample: '"отворен код" filetype:docx OR filetype:pdf -wikipedia',
    requiredOperators: ['filetype:', 'wiki', '"'],
    hint: 'Използвайте кавички за "отворен код", задайте файлов тип и изключете wikipedia (-wikipedia или NOT wikipedia).',
    sampleResult: {
      title: 'Ръководство за свободни лицензи и Creative Commons в образованието',
      url: 'https://creativecommons.bg/materials/guide_open_code.pdf',
      snippet: 'Официален наръчник за законно използване, споделяне и цитиране на авторски материали с отворен код.'
    },
    reflectionQuestion: 'Защо търсенето само на официални файлови типове е ключово за законното изтегляне на ресурси в училищен проект?',
    expertAnswer: 'Официалните документи (PDF/DOCX) обикновено съдържат точния правен лиценз, име на автора и условия за свободно преизползване, което защитава екипа от нарушаване на авторски права.'
  },
  {
    id: 'mission-4',
    title: 'Казус 4: Социални мрежи и рискове (Кибертормоз)',
    badge: 'define: и intitle:',
    goal: 'Потърсете официална дефиниция за „инфлуенсър“ (define:), а след това намерете само статии със заглавия (intitle:), съдържащи „заплаха“ и свързани с „кибертормоз“.',
    targetSample: 'define:инфлуенсър | intitle:заплаха кибертормоз',
    requiredOperators: ['intitle:', 'define:'],
    hint: 'Изпробвайте оператора define: за дефиниция и intitle:заплаха кибертормоз за намиране на специализирани заглавия.',
    sampleResult: {
      title: 'Заплаха от кибертормоз в тийнейджърските групи в социалните мрежи',
      url: 'https://safenet.bg/analysis/intitle-zaplahata-online',
      snippet: 'Анализ на рисковете при общуване онлайн, начини за защита на личното пространство и сигнализиране при тормоз.'
    },
    reflectionQuestion: 'Как операторът intitle: помага да филтрирате сензационния език и да откриете аналитични статии за безопасност?',
    expertAnswer: 'Когато ключовата дума е задължително в заглавието (HTML тага <title>), статията е тематично фокусирана върху проблема, а не просто споменаваща думата случайно в коментарите.'
  }
];

export function render(comp) {
  const id = comp.id || 'search-mission-lab';
  const title = comp.title || 'Лаборатория: Решаване на търсещи казуси (Практикум)';

  const tabsHtml = MISSIONS.map((m, idx) => `
    <button type="button" class="sml-tab ${idx === 0 ? 'active' : ''}" data-mission-index="${idx}">
      <span class="sml-tab-text">${esc(m.title.split(':')[0])}</span>
      <span class="sml-tab-badge">${esc(m.badge)}</span>
    </button>
  `).join('');

  return `
    <div class="search-mission-lab-card" id="${esc(id)}">
      <div class="sml-header">
        <div class="sml-title-wrap">
          <h3 class="sml-title">${esc(title)}</h3>
        </div>
      </div>

      <div class="sml-tabs-bar">
        ${tabsHtml}
      </div>

      <div class="sml-body">
        <div class="sml-mission-panel">
          <div class="sml-goal-box">
            <div class="sml-goal-header">
              <strong class="sml-mission-heading">Задание:</strong>
            </div>
            <p class="sml-goal-text"></p>
            <div class="sml-hint-text"><span></span></div>
          </div>

          <div class="sml-search-bar-wrap">
            <div class="sml-input-row">
              <div class="sml-input-box">
                <i class="fas fa-search sml-search-icon"></i>
                <input type="text" class="sml-query-input" placeholder="Въведете заявка с оператори..." />
              </div>
              <button type="button" class="sml-test-btn"><i class="fas fa-play"></i> Тествай</button>
              <button type="button" class="sml-autofill-btn" title="Постави примерна точна заявка"><i class="fas fa-wand-magic-sparkles"></i> Пример</button>
            </div>
          </div>

          <div class="sml-feedback-box" style="display:none;"></div>

          <div class="sml-serp-preview" style="display:none;">
            <div class="sml-serp-header"><i class="fas fa-globe"></i> Симулиран сигурен резултат:</div>
            <div class="sml-serp-card">
              <div class="sml-serp-url"></div>
              <div class="sml-serp-title"></div>
              <div class="sml-serp-snippet"></div>
            </div>
          </div>

          <div class="sml-reflection-card">
            <button type="button" class="lesson-tag tone-purple tag-discussion sml-discussion-btn" data-modal-target="smlDiscussionModal">
              <span class="lesson-tag-ico"><i class="fas fa-comments"></i></span>
              <span class="lesson-tag-text">Дискусия</span>
              <i class="fas fa-chevron-right lesson-tag-arrow"></i>
            </button>
          </div>

          <div id="smlDiscussionModal" class="lesson-modal" style="display:none;">
            <div class="modal-wrapper">
              <div class="modal-header">
                <h3 class="modal-title sml-modal-title">Дискусия: Въпрос за критичен анализ</h3>
                <button type="button" class="close-modal" data-close-modal="smlDiscussionModal">&times;</button>
              </div>
              <div class="modal-body exercise-modal-content">
                <div class="exercise-instructions">
                  <p class="exercise-text sml-modal-question-text"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function init(comp) {
  const id = comp.id || 'search-mission-lab';
  const root = document.getElementById(id);
  if (!root) return;

  let currentIdx = 0;

  const tabs = root.querySelectorAll('.sml-tab');
  const goalHeading = root.querySelector('.sml-mission-heading');
  const goalText = root.querySelector('.sml-goal-text');
  const hintSpan = root.querySelector('.sml-hint-text span');
  const queryInput = root.querySelector('.sml-query-input');
  const testBtn = root.querySelector('.sml-test-btn');
  const autofillBtn = root.querySelector('.sml-autofill-btn');
  const feedbackBox = root.querySelector('.sml-feedback-box');
  const serpPreview = root.querySelector('.sml-serp-preview');
  const serpUrl = root.querySelector('.sml-serp-url');
  const serpTitle = root.querySelector('.sml-serp-title');
  const serpSnippet = root.querySelector('.sml-serp-snippet');
  const modal = root.querySelector('#smlDiscussionModal');
  const modalText = root.querySelector('.sml-modal-question-text');
  const modalTitle = root.querySelector('.sml-modal-title');
  const discussionBtn = root.querySelector('.sml-discussion-btn');

  function openModal() {
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  if (discussionBtn) {
    discussionBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  }

  if (modal) {
    modal.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', closeModal);
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  function loadMission(idx) {
    currentIdx = idx;
    const m = MISSIONS[idx];
    if (!m) return;

    tabs.forEach((t, i) => t.classList.toggle('active', i === idx));

    goalHeading.textContent = m.title;
    goalText.textContent = m.goal;
    hintSpan.textContent = m.hint;
    queryInput.value = '';
    feedbackBox.style.display = 'none';
    serpPreview.style.display = 'none';
    if (modalText) {
      modalText.textContent = m.reflectionQuestion;
    }
    if (modalTitle) {
      modalTitle.textContent = 'Дискусия: ' + m.title.split(':')[0];
    }
  }

  tabs.forEach((t, idx) => {
    t.addEventListener('click', () => loadMission(idx));
  });

  if (autofillBtn) {
    autofillBtn.addEventListener('click', () => {
      const m = MISSIONS[currentIdx];
      if (m) {
        queryInput.value = m.targetSample.split('|')[0].trim();
        feedbackBox.style.display = 'none';
        queryInput.focus();
      }
    });
  }

  if (testBtn) {
    testBtn.addEventListener('click', () => {
      const m = MISSIONS[currentIdx];
      const val = (queryInput.value || '').trim();

      if (!val) {
        feedbackBox.style.display = 'block';
        feedbackBox.className = 'sml-feedback-box feedback-error';
        feedbackBox.innerHTML = '<i class="fas fa-circle-exclamation"></i> Моля, въведете търсеща заявка преди да натиснете Тествай.';
        serpPreview.style.display = 'none';
        return;
      }

      const lowerVal = val.toLowerCase();
      // Check required operators
      const missing = [];
      m.requiredOperators.forEach(op => {
        if (op === 'or') {
          if (!lowerVal.includes('or') && !lowerVal.includes('или')) missing.push('OR');
        } else if (op === 'wiki') {
          if (!lowerVal.includes('wiki')) missing.push('-wikipedia или NOT');
        } else if (op === '"') {
          if (!val.includes('"')) missing.push('кавички (" ")');
        } else if (op === '-') {
          if (!val.includes('-')) missing.push('минус (-)');
        } else {
          if (!lowerVal.includes(op.toLowerCase())) missing.push(op);
        }
      });

      if (missing.length > 0 && !val.includes(m.targetSample.split(' ')[0])) {
        feedbackBox.style.display = 'block';
        feedbackBox.className = 'sml-feedback-box feedback-warn';
        feedbackBox.innerHTML = `<i class="fas fa-triangle-exclamation"></i> Добра посока, но за пълен ефект добавете: <strong>${esc(missing.join(', '))}</strong>.`;
      } else {
        feedbackBox.style.display = 'block';
        feedbackBox.className = 'sml-feedback-box feedback-success';
        feedbackBox.innerHTML = `<i class="fas fa-circle-check"></i> <strong>Отлична професионална заявка!</strong> Заявката спазва всички изисквания на казуса и филтрира излишния шум.`;
      }

      // Show mock SERP
      serpUrl.textContent = m.sampleResult.url;
      serpTitle.textContent = m.sampleResult.title;
      serpSnippet.textContent = m.sampleResult.snippet;
      serpPreview.style.display = 'block';
    });
  }

  // Load first mission initially
  loadMission(0);
}
