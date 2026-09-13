function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

const QUADRANTS_DATA = {
  red: {
    name: '🔴 Червен квадрант',
    subtitle: 'Висока енергия / Неприятно',
    badgeClass: 'bg-rose-100 text-rose-800 border border-rose-200',
    animalName: 'Остроок сокол',
    emoji: '🦅',
    desc: 'Притежавате силна енергия и изострен фокус! Впрягате тази активност, за да преодолеете трудните задачи, да откриете сгрешените детайли и да постигнете прецизен резултат.',
    emotions: ['Ядосан', 'Тревожен', 'Напрегнат', 'Неспокоен', 'Раздразнен']
  },
  yellow: {
    name: '🟡 Жълт квадрант',
    subtitle: 'Висока енергия / Приятно',
    badgeClass: 'bg-amber-100 text-amber-800 border border-amber-200',
    animalName: 'Бърз гепард',
    emoji: '🐆',
    desc: 'Притежавате силна енергия и изострен фокус! Впрягате тази активност, за да преодолеете трудните задачи, да откриете сгрешените детайли и да постигнете прецизен резултат.',
    emotions: ['Радостен', 'Вдъхновен', 'Ентусиазиран', 'Енергичен', 'Горд']
  },
  blue: {
    name: '🔵 Син квадрант',
    subtitle: 'Ниска енергия / Неприятно',
    badgeClass: 'bg-sky-100 text-sky-800 border border-sky-200',
    animalName: 'Мъдра сова',
    emoji: '🦉',
    desc: 'Притежавате силна енергия и изострен фокус! Впрягате тази активност, за да преодолеете трудните задачи, да откриете сгрешените детайли и да постигнете прецизен резултат.',
    emotions: ['Тъжен', 'Изморен', 'Отпаднал', 'Обезкуражен', 'Скучаещ']
  },
  green: {
    name: '🟢 Зелен квадрант',
    subtitle: 'Ниска енергия / Приятно',
    badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    animalName: 'Сръчна лисица',
    emoji: '🦊',
    desc: 'Притежавате силна енергия и изострен фокус! Впрягате тази активност, за да преодолеете трудните задачи, да откриете сгрешените детайли и да постигнете прецизен резултат.',
    emotions: ['Спокоен', 'Удовлетворен', 'Хармоничен', 'Благодарен', 'Релаксиран']
  }
};

