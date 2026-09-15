// OS Terminal Lab Component
// Interactive side-by-side comparison of CLI (Terminal) vs GUI (Desktop/File Explorer)

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

export function render(comp) {
  const id = comp.id || 'os-terminal-lab';
  const title = comp.title || 'Една задача, два интерфейса';

  return `
    <div id="${esc(id)}" class="os-terminal-lab">
      <div class="os-term-header">
        <h3>${esc(title)}</h3>
      </div>

      <div class="os-term-dual-layout">
        <!-- Left: Terminal CLI -->
        <div class="os-cli-window">
          <div class="os-window-titlebar dark">
            <div class="os-win-dots">
              <span class="win-dot red"></span>
              <span class="win-dot yellow"></span>
              <span class="win-dot green"></span>
            </div>
            <div class="os-win-title"><i class="fas fa-terminal"></i> Command Prompt</div>
          </div>
          <div class="os-cli-body">
            <div class="os-cli-history" aria-live="polite">
              <div class="cli-line intro">Microsoft Windows [Version 10.0.22631]</div>
              <div class="cli-line intro">(c) Корпорация Майкрософт. Всички права запазени.</div>
              <div class="cli-line intro">Въведете команда или използвайте бързите бутони отдолу.</div>
              <div class="cli-line"><br></div>
            </div>
            <div class="os-cli-prompt-line">
              <span class="cli-path">C:\\Users\\Student&gt;</span>
              <input type="text" class="os-cli-input" placeholder="напишете команда (напр. dir, mkdir Proekti, del referat.docx, rmdir Снимки, ipconfig)..." autocomplete="off" spellcheck="false" aria-label="Въвеждане на команден ред" />
              <button type="button" class="os-cli-send-btn" title="Изпълни команда (Enter)" aria-label="Изпълни команда (Enter)"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display: block;"><polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path></svg></button>
            </div>
            <div class="os-cli-helpers">
              <button type="button" class="cli-quick-btn" data-cmd="dir" data-tooltip="Списък на файлове и папки"><code>dir</code></button>
              <button type="button" class="cli-quick-btn" data-cmd="mkdir Proekti" data-tooltip="Създаване на нова папка Proekti"><code>mkdir Proekti</code></button>
              <button type="button" class="cli-quick-btn" data-cmd="del referat.docx" data-tooltip="Изтриване на файл referat.docx"><code>del referat.docx</code></button>
              <button type="button" class="cli-quick-btn" data-cmd="rmdir Документи" data-tooltip="Изтриване на папка Документи"><code>rmdir Документи</code></button>
              <button type="button" class="cli-quick-btn" data-cmd="ipconfig" data-tooltip="Мрежова информация и IP адрес"><code>ipconfig</code></button>
              <button type="button" class="cli-quick-btn" data-cmd="cls" data-tooltip="Изчистване на екрана"><code>cls</code></button>
            </div>
          </div>
        </div>

        <!-- Right: Graphical UI (GUI) -->
        <div class="os-gui-window">
          <div class="os-window-titlebar light">
            <div class="os-win-dots">
              <span class="win-dot"></span>
              <span class="win-dot"></span>
              <span class="win-dot"></span>
            </div>
            <div class="os-win-title"><i class="fas fa-window-maximize"></i> Файлов браузър / Настройки (GUI)</div>
          </div>
          <div class="os-gui-body">
            <!-- Breadcrumbs / Ribbon -->
            <div class="os-gui-ribbon">
              <div class="os-gui-path-box"><i class="fas fa-folder-open"></i> Този компютър &gt; Диск (C:) &gt; Потребители &gt; Student</div>
              <div class="os-gui-toolbar">
                <button type="button" class="os-gui-tool-btn os-gui-new-folder" title="Създай нова папка в текущата директория"><i class="fas fa-folder-plus"></i> Нова папка</button>
                <button type="button" class="os-gui-tool-btn os-gui-net-btn" title="Преглед на мрежовото състояние"><i class="fas fa-network-wired"></i> Мрежа</button>
              </div>
            </div>

            <!-- View Modes in GUI: File Explorer vs Info View -->
            <div class="os-gui-views-container">
              <!-- Network Info Card Banner if ipconfig called -->
              <div class="os-gui-net-banner" style="display: none;">
                <div class="os-gui-net-header">
                  <span><i class="fas fa-wifi"></i> Мрежови свойства (Wi-Fi адаптер)</span>
                  <button type="button" class="os-gui-net-close" title="Затвори мрежовия панел">&times;</button>
                </div>
                <div class="os-gui-net-body">
                  <div class="net-grid-row"><span>IPv4 адрес:</span> <strong>192.168.1.105</strong></div>
                  <div class="net-grid-row"><span>Маска на подмрежа:</span> <strong>255.255.255.0</strong></div>
                  <div class="net-grid-row"><span>Шлюз (Gateway):</span> <strong>192.168.1.1</strong></div>
                  <div class="net-grid-row"><span>DNS сървъри:</span> <strong>8.8.8.8, 1.1.1.1</strong></div>
                </div>
              </div>

              <!-- Visual Folder Contents Canvas -->
              <div class="os-gui-files-grid" aria-label="Файлове и папки">
                <!-- Will be dynamically populated and synchronized -->
              </div>
            </div>

            <div class="os-gui-modal" style="display: none;">
              <div class="os-modal-card">
                <div class="os-modal-head">
                  <strong class="os-modal-title">Системни свойства</strong>
                  <button type="button" class="os-modal-close">&times;</button>
                </div>
                <div class="os-modal-content"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Comparative Insight Matrix -->
      <div class="os-term-comparison-card">
        <div class="os-comp-grid">
          <div class="os-comp-side">
            <h5><i class="fas fa-terminal"></i> Интерфейс с команден ред (CLI)</h5>
            <ul>
              <li><strong>Мълниеносна скорост:</strong> Няма нужда компютърът да чертае милиони графични пиксели и менюта.</li>
              <li><strong>Автоматизация (Скриптове):</strong> Можете да преименувате 10,000 файла или да архивирате цял сървър само с 1 ред код.</li>
              <li><strong>Къде се използва:</strong> Всички облачни сървъри, Linux инфраструктури, бази данни и среди за разработка.</li>
              <li><strong>Недостатък:</strong> Изисква заучаване на точни команди и синтаксис.</li>
            </ul>
          </div>
          <div class="os-comp-side">
            <h5><i class="fas fa-mouse-pointer"></i> Графичен потребителски интерфейс (GUI)</h5>
            <ul>
              <li><strong>Интуитивност и визуалност:</strong> Потребителят вижда веднага какво прави — икони, папки, кошче, плъзгане (Drag &amp; Drop).</li>
              <li><strong>Минимално заучаване:</strong> Дори дете на 5 години може да стартира игра с кликване върху картинка.</li>
              <li><strong>Къде се използва:</strong> Лични компютри, смартфони, таблети, графичен дизайн и мултимедия.</li>
              <li><strong>Недостатък:</strong> Изразходва значително повече RAM и видео памет; повтарящите се действия с мишката са бавни.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id);
  if (!root) return;

  const cliHistory = root.querySelector('.os-cli-history');
  const cliInput = root.querySelector('.os-cli-input');
  const cliSendBtn = root.querySelector('.os-cli-send-btn');
  const quickBtns = root.querySelectorAll('.cli-quick-btn');

  const filesGrid = root.querySelector('.os-gui-files-grid');
  const guiNewFolderBtn = root.querySelector('.os-gui-new-folder');
  const guiNetBtn = root.querySelector('.os-gui-net-btn');
  const guiNetBanner = root.querySelector('.os-gui-net-banner');
  const guiNetClose = root.querySelector('.os-gui-net-close');

  // Unified File System State
  let fileSystem = [
    { name: 'Документи', type: 'folder', size: '&lt;DIR&gt;', date: '14.09.2026  11:20', icon: 'fas fa-folder' },
    { name: 'Снимки', type: 'folder', size: '&lt;DIR&gt;', date: '14.09.2026  12:05', icon: 'fas fa-folder' },
    { name: 'notes.txt', type: 'file', size: '1,024', bytes: 1024, date: '14.09.2026  13:40', icon: 'fas fa-file-lines' },
    { name: 'referat.docx', type: 'file', size: '253,952', bytes: 253952, date: '14.09.2026  14:20', icon: 'fas fa-file-word' }
  ];

  function hideNetworkInGui() {
    if (guiNetBanner) guiNetBanner.style.display = 'none';
    if (filesGrid) filesGrid.style.display = 'grid';
  }

  function renderGuiFiles(highlightName = null) {
    hideNetworkInGui();
    if (!filesGrid) return;
    filesGrid.innerHTML = '';
    fileSystem.forEach(item => {
      const el = document.createElement('div');
      el.className = `os-gui-item ${item.type}`;
      if (highlightName && item.name.toLowerCase() === highlightName.toLowerCase()) {
        el.classList.add('highlight-pulse');
      }
      el.dataset.name = item.name;
      el.innerHTML = `
        <i class="${item.icon}"></i>
        <span title="${esc(item.name)}">${esc(item.name)}</span>
      `;
      // Allow clicking an item in GUI to delete or view
      el.addEventListener('click', () => {
        // Toggle selected state
        filesGrid.querySelectorAll('.os-gui-item').forEach(i => i.classList.remove('selected'));
        el.classList.add('selected');
      });
      filesGrid.appendChild(el);
    });
  }

  // Initial render of files
  renderGuiFiles();

  function appendCli(text, isCommand = false) {
    if (!cliHistory) return;
    const line = document.createElement('div');
    line.className = isCommand ? 'cli-line user-cmd' : 'cli-line response';
    line.innerHTML = isCommand ? `<span class="cli-path">C:\\Users\\Student&gt;</span> ${esc(text)}` : text;
    cliHistory.appendChild(line);
    cliHistory.scrollTop = cliHistory.scrollHeight;
  }

  function showNetworkInGui() {
    if (filesGrid) filesGrid.style.display = 'none';
    if (guiNetBanner) {
      guiNetBanner.style.display = 'block';
      guiNetBanner.classList.add('highlight-pulse');
      setTimeout(() => guiNetBanner.classList.remove('highlight-pulse'), 1200);
    }
  }

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    appendCli(cmd, true);

    const lower = cmd.toLowerCase();

    if (lower === 'cls' || lower === 'clear') {
      if (cliHistory) cliHistory.innerHTML = '';
      return;
    }

    if (lower === 'dir' || lower === 'ls') {
      // Highlight files in GUI and sync dir display
      renderGuiFiles();
      if (filesGrid) {
        filesGrid.classList.add('highlight-pulse');
        setTimeout(() => filesGrid.classList.remove('highlight-pulse'), 1000);
      }

      let filesCount = 0;
      let filesBytes = 0;
      let dirsCount = 2; // . and ..

      const rows = fileSystem.map(item => {
        if (item.type === 'folder') {
          dirsCount++;
          const namePad = esc(item.name);
          return `&nbsp;&nbsp;${item.date}&nbsp;&nbsp;&lt;DIR&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${namePad}`;
        } else {
          filesCount++;
          filesBytes += (item.bytes || 1024);
          const sizeStr = String(item.size).padStart(14, ' ');
          return `&nbsp;&nbsp;${item.date}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${sizeStr}&nbsp;${esc(item.name)}`;
        }
      }).join('<br>');

      appendCli(`
        Томът в устройство C няма етикет.<br>
        Сериен номер на тома е 4A8B-91E2<br>
        Директория на C:\\Users\\Student<br><br>
        &nbsp;&nbsp;14.09.2026&nbsp;&nbsp;10:12&nbsp;&nbsp;&lt;DIR&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.<br>
        &nbsp;&nbsp;14.09.2026&nbsp;&nbsp;10:12&nbsp;&nbsp;&lt;DIR&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;..<br>
        ${rows}<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${filesCount} Файл(а)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${filesBytes.toLocaleString()} байта<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${dirsCount} Директори(и)&nbsp;&nbsp;185,249,153,024 байта свободно<br>
        <span class="cli-info-note"><i class="fas fa-eye"></i> Списъкът на файловете се синхронизира и освежи и във Файловия браузър (вдясно).</span>
      `);
    } else if (lower.startsWith('mkdir ') || lower.startsWith('md ')) {
      const name = cmd.replace(/^(mkdir|md)\s+/i, '').trim().replace(/['"]/g, '');
      if (!name) {
        appendCli('<span style="color:#ef4444;">Синтаксична грешка: Посочете име на новата папка. Пример: mkdir Proekti</span>');
        return;
      }
      const existing = fileSystem.find(f => f.name.toLowerCase() === name.toLowerCase());
      if (existing) {
        appendCli(`<span style="color:#eab308;">Поддиректорията или файлът „${esc(name)}“ вече съществува.</span>`);
        return;
      }
      fileSystem.push({
        name: name,
        type: 'folder',
        size: '&lt;DIR&gt;',
        date: '15.09.2026  14:35',
        icon: 'fas fa-folder'
      });
      renderGuiFiles(name);
      appendCli(`<span style="color:#22c55e;">[OK] Папката „${esc(name)}“ беше успешно създадена!</span><br><span class="cli-info-note"><i class="fas fa-folder-plus"></i> Новата папка се появи моментално и във Файловия браузър (вдясно).</span>`);
    } else if (lower.startsWith('del ') || lower.startsWith('erase ') || lower.startsWith('rmdir ') || lower.startsWith('rd ') || lower.startsWith('rm ')) {
      const targetName = cmd.replace(/^(del|erase|rmdir|rd|rm)\s+/i, '').trim().replace(/['"]/g, '');
      if (!targetName) {
        appendCli('<span style="color:#ef4444;">Синтаксична грешка: Посочете име на файла или папката за изтриване. Пример: del referat.docx или rmdir Документи</span>');
        return;
      }
      const index = fileSystem.findIndex(f => f.name.toLowerCase() === targetName.toLowerCase());
      if (index === -1) {
        appendCli(`<span style="color:#ef4444;">Грешка: Не може да се намери „${esc(targetName)}“. Проверете точното изписване чрез dir.</span>`);
      } else {
        const removed = fileSystem.splice(index, 1)[0];
        renderGuiFiles();
        appendCli(`<span style="color:#22c55e;">[OK] Обектът „${esc(removed.name)}“ беше изтрит от диска.</span><br><span class="cli-info-note"><i class="fas fa-trash-can"></i> „${esc(removed.name)}“ изчезна автоматично и от Файловия браузър (вдясно).</span>`);
      }
    } else if (lower === 'ipconfig') {
      showNetworkInGui();
      appendCli(`
        Настройка на IP за Windows:<br><br>
        Адаптер за безжична локална мрежа Wi-Fi:<br>
        &nbsp;&nbsp;Състояние на носителя . . . . . . . : Свързан<br>
        &nbsp;&nbsp;IPv4 адрес . . . . . . . . . . . . . : 192.168.1.105<br>
        &nbsp;&nbsp;Маска на подмрежата. . . . . . . . . : 255.255.255.0<br>
        &nbsp;&nbsp;Шлюз по подразбиране . . . . . . . . : 192.168.1.1<br>
        &nbsp;&nbsp;DNS сървъри. . . . . . . . . . . . . : 8.8.8.8, 1.1.1.1<br>
        <span class="cli-info-note"><i class="fas fa-network-wired"></i> Мрежовата информация се визуализира в панел „Мрежа“ и във Файловия браузър!</span>
      `);
    } else if (lower === 'systeminfo') {
      appendCli(`
        Име на хост:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SCHOOL-LAB-08<br>
        Име на ОС:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Microsoft Windows 11 Pro 64-bit<br>
        Версия на ОС:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10.0.22631 Build 22631<br>
        Тип система:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x64-based PC<br>
        Процесор:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8-Core Intel Core i7 / AMD Ryzen (3.80 GHz)<br>
        Версия на BIOS/UEFI:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;American Megatrends UEFI v2.40<br>
        Обща физическа памет:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16,384 MB (16 GB)<br>
        Налична физическа памет:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10,412 MB свободна
      `);
    } else if (lower === 'help') {
      appendCli(`
        Поддържани команди в симулатора:<br>
        • <strong>dir</strong> — показва съдържанието на текущата папка (синхронизира се и с GUI)<br>
        • <strong>mkdir &lt;име&gt;</strong> — създава нова папка (напр. <code>mkdir Proekti</code>)<br>
        • <strong>del &lt;файл&gt;</strong> — изтрива файл (напр. <code>del referat.docx</code>)<br>
        • <strong>rmdir &lt;папка&gt;</strong> — изтрива папка (напр. <code>rmdir Документи</code>)<br>
        • <strong>ipconfig</strong> — показва IP адрес и мрежови параметри (показва се и в GUI)<br>
        • <strong>systeminfo</strong> — системни параметри и хардуер<br>
        • <strong>cls</strong> — изчистване на екрана
      `);
    } else {
      appendCli(`<span style="color:#ef4444;">'${esc(cmd)}' не се разпознава като вътрешна или външна команда. Въведете <strong>help</strong> или кликнете на бързите команди отдолу.</span>`);
    }
  }

  function handleSend() {
    if (!cliInput) return;
    const text = cliInput.value;
    cliInput.value = '';
    executeCommand(text);
  }

  if (cliSendBtn) cliSendBtn.addEventListener('click', handleSend);
  if (cliInput) {
    cliInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleSend();
    });
  }

  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.dataset.cmd;
      executeCommand(cmd);
    });
  });

  // GUI interaction handlers
  if (guiNewFolderBtn) {
    guiNewFolderBtn.addEventListener('click', () => {
      let counter = 1;
      let newName = 'Нова папка';
      while (fileSystem.find(f => f.name.toLowerCase() === newName.toLowerCase())) {
        counter++;
        newName = `Нова папка (${counter})`;
      }
      fileSystem.push({
        name: newName,
        type: 'folder',
        size: '&lt;DIR&gt;',
        date: '15.09.2026  14:35',
        icon: 'fas fa-folder'
      });
      renderGuiFiles(newName);
      appendCli(`[GUI събитие] Потребителят създаде „${esc(newName)}“ чрез бутона в GUI. Ядрото изпълни същата системна операция, както при <code>mkdir "${esc(newName)}"</code>.`);
    });
  }

  if (guiNetBtn) {
    guiNetBtn.addEventListener('click', () => {
      showNetworkInGui();
      appendCli('[GUI събитие] Отворен е мрежовият панел в GUI (съответства на командата <code>ipconfig</code> в CLI).');
    });
  }

  if (guiNetClose) {
    guiNetClose.addEventListener('click', () => {
      hideNetworkInGui();
    });
  }
}

