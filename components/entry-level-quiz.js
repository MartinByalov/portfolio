// Entry Level Assessment Quiz Component for 10th Grade
// Includes 26 multiple choice questions + 3 practical Excel tasks (Total 30 points)

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

const quizData = [
  { num: 1, q: "GPS се използва основно за:", options: ["определяне на местоположение", "създаване на пароли", "филтриране на таблици", "защита от вируси"], correct: 0, pts: 1, exp: "GPS (Global Positioning System) е спътникова система за точно определяне на географските координати." },
  { num: 2, q: "Кое твърдение за приложенията за карти е вярно?", options: ["Винаги показват само един маршрут.", "Могат да предложат различни маршрути (автомобилен, пешеходен, обществен транспорт).", "Работят само без интернет.", "Не използват данни за местоположение."], correct: 1, pts: 1, exp: "Картографските приложения (Google Maps, Waze) анализират трафика и предлагат алтернативни маршрути." },
  { num: 3, q: "Суперкомпютрите се използват най-често за:", options: ["писане на кратки текстове", "сложни научни, инженерни и климатични изчисления", "разглеждане на социални мрежи", "създаване на пароли"], correct: 1, pts: 1, exp: "Суперкомпютрите обработват масивни паралелни изчисления (симулация на климат, молекулярна биология, аеродинамика)." },
  { num: 4, q: "Коя услуга е пример за Cloud Storage (облачно хранилище)?", options: ["Google Drive", "калкулатор", "антивирусна програма", "драйвер за принтер"], correct: 0, pts: 1, exp: "Google Drive, OneDrive и Dropbox са водещи платформи за отдалечено съхранение на файлове." },
  { num: 5, q: "Облачните технологии позволяват:", options: ["само съхранение", "само споделяне", "съхранение, споделяне и съвместна работа в реално време", "само печат на документи"], correct: 2, pts: 1, exp: "Облакът обединява централизирано съхранение, контрол на достъпа и колаборация в реално време." },
  { num: 6, q: "Компютърна мрежа е:", options: ["един компютър с много програми", "два или повече свързани компютъра и устройства за обмен на данни и ресурси", "само безжична връзка", "само интернет страница"], correct: 1, pts: 1, exp: "Мрежата е съвкупност от апаратни и софтуерни средства за свързване на независими изчислителни устройства." },
  { num: 7, q: "При Peer-to-Peer (P2P) мрежа:", options: ["всеки компютър може да е едновременно клиент и сървър", "има само един клиент", "няма обмен на ресурси", "задължително има централен сървър"], correct: 0, pts: 1, exp: "В едноранговите (P2P) мрежи всички възли са равнопоставени и споделят ресурси без централен сървър." },
  { num: 8, q: "При Client–Server мрежа сървърът:", options: ["няма специална роля", "предоставя и управлява ресурси и услуги за клиентите", "винаги е изключен", "служи само като принтер"], correct: 1, pts: 1, exp: "Сървърът е мощна машина, предоставяща централизирани бази данни, файлове и автентикация." },
  { num: 9, q: "Коя мрежа обикновено обхваща училищна сграда?", options: ["WAN", "MAN", "LAN", "GPS"], correct: 2, pts: 1, exp: "LAN (Local Area Network) покрива ограничена географска площ – стая, етаж или сграда." },
  { num: 10, q: "Коя мрежа може да обхваща цял град?", options: ["LAN", "MAN", "PAN", "Peer-to-Peer"], correct: 1, pts: 1, exp: "MAN (Metropolitan Area Network) е градска мрежа, свързваща множество локални мрежи." },
  { num: 11, q: "WAN е мрежа, която:", options: ["свързва устройства само в една стая", "обхваща големи географски разстояния (държави, континенти)", "не използва интернет", "съдържа само два компютъра"], correct: 1, pts: 1, exp: "WAN (Wide Area Network) свързва отдалечени региони; глобалната мрежа Интернет е най-големият пример." },
  { num: 12, q: "Коя топология използва централно устройство (суич/хъб)?", options: ["кръгова", "звезда", "шинна", "дървовидна"], correct: 1, pts: 1, exp: "В топология Звезда (Star) всички компютри са свързани към централно разпределително устройство." },
  { num: 13, q: "При шинната топология устройствата са свързани:", options: ["към общ основен кабел с терминатори", "само по двойки", "в затворен кръг", "без кабели"], correct: 0, pts: 1, exp: "В шинната (Bus) топология всички устройства ползват общ линеен кабел с терминатори в краищата." },
  { num: 14, q: "Кой кабел предава данни чрез светлинни импулси?", options: ["коаксиален", "усукана двойка", "оптичен", "USB"], correct: 2, pts: 1, exp: "Оптичният кабел използва стъклени/пластмасови влакна и фотонно предаване с огромна скорост." },
  { num: 15, q: "Мярката за скорост на предаване на данни в мрежа е:", options: ["Hz", "b/s (bps, бита в секунда)", "cm/s", "dpi"], correct: 1, pts: 1, exp: "Мрежовата пропускателна способност се измерва в бита за секунда (b/s, Mb/s, Gb/s)." },
  { num: 16, q: "IP адресът е:", options: ["име на папка", "уникален цифров адрес на устройство в мрежа", "вид парола", "команда за сортиране"], correct: 1, pts: 1, exp: "IP адресът (напр. 192.168.1.10) уникално идентифицира мрежовия интерфейс в протокола TCP/IP." },
  { num: 17, q: "DNS (Domain Name System) служи за:", options: ["преобразуване между домейн имена и IP адреси", "създаване на таблици", "компресиране на файлове", "филтриране на данни"], correct: 0, pts: 1, exp: "DNS действа като телефонен указател на интернет, свързвайки имена като 'mon.bg' със съответния IP адрес." },
  { num: 18, q: "Коя парола е най-сигурна?", options: ["12345678", "qwerty2026", "PetarBogdan", "M0re!Kamen_84"], correct: 3, pts: 1, exp: "M0re!Kamen_84 съдържа главни и малки букви, цифри, специални знаци и достатъчна дължина." },
  { num: 19, q: "Firewall (Защитна стена) служи основно за:", options: ["филтриране на мрежовия трафик и спиране на неразрешен достъп", "смяна на шрифтове", "изчертаване на диаграми", "увеличаване на звука"], correct: 0, pts: 1, exp: "Защитната стена следи входящия и изходящия трафик според дефинирани правила за сигурност." },
  { num: 20, q: "Какво прави формулата =COUNTIF(B2:B20;\">=50\") в Excel?", options: ["намира сбора на числата", "преброява колко клетки в диапазона съдържат стойност, по-голяма или равна на 50", "сортира колоната", "изтрива клетките под 50"], correct: 1, pts: 1, exp: "COUNTIF(range; criteria) брои само онези клетки от диапазона, които отговарят на зададеното условие." },
  { num: 21, q: "Сортирането в електронна таблица:", options: ["скрива редове", "подрежда редовете по определен критерий (възходящ или низходящ)", "изтрива колони", "създава нова таблица"], correct: 1, pts: 1, exp: "Сортирането пренарежда данните без да премахва или скрива редове." },
  { num: 22, q: "Бутонът Add Level в диалоговия прозорец Custom Sort служи за:", options: ["добавяне на допълнителен критерий за сортиране (многокритерийно сортиране)", "добавяне на нов работен лист", "добавяне на нова формула", "добавяне на анимация"], correct: 0, pts: 1, exp: "Add Level дефинира втори и последващи нива на подреждане (Then by)." },
  { num: 23, q: "Филтрирането в Excel:", options: ["временно скрива редовете, които не отговарят на зададени условия", "изтрива безвъзвратно данни", "променя стойностите в клетките", "затваря документа"], correct: 0, pts: 1, exp: "Филтърът визуализира само редовете, отговарящи на критерия, като останалите остават скрити." },
  { num: 24, q: "От кои менюта в Excel може да се избере инструментът Sort & Filter?", options: ["Home и Data", "Insert и View", "Page Layout и Review", "Help и File"], correct: 0, pts: 1, exp: "Sort & Filter се намира както в раздел Home (Editing), така и в раздел Data (Sort & Filter)." },
  { num: 25, q: "Инструментът Data Validation може да ограничава:", options: ["само цвета на клетката", "само размера на шрифта", "типа, обхвата и формата на въвежданите данни", "скоростта на компютъра"], correct: 2, pts: 1, exp: "Data Validation задава допустими диапазони (цели числа, десетични, списъци, дати, дължина на текст)." },
  { num: 26, q: "Кои твърдения за Data Validation са верни? [Изберете ДВАТА верни отговора] (2 т.)", options: ["Винаги изтрива съдържанието на клетките.", "Може да изведе потребителско съобщение преди въвеждане (Input Message).", "Може да блокира въвеждането на невалидни данни чрез съобщение за грешка (Error Alert - Stop).", "Работи само при безжична връзка."], correct: [1, 2], pts: 2, exp: "Data Validation има табове Settings (критерии), Input Message (подсказка) и Error Alert (Stop, Warning, Info)." }
];