const EMOTIONS_MAP = {
  'Ядосан': { animalName: 'Остроок сокол', emoji: '🦅', desc: 'Притежавате силна енергия и изострен фокус! Впрягате тази активност, за да преодолеете трудните задачи, да откриете сгрешените детайли и да постигнете прецизен резултат.' },
  'Тревожен': { animalName: 'Бдителен еленов съгледвач', emoji: '🦌', desc: 'Притежавате силна енергия и изострен фокус! Впрягате тази активност, за да преодолеете трудните задачи, да откриете сгрешените детайли и да постигнете прецизен резултат.' },
  'Напрегнат': { animalName: 'Фокусиран тигър', emoji: '🐅', desc: 'Притежавате силна енергия и изострен фокус! Впрягате тази активност, за да преодолеете трудните задачи, да откриете сгрешените детайли и да постигнете прецизен резултат.' },
  'Неспокоен': { animalName: 'Енергичен кон', emoji: '🐎', desc: 'Притежавате силна енергия и изострен фокус! Впрягате тази активност, за да преодолеете трудните задачи, да откриете сгрешените детайли и да постигнете прецизен резултат.' },
  'Раздразнен': { animalName: 'Остър таралеж', emoji: '🦔', desc: 'Притежавате силна енергия и изострен фокус! Впрягате тази активност, за да преодолеете трудните задачи, да откриете сгрешените детайли и да постигнете прецизен резултат.' },

  'Радостен': { animalName: 'Игрив делфин', emoji: '🐬', desc: 'Притежавате силна енергия и изострен фокус! Впрягате тази активност, за да преодолеете трудните задачи, да откриете сгрешените детайли и да постигнете прецизен резултат.' },
  'Вдъхновен': { animalName: 'Въздушен орел', emoji: '🦅', desc: 'Притежавате силна енергия и изострен фокус! Впрягате тази активност, за да преодолеете трудните задачи, да откриете сгрешените детайли и да постигнете прецизен резултат.' },
  'Ентусиазиран': { animalName: 'Бърз гепард', emoji: '🐆', desc: 'Притежавате силна енергия и изострен фокус! Впрягате тази активност, за да преодолеете трудните задачи, да откриете сгрешените детайли и да постигнете прецизен резултат.' },
  'Енергичен': { animalName: 'Динамичен кон', emoji: '⚡', desc: 'Притежавате силна енергия и изострен фокус! Впрягате тази активност, за да преодолеете трудните задачи, да откриете сгрешените детайли и да постигнете прецизен резултат.' },
  'Горд': { animalName: 'Величествен лъв', emoji: '🦁', desc: 'Притежавате силна енергия и изострен фокус! Впрягате тази активност, за да преодолеете трудните задачи, да откриете сгрешените детайли и да постигнете прецизен резултат.' },

  'Тъжен': { animalName: 'Мъдра сова', emoji: '🦉', desc: 'Притежавате силна енергия и изострен фокус! Впрягате тази активност, за да преодолеете трудните задачи, да откриете сгрешените детайли и да постигнете прецизен резултат.' },
  'Изморен': { animalName: 'Почиваща коала', emoji: '🐨', desc: 'Притежавате силна енергия и изострен фокус! Впрягате тази активност, за да преодолеете трудните задачи, да откриете сгрешените детайли и да постигнете прецизен резултат.' },
  'Отпаднал': { animalName: 'Търпелива костенурка', emoji: '🐢', desc: 'Притежавате силна енергия и изострен фокус! Впрягате тази активност, за да преодолеете трудните задачи, да откриете сгрешените детайли и да постигнете прецизен резултат.' },
  'Обезкуражен': { animalName: 'Устойчив козел', emoji: '🐐', desc: 'Притежавате силна енергия и изострен фокус! Впрягате тази активност, за да преодолеете трудните задачи, да откриете сгрешените детайли и да постигнете прецизен резултат.' },
  'Скучаещ': { animalName: 'Любопитен хамелеон', emoji: '🦎', desc: 'Притежавате силна енергия и изострен фокус! Впрягате тази активност, за да преодолеете трудните задачи, да откриете сгрешените детайли и да постигнете прецизен резултат.' },

  'Спокоен': { animalName: 'Мъдър слон', emoji: '🐘', desc: 'Притежавате силна енергия и изострен фокус! Впрягате тази активност, за да преодолеете трудните задачи, да откриете сгрешените детайли и да постигнете прецизен резултат.' },
  'Удовлетворен': { animalName: 'Работническа пчела', emoji: '🐝', desc: 'Притежавате силна енергия и изострен фокус! Впрягате тази активност, за да преодолеете трудните задачи, да откриете сгрешените детайли и да постигнете прецизен резултат.' },
  'Хармоничен': { animalName: 'Грациозен лебед', emoji: '🦢', desc: 'Притежавате силна енергия и изострен фокус! Впрягате тази активност, за да преодолеете трудните задачи, да откриете сгрешените детайли и да постигнете прецизен резултат.' },
  'Благодарен': { animalName: 'Зелена панда', emoji: '🐼', desc: 'Притежавате силна енергия и изострен фокус! Впрягате тази активност, за да преодолеете трудните задачи, да откриете сгрешените детайли и да постигнете прецизен резултат.' },
  'Релаксиран': { animalName: 'Мързелив делфин', emoji: '🐬', desc: 'Притежавате силна енергия и изострен фокус! Впрягате тази активност, за да преодолеете трудните задачи, да откриете сгрешените детайли и да постигнете прецизен резултат.' }
};

export function render(comp) {
  const id = comp.id || 'emotiometer-block';
  const rawTitle = comp.title || 'Посочете вашето настроение и енергия';
  const title = rawTitle.replace(/^Емоциометър:\s*/, '');
  const prompt = comp.prompt || '';

  const renderChips = (quadKey) => {
    return QUADRANTS_DATA[quadKey].emotions.map(e => `
      <button type="button" class="emot-chip" data-emotion="${esc(e)}" data-quad="${quadKey}">${esc(e)}</button>
    `).join('');
  };

  return `
    <div class="emotiometer-card" id="${id}">
      <div class="interactive-card-header">
        ${title ? `
        <div class="interactive-card-badge">
          <span>${esc(title)}</span>
        </div>` : ''}
        ${prompt ? `<p class="interactive-card-lead mt-2 text-slate-600 font-medium">${esc(prompt)}</p>` : ''}
      </div>

      <div class="emotiometer-grid-wrapper">
        <div class="emotiometer-axis-top">
          <i class="fas fa-bolt text-amber-500"></i> ВИСОКА ЕНЕРГИЯ
        </div>

        <div class="emotiometer-middle-row">
          <div class="emotiometer-axis-left">
            <span>НЕПРИЯТНО</span>
            <i class="fas fa-thumbs-down text-rose-500"></i>
          </div>

          <div class="emotiometer-board" id="${id}-board">
            <div class="emotiometer-quadrant quad-red" data-quadrant="red">
              <div class="quad-header">
                <span class="quad-title">🔴 Червен квадрант</span>
                <span class="quad-subtitle">Висока енергия / Неприятно</span>
              </div>
              <div class="quad-emotions">${renderChips('red')}</div>
            </div>

            <div class="emotiometer-quadrant quad-yellow" data-quadrant="yellow">
              <div class="quad-header">
                <span class="quad-title">🟡 Жълт квадрант</span>
                <span class="quad-subtitle">Висока енергия / Приятно</span>
              </div>
              <div class="quad-emotions">${renderChips('yellow')}</div>
            </div>

            <div class="emotiometer-quadrant quad-blue" data-quadrant="blue">
              <div class="quad-header">
                <span class="quad-title">🔵 Син квадрант</span>
                <span class="quad-subtitle">Ниска енергия / Неприятно</span>
              </div>
              <div class="quad-emotions">${renderChips('blue')}</div>
            </div>

            <div class="emotiometer-quadrant quad-green" data-quadrant="green">
              <div class="quad-header">
                <span class="quad-title">🟢 Зелен квадрант</span>
                <span class="quad-subtitle">Ниска енергия / Приятно</span>
              </div>
              <div class="quad-emotions">${renderChips('green')}</div>
            </div>

            <div class="emotiometer-pin" id="${id}-pin" style="display: none;">
              <div class="pin-head">🎯</div>
            </div>
          </div>

          <div class="emotiometer-axis-right">
            <i class="fas fa-thumbs-up text-emerald-500"></i>
            <span>ПРИЯТНО</span>
          </div>
        </div>

        <div class="emotiometer-axis-bottom">
          <i class="fas fa-battery-quarter text-slate-400"></i> НИСКА ЕНЕРГИЯ
        </div>
      </div>

      <div class="emotiometer-result" id="${id}-result" style="display: none;">
        <div class="emot-result-card">
          <div class="emot-result-badge-quad" id="${id}-res-badge"></div>
          <div class="emot-avatar-circle" id="${id}-res-avatar"></div>
          <h3 class="emot-result-title" id="${id}-res-title"></h3>
          <div class="emot-emotion-selected" id="${id}-res-emotion"></div>
          <p class="emot-result-desc" id="${id}-res-desc"></p>
          <button type="button" class="btn-activity emot-reset-btn mt-3" id="${id}-reset-btn">
            Нов избор
          </button>
        </div>
      </div>
    </div>
  `;
}

