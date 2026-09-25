// OS Conductor Lab Component - IT 8 Lesson 2.7 Summary
// Interactive dispatcher simulation: Route incoming system requests to the correct OS core subsystem

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

const DEFAULT_SUBSYSTEMS = [
  {
    id: 'cpu',
    label: 'Процеси и CPU',
    sublabel: 'Разпределяне на процесорно време (мултитаскинг)',
    icon: 'fas fa-microchip',
    color: '#f59e0b',
    border: '#fde68a'
  },
  {
    id: 'memory',
    label: 'Памет (RAM)',
    sublabel: 'Заделяне, освобождаване и защита на паметта',
    icon: 'fas fa-memory',
    color: '#3b82f6',
    border: '#bfdbfe'
  },
  {
    id: 'filesystem',
    label: 'Файлова система',
    sublabel: 'Записване, четене, имена и йерархия от папки',
    icon: 'fas fa-folder-tree',
    color: '#10b981',
    border: '#a7f3d0'
  },
  {
    id: 'devices',
    label: 'Драйвери и устройства',
    sublabel: 'Комуникация с периферния хардуер през драйвери',
    icon: 'fas fa-plug',
    color: '#8b5cf6',
    border: '#ddd6fe'
  },
  {
    id: 'ui',
    label: 'Потребителски интерфейс',
    sublabel: 'Графична среда (GUI), прозорци и вход от мишка/клавиатура',
    icon: 'fas fa-display',
    color: '#0284c7',
    border: '#bae6fd'
  }
];

const DEFAULT_EVENTS = [
  {
    id: 'ev-1',
    situation: 'Включвате нов безжичен USB адаптер за слушалки с микрофон. Системата разпознава модела и подготвя звуковия канал за разговор.',
    question: 'Коя подсистема свързва операционната система с хардуерното устройство чрез съответния драйвер?',
    target: 'devices'
  },
  {
    id: 'ev-2',
    situation: 'Кликвате бутона "Запиши като..." и избирате име "Referat_IT.docx" в папка "Документи" върху вътрешния SSD диск.',
    question: 'Коя подсистема организира физическото разположение на данните върху диска в йерархична структура от файлове и папки?',
    target: 'filesystem'
  },
  {
    id: 'ev-3',
    situation: 'Хващате заглавната лента на прозорец с мишката и го плъзвате до десния ръб на екрана, за да заеме точно половината площ.',
    question: 'Кой елемент на ОС приема действията на потребителя и управлява визуалното позициониране на прозорците на екрана?',
    target: 'ui'
  },
  {
    id: 'ev-4',
    situation: 'Слушате любима музика, докато играете онлайн игра на цял екран. И двете програми работят едновременно без прекъсване на звука.',
    question: 'Коя подсистема гарантира паралелната им работа, като разделя времето на кванти и светкавично превключва задачите?',
    target: 'cpu'
  },
  {
    id: 'ev-5',
    situation: 'Приключвате работа с голям проект за фотообработка и затваряте приложението. Заеманите досега 3 GB пространство стават свободни.',
    question: 'Коя подсистема моментално изчиства заетите адреси и връща паметта в общия системен резерв?',
    target: 'memory'
  },
  {
    id: 'ev-6',
    situation: 'Отваряте 15 нови тежки раздела с мултимедия. Браузърът иска от системата още 1.5 GB работно пространство за данни.',
    question: 'Коя функция на ОС осигурява изолирано пространство в оперативната памет за всеки отворен раздел?',
    target: 'memory'
  }
];