export function render(comp) {
  const compId = comp.id || 'entry-level-quiz';

  const questionsHtml = quizData.map((item, idx) => {
    const isMulti = Array.isArray(item.correct);
    const inputType = isMulti ? 'checkbox' : 'radio';

    const optsHtml = item.options.map((opt, oIdx) => {
      const optLetter = ['А', 'Б', 'В', 'Г'][oIdx] || '';
      return `
        <label class="quiz-opt-label" style="display:flex; align-items:flex-start; gap:10px; padding:8px 12px; margin-bottom:6px; background:#161b22; border:1px solid #30363d; border-radius:6px; cursor:pointer; font-size:13.5px; color:#c9d1d9; transition:all 0.15s;">
          <input type="${inputType}" name="${esc(compId)}-q${idx}" value="${oIdx}" style="margin-top:3px; accent-color:#238636;">
          <span><strong>${optLetter})</strong> ${esc(opt)}</span>
        </label>
      `;
    }).join('');

    return `
      <div class="test-question-item" data-qindex="${idx}" style="background:#0d1117; border:1px solid #30363d; border-radius:8px; padding:16px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
          <h4 style="margin:0; font-size:14.5px; color:#f0f6fc; line-height:1.4;">
            <span style="color:#58a6ff; font-family:monospace; margin-right:6px;">${item.num}.</span>${esc(item.q)}
          </h4>
          <span style="font-size:11px; padding:2px 8px; border-radius:10px; background:#21262d; color:#8b949e; white-space:nowrap; margin-left:12px; font-weight:700;">
            ${item.pts} ${item.pts === 1 ? 'точка' : 'точки'}
          </span>
        </div>
        <div class="quiz-opts-container">
          ${optsHtml}
        </div>
        <div class="q-feedback-box" style="display:none; margin-top:10px; padding:10px; border-radius:6px; font-size:12.5px; line-height:1.5;"></div>
      </div>
    `;
  }).join('');

  return `
    <section class="component entry-quiz-container" id="${esc(compId)}" style="margin: 32px 0;">
      <div style="background:#161b22; border:1px solid #30363d; border-radius:12px; padding:24px; box-shadow:0 8px 24px rgba(0,0,0,0.15);">
        
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px; border-bottom:1px solid #30363d; padding-bottom:16px;">
          <div>
            <h3 style="margin:0; font-size:1.3rem; color:#ffffff; display:flex; align-items:center; gap:10px;">
              <i class="fa-solid fa-clipboard-question" style="color:#3fb950;"></i>
              <span>${esc(comp.title || 'Тренировъчен тест за входно ниво (10. клас)')}</span>
            </h3>
            <p style="margin:6px 0 0 0; font-size:13.5px; color:#8b949e;">
              Максимален резултат: <strong>30 точки</strong>. Решете въпросите за цялостна проверка на началната подготовка.
            </p>
          </div>
          <div style="display:flex; gap:10px; align-items:center;">
            <span class="quiz-score-badge" style="font-size:13px; font-weight:700; padding:6px 14px; border-radius:20px; background:#21262d; color:#58a6ff; border:1px solid #30363d;">
              Резултат: -- / 30 т.
            </span>
          </div>
        </div>

        <form class="entry-quiz-form">
          <!-- 26 MULTIPLE CHOICE QUESTIONS -->
          ${questionsHtml}

          <!-- PRACTICAL EXCEL QUESTIONS (27, 28, 29) -->
          <div style="margin: 28px 0 16px; padding:12px 16px; background:#21262d; border-left:4px solid #58a6ff; border-radius:4px;">
            <h4 style="margin:0; font-size:14px; color:#f0f6fc; text-transform:uppercase; letter-spacing:0.5px;">
              Практически задачи върху Microsoft Excel (Въпроси 27, 28, 29)
            </h4>
          </div>

          <!-- Q27 -->
          <div class="test-practical-item" data-pindex="27" style="background:#0d1117; border:1px solid #30363d; border-radius:8px; padding:16px; margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
              <h4 style="margin:0; font-size:14.5px; color:#f0f6fc;">
                <span style="color:#58a6ff; font-family:monospace; margin-right:6px;">27.</span>
                В клетки B2:B11 има стойности. Напишете формула в Excel, която преброява колко стойности са равни на 25:
              </h4>
              <span style="font-size:11px; padding:2px 8px; border-radius:10px; background:#21262d; color:#8b949e; font-weight:700;">2 точки</span>
            </div>
            <input type="text" class="q27-input" placeholder="Въведете формула (напр. =COUNTIF(...))" style="width:100%; box-sizing:border-box; background:#161b22; border:1px solid #30363d; color:#58a6ff; font-family:monospace; padding:10px 12px; border-radius:6px; font-size:13.5px; margin-bottom:8px;">
            <div class="q27-feedback" style="display:none; padding:8px 12px; border-radius:6px; font-size:12.5px;"></div>
          </div>

          <!-- Q28 -->
          <div class="test-practical-item" data-pindex="28" style="background:#0d1117; border:1px solid #30363d; border-radius:8px; padding:16px; margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
              <h4 style="margin:0; font-size:14.5px; color:#f0f6fc;">
                <span style="color:#58a6ff; font-family:monospace; margin-right:6px;">28.</span>
                Таблица съдържа колони „Клас“, „Име“ и „Среден успех“. Опишете как ще сортирате първо по клас във възходящ ред, а в рамките на всеки клас – по среден успех в низходящ ред:
              </h4>
              <span style="font-size:11px; padding:2px 8px; border-radius:10px; background:#21262d; color:#8b949e; font-weight:700;">2 точки</span>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:8px;" class="sandbox-grid-responsive">
              <div style="background:#161b22; padding:10px; border-radius:6px; border:1px solid #30363d;">
                <label style="font-size:12px; color:#8b949e; display:block; margin-bottom:4px;">Първо ниво (Sort by):</label>
                <select class="q28-level1" style="width:100%; background:#0d1117; border:1px solid #30363d; color:#c9d1d9; padding:6px; border-radius:4px; font-size:12.5px;">
                  <option value="">-- Изберете първо поле --</option>
                  <option value="class-asc">Колона „Клас“ – Възходящ ред (A to Z)</option>
                  <option value="name-asc">Колона „Име“ – Възходящ ред</option>
                  <option value="score-desc">Колона „Среден успех“ – Низходящ ред</option>
                </select>
              </div>
              <div style="background:#161b22; padding:10px; border-radius:6px; border:1px solid #30363d;">
                <label style="font-size:12px; color:#8b949e; display:block; margin-bottom:4px;">Действие + Второ ниво (Then by):</label>
                <select class="q28-level2" style="width:100%; background:#0d1117; border:1px solid #30363d; color:#c9d1d9; padding:6px; border-radius:4px; font-size:12.5px;">
                  <option value="">-- Изберете действие и второ поле --</option>
                  <option value="addlevel-score-desc">Натискане на "Add Level" → „Среден успех“ в низходящ ред (Z to A / Largest to Smallest)</option>
                  <option value="direct-name">Директно избиране на „Име“</option>
                  <option value="filter">Прилагане на AutoFilter</option>
                </select>
              </div>
            </div>
            <div class="q28-feedback" style="display:none; padding:8px 12px; border-radius:6px; font-size:12.5px;"></div>
          </div>

          <!-- Q29 -->
          <div class="test-practical-item" data-pindex="29" style="background:#0d1117; border:1px solid #30363d; border-radius:8px; padding:16px; margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
              <h4 style="margin:0; font-size:14.5px; color:#f0f6fc;">
                <span style="color:#58a6ff; font-family:monospace; margin-right:6px;">29.</span>
                Трябва да се позволяват само цели числа от 2 до 6. Посочете подходящите настройки в Data Validation:
              </h4>
              <span style="font-size:11px; padding:2px 8px; border-radius:10px; background:#21262d; color:#8b949e; font-weight:700;">2 точки</span>
            </div>
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; margin-bottom:8px;" class="sandbox-grid-responsive">
              <div>
                <label style="font-size:11.5px; color:#8b949e; display:block; margin-bottom:2px;">Allow:</label>
                <select class="q29-allow" style="width:100%; background:#161b22; border:1px solid #30363d; color:#c9d1d9; padding:6px; border-radius:4px; font-size:12px;">
                  <option value="">-- Allow --</option>
                  <option value="whole">Whole number</option>
                  <option value="decimal">Decimal</option>
                  <option value="list">List</option>
                  <option value="text">Text length</option>
                </select>
              </div>
              <div>
                <label style="font-size:11.5px; color:#8b949e; display:block; margin-bottom:2px;">Data:</label>
                <select class="q29-data" style="width:100%; background:#161b22; border:1px solid #30363d; color:#c9d1d9; padding:6px; border-radius:4px; font-size:12px;">
                  <option value="">-- Data --</option>
                  <option value="between">between</option>
                  <option value="equal">equal to</option>
                  <option value="greater">greater than</option>
                </select>
              </div>
              <div>
                <label style="font-size:11.5px; color:#8b949e; display:block; margin-bottom:2px;">Minimum:</label>
                <input type="text" class="q29-min" placeholder="напр. 2" style="width:100%; box-sizing:border-box; background:#161b22; border:1px solid #30363d; color:#58a6ff; padding:6px; border-radius:4px; font-size:12px;">
              </div>
              <div>
                <label style="font-size:11.5px; color:#8b949e; display:block; margin-bottom:2px;">Maximum:</label>
                <input type="text" class="q29-max" placeholder="напр. 6" style="width:100%; box-sizing:border-box; background:#161b22; border:1px solid #30363d; color:#58a6ff; padding:6px; border-radius:4px; font-size:12px;">
              </div>
            </div>
            <div class="q29-feedback" style="display:none; padding:8px 12px; border-radius:6px; font-size:12.5px;"></div>
          </div>

          <!-- ACTIONS -->
          <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; margin-top:24px;">
            <button type="button" class="btn-check-test" style="background:#238636; border:1px solid #2ea043; color:#ffffff; padding:10px 24px; border-radius:6px; font-size:14px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:8px;">
              <i class="fa-solid fa-check-double"></i> Провери теста и изчисли оценка
            </button>
            <button type="button" class="btn-reset-test" style="display:none; background:#21262d; border:1px solid #30363d; color:#c9d1d9; padding:10px 18px; border-radius:6px; font-size:14px; cursor:pointer;">
              <i class="fa-solid fa-rotate-left"></i> Нов опит
            </button>
          </div>

          <!-- GLOBAL RESULT BANNER -->
          <div class="quiz-final-banner" style="display:none; margin-top:20px; padding:18px 20px; border-radius:8px; border:1px solid #30363d;">
            <div class="final-score-title" style="font-size:1.25rem; font-weight:800; margin-bottom:8px;"></div>
            <div class="final-score-desc" style="font-size:14px; line-height:1.6; color:#c9d1d9;"></div>
          </div>

        </form>

      </div>
    </section>
  `;
}

