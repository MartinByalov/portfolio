// OS Ecosystem Matrix Component
// Comparative matrix and consultant decision simulator for major Operating Systems

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

export function render(comp) {
  const id = comp.id || 'os-ecosystem-matrix';
  const title = comp.title || 'Семействата съвременни операционни системи';
  const subtitle = comp.subtitle || 'Сравнете архитектурата, лицензите и предназначението на водещите платформи и решете реални потребителски казуси';

  const osList = [
    {
      id: 'windows',
      name: 'Microsoft Windows',
      badge: 'Десктоп & Гейминг Лидер',
      icon: 'fab fa-windows',
      color: '#0078d4',
      maker: 'Microsoft',
      license: 'Проприетарен (Платен лиценз)',
      market: '~70% от персоналните компютри',
      kernel: 'Windows NT ядро',
      strengths: 'Универсална съвместимост с всякакъв хардуер; абсолютен стандарт за игри (DirectX) и бизнес софтуер (MS Office).',
      limits: 'Платен лиценз; честа цел на вируси заради масовата популярност.'
    },
    {
      id: 'linux',
      name: 'GNU / Linux',
      badge: 'Сървъри, Облак & Отворен код',
      icon: 'fab fa-linux',
      color: '#f59e0b',
      maker: 'Линус Торвалдс & Отворена общност',
      license: 'Свободен софтуер с отворен код (GPL)',
      market: '>90% от уеб сървърите и суперкомпютрите',
      kernel: 'Монолитно Linux ядро',
      strengths: '100% безплатен; максимална стабилност и сигурност; пълен достъп до кода; липса на скрита телеметрия.',
      limits: 'Изисква повече технически познания; по-малко комерсиални приложни програми.'
    },
    {
      id: 'macos',
      name: 'Apple macOS',
      badge: 'Креативност & Премиум дизайн',
      icon: 'fab fa-apple',
      color: '#1e293b',
      maker: 'Apple Inc.',
      license: 'Проприетарен (Включен в Mac хардуера)',
      market: '~18-20% от персоналните компютри',
      kernel: 'Unix-базирано Darwin (XNU) ядро',
      strengths: 'Оптимизирана за Apple Silicon процесори; висока енергийна ефективност; стандарт за видео/аудио обработка.',
      limits: 'Работи законно единствено на скъп Apple хардуер; ограничен гейминг.'
    },
    {
      id: 'android',
      name: 'Google Android',
      badge: 'Мобилен лидер на планетата',
      icon: 'fab fa-android',
      color: '#10b981',
      maker: 'Google / OHA',
      license: 'Отворен код (AOSP) + Google услуги',
      market: '>70% от смартфоните в света',
      kernel: 'Модифицирано Linux ядро',
      strengths: 'Огромно разнообразие от устройства и цени; лесно прехвърляне на файлове; гигантски магазин Google Play.',
      limits: 'Фрагментация (различни производители обновяват версиите с различно закъснение).'
    },
    {
      id: 'ios',
      name: 'Apple iOS',
      badge: 'Сигурност & Мобилна екосистема',
      icon: 'fas fa-mobile-screen',
      color: '#6366f1',
      maker: 'Apple Inc.',
      license: 'Проприетарен (Затворена екосистема)',
      market: '~28% от смартфоните (лидер в САЩ)',
      kernel: 'Darwin / Mach ядро (Unix основа)',
      strengths: 'Стриктна сигурност на приложенията; гарантирани обновления за 5-7 години; перфектна синхронизация с Mac/iPad.',
      limits: 'Затворена среда („златна клетка“); висока цена на устройствата; липса на пълен свободен достъп до файловата система.'
    }
  ];

  const consultantCases = [
    {
      id: 'case-gamer',
      tabTitle: '1. Гейминг и училище',
      cardTitle: 'Казус 1: Клиент - Гейминг и училище',
      desc: 'Клиентът иска настолен компютър, на който да играе най-новите състезателни и AAA игри, да ползва Discord и училищния софтуер.',
      correct: 'windows',
      explanation: 'Правилно! Windows предлага най-богатата съвместимост за съвременни видеокарти, DirectX 12 технологии, античийт системи и практически всяка игра в Steam и Epic Games.'
    },
    {
      id: 'case-server',
      tabTitle: '2. Училищен уеб сървър',
      cardTitle: 'Казус 2: Клиент - Училищен уеб сървър',
      desc: 'Клиентът иска денонощен уеб и файлов сървър за училище с нулев бюджет за лицензи, който да не се рестартира с години и да има висша защита.',
      correct: 'linux',
      explanation: 'Точно така! Linux (напр. Ubuntu Server или Debian) е златният стандарт за интернет сървъри - 100% безплатен, изключително стабилен, лек и сигурен.'
    },
    {
      id: 'case-video',
      tabTitle: '3. Графичен дизайн и монтаж',
      cardTitle: 'Казус 3: Клиент - Графичен дизайн и монтаж',
      desc: 'Клиентът учи видеообработка, ползва iPhone и иска лаптоп с прецизен екран, безшумна работа, изключителна батерия и софтуер като Final Cut Pro.',
      correct: 'macos',
      explanation: 'Отличен избор! macOS в съчетание с MacBook предлага водеща в света енергийна ефективност, оптимизация за 4K/8K видео и мигновена връзка с неговия iPhone чрез AirDrop.'
    },
    {
      id: 'case-dev',
      tabTitle: '4. Пътуващ блогър (смартфон)',
      cardTitle: 'Казус 4: Клиент - Пътуващ блогър с бюджетен смартфон',
      desc: 'Клиентът търси достъпен телефон, който да зарежда бързо снимки на флашка без iTunes и да му дава пълен контрол над файловете.',
      correct: 'android',
      explanation: 'Браво! Android осигурява пълен свободен достъп до файловата система през USB кабел, поддържа OTG флашки и позволява избор от стотици модели на достъпни цени.'
    }
  ];

  return `
    <div id="${esc(id)}" class="os-ecosystem-matrix">
      <div class="os-matrix-header">
        <h3>${esc(title)}</h3>
        <p>${esc(subtitle)}</p>
      </div>

      <!-- Filter Controls -->
      <div class="os-matrix-filters">
        <button type="button" class="os-filter-btn active" data-filter="all">Всички (5)</button>
        <button type="button" class="os-filter-btn" data-filter="desktop">Компютри &amp; Лаптопи</button>
        <button type="button" class="os-filter-btn" data-filter="mobile">Смартфони &amp; Мобилни</button>
        <button type="button" class="os-filter-btn" data-filter="open">С отворен код (Open Source)</button>
      </div>

      <!-- Cards Grid -->
      <div class="os-cards-grid">
        ${osList.map(os => `
          <div class="os-card" data-os-id="${esc(os.id)}" data-type="${os.id === 'android' || os.id === 'ios' ? 'mobile' : 'desktop'}" data-open="${os.id === 'linux' || os.id === 'android' ? 'yes' : 'no'}" style="--os-accent: ${os.color};">
            <div class="os-card-top">
              <div class="os-card-icon"><i class="${esc(os.icon)}"></i></div>
              <div class="os-card-meta">
                <span class="os-card-badge">${esc(os.badge)}</span>
                <h4 class="os-card-name">${esc(os.name)}</h4>
              </div>
            </div>
            <div class="os-card-facts">
              <div class="os-fact-row"><span>Производител:</span><strong>${esc(os.maker)}</strong></div>
              <div class="os-fact-row"><span>Лиценз:</span><strong>${esc(os.license)}</strong></div>
              <div class="os-fact-row"><span>Ядро:</span><strong>${esc(os.kernel)}</strong></div>
              <div class="os-fact-row"><span>Дял:</span><strong>${esc(os.market)}</strong></div>
            </div>
            <div class="os-card-desc">
              <div class="os-desc-block strength">
                <i class="fas fa-check-circle"></i>
                <span>${esc(os.strengths)}</span>
              </div>
              <div class="os-desc-block limit">
                <i class="fas fa-info-circle"></i>
                <span>${esc(os.limits)}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Consultant Mission Interactive Section -->
      <div class="os-consultant-section">
        <div class="os-consultant-head">
          <div class="os-consultant-icon"><i class="fas fa-user-tie"></i></div>
          <div>
            <h4>Мисия: ИТ Консултант - Изберете правилната ОС за клиента</h4>
            <p>Прочетете изискванията на клиента и посочете най-подходящата операционна система:</p>
          </div>
        </div>

        <div class="os-case-selector">
          ${consultantCases.map((c, i) => `
            <button type="button" class="os-case-tab ${i === 0 ? 'active' : ''}" data-case-idx="${i}">
              ${esc(c.tabTitle)}
            </button>
          `).join('')}
        </div>

        <div class="os-active-case-card">
          <div class="os-case-brief">
            <strong class="os-case-heading">${esc(consultantCases[0].cardTitle)}</strong>
            <p class="os-case-text">${esc(consultantCases[0].desc)}</p>
          </div>

          <div class="os-case-choices">
            <span class="os-choice-prompt">Коя операционна система препоръчвате?</span>
            <div class="os-choice-buttons">
              <button type="button" class="os-choice-btn" data-choice="windows"><i class="fab fa-windows"></i> Windows</button>
              <button type="button" class="os-choice-btn" data-choice="linux"><i class="fab fa-linux"></i> Linux</button>
              <button type="button" class="os-choice-btn" data-choice="macos"><i class="fab fa-apple"></i> macOS</button>
              <button type="button" class="os-choice-btn" data-choice="android"><i class="fab fa-android"></i> Android</button>
              <button type="button" class="os-choice-btn" data-choice="ios"><i class="fas fa-mobile-screen"></i> iOS</button>
            </div>
          </div>

          <div class="os-case-feedback" style="display: none;" aria-live="polite"></div>
        </div>
      </div>
    </div>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id);
  if (!root) return;

  // Filter Buttons
  const filterBtns = root.querySelectorAll('.os-filter-btn');
  const osCards = root.querySelectorAll('.os-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const f = btn.dataset.filter;
      osCards.forEach(card => {
        if (f === 'all') {
          card.style.display = 'flex';
        } else if (f === 'desktop') {
          card.style.display = card.dataset.type === 'desktop' ? 'flex' : 'none';
        } else if (f === 'mobile') {
          card.style.display = card.dataset.type === 'mobile' ? 'flex' : 'none';
        } else if (f === 'open') {
          card.style.display = card.dataset.open === 'yes' ? 'flex' : 'none';
        }
      });
    });
  });

  let currentCaseIdx = 0;
  const caseTabs = root.querySelectorAll('.os-case-tab');
  const caseHeading = root.querySelector('.os-case-heading');
  const caseText = root.querySelector('.os-case-text');
  const choiceBtns = root.querySelectorAll('.os-choice-btn');
  const feedbackBox = root.querySelector('.os-case-feedback');

  function updateCase(idx) {
    currentCaseIdx = idx;
    caseTabs.forEach((tab, i) => tab.classList.toggle('active', i === idx));
    const c = consultantCases[idx];
    if (caseHeading) caseHeading.textContent = c.cardTitle;
    if (caseText) caseText.textContent = c.desc;
    choiceBtns.forEach(btn => {
      btn.classList.remove('selected-correct', 'selected-wrong');
      btn.disabled = false;
    });
    if (feedbackBox) {
      feedbackBox.style.display = 'none';
      feedbackBox.innerHTML = '';
    }
  }

  caseTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.dataset.caseIdx, 10);
      updateCase(idx);
    });
  });

  choiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.choice;
      const c = consultantCases[currentCaseIdx];
      const isCorrect = choice === c.correct;

      choiceBtns.forEach(b => {
        b.classList.remove('selected-correct', 'selected-wrong');
        if (b.dataset.choice === c.correct) {
          b.classList.add('selected-correct');
        } else if (b === btn && !isCorrect) {
          b.classList.add('selected-wrong');
        }
      });

      if (feedbackBox) {
        feedbackBox.style.display = 'block';
        feedbackBox.className = `os-case-feedback ${isCorrect ? 'correct' : 'wrong'}`;
        feedbackBox.innerHTML = `
          <div style="display:flex; align-items:flex-start; gap:0.75rem;">
            <i class="fas ${isCorrect ? 'fa-check-circle' : 'fa-triangle-exclamation'}" style="font-size:1.4rem; margin-top:0.2rem;"></i>
            <div>
              <strong>${isCorrect ? 'Отличен избор!' : 'Не съвсем подходящо за тези изисквания.'}</strong>
              <p style="margin:0.25rem 0 0 0; font-size:0.92rem; line-height:1.5;">${c.explanation}</p>
            </div>
          </div>
        `;
      }
    });
  });
}
