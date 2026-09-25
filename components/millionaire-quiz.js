// Millionaire Quiz Component ("Стани богат") - IT 8 Module 2 Summary Game
// Interactive 15-question quiz game show with lifelines, prize ladder (KP), and sound/visual effects.

import { resolveMediaUrl } from '../utils/media.js';

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

const PRIZE_LADDER = [
  { level: 1, amount: '100 KP', val: 100, guaranteed: false },
  { level: 2, amount: '200 KP', val: 200, guaranteed: false },
  { level: 3, amount: '300 KP', val: 300, guaranteed: false },
  { level: 4, amount: '500 KP', val: 500, guaranteed: false },
  { level: 5, amount: '1 000 KP', val: 1000, guaranteed: true },
  { level: 6, amount: '2 000 KP', val: 2000, guaranteed: false },
  { level: 7, amount: '4 000 KP', val: 4000, guaranteed: false },
  { level: 8, amount: '8 000 KP', val: 8000, guaranteed: false },
  { level: 9, amount: '16 000 KP', val: 16000, guaranteed: false },
  { level: 10, amount: '32 000 KP', val: 32000, guaranteed: true },
  { level: 11, amount: '64 000 KP', val: 64000, guaranteed: false },
  { level: 12, amount: '125 000 KP', val: 125000, guaranteed: false },
  { level: 13, amount: '250 000 KP', val: 250000, guaranteed: false },
  { level: 14, amount: '500 000 KP', val: 500000, guaranteed: false },
  { level: 15, amount: '1 000 000 KP', val: 1000000, guaranteed: true }
];