export function init(comp) {
  const compId = comp.id || 'entry-level-quiz';
  const root = document.getElementById(compId);
  if (!root) return;

  const form = root.querySelector('.entry-quiz-form');
  const checkBtn = root.querySelector('.btn-check-test');
  const resetBtn = root.querySelector('.btn-reset-test');
  const finalBanner = root.querySelector('.quiz-final-banner');
  const finalTitle = root.querySelector('.final-score-title');
  const finalDesc = root.querySelector('.final-score-desc');
  const scoreBadge = root.querySelector('.quiz-score-badge');

  if (!checkBtn) return;

  checkBtn.addEventListener('click', () => {
    let totalScore = 0;

    // Check questions 1..26
    quizData.forEach((item, idx) => {
      const qBox = root.querySelector(`[data-qindex="${idx}"]`);
      if (!qBox) return;

      const feedbackBox = qBox.querySelector('.q-feedback-box');
      const isMulti = Array.isArray(item.correct);

      if (!isMulti) {
        const checked = qBox.querySelector(`input[name="${compId}-q${idx}"]:checked`);
        const userVal = checked ? parseInt(checked.value, 10) : null;
        const isCorrect = userVal === item.correct;

        if (isCorrect) {
          totalScore += item.pts;
          feedbackBox.style.display = 'block';
          feedbackBox.style.background = 'rgba(46, 160, 67, 0.15)';
          feedbackBox.style.borderLeft = '3px solid #3fb950';
          feedbackBox.style.color = '#3fb950';
          feedbackBox.innerHTML = `✓ Верен отговор (+1 т.). ${esc(item.exp)}`;
        } else {
          feedbackBox.style.display = 'block';
          feedbackBox.style.background = 'rgba(248, 81, 73, 0.15)';
          feedbackBox.style.borderLeft = '3px solid #f85149';
          feedbackBox.style.color = '#ff7b72';
          const correctLetter = ['А', 'Б', 'В', 'Г'][item.correct];
          feedbackBox.innerHTML = `✗ Грешен отговор (0 т.). Верният е <strong>${correctLetter}) ${esc(item.options[item.correct])}</strong>. ${esc(item.exp)}`;
        }
      } else {
        // Multi-select for Q26
        const checkedBoxes = Array.from(qBox.querySelectorAll(`input[name="${compId}-q${idx}"]:checked`)).map(cb => parseInt(cb.value, 10));
        const correctSet = item.correct; // [1, 2]
        
        let qScore = 0;
        // 1 pt per correct chosen, 0 if wrong selected
        const selectedCorrect = checkedBoxes.filter(v => correctSet.includes(v)).length;
        const selectedWrong = checkedBoxes.filter(v => !correctSet.includes(v)).length;

        if (selectedWrong === 0) {
          qScore = selectedCorrect; // 0, 1, or 2
        } else {
          qScore = 0;
        }

        totalScore += qScore;
        feedbackBox.style.display = 'block';
        if (qScore === 2) {
          feedbackBox.style.background = 'rgba(46, 160, 67, 0.15)';
          feedbackBox.style.borderLeft = '3px solid #3fb950';
          feedbackBox.style.color = '#3fb950';
          feedbackBox.innerHTML = `✓ Отличен отговор (+2 т.). Верните твърдения са Б) и В). ${esc(item.exp)}`;
        } else {
          feedbackBox.style.background = 'rgba(248, 81, 73, 0.15)';
          feedbackBox.style.borderLeft = '3px solid #f85149';
          feedbackBox.style.color = '#ff7b72';
          feedbackBox.innerHTML = `Получени точки: ${qScore}/2 т. Верните отговори са <strong>Б)</strong> и <strong>В)</strong>. ${esc(item.exp)}`;
        }
      }
    });

    // Check Q27 (Formula)
    const q27Input = root.querySelector('.q27-input');
    const q27Fb = root.querySelector('.q27-feedback');
    if (q27Input && q27Fb) {
      const val = (q27Input.value || '').replace(/\s+/g, '').toUpperCase();
      // Accepts =COUNTIF(B2:B11;25), =COUNTIF(B2:B11;"25"), =COUNTIF(B2:B11;"=25")
      const isQ27Correct = val.includes('COUNTIF(B2:B11;25') || val.includes('COUNTIF(B2:B11;"=25"') || val.includes('COUNTIF(B2:B11;"25"');
      q27Fb.style.display = 'block';
      if (isQ27Correct) {
        totalScore += 2;
        q27Fb.style.background = 'rgba(46, 160, 67, 0.15)';
        q27Fb.style.borderLeft = '3px solid #3fb950';
        q27Fb.style.color = '#3fb950';
        q27Fb.innerHTML = `✓ Вярно (+2 т.)! Формулата <code>=COUNTIF(B2:B11; 25)</code> правилно преброява срещанията на 25.`;
      } else {
        q27Fb.style.background = 'rgba(248, 81, 73, 0.15)';
        q27Fb.style.borderLeft = '3px solid #f85149';
        q27Fb.style.color = '#ff7b72';
        q27Fb.innerHTML = `✗ Грешен отговор (0 т.). Верният запис е <code>=COUNTIF(B2:B11; 25)</code> или <code>=COUNTIF(B2:B11; "=25")</code>.`;
      }
    }

    // Check Q28 (Custom Sort)
    const q28L1 = root.querySelector('.q28-level1');
    const q28L2 = root.querySelector('.q28-level2');
    const q28Fb = root.querySelector('.q28-feedback');
    if (q28L1 && q28L2 && q28Fb) {
      const isQ28Correct = q28L1.value === 'class-asc' && q28L2.value === 'addlevel-score-desc';
      q28Fb.style.display = 'block';
      if (isQ28Correct) {
        totalScore += 2;
        q28Fb.style.background = 'rgba(46, 160, 67, 0.15)';
        q28Fb.style.borderLeft = '3px solid #3fb950';
        q28Fb.style.color = '#3fb950';
        q28Fb.innerHTML = `✓ Вярно (+2 т.)! В диалоговия прозорец Data → Sort избирате първо „Клас“ (възходящо), след това бутон „Add Level“ и „Среден успех“ (низходящо).`;
      } else {
        q28Fb.style.background = 'rgba(248, 81, 73, 0.15)';
        q28Fb.style.borderLeft = '3px solid #f85149';
        q28Fb.style.color = '#ff7b72';
        q28Fb.innerHTML = `✗ Непълен отговор (0 т.). Вярната последователност е: първи критерий „Клас“ (възходящо) → бутон <strong>Add Level</strong> → втори критерий „Среден успех“ (низходящо).`;
      }
    }

    // Check Q29 (Data Validation)
    const q29Allow = root.querySelector('.q29-allow');
    const q29Data = root.querySelector('.q29-data');
    const q29Min = root.querySelector('.q29-min');
    const q29Max = root.querySelector('.q29-max');
    const q29Fb = root.querySelector('.q29-feedback');

    if (q29Allow && q29Data && q29Min && q29Max && q29Fb) {
      const isAllow = q29Allow.value === 'whole';
      const isData = q29Data.value === 'between';
      const isMin = (q29Min.value || '').trim() === '2';
      const isMax = (q29Max.value || '').trim() === '6';
      const isQ29Correct = isAllow && isData && isMin && isMax;

      q29Fb.style.display = 'block';
      if (isQ29Correct) {
        totalScore += 2;
        q29Fb.style.background = 'rgba(46, 160, 67, 0.15)';
        q29Fb.style.borderLeft = '3px solid #3fb950';
        q29Fb.style.color = '#3fb950';
        q29Fb.innerHTML = `✓ Вярно (+2 т.)! Allow: Whole number; Data: between; Minimum: 2; Maximum: 6.`;
      } else {
        q29Fb.style.background = 'rgba(248, 81, 73, 0.15)';
        q29Fb.style.borderLeft = '3px solid #f85149';
        q29Fb.style.color = '#ff7b72';
        q29Fb.innerHTML = `✗ Грешен отговор (0 т.). Верните параметри са: Allow: <strong>Whole number</strong>, Data: <strong>between</strong>, Minimum: <strong>2</strong>, Maximum: <strong>6</strong>.`;
      }
    }

    // Update Banner & Score Badge
    if (scoreBadge) {
      scoreBadge.textContent = `Резултат: ${totalScore} / 30 т.`;
      scoreBadge.style.color = totalScore >= 21 ? '#3fb950' : (totalScore >= 15 ? '#d29922' : '#f85149');
    }

    if (finalBanner && finalTitle && finalDesc) {
      finalBanner.style.display = 'block';
      if (totalScore >= 26) {
        finalBanner.style.background = 'rgba(46, 160, 67, 0.15)';
        finalBanner.style.borderColor = '#3fb950';
        finalTitle.style.color = '#3fb950';
        finalTitle.innerHTML = `🌟 Резултат: ${totalScore} от 30 точки (Много добра подготовка)`;
        finalDesc.innerHTML = `Поздравления! Демонстрирате отлични познания по мрежи, сигурност, облачни услуги и анализ на данни в Excel. Готови сте за новите теми в 10. клас!`;
      } else if (totalScore >= 21) {
        finalBanner.style.background = 'rgba(56, 139, 253, 0.15)';
        finalBanner.style.borderColor = '#58a6ff';
        finalTitle.style.color = '#58a6ff';
        finalTitle.innerHTML = `👍 Резултат: ${totalScore} от 30 точки (Добра подготовка)`;
        finalDesc.innerHTML = `Много добър резултат! Прегледайте отговорите с червен маркер, за да изчистите допуснатите неточности.`;
      } else if (totalScore >= 15) {
        finalBanner.style.background = 'rgba(210, 153, 34, 0.15)';
        finalBanner.style.borderColor = '#d29922';
        finalTitle.style.color = '#d29922';
        finalTitle.innerHTML = `⚡ Резултат: ${totalScore} от 30 точки (Задоволителна подготовка)`;
        finalDesc.innerHTML = `Препоръка: Повторете разделите, в които сте допуснали грешки – обърнете внимание на мрежовите топологии и формулите в Excel.`;
      } else {
        finalBanner.style.background = 'rgba(248, 81, 73, 0.15)';
        finalBanner.style.borderColor = '#f85149';
        finalTitle.style.color = '#ff7b72';
        finalTitle.innerHTML = `⚠️ Резултат: ${totalScore} от 30 точки (Нужда от преговор)`;
        finalDesc.innerHTML = `Препоръка: Прочетете отново цялото преговорно съдържание, разгледайте симулатора в лабораторията и направете теста повторно.`;
      }
    }

    if (resetBtn) resetBtn.style.display = 'inline-flex';
    finalBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      root.querySelectorAll('.q-feedback-box, .q27-feedback, .q28-feedback, .q29-feedback').forEach(el => {
        el.style.display = 'none';
        el.innerHTML = '';
      });
      if (finalBanner) finalBanner.style.display = 'none';
      if (scoreBadge) {
        scoreBadge.textContent = 'Резултат: -- / 30 т.';
        scoreBadge.style.color = '#58a6ff';
      }
      resetBtn.style.display = 'none';
    });
  }
}
