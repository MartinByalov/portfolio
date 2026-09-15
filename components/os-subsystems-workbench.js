// OS Subsystems Workbench Component
// Deep interactive exploration of the 4 core subsystems of an Operating System

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

export function render(comp) {
  const id = comp.id || 'os-subsystems-workbench';
  const title = comp.title || 'Четирите стълба на операционната система';
  const subtitle = comp.subtitle || 'Изследвайте как всяка подсистема превръща суровия хардуер в организирана, бърза и сигурна работна среда';

  return `
    <div id="${esc(id)}" class="os-subsystems-workbench">
      <div class="os-wb-header">
        <span class="os-wb-badge"><i class="fas fa-cubes"></i> Системни подсистеми</span>
        <h3>${esc(title)}</h3>
        <p>${esc(subtitle)}</p>
      </div>

      <nav class="os-wb-nav" aria-label="Подсистеми на операционната система">
        <button type="button" class="os-wb-tab active" data-tab="cpu">
          <i class="fas fa-microchip"></i>
          <span><strong>1. Процеси &amp; Мултитаскинг</strong><small>Разпределяне на процесорното време</small></span>
        </button>
        <button type="button" class="os-wb-tab" data-tab="memory">
          <i class="fas fa-memory"></i>
          <span><strong>2. Управление на паметта</strong><small>RAM и виртуална памет (Swap)</small></span>
        </button>
        <button type="button" class="os-wb-tab" data-tab="fs">
          <i class="fas fa-folder-tree"></i>
          <span><strong>3. Файлова система</strong><small>Йерархия, пътища и метаданни</small></span>
        </button>
        <button type="button" class="os-wb-tab" data-tab="io">
          <i class="fas fa-plug"></i>
          <span><strong>4. Драйвери &amp; Периферия</strong><small>Хардуерна абстракция (HAL)</small></span>
        </button>
      </nav>

      <!-- Panel 1: CPU & Multitasking -->
      <div class="os-wb-panel active" data-panel="cpu">
        <div class="os-panel-intro">
          <h4><i class="fas fa-clock"></i> Как работи многозадачността (Мултитаскинг)?</h4>
          <p>
            Дори процесорът да има само едно ядро, операционната система създава перфектната илюзия, че десетки програми работят абсолютно едновременно.
            Тя разделя времето на миниатюрни отрязъци (<strong>кванти от време</strong>, обикновено 10–20 милисекунди) и светкавично превключва процесора между тях (<strong>Time-slicing</strong>).
          </p>
        </div>

        <div class="os-cpu-sim-box">
          <div class="os-cpu-core-status">
            <div class="os-cpu-badge"><i class="fas fa-bolt"></i> Процесорно ядро (CPU Core 1)</div>
            <div class="os-cpu-current-task">Текущо изпълнение: <strong class="os-cpu-active-label">Браузър</strong></div>
            <button type="button" class="btn-activity os-cpu-toggle-btn"><i class="fas fa-pause"></i> Пауза</button>
          </div>

          <!-- Time-slice Gantt Chart visualization -->
          <div class="os-cpu-timeline-track">
            <div class="os-cpu-slot slot-browser active">Браузър (15ms)</div>
            <div class="os-cpu-slot slot-music">Музика (10ms)</div>
            <div class="os-cpu-slot slot-writer">Текстов редактор (10ms)</div>
            <div class="os-cpu-slot slot-antivirus">Антивирус (5ms)</div>
          </div>

          <!-- Process Lifecycle States -->
          <div class="os-process-states-card">
            <div class="os-states-title"><i class="fas fa-diagram-project"></i> Жизнен цикъл на един процес в ОС:</div>
            <div class="os-states-flow">
              <div class="os-state-node" data-state="new"><span>1. Нов</span><small>Създава се в паметта</small></div>
              <i class="fas fa-arrow-right"></i>
              <div class="os-state-node active" data-state="ready"><span>2. Готов</span><small>Чака ред за процесора</small></div>
              <i class="fas fa-arrow-right"></i>
              <div class="os-state-node active-running" data-state="running"><span>3. Изпълнява се</span><small>CPU изпълнява код</small></div>
              <i class="fas fa-arrow-right"></i>
              <div class="os-state-node" data-state="waiting"><span>4. Изчакващ</span><small>Чака вход от потребител/диск</small></div>
              <i class="fas fa-arrow-right"></i>
              <div class="os-state-node" data-state="terminated"><span>5. Завършен</span><small>Освобождава RAM</small></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel 2: Memory & Virtual Memory -->
      <div class="os-wb-panel" data-panel="memory">
        <div class="os-panel-intro">
          <h4><i class="fas fa-shield-halved"></i> Защита на паметта и виртуална памет (Paging / Swap)</h4>
          <p>
            Операционната система пази стриктно всяка програма в нейно собствено затворено пространство. Програма A не може да чете или променя паметта на Програма B.
            А когато физическата оперативна памет (RAM) се запълни, ОС прехвърля временно неактивните данни на SSD диска във <strong>файл за виртуална памет (Pagefile/Swap)</strong>.
          </p>
        </div>

        <div class="os-mem-sim-box">
          <div class="os-mem-controls">
            <div class="os-mem-stat">
              <span>Физическа RAM: <strong>8.0 GB</strong></span>
              <span>Заета: <strong class="os-mem-used-label">3.8 GB</strong> (<span class="os-mem-pct-label">47%</span>)</span>
            </div>
            <div class="os-mem-actions">
              <button type="button" class="btn-activity os-mem-add-app" data-app="chrome"><i class="fas fa-plus"></i> Отвори още раздели в браузъра (+1.5 GB)</button>
              <button type="button" class="btn-activity os-mem-add-app" data-app="video"><i class="fas fa-video"></i> Стартирай 4K видеообработка (+4.5 GB)</button>
              <button type="button" class="btn-activity os-mem-reset-btn"><i class="fas fa-rotate-left"></i> Изчисти</button>
            </div>
          </div>

          <!-- Physical RAM bar -->
          <div class="os-mem-bar-wrap">
            <div class="os-mem-bar-header">
              <span>Оперативна памет (RAM) — Бърза, енергозависима</span>
              <span class="os-mem-bar-legend"><span class="legend-box ram-active"></span> Активни програми</span>
            </div>
            <div class="os-mem-bar-track">
              <div class="os-mem-bar-fill" style="width: 47%;"></div>
            </div>
          </div>

          <!-- Virtual Memory / Swap on SSD bar -->
          <div class="os-swap-bar-wrap">
            <div class="os-mem-bar-header">
              <span>Виртуална памет на SSD (Pagefile.sys / Swap) — Резервна памет при недостиг</span>
              <span class="os-swap-status">Статус: <strong class="os-swap-label">Неактивна (Има достатъчно свободна RAM)</strong></span>
            </div>
            <div class="os-swap-bar-track">
              <div class="os-swap-bar-fill" style="width: 0%;"></div>
            </div>
          </div>

          <div class="os-mem-insight-card" aria-live="polite">
            <i class="fas fa-info-circle"></i>
            <span class="os-mem-insight-text">Системата работи нормално. Всички активни програми се побират изцяло в бързата физическа памет (RAM).</span>
          </div>
        </div>
      </div>

      <!-- Panel 3: File System & Hierarchy -->
      <div class="os-wb-panel" data-panel="fs">
        <div class="os-panel-intro">
          <h4><i class="fas fa-sitemap"></i> Файловата система: Дървовидна структура и метаданни</h4>
          <p>
            Файловата система (напр. <strong>NTFS</strong> при Windows, <strong>ext4</strong> при Linux, <strong>APFS</strong> при Apple) превръща суровите милиарди сектори на диска в логично подредено дърво от папки и файлове с точни адреси (пътища).
          </p>
        </div>

        <div class="os-fs-sim-layout">
          <!-- Tree view -->
          <div class="os-fs-tree">
            <div class="os-tree-node root active" data-file="root">
              <i class="fas fa-hard-drive"></i> <span>Диск C: (Коренна папка)</span>
            </div>
            <div class="os-tree-branch">
              <div class="os-tree-node folder" data-file="windows">
                <i class="fas fa-folder"></i> <span>Windows (Системни файлове)</span>
              </div>
              <div class="os-tree-branch">
                <div class="os-tree-node file" data-file="notepad">
                  <i class="fas fa-gear"></i> <span>notepad.exe</span>
                </div>
              </div>
              <div class="os-tree-node folder" data-file="users">
                <i class="fas fa-folder-open"></i> <span>Users (Потребители)</span>
              </div>
              <div class="os-tree-branch">
                <div class="os-tree-node folder" data-file="student">
                  <i class="fas fa-folder-open"></i> <span>Student (Моят профил)</span>
                </div>
                <div class="os-tree-branch">
                  <div class="os-tree-node file active-file" data-file="doc">
                    <i class="fas fa-file-word"></i> <span>referat_it.docx</span>
                  </div>
                  <div class="os-tree-node file" data-file="photo">
                    <i class="fas fa-file-image"></i> <span>grafika.png</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- File Inspector / Metadata -->
          <div class="os-fs-inspector">
            <div class="os-inspector-head">
              <i class="fas fa-file-lines"></i>
              <div>
                <strong class="os-inspect-filename">referat_it.docx</strong>
                <small class="os-inspect-type">Документ на Microsoft Word (.docx)</small>
              </div>
            </div>

            <div class="os-inspect-details">
              <div class="os-inspect-row">
                <span>Пълен абсолютен път:</span>
                <code class="os-inspect-path">C:\Users\Student\referat_it.docx</code>
              </div>
              <div class="os-inspect-row">
                <span>Еквивалентен път в Linux:</span>
                <code class="os-inspect-linux">/home/student/referat_it.docx</code>
              </div>
              <div class="os-inspect-row">
                <span>Размер на диска:</span>
                <strong class="os-inspect-size">248 KB (заема 64 сектора)</strong>
              </div>
              <div class="os-inspect-row">
                <span>Права за достъп:</span>
                <span class="os-inspect-perms"><i class="fas fa-lock-open"></i> Четене и Запис (Read / Write)</span>
              </div>
              <div class="os-inspect-row">
                <span>Последна промяна:</span>
                <span class="os-inspect-date">Днес, 14:32 ч.</span>
              </div>
            </div>

            <div class="os-inspect-tip">
              <i class="fas fa-lightbulb"></i>
              <span><strong>Защо разширението (.ext) има значение?</strong> То казва на ОС кое приложно приложение да отвори файла по подразбиране при двоен клик.</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel 4: Drivers & I/O Abstraction -->
      <div class="os-wb-panel" data-panel="io">
        <div class="os-panel-intro">
          <h4><i class="fas fa-microchip"></i> Хардуерна абстракция: Как програмите говорят с периферията?</h4>
          <p>
            Приложният софтуер не знае дали вашият монитор е 4K OLED или стар LCD, нито дали принтерът ви е Canon или HP.
            Приложението изпраща универсална команда <code>Print(Document)</code> към операционната система, а <strong>драйверът</strong> я превежда в специфичните електрически сигнали на устройството.
          </p>
        </div>

        <div class="os-driver-demo-box">
          <div class="os-driver-flow">
            <div class="os-flow-box app-box">
              <i class="fas fa-file-lines"></i>
              <strong>Текстов редактор</strong>
              <small>Извиква Print()</small>
            </div>
            <i class="fas fa-arrow-right flow-arrow"></i>
            <div class="os-flow-box os-box">
              <i class="fas fa-cogs"></i>
              <strong>Ядро на ОС (HAL)</strong>
              <small>Универсален системен API</small>
            </div>
            <i class="fas fa-arrow-right flow-arrow"></i>
            <div class="os-flow-box driver-box">
              <i class="fas fa-puzzle-piece"></i>
              <strong>Драйвер на HP LaserJet</strong>
              <small>Специализиран преводач</small>
            </div>
            <i class="fas fa-arrow-right flow-arrow"></i>
            <div class="os-flow-box hw-box">
              <i class="fas fa-print"></i>
              <strong>Физически лазерен принтер</strong>
              <small>Лазерно нанасяне на тонер</small>
            </div>
          </div>

          <div class="os-pnp-simulator">
            <span class="os-pnp-title"><i class="fas fa-bolt"></i> Симулация: Включване на ново устройство (Plug and Play)</span>
            <div class="os-pnp-buttons">
              <button type="button" class="btn-activity os-pnp-btn" data-device="gamepad"><i class="fas fa-gamepad"></i> Включи геймпад контролер (USB)</button>
              <button type="button" class="btn-activity os-pnp-btn" data-device="camera"><i class="fas fa-video"></i> Включи уеб камера (USB 3.0)</button>
              <button type="button" class="btn-activity os-pnp-btn" data-device="flash"><i class="fas fa-usb"></i> Включи USB флаш памет</button>
            </div>
            <div class="os-pnp-log" aria-live="polite">
              <div class="os-log-item"><span class="os-log-time">[Система]</span> Изберете устройство по-горе, за да проследите Plug &amp; Play разпознаването.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id);
  if (!root) return;

  // Tab switching
  const tabs = root.querySelectorAll('.os-wb-tab');
  const panels = root.querySelectorAll('.os-wb-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const activePanel = root.querySelector(`.os-wb-panel[data-panel="${targetTab}"]`);
      if (activePanel) activePanel.classList.add('active');
    });
  });

  // Panel 1: CPU Multitasking Simulation
  const cpuSlots = root.querySelectorAll('.os-cpu-slot');
  const activeLabel = root.querySelector('.os-cpu-active-label');
  const toggleBtn = root.querySelector('.os-cpu-toggle-btn');
  let cpuRunning = true;
  let currentSlot = 0;

  const slotLabels = ['Браузър (Chrome)', 'Музика (Spotify)', 'Текстов редактор (Writer)', 'Антивирусна защита'];

  const cpuInterval = setInterval(() => {
    if (!cpuRunning) return;
    cpuSlots.forEach(s => s.classList.remove('active'));
    currentSlot = (currentSlot + 1) % cpuSlots.length;
    cpuSlots[currentSlot].classList.add('active');
    if (activeLabel) activeLabel.textContent = slotLabels[currentSlot];
  }, 1200);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      cpuRunning = !cpuRunning;
      toggleBtn.innerHTML = cpuRunning ? '<i class="fas fa-pause"></i> Пауза' : '<i class="fas fa-play"></i> Продължи';
    });
  }

  // Panel 2: Memory & Virtual Memory
  let currentRamUsed = 3.8;
  const maxRam = 8.0;

  const usedLabel = root.querySelector('.os-mem-used-label');
  const pctLabel = root.querySelector('.os-mem-pct-label');
  const ramBarFill = root.querySelector('.os-mem-bar-fill');
  const swapBarFill = root.querySelector('.os-swap-bar-fill');
  const swapLabel = root.querySelector('.os-swap-label');
  const memInsight = root.querySelector('.os-mem-insight-text');

  function updateMemoryDisplay() {
    const ramPct = Math.min(100, Math.round((currentRamUsed / maxRam) * 100));
    if (usedLabel) usedLabel.textContent = `${currentRamUsed.toFixed(1)} GB`;
    if (pctLabel) pctLabel.textContent = `${ramPct}%`;
    if (ramBarFill) {
      ramBarFill.style.width = `${ramPct}%`;
      ramBarFill.style.background = ramPct > 85 ? '#ef4444' : (ramPct > 65 ? '#f59e0b' : '#3b82f6');
    }

    if (currentRamUsed > maxRam) {
      const swapNeeded = (currentRamUsed - maxRam).toFixed(1);
      const swapPct = Math.min(100, Math.round((swapNeeded / 4.0) * 100));
      if (swapBarFill) swapBarFill.style.width = `${swapPct}%`;
      if (swapLabel) {
        swapLabel.innerHTML = `<span style="color:#ef4444; font-weight:700;">АКТИВНА: ${swapNeeded} GB на SSD диска!</span>`;
      }
      if (memInsight) {
        memInsight.innerHTML = `<strong>Внимание — RAM е препълнена!</strong> Операционната система активира виртуалната памет на SSD диска. Тъй като SSD е по-бавен от RAM, забелязвате леко забавяне при превключване между тежките програми (Paging thrashing).`;
      }
    } else {
      if (swapBarFill) swapBarFill.style.width = '0%';
      if (swapLabel) swapLabel.textContent = 'Неактивна (Има достатъчно свободна RAM)';
      if (memInsight) {
        memInsight.textContent = 'Системата работи оптимално. Всички активни програми се побират изцяло в бързата физическа памет (RAM).';
      }
    }
  }

  const addAppBtns = root.querySelectorAll('.os-mem-add-app');
  addAppBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.app;
      if (type === 'chrome') {
        currentRamUsed += 1.5;
      } else if (type === 'video') {
        currentRamUsed += 4.5;
      }
      updateMemoryDisplay();
    });
  });

  const resetMemBtn = root.querySelector('.os-mem-reset-btn');
  if (resetMemBtn) {
    resetMemBtn.addEventListener('click', () => {
      currentRamUsed = 3.8;
      updateMemoryDisplay();
    });
  }

  // Panel 3: File System Tree
  const fileNodes = root.querySelectorAll('.os-tree-node');
  const inspectFilename = root.querySelector('.os-inspect-filename');
  const inspectType = root.querySelector('.os-inspect-type');
  const inspectPath = root.querySelector('.os-inspect-path');
  const inspectLinux = root.querySelector('.os-inspect-linux');
  const inspectSize = root.querySelector('.os-inspect-size');
  const inspectPerms = root.querySelector('.os-inspect-perms');
  const inspectDate = root.querySelector('.os-inspect-date');

  const fileData = {
    doc: {
      name: 'referat_it.docx',
      type: 'Документ на Microsoft Word (.docx)',
      path: 'C:\\Users\\Student\\referat_it.docx',
      linux: '/home/student/referat_it.docx',
      size: '248 KB (заема 64 сектора)',
      perms: 'Четене и Запис (Read / Write)',
      date: 'Днес, 14:32 ч.'
    },
    photo: {
      name: 'grafika.png',
      type: 'Растерно графично изображение PNG (.png)',
      path: 'C:\\Users\\Student\\grafika.png',
      linux: '/home/student/grafika.png',
      size: '1.4 MB (заема 358 сектора)',
      perms: 'Само за четене (Read Only)',
      date: 'Вчера, 18:15 ч.'
    },
    notepad: {
      name: 'notepad.exe',
      type: 'Системно изпълнимо приложение за Windows (.exe)',
      path: 'C:\\Windows\\notepad.exe',
      linux: '/usr/bin/nano (еквивалент)',
      size: '215 KB (защитено)',
      perms: 'Изпълнение и четене (Read / Execute, само за Администратор)',
      date: 'Актуализирано със системния ъпдейт'
    }
  };

  fileNodes.forEach(node => {
    node.addEventListener('click', () => {
      const fileKey = node.dataset.file;
      const data = fileData[fileKey];
      if (!data) return;

      fileNodes.forEach(n => n.classList.remove('active-file'));
      node.classList.add('active-file');

      if (inspectFilename) inspectFilename.textContent = data.name;
      if (inspectType) inspectType.textContent = data.type;
      if (inspectPath) inspectPath.textContent = data.path;
      if (inspectLinux) inspectLinux.textContent = data.linux;
      if (inspectSize) inspectSize.textContent = data.size;
      if (inspectPerms) inspectPerms.textContent = data.perms;
      if (inspectDate) inspectDate.textContent = data.date;
    });
  });

  // Panel 4: Plug and Play Simulator
  const pnpBtns = root.querySelectorAll('.os-pnp-btn');
  const pnpLog = root.querySelector('.os-pnp-log');

  const pnpScenarios = {
    gamepad: [
      'USB шината регистрира промяна в напрежението на Порт 2.',
      'ОС изпраща сигнал за идентификация: Устройството отговаря с Vendor ID: 0x045E (Xbox Controller).',
      'ОС търси съответстващ драйвер в системния каталог на ядрото: Намерен е „xinput_driver.sys“.',
      'Драйверът се зарежда в паметта и установява връзка. Контролерът вибрира за готовност: „Устройството е готово за работа!“'
    ],
    camera: [
      'USB 3.0 портът засича високоскоростно UVC (USB Video Class) устройство.',
      'ОС проверява системните права за поверителност: „Разрешен ли е достъпът на приложения до камерата? Да.“',
      'Зарежда се универсален системен драйвер за видеопоток.',
      'Уеб камерата стартира, зеленият индикатор светва: Браузърът и приложенията вече получават 1080p видео.'
    ],
    flash: [
      'USB флаш паметта е свързана. Дисковият мениджър на ОС прочита дяловата таблица (MBR/GPT).',
      'Файловата система е разпозната: FAT32 / exFAT, обем 32 GB.',
      'ОС автоматично присвоява буква на устройството: Диск (E:).',
      'Shell показва известие на работния плот: „Отвори папката за преглед на файлове“.'
    ]
  };

  pnpBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const dev = btn.dataset.device;
      const lines = pnpScenarios[dev];
      if (!lines || !pnpLog) return;

      pnpLog.innerHTML = `<div class="os-log-item header"><strong><i class="fas fa-circle-notch fa-spin"></i> Plug &amp; Play протокол в действие...</strong></div>`;

      lines.forEach((line, i) => {
        setTimeout(() => {
          const item = document.createElement('div');
          item.className = 'os-log-item';
          item.innerHTML = `<span class="os-log-step">Стъпка ${i + 1}:</span> ${line}`;
          pnpLog.appendChild(item);
        }, (i + 1) * 600);
      });
    });
  });
}