export function render(comp) {
  const id = comp.id || 'millionaire-quiz';
  const title = comp.title || 'Раздел 2: Компютърни системи';
  const rawBg = comp.backgroundImage || comp.bgImage || 'other/gameBackgr.png';
  const bgImg = resolveMediaUrl(rawBg);

  return `
    <section id="${esc(id)}" class="component mq-card" aria-label="${esc(title)}">
      <style>
        .mq-card {
          background: linear-gradient(180deg, rgba(9, 13, 22, 0.72) 0%, rgba(9, 13, 22, 0.88) 100%),
                      url("${esc(bgImg)}") center/cover no-repeat;
          border: 1px solid #312e81;
          border-radius: 18px;
          padding: 24px;
          color: #ffffff;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          font-family: inherit;
        }

        .mq-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 16px;
          margin-bottom: 20px;
        }

        .mq-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mq-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #eab308;
          margin: 0;
        }

        .mq-autowin-btn {
          background: rgba(234, 179, 8, 0.15);
          border: 1px dashed #eab308;
          color: #eab308;
          padding: 4px 10px;
          font-size: 0.76rem;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mq-autowin-btn:hover {
          background: #eab308;
          color: #0f172a;
        }

        /* Lifelines Bar */
        .mq-lifelines {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mq-lifeline-btn {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(234, 179, 8, 0.4);
          color: #eab308;
          border-radius: 12px;
          padding: 8px 12px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .mq-lifeline-btn:hover:not(:disabled) {
          background: #eab308;
          color: #0f172a;
          box-shadow: 0 0 12px rgba(234, 179, 8, 0.5);
        }

        .mq-lifeline-btn:disabled {
          opacity: 0.3;
          border-color: rgba(255,255,255,0.1);
          color: #64748b;
          cursor: not-allowed;
          text-decoration: line-through;
        }

        /* Main Game Grid */
        .mq-game-grid {
          display: grid;
          grid-template-columns: 1fr 240px;
          gap: 20px;
        }

        @media (max-width: 800px) {
          .mq-game-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Left Board */
        .mq-board {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .mq-question-box {
          background: linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%);
          border: 2px solid #eab308;
          border-radius: 14px;
          padding: 20px;
          min-height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 1.05rem;
          font-weight: 700;
          color: #ffffff;
          box-shadow: inset 0 0 20px rgba(234, 179, 8, 0.15);
          margin-bottom: 20px;
          position: relative;
        }

        .mq-q-number {
          position: absolute;
          top: -12px;
          left: 20px;
          background: #eab308;
          color: #0f172a;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 2px 10px;
          border-radius: 10px;
          text-transform: uppercase;
        }

        .mq-options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        @media (max-width: 600px) {
          .mq-options-grid {
            grid-template-columns: 1fr;
          }
        }

        .mq-option-btn {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid #3b82f6;
          border-radius: 10px;
          padding: 14px 16px;
          color: #ffffff;
          font-weight: 600;
          font-size: 0.9rem;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.2s ease;
          position: relative;
        }

        .mq-option-btn:hover:not(:disabled) {
          border-color: #eab308;
          background: rgba(234, 179, 8, 0.15);
          color: #eab308;
        }

        .mq-opt-prefix {
          color: #eab308;
          font-weight: 800;
        }

        .mq-option-btn.selected {
          background: #d97706 !important;
          border-color: #f59e0b !important;
          color: #ffffff !important;
          animation: mqPulse 0.5s infinite alternate;
        }

        @keyframes mqPulse {
          0% { box-shadow: 0 0 5px #f59e0b; }
          100% { box-shadow: 0 0 18px #f59e0b; }
        }

        .mq-option-btn.correct {
          background: #059669 !important;
          border-color: #34d399 !important;
          color: #ffffff !important;
          box-shadow: 0 0 20px rgba(52, 211, 153, 0.5);
        }

        .mq-option-btn.wrong {
          background: #dc2626 !important;
          border-color: #fca5a5 !important;
          color: #ffffff !important;
        }

        .mq-option-btn.disabled-5050 {
          opacity: 0.15;
          pointer-events: none;
          filter: grayscale(100%);
        }

        /* Right Prize Ladder */
        .mq-ladder-panel {
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 12px;
          display: flex;
          flex-direction: column-reverse;
          gap: 4px;
        }

        .mq-ladder-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #64748b;
          transition: all 0.2s ease;
        }

        .mq-ladder-item.guaranteed {
          color: #ffffff;
        }

        .mq-ladder-item.active {
          background: #eab308;
          color: #0f172a;
          box-shadow: 0 0 10px rgba(234, 179, 8, 0.5);
        }

        .mq-ladder-item.passed {
          color: #10b981;
        }

        /* Modal Overlay for Lifelines or Game Over */
        .mq-dialog {
          position: absolute;
          inset: 0;
          background: rgba(9, 13, 22, 0.92);
          backdrop-filter: blur(6px);
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          text-align: center;
          z-index: 10;
          animation: mqFadeIn 0.3s ease;
        }

        @keyframes mqFadeIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }

        .mq-dialog-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #eab308;
          margin-bottom: 12px;
        }

        .mq-dialog-text {
          font-size: 0.92rem;
          color: #cbd5e1;
          line-height: 1.5;
          margin-bottom: 20px;
          max-width: 480px;
        }

        .mq-dialog-btn {
          background: #eab308;
          color: #0f172a;
          border: none;
          border-radius: 10px;
          padding: 12px 24px;
          font-size: 0.9rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .mq-dialog-btn:hover {
          background: #f59e0b;
          transform: translateY(-2px);
          box-shadow: 0 0 12px rgba(234, 179, 8, 0.4);
        }

        /* Audience Poll Bars */
        .mq-poll-bars {
          display: flex;
          gap: 12px;
          align-items: flex-end;
          height: 120px;
          margin: 16px 0;
          width: 280px;
        }

        .mq-poll-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .mq-poll-bar-fill {
          width: 100%;
          background: linear-gradient(180deg, #38bdf8 0%, #0284c7 100%);
          border-radius: 4px 4px 0 0;
          transition: height 0.8s ease-out;
        }

        .mq-poll-lbl {
          font-size: 0.75rem;
          font-weight: 700;
          color: #eab308;
        }
      </style>

      <div style="position: relative;">
        <div class="mq-header">
          <div class="mq-title-group">
            <h3 class="mq-title">${esc(title)}</h3>
            <button type="button" class="mq-autowin-btn" title="Преглед на победата при 1 000 000 KP">⚡ Автоматично решаване (тест)</button>
          </div>

          <div class="mq-lifelines">
            <button type="button" class="mq-lifeline-btn" data-life="5050" title="50 на 50: Премахва 2 грешни отговора">
              <i class="fas fa-percent" aria-hidden="true"></i> 50:50
            </button>
            <button type="button" class="mq-lifeline-btn" data-life="audience" title="Помощ от публиката">
              <i class="fas fa-users" aria-hidden="true"></i> Публика
            </button>
            <button type="button" class="mq-lifeline-btn" data-life="friend" title="Помощ от учител">
              <i class="fas fa-graduation-cap" aria-hidden="true"></i> Учител
            </button>
          </div>
        </div>

        <div class="mq-game-grid">
          <div class="mq-board">
            <div class="mq-question-box">
              <span class="mq-q-number">Въпрос 1 / 15</span>
              <span class="mq-q-text">Зареждане на въпрос...</span>
            </div>

            <div class="mq-options-grid">
              <button type="button" class="mq-option-btn" data-idx="0">
                <span class="mq-opt-prefix">A:</span> <span class="mq-opt-txt"></span>
              </button>
              <button type="button" class="mq-option-btn" data-idx="1">
                <span class="mq-opt-prefix">B:</span> <span class="mq-opt-txt"></span>
              </button>
              <button type="button" class="mq-option-btn" data-idx="2">
                <span class="mq-opt-prefix">C:</span> <span class="mq-opt-txt"></span>
              </button>
              <button type="button" class="mq-option-btn" data-idx="3">
                <span class="mq-opt-prefix">D:</span> <span class="mq-opt-txt"></span>
              </button>
            </div>
          </div>

          <div class="mq-ladder-panel">
            ${PRIZE_LADDER.map(item => `
              <div class="mq-ladder-item ${item.guaranteed ? 'guaranteed' : ''}" data-level="${item.level}">
                <span>${item.level}.</span>
                <span>${item.amount}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Dynamic Overlay Dialog -->
        <div class="mq-dialog" style="display: none;"></div>
      </div>
    </section>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id || 'millionaire-quiz');
  if (!root) return;

  const questions = comp.questions || [
    {
      question: 'Кой основен принцип въвежда архитектурата на фон Нойман?',
      options: ['Съхранена в паметта програма', 'Безжична връзка между устройства', 'Двоичен код за звук', 'Сензорен екран'],
      correctIndex: 0
    },
    {
      question: 'Кои три основни стълба изграждат компютърната система?',
      options: ['Хардуер, софтуер и данни', 'Само хардуер и интернет', 'Само процесор и памет', 'Клавиатура, мишка и монитор'],
      correctIndex: 0
    },
    {
      question: 'Кой компонент е известен като „мозъкът“ на компютърната система?',
      options: ['Централен процесор (CPU)', 'Твърд диск (SSD)', 'Захранващ блок', 'Монитор'],
      correctIndex: 0
    },
    {
      question: 'Коя памет губи съдържанието си при изключване на компютъра (енергозависима)?',
      options: ['Оперативна памет (RAM)', 'Твърд диск (HDD/SSD)', 'USB флаш памет', 'ROM BIOS'],
      correctIndex: 0
    },
    {
      question: 'Коя е основната задача на операционната система (ОС)?',
      options: ['Управление на хардуерните ресурси и изпълнение на програми', 'Оформяне на текст с получер шрифт', 'Печат на документи върху хартия', 'Заснемане на цифрови снимки'],
      correctIndex: 0
    },
    {
      question: 'Каква е функцията на системния драйвер?',
      options: ['Управлява конкретно хардуерно устройство от името на ОС', 'Заменя изцяло операционната система', 'Съхранява пароли на потребителя', 'Ускорява скоростта на интернет'],
      correctIndex: 0
    },
    {
      question: 'Какво представлява технологията Plug-and-Play (PnP)?',
      options: ['ОС автоматично разпознава и инсталира ново устройство', 'Изтрива стари драйвери от твърдия диск', 'Ускорява процесора автоматично', 'Автоматично архивни файлове'],
      correctIndex: 0
    },
    {
      question: 'Коя безжична технология работи на най-малко разстояние (няколко сантиметра)?',
      options: ['NFC', 'Wi-Fi Direct', 'Bluetooth', 'Клетъчни мрежи 5G'],
      correctIndex: 0
    },
    {
      question: 'Какво означава буквата „G“ в наименованията 4G и 5G?',
      options: ['Generation (поколение)', 'Gigabyte', 'Global', 'Graphics'],
      correctIndex: 0
    },
    {
      question: 'Какво представлява моделът на сигурност „Пясъчник“ (Sandbox)?',
      options: ['Изолирана защитена среда за всяко мобилно приложение', 'Антивирусен скенер за настолен компютър', 'Изолация срещу прах и вода', 'Архивиране на контакти'],
      correctIndex: 0
    },
    {
      question: 'Как се нарича интегрираният чип при смартфоните, съчетаващ CPU, GPU и модем?',
      options: ['System on Chip (SoC)', 'BIOS', 'Northbridge', 'SATA Controller'],
      correctIndex: 0
    },
    {
      question: 'Кой интерфейс пренася едновременно цифрово видео и многоканален звук?',
      options: ['HDMI', 'VGA', 'USB-A', 'RJ-45 (LAN)'],
      correctIndex: 0
    },
    {
      question: 'Къде в Windows проверяваме за липсващ драйвер с жълт удивителен знак?',
      options: ['Device Manager (Диспечер на устройствата)', 'Notepad', 'Calculator', 'Paint'],
      correctIndex: 0
    },
    {
      question: 'Кой етап от еволюцията на компютрите се отличава с използване на вакуумни лампи?',
      options: ['Електронен етап (Първо поколение)', 'Предмеханичен етап', 'Механичен етап', 'Микропроцесорен етап'],
      correctIndex: 0
    },
    {
      question: 'Дадена конфигурация има „RAM: 16 GB DDR4, SSD: 512 GB NVMe“. Кое е вярно?',
      options: ['Има 16 GB оперативна памет и 512 GB бърз NVMe диск', 'Има 512 GB оперативна памет', 'RAM и SSD са един и същ компонент', 'DDR4 е вид видеокарта'],
      correctIndex: 0
    }
  ];

  let currentLevel = 1; // 1 to 15
  let answeredState = false;
  let lifelinesUsed = { '5050': false, 'audience': false, 'friend': false };
  let currentQuestionData = null;

  const qBoxNum = root.querySelector('.mq-q-number');
  const qBoxText = root.querySelector('.mq-q-text');
  const optBtns = [...root.querySelectorAll('.mq-option-btn')];
  const ladderItems = [...root.querySelectorAll('.mq-ladder-item')];
  const dialog = root.querySelector('.mq-dialog');
  const lifelineBtns = [...root.querySelectorAll('.mq-lifeline-btn')];
  const autowinBtn = root.querySelector('.mq-autowin-btn');

  function shuffleOptions(qData) {
    const rawOpts = qData.options.map((opt, i) => ({ text: opt, isCorrect: i === qData.correctIndex }));
    for (let i = rawOpts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rawOpts[i], rawOpts[j]] = [rawOpts[j], rawOpts[i]];
    }
    return rawOpts;
  }

  function loadLevel(level) {
    currentLevel = level;
    answeredState = false;

    qBoxNum.textContent = `Въпрос ${level} / 15`;

    const rawQ = questions[level - 1] || questions[0];
    currentQuestionData = {
      question: rawQ.question,
      shuffledOptions: shuffleOptions(rawQ)
    };

    qBoxText.textContent = currentQuestionData.question;

    optBtns.forEach((btn, i) => {
      btn.className = 'mq-option-btn';
      btn.disabled = false;
      const txtSpan = btn.querySelector('.mq-opt-txt');
      txtSpan.textContent = currentQuestionData.shuffledOptions[i].text;
    });

    // Update Ladder
    ladderItems.forEach(item => {
      const lvl = parseInt(item.dataset.level, 10);
      item.classList.toggle('active', lvl === level);
      item.classList.toggle('passed', lvl < level);
    });
  }

  function getGuaranteedAmount() {
    let amount = '0 KP';
    for (let i = currentLevel - 2; i >= 0; i--) {
      if (PRIZE_LADDER[i].guaranteed) {
        return PRIZE_LADDER[i].amount;
      }
    }
    return amount;
  }

  function triggerWin() {
    showDialog(`
      <div style="font-size: 3rem; margin-bottom: 10px;">🏆</div>
      <h4 class="mq-dialog-title">ПОЗДРАВЛЕНИЯ!</h4>
      <p class="mq-dialog-text">Отговорихте правилно на всички 15 въпроса и спечелихте:<br><strong style="font-size: 1.25rem; color: #eab308; display: inline-block; margin-top: 8px;">1 000 000 KP!</strong></p>
      <button type="button" class="mq-dialog-btn mq-restart-btn">
        Нов опит
      </button>
    `);
  }

  function handleOptionClick(btnIndex) {
    if (answeredState) return;
    answeredState = true;

    optBtns.forEach(b => { b.disabled = true; });
    const clickedBtn = optBtns[btnIndex];
    clickedBtn.classList.add('selected');

    const isCorrect = currentQuestionData.shuffledOptions[btnIndex].isCorrect;

    setTimeout(() => {
      clickedBtn.classList.remove('selected');

      if (isCorrect) {
        clickedBtn.classList.add('correct');

        setTimeout(() => {
          if (currentLevel === 15) {
            triggerWin();
          } else {
            // Move to next level
            loadLevel(currentLevel + 1);
          }
        }, 1200);
      } else {
        clickedBtn.classList.add('wrong');
        // Find and highlight correct one
        const correctIndex = currentQuestionData.shuffledOptions.findIndex(o => o.isCorrect);
        if (correctIndex !== -1) {
          optBtns[correctIndex].classList.add('correct');
        }

        const wonAmount = getGuaranteedAmount();

        setTimeout(() => {
          showDialog(`
            <h4 class="mq-dialog-title" style="color: #fca5a5;">Играта приключи</h4>
            <p class="mq-dialog-text">За съжаление отговорът беше грешен.<br>Тръгвате си със застрахованата сума от <strong>${wonAmount}</strong>!</p>
            <button type="button" class="mq-dialog-btn mq-restart-btn">
              Нов опит
            </button>
          `);
        }, 1500);
      }
    }, 1200);
  }

  function showDialog(html) {
    dialog.innerHTML = html;
    dialog.style.display = 'flex';

    const restartBtn = dialog.querySelector('.mq-restart-btn');
    if (restartBtn) {
      restartBtn.onclick = () => {
        dialog.style.display = 'none';
        lifelinesUsed = { '5050': false, 'audience': false, 'friend': false };
        lifelineBtns.forEach(b => { b.disabled = false; });
        loadLevel(1);
      };
    }

    const closeBtn = dialog.querySelector('.mq-close-btn');
    if (closeBtn) {
      closeBtn.onclick = () => {
        dialog.style.display = 'none';
      };
    }
  }

  if (autowinBtn) {
    autowinBtn.onclick = () => {
      triggerWin();
    };
  }

  // Lifelines implementation
  lifelineBtns.forEach(btn => {
    btn.onclick = () => {
      const type = btn.dataset.life;
      if (lifelinesUsed[type] || answeredState) return;

      lifelinesUsed[type] = true;
      btn.disabled = true;

      if (type === '5050') {
        // Disable 2 wrong options
        const wrongIndices = [];
        currentQuestionData.shuffledOptions.forEach((opt, idx) => {
          if (!opt.isCorrect) wrongIndices.push(idx);
        });

        // Shuffle wrong indices and pick 2
        wrongIndices.sort(() => Math.random() - 0.5);
        const toDisable = wrongIndices.slice(0, 2);

        toDisable.forEach(idx => {
          optBtns[idx].classList.add('disabled-5050');
        });
      } else if (type === 'audience') {
        // Generate audience percentages favoring the correct answer
        const correctIdx = currentQuestionData.shuffledOptions.findIndex(o => o.isCorrect);
        let percentages = [10, 10, 10, 10];
        const correctBoost = Math.floor(Math.random() * 25) + 55; // 55% - 80%
        percentages[correctIdx] = correctBoost;

        let rem = 100 - correctBoost;
        for (let i = 0; i < 4; i++) {
          if (i !== correctIdx) {
            const p = Math.floor(Math.random() * rem);
            percentages[i] = p;
            rem -= p;
          }
        }
        percentages[correctIdx] += rem; // Assign remaining

        const letters = ['A', 'B', 'C', 'D'];
        let barsHtml = `<div class="mq-poll-bars">`;
        letters.forEach((ltr, i) => {
          barsHtml += `
            <div class="mq-poll-col">
              <span style="font-size: 0.75rem; color: #94a3b8;">${percentages[i]}%</span>
              <div class="mq-poll-bar-fill" style="height: ${percentages[i]}%;"></div>
              <span class="mq-poll-lbl">${ltr}</span>
            </div>
          `;
        });
        barsHtml += `</div>`;

        showDialog(`
          <p class="mq-dialog-text" style="margin-bottom: 8px;">Резултати от гласуването на публиката в студиото:</p>
          ${barsHtml}
          <button type="button" class="mq-dialog-btn mq-close-btn">Продължи</button>
        `);
      } else if (type === 'friend') {
        const correctOpt = currentQuestionData.shuffledOptions.find(o => o.isCorrect);
        showDialog(`
          <p class="mq-dialog-text" style="margin-top: 10px;">
            <em>„Здравей! Прегледах въпроса внимателно. Според учебния материал по Информационни технологии, с почти 100% сигурност правилният отговор е: <strong>${esc(correctOpt.text)}</strong>.“</em>
          </p>
          <button type="button" class="mq-dialog-btn mq-close-btn">Благодаря!</button>
        `);
      }
    };
  });

  optBtns.forEach((btn, idx) => {
    btn.onclick = () => handleOptionClick(idx);
  });

  loadLevel(1);
}