export function init(comp) {
  const id = comp.id || 'emotiometer-block';
  const root = document.getElementById(id);
  if (!root) return;

  const board = root.querySelector(`#${id}-board`);
  const pin = root.querySelector(`#${id}-pin`);
  const resultBox = root.querySelector(`#${id}-result`);
  const resBadge = root.querySelector(`#${id}-res-badge`);
  const resAvatar = root.querySelector(`#${id}-res-avatar`);
  const resTitle = root.querySelector(`#${id}-res-title`);
  const resEmotion = root.querySelector(`#${id}-res-emotion`);
  const resDesc = root.querySelector(`#${id}-res-desc`);
  const resetBtn = root.querySelector(`#${id}-reset-btn`);

  if (!board || !resultBox) return;

  const quadrants = board.querySelectorAll('.emotiometer-quadrant');

  const selectState = (quadKey, emotionName, pageX, pageY) => {
    const data = QUADRANTS_DATA[quadKey];
    if (!data) return;

    let animalName = data.animalName;
    let emoji = data.emoji;
    let desc = data.desc;

    if (emotionName && EMOTIONS_MAP[emotionName]) {
      animalName = EMOTIONS_MAP[emotionName].animalName;
      emoji = EMOTIONS_MAP[emotionName].emoji;
      desc = EMOTIONS_MAP[emotionName].desc;
    }

    // Highlight quadrant
    quadrants.forEach(q => {
      if (q.dataset.quadrant === quadKey) {
        q.classList.add('active');
      } else {
        q.classList.remove('active');
      }
    });

    // Position pin
    if (pageX !== undefined && pageY !== undefined && pin) {
      const rect = board.getBoundingClientRect();
      const x = pageX - rect.left;
      const y = pageY - rect.top;
      pin.style.left = `${x}px`;
      pin.style.top = `${y}px`;
      pin.style.display = 'block';
    }

    // Populate result card
    if (resBadge) {
      resBadge.className = `emot-result-badge-quad ${data.badgeClass}`;
      resBadge.textContent = `${data.name} — ${data.subtitle}`;
    }
    if (resAvatar) resAvatar.textContent = emoji;
    if (resTitle) resTitle.textContent = animalName;
    if (resEmotion) {
      resEmotion.textContent = emotionName ? `Избрана емоция: „${emotionName}“` : `Посочено състояние в ${data.name}`;
    }
    if (resDesc) resDesc.textContent = desc;

    resultBox.style.display = 'block';
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  // Event handlers
  board.addEventListener('click', (e) => {
    const chip = e.target.closest('.emot-chip');
    if (chip) {
      e.stopPropagation();
      const quad = chip.dataset.quad;
      const emotion = chip.dataset.emotion;
      const rect = chip.getBoundingClientRect();
      selectState(quad, emotion, rect.left + rect.width / 2, rect.top + rect.height / 2);
      return;
    }

    const quadEl = e.target.closest('.emotiometer-quadrant');
    if (quadEl) {
      const quad = quadEl.dataset.quadrant;
      selectState(quad, null, e.clientX, e.clientY);
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      quadrants.forEach(q => q.classList.remove('active'));
      if (pin) pin.style.display = 'none';
      resultBox.style.display = 'none';
    });
  }
}