export function render(comp) {
  const id = comp.id || 'os-conductor-lab';
  const title = comp.title || '';
  const events = comp.events || DEFAULT_EVENTS;
  const subsystems = comp.subsystems || DEFAULT_SUBSYSTEMS;

  return `
    <section id="${esc(id)}" class="component osc-container" aria-label="${esc(title)}">
      <style>
        .osc-container {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          margin: 20px 0;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
          font-family: inherit;
        }

        .osc-header {
          margin-bottom: 20px;
          text-align: center;
        }

        .osc-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        /* Active Event Board */
        .osc-event-card {
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 22px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          transition: all 0.3s ease;
          position: relative;
        }

        .osc-event-text {
          font-size: 1.05rem;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.5;
          margin-bottom: 12px;
        }

        .osc-event-question {
          font-size: 0.88rem;
          font-weight: 700;
          color: #0369a1;
          background: #f0f9ff;
          border-left: 4px solid #0284c7;
          padding: 8px 12px;
          border-radius: 0 8px 8px 0;
          margin-bottom: 0;
        }

        /* Targets Grid */
        .osc-targets-title {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
          margin-bottom: 10px;
        }

        .osc-targets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-bottom: 18px;
        }

        .osc-target-btn {
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px;
          text-align: left;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: all 0.2s ease;
          position: relative;
        }

        .osc-target-btn:hover:not(:disabled) {
          border-color: #3b82f6;
          background: #f8fafc;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.12);
        }

        .osc-target-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 0.92rem;
          color: #1e293b;
        }

        .osc-target-desc {
          font-size: 0.76rem;
          color: #64748b;
          line-height: 1.35;
        }

        .osc-target-btn.btn-correct {
          background: #ecfdf5 !important;
          border-color: #10b981 !important;
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
        }

        .osc-target-btn.btn-correct .osc-target-header {
          color: #047857 !important;
        }

        .osc-target-btn.btn-wrong {
          background: #fef2f2 !important;
          border-color: #ef4444 !important;
          animation: oscShake 0.4s ease;
        }

        .osc-target-btn.btn-wrong .osc-target-header {
          color: #b91c1c !important;
        }

        @keyframes oscShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }

        /* Bottom Progress Meter */
        .osc-progress-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 10px 16px;
          margin-top: 20px;
        }

        .osc-progress-stat {
          font-size: 0.84rem;
          font-weight: 700;
          color: #334155;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .osc-dots {
          display: flex;
          gap: 6px;
        }

        .osc-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #cbd5e1;
          transition: all 0.3s ease;
        }

        .osc-dot.current {
          background: #3b82f6;
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
          transform: scale(1.2);
        }

        .osc-dot.done {
          background: #10b981;
        }
      </style>

      ${title ? `
      <div class="osc-header">
        <h3 class="osc-title">${esc(title)}</h3>
      </div>
      ` : ''}

      <!-- Play Screen -->
      <div class="osc-play-screen">
        <div class="osc-event-card">
          <div class="osc-event-text"></div>
          <div class="osc-event-question"></div>
        </div>

        <div class="osc-targets-title">
          Изберете подсистемата, която обработва тази заявка:
        </div>

        <div class="osc-targets-grid">
          ${subsystems.map(sub => `
            <button type="button" class="osc-target-btn" data-target="${esc(sub.id)}" style="--accent: ${sub.color};">
              <div class="osc-target-header">
                <i class="${esc(sub.icon)}" style="color: ${sub.color};" aria-hidden="true"></i>
                <span>${esc(sub.label)}</span>
              </div>
              <div class="osc-target-desc">${esc(sub.sublabel)}</div>
            </button>
          `).join('')}
        </div>

        <!-- Bottom Progress Meter -->
        <div class="osc-progress-bar">
          <div class="osc-progress-stat">
            Системна заявка <span class="osc-cur-idx">1</span> от ${events.length}
          </div>
          <div class="osc-dots">
            ${events.map((_, i) => `<span class="osc-dot ${i === 0 ? 'current' : ''}" data-idx="${i}"></span>`).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id || 'os-conductor-lab');
  if (!root) return;

  const events = comp.events || DEFAULT_EVENTS;
  let currentIndex = 0;
  let answeredState = false;
  let autoTimer = null;

  const curIdxEl = root.querySelector('.osc-cur-idx');
  const dots = [...root.querySelectorAll('.osc-dot')];
  const eventTextEl = root.querySelector('.osc-event-text');
  const questionEl = root.querySelector('.osc-event-question');
  const targetBtns = [...root.querySelectorAll('.osc-target-btn')];

  function renderEvent(idx) {
    if (autoTimer) {
      clearTimeout(autoTimer);
      autoTimer = null;
    }

    currentIndex = idx;
    answeredState = false;

    curIdxEl.textContent = idx + 1;

    dots.forEach((dot, i) => {
      dot.className = 'osc-dot';
      if (i < idx) dot.classList.add('done');
      if (i === idx) dot.classList.add('current');
    });

    const ev = events[idx];
    eventTextEl.textContent = ev.situation;
    questionEl.textContent = ev.question;

    targetBtns.forEach(btn => {
      btn.className = 'osc-target-btn';
      btn.disabled = false;
    });
  }

  function handleSelectTarget(chosenId, btn) {
    if (answeredState) return;

    const ev = events[currentIndex];
    const isCorrect = chosenId === ev.target;

    if (isCorrect) {
      answeredState = true;
      targetBtns.forEach(b => { b.disabled = true; });
      btn.classList.add('btn-correct');

      // Auto advance directly after 600ms
      autoTimer = setTimeout(() => {
        advance();
      }, 600);
    } else {
      btn.classList.add('btn-wrong');
      setTimeout(() => btn.classList.remove('btn-wrong'), 500);
    }
  }

  function advance() {
    if (autoTimer) {
      clearTimeout(autoTimer);
      autoTimer = null;
    }

    if (currentIndex + 1 < events.length) {
      renderEvent(currentIndex + 1);
    } else {
      dots.forEach(d => { d.className = 'osc-dot done'; });
      curIdxEl.textContent = events.length;
      eventTextEl.textContent = 'Всички системни заявки са успешно разпределени.';
      questionEl.style.display = 'none';
      targetBtns.forEach(btn => {
        btn.disabled = true;
        btn.className = 'osc-target-btn';
      });
    }
  }

  targetBtns.forEach(btn => {
    btn.onclick = () => {
      const targetId = btn.dataset.target;
      handleSelectTarget(targetId, btn);
    };
  });

  renderEvent(0);
}
