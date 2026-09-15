// OS Architecture Stack Component
// Interactive 5-layer software/hardware stack with signal propagation and failure isolation

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

export function render(comp) {
  const id = comp.id || 'os-architecture-stack';
  const title = comp.title || 'Слоевете на компютърната система: Пътят на действието';
  const subtitle = comp.subtitle || 'Проследете как всяко потребителско действие преминава през софтуерните и хардуерни нива';

  const scenarios = comp.scenarios || [
    {
      id: 'save-file',
      title: 'Запазване',
      icon: 'fas fa-floppy-disk',
      desc: 'Потребителят натиска „Запази“ в текстов редактор (Word / Writer).',
      steps: [
        { layer: 'user', text: 'Потребителят кликва върху бутона „Запази“ в приложението.' },
        { layer: 'apps', text: 'Текстовият редактор форматира данните в текстов файл и извиква системна заявка (System API Call).' },
        { layer: 'shell', text: 'Потребителският интерфейс / Shell проверява името на файла и пътя в избраната папка.' },
        { layer: 'kernel', text: 'Ядрото на ОС (Kernel) разпределя дискови блокове, проверява правата за запис и планира операцията в опашката на диска.' },
        { layer: 'drivers', text: 'Драйверът за дисковия контролер превежда заявката в команди за запис (NVMe / SATA протокол).' },
        { layer: 'hardware', text: 'SSD устройството физически записва байтовете във флаш паметта. Файлът е надеждно съхранен.' }
      ]
    },
    {
      id: 'print-doc',
      title: 'Печат',
      icon: 'fas fa-print',
      desc: 'Потребителят изпраща доклад към мастиленоструен или лазерен принтер.',
      steps: [
        { layer: 'user', text: 'Потребителят избира „Печат“ (Ctrl + P) и задава 2 копия.' },
        { layer: 'apps', text: 'Приложението подготвя векторно графично представяне на страницата.' },
        { layer: 'shell', text: 'Графичният диалогов прозорец за печат предава настройките към системната услуга за печат.' },
        { layer: 'kernel', text: 'Ядрото управлява опашката за печат (Print Spooler) и буферира данните в оперативната памет.' },
        { layer: 'drivers', text: 'Специализираният драйвер на принтера превежда графичните страници на команден език за съответния принтер.' },
        { layer: 'hardware', text: 'USB/Wi-Fi интерфейсът предава данните; печатащият механизъм на принтера нанася тонера върху листа.' }
      ]
    },
    {
      id: 'play-game',
      title: 'Игра',
      icon: 'fas fa-gamepad',
      desc: 'Стартиране на видеоигра с 3D графика, звук и мрежова игра.',
      steps: [
        { layer: 'user', text: 'Потребителят кликва двукратно върху иконата на играта на работния плот.' },
        { layer: 'apps', text: 'Изпълнимият файл (game.exe) изисква зареждане на 3D модели, звуци и мрежова връзка.' },
        { layer: 'shell', text: 'Shell създава графичен прозорец на играта в цял екран.' },
        { layer: 'kernel', text: 'Ядрото заделя RAM, стартира процеси с висок приоритет и координира нишките за процесора.' },
        { layer: 'drivers', text: 'Драйверите за графичната карта (DirectX / Vulkan) и звуковата карта поемат директния контрол над ускорението.' },
        { layer: 'hardware', text: 'GPU изчислява милиони полигони в секунда, RAM зарежда нивата, а мрежовата карта изпраща пакети към сървъра.' }
      ]
    }
  ];

  const layers = [
    { id: 'user', name: 'Потребител (User)', role: 'Човекът, който работи, учи, твори или играе', icon: 'fas fa-user', color: '#6366f1' },
    { id: 'apps', name: 'Приложен софтуер (Applications)', role: 'Програми за конкретни задачи (Word, Chrome, Игри, Photoshop)', icon: 'fas fa-shapes', color: '#0ea5e9' },
    { id: 'shell', name: 'Потребителски интерфейс / Обвивка (Shell)', role: 'Графична среда (GUI) или команден ред (CLI) за взаимодействие', icon: 'fas fa-desktop', color: '#10b981' },
    { id: 'kernel', name: 'Ядро на ОС (Kernel)', role: 'Сърцето на ОС — разпределя CPU, памет, процеси и сигурност', icon: 'fas fa-microchip', color: '#f59e0b' },
    { id: 'drivers', name: 'Системни услуги и драйвери (Drivers)', role: 'Специален софтуер, превеждащ командите на ОС към конкретния хардуер', icon: 'fas fa-cogs', color: '#ec4899' },
    { id: 'hardware', name: 'Компютърен хардуер (Hardware)', role: 'Физическите компоненти (CPU, RAM, SSD, Видеокарта, Периферия)', icon: 'fas fa-server', color: '#64748b' }
  ];

  return `
    <div id="${esc(id)}" class="os-architecture-stack" data-active-scenario="0">
      <div class="os-stack-header">
        <h3>${esc(title)}</h3>
        <p>${esc(subtitle)}</p>
      </div>

      <div class="os-scenario-selector">
        <div class="os-scenario-top-bar">
          ${scenarios.map((sc, idx) => `
            <button type="button" class="os-scenario-btn ${idx === 0 ? 'active' : ''}" data-scenario-idx="${idx}">
              <i class="${esc(sc.icon)}"></i> ${esc(sc.title)}
            </button>
          `).join('')}
          <button type="button" class="btn-activity os-trace-play-btn">
            <i class="fas fa-play"></i> Стартирай
          </button>
        </div>
      </div>

      <div class="os-scenario-details">
        <div class="os-scenario-desc-box">
          <strong class="os-scenario-desc-title">Сценарий:</strong>
          <span class="os-scenario-desc-text">${esc(scenarios[0].desc)}</span>
        </div>
      </div>

      <div class="os-stack-layout">
        <!-- 6 слоя, подредени в 2 колони от по 3 -->
        <div class="os-layers-grid">
          ${layers.map((l) => `
            <div class="os-layer-card" data-layer-id="${esc(l.id)}" style="--layer-color: ${l.color};">
              <div class="os-layer-indicator">
                <i class="${esc(l.icon)}"></i>
              </div>
              <div class="os-layer-body">
                <div class="os-layer-name">${esc(l.name)}</div>
                <div class="os-layer-role">${esc(l.role)}</div>
                <div class="os-layer-step-msg" style="display:none;"></div>
              </div>
              <div class="os-layer-signal"></div>
            </div>
          `).join('')}
        </div>

        <!-- Layer Isolation Probe & Insights (отдолу под 6-те слоя) -->
        <div class="os-stack-insight-panel">
          <div class="os-insight-header">
            <h4>Изследване на изолацията</h4>
            <p>Какво би се случило, ако липсва даден софтуерен слой?</p>
          </div>

          <div class="os-isolation-buttons">
            <button type="button" class="os-isolation-btn" data-missing="drivers">
              <i class="fas fa-ban"></i> Без драйвери
            </button>
            <button type="button" class="os-isolation-btn" data-missing="kernel">
              <i class="fas fa-skull"></i> Без операционна система (ядро)
            </button>
            <button type="button" class="os-isolation-btn" data-missing="shell">
              <i class="fas fa-terminal"></i> Без графична обвивка (GUI)
            </button>
          </div>

          <div class="os-isolation-result-box" aria-live="polite"></div>
        </div>
      </div>
    </div>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id);
  if (!root) return;

  const scenarios = comp.scenarios || [
    {
      id: 'save-file',
      title: 'Запазване на документ',
      icon: 'fas fa-floppy-disk',
      desc: 'Потребителят натиска „Запази“ в текстов редактор (Word / Writer).',
      steps: [
        { layer: 'user', text: 'Потребителят кликва върху бутона „Запази“ в приложението.' },
        { layer: 'apps', text: 'Текстовият редактор форматира данните в текстов файл и извиква системна заявка (System API Call).' },
        { layer: 'shell', text: 'Потребителският интерфейс / Shell проверява името на файла и пътя в избраната папка.' },
        { layer: 'kernel', text: 'Ядрото на ОС (Kernel) разпределя дискови блокове, проверява правата за запис и планира операцията в опашката на диска.' },
        { layer: 'drivers', text: 'Драйверът за дисковия контролер превежда заявката в команди за запис (NVMe / SATA протокол).' },
        { layer: 'hardware', text: 'SSD устройството физически записва байтовете във флаш паметта. Файлът е надеждно съхранен.' }
      ]
    },
    {
      id: 'print-doc',
      title: 'Печат на документ',
      icon: 'fas fa-print',
      desc: 'Потребителят изпраща доклад към мастиленоструен или лазерен принтер.',
      steps: [
        { layer: 'user', text: 'Потребителят избира „Печат“ (Ctrl + P) и задава 2 копия.' },
        { layer: 'apps', text: 'Приложението подготвя векторно графично представяне на страницата.' },
        { layer: 'shell', text: 'Графичният диалогов прозорец за печат предава настройките към системната услуга за печат.' },
        { layer: 'kernel', text: 'Ядрото управлява опашката за печат (Print Spooler) и буферира данните в оперативната памет.' },
        { layer: 'drivers', text: 'Специализираният драйвер на принтера превежда графичните страници на команден език за съответния принтер.' },
        { layer: 'hardware', text: 'USB/Wi-Fi интерфейсът предава данните; печатащият механизъм на принтера нанася тонера върху листа.' }
      ]
    },
    {
      id: 'play-game',
      title: 'Стартиране на 3D игра',
      icon: 'fas fa-gamepad',
      desc: 'Стартиране на видеоигра с 3D графика, звук и мрежова игра.',
      steps: [
        { layer: 'user', text: 'Потребителят кликва двукратно върху иконата на играта на работния плот.' },
        { layer: 'apps', text: 'Изпълнимият файл (game.exe) изисква зареждане на 3D модели, звуци и мрежова връзка.' },
        { layer: 'shell', text: 'Shell създава графичен прозорец на играта в цял екран.' },
        { layer: 'kernel', text: 'Ядрото заделя RAM, стартира процеси с висок приоритет и координира нишките за процесора.' },
        { layer: 'drivers', text: 'Драйверите за графичната карта (DirectX / Vulkan) и звуковата карта поемат директния контрол над ускорението.' },
        { layer: 'hardware', text: 'GPU изчислява милиони полигони в секунда, RAM зарежда нивата, а мрежовата карта изпраща пакети към сървъра.' }
      ]
    }
  ];

  let currentScenarioIdx = 0;
  let traceTimer = null;

  const scenarioBtns = root.querySelectorAll('.os-scenario-btn');
  const descText = root.querySelector('.os-scenario-desc-text');
  const playBtn = root.querySelector('.os-trace-play-btn');
  const layerCards = root.querySelectorAll('.os-layer-card');
  const isolationBtns = root.querySelectorAll('.os-isolation-btn');
  const isolationResult = root.querySelector('.os-isolation-result-box');

  function updateScenario(idx) {
    currentScenarioIdx = idx;
    scenarioBtns.forEach((btn, i) => btn.classList.toggle('active', i === idx));
    if (descText) descText.textContent = scenarios[idx].desc;
    resetTrace();
  }

  function resetTrace() {
    if (traceTimer) clearInterval(traceTimer);
    layerCards.forEach(card => {
      card.classList.remove('active-step', 'passed-step');
      const msg = card.querySelector('.os-layer-step-msg');
      if (msg) {
        msg.style.display = 'none';
        msg.textContent = '';
      }
    });
    if (playBtn) {
      playBtn.innerHTML = '<i class="fas fa-play"></i> Стартирай';
      playBtn.disabled = false;
    }
  }

  function runTrace() {
    resetTrace();
    const sc = scenarios[currentScenarioIdx];
    let stepIndex = 0;

    if (playBtn) {
      playBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Стартиране...';
      playBtn.disabled = true;
    }

    traceTimer = setInterval(() => {
      if (stepIndex >= sc.steps.length) {
        clearInterval(traceTimer);
        if (playBtn) {
          playBtn.innerHTML = '<i class="fas fa-rotate-right"></i> Стартирай отново';
          playBtn.disabled = false;
        }
        return;
      }

      const step = sc.steps[stepIndex];
      layerCards.forEach(c => {
        if (c.dataset.layerId === step.layer) {
          c.classList.add('active-step');
          const msg = c.querySelector('.os-layer-step-msg');
          if (msg) {
            msg.textContent = step.text;
            msg.style.display = 'block';
          }
        } else {
          if (c.classList.contains('active-step')) {
            c.classList.remove('active-step');
            c.classList.add('passed-step');
          }
        }
      });

      stepIndex++;
    }, 1100);
  }

  scenarioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.scenarioIdx, 10);
      updateScenario(idx);
    });
  });

  if (playBtn) {
    playBtn.addEventListener('click', runTrace);
  }

  const isolationData = {
    drivers: {
      title: 'Ако липсват драйвери за устройствата:',
      icon: 'fas fa-triangle-exclamation',
      color: '#d97706',
      content: 'Операционната система разпознава физическото устройство като „Непознато устройство“ (Unknown Device), но не знае неговия специфичен микроезик. Принтерът няма да отпечата нито един ред, звуковата карта ще остане без звук, а мощната видеокарта ще работи само с бавен базов софтуерен режим.'
    },
    kernel: {
      title: 'Ако липсва операционната система (ядрото):',
      icon: 'fas fa-bomb',
      color: '#dc2626',
      content: 'Всяка приложна програма би трябвало сама да знае как директно да програмира секторите на SSD диска и чиповете на RAM. Две едновременно отворени програми биха се презаписали взаимно в паметта и дискът би бил напълно разрушен от конфликти. Хардуерът без ОС е като оркестър без партитура и без диригент — настъпва пълен хаос!'
    },
    shell: {
      title: 'Ако липсва графичната обвивка (GUI):',
      icon: 'fas fa-terminal',
      color: '#2563eb',
      content: 'Компютърът и ядрото работят отлично, но потребителят не вижда прозорци, мишка, кошче или икони. Цялото управление се извършва изключително чрез въвеждане на текстови команди в черен терминал (Command Prompt / Linux Bash). Точно така работят повечето съвременни интернет сървъри и суперкомпютри!'
    }
  };

  isolationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      isolationBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const missing = btn.dataset.missing;
      const data = isolationData[missing];
      if (data && isolationResult) {
        isolationResult.innerHTML = `
          <div class="os-isolation-card" style="border-left: 4px solid ${data.color};">
            <p style="margin: 0; color: #334155; line-height: 1.55; font-size: 0.95rem;">${data.content}</p>
          </div>
        `;
      }
    });
  });
}
