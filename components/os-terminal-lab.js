// OS Terminal Lab Component
// Interactive side-by-side comparison of CLI (Terminal) vs GUI (Desktop/File Explorer)

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

export function render(comp) {
  const id = comp.id || 'os-terminal-lab';
  const title = comp.title || 'Двете лица на интерфейса: Команден ред (CLI) срещу Работен плот (GUI)';
  const subtitle = comp.subtitle || 'Изпълнете еднакви практически задачи в текстов терминал и в графична среда, за да разберете предимствата на всеки подход';

  return `
    <div id="${esc(id)}" class="os-terminal-lab">
      <div class="os-term-header">
        <span class="os-term-badge"><i class="fas fa-terminal"></i> Интерактивна лаборатория</span>
        <h3>${esc(title)}</h3>
        <p>${esc(subtitle)}</p>
      </div>

      <div class="os-term-missions">
        <span class="os-mission-title"><i class="fas fa-crosshairs"></i> Изберете практическа мисия:</span>
        <div class="os-mission-chips">
          <button type="button" class="os-mission-chip active" data-mission="list">
            <span>Мисия 1</span><strong>Списък на файловете</strong>
          </button>
          <button type="button" class="os-mission-chip" data-mission="mkdir">
            <span>Мисия 2</span><strong>Създаване на нова папка</strong>
          </button>
          <button type="button" class="os-mission-chip" data-mission="sysinfo">
            <span>Мисия 3</span><strong>Системна информация</strong>
          </button>
          <button type="button" class="os-mission-chip" data-mission="net">
            <span>Мисия 4</span><strong>Мрежова диагностика</strong>
          </button>
        </div>
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
            <div class="os-win-title"><i class="fas fa-terminal"></i> Command Prompt / Bash Terminal (CLI)</div>
          </div>
          <div class="os-cli-body">
            <div class="os-cli-history" aria-live="polite">
              <div class="cli-line intro">Microsoft Windows [Version 10.0.22631]</div>
              <div class="cli-line intro">(c) Корпорация Майкрософт. Всички права запазени.</div>
              <div class="cli-line intro">Въведете команда или използвайте бързите бутони отдолу.</div>
              <div class="cli-line"><br></div>
            </div>
            <div class="os-cli-prompt-line">
              <span class="cli-path">C:\Users\Student&gt;</span>
              <input type="text" class="os-cli-input" placeholder="напишете команда тук (напр. dir или help)..." autocomplete="off" spellcheck="false" aria-label="Въвеждане на команден ред" />
              <button type="button" class="os-cli-send-btn" title="Изпълни команда"><i class="fas fa-arrow-turn-down"></i></button>
            </div>
            <div class="os-cli-helpers">
              <span class="cli-helper-label">Бързи команди:</span>
              <button type="button" class="cli-quick-btn" data-cmd="dir"><code>dir</code> (списък)</button>
              <button type="button" class="cli-quick-btn" data-cmd="mkdir Proekti"><code>mkdir Proekti</code> (нова папка)</button>
              <button type="button" class="cli-quick-btn" data-cmd="systeminfo"><code>systeminfo</code> (система)</button>
              <button type="button" class="cli-quick-btn" data-cmd="ipconfig"><code>ipconfig</code> (мрежа)</button>
              <button type="button" class="cli-quick-btn" data-cmd="cls"><code>cls</code> (изчисти)</button>
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
                <button type="button" class="os-gui-tool-btn os-gui-new-folder"><i class="fas fa-folder-plus"></i> Нова папка</button>
                <button type="button" class="os-gui-tool-btn os-gui-sys-props"><i class="fas fa-info-circle"></i> Свойства</button>
              </div>
            </div>

            <!-- Visual Folder Contents Canvas -->
            <div class="os-gui-files-grid">
              <div class="os-gui-item folder">
                <i class="fas fa-folder"></i>
                <span>Документи</span>
              </div>
              <div class="os-gui-item folder">
                <i class="fas fa-folder"></i>
                <span>Снимки</span>
              </div>
              <div class="os-gui-item file">
                <i class="fas fa-file-lines"></i>
                <span>notes.txt</span>
              </div>
              <div class="os-gui-item file">
                <i class="fas fa-file-word"></i>
                <span>referat.docx</span>
              </div>
              <div class="os-gui-item folder os-new-folder-item" style="display: none;">
                <i class="fas fa-folder" style="color: #f59e0b;"></i>
                <span class="os-new-folder-name">Proekti</span>
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
  const missionChips = root.querySelectorAll('.os-mission-chip');

  const newFolderItem = root.querySelector('.os-new-folder-item');
  const guiNewFolderBtn = root.querySelector('.os-gui-new-folder');
  const guiSysPropsBtn = root.querySelector('.os-gui-sys-props');
  const guiModal = root.querySelector('.os-gui-modal');
  const guiModalTitle = root.querySelector('.os-modal-title');
  const guiModalContent = root.querySelector('.os-modal-content');
  const guiModalClose = root.querySelector('.os-modal-close');

  let folderCreated = false;

  function appendCli(text, isCommand = false) {
    if (!cliHistory) return;
    const line = document.createElement('div');
    line.className = isCommand ? 'cli-line user-cmd' : 'cli-line response';
    line.innerHTML = isCommand ? `<span class="cli-path">C:\\Users\\Student&gt;</span> ${esc(text)}` : text;
    cliHistory.appendChild(line);
    cliHistory.scrollTop = cliHistory.scrollHeight;
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
      const proektiLine = folderCreated ? '<br>&nbsp;&nbsp;14.09.2026&nbsp;&nbsp;14:35&nbsp;&nbsp;&lt;DIR&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Proekti' : '';
      appendCli(`
        Томът в устройство C няма етикет.<br>
        Сериен номер на тома е 4A8B-91E2<br>
        Директория на C:\\Users\\Student<br><br>
        &nbsp;&nbsp;14.09.2026&nbsp;&nbsp;10:12&nbsp;&nbsp;&lt;DIR&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.<br>
        &nbsp;&nbsp;14.09.2026&nbsp;&nbsp;10:12&nbsp;&nbsp;&lt;DIR&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;..<br>
        &nbsp;&nbsp;14.09.2026&nbsp;&nbsp;11:20&nbsp;&nbsp;&lt;DIR&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Документи<br>
        &nbsp;&nbsp;14.09.2026&nbsp;&nbsp;12:05&nbsp;&nbsp;&lt;DIR&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Снимки${proektiLine}<br>
        &nbsp;&nbsp;14.09.2026&nbsp;&nbsp;13:40&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1,024 notes.txt<br>
        &nbsp;&nbsp;14.09.2026&nbsp;&nbsp;14:20&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;253,952 referat.docx<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 Файл(а)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;254,976 байта<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${folderCreated ? '5' : '4'} Директори(и)&nbsp;&nbsp;185,249,153,024 байта свободно
      `);
    } else if (lower.startsWith('mkdir') || lower.startsWith('md')) {
      const parts = cmd.split(/\s+/);
      const name = parts[1] || 'НоваПапка';
      folderCreated = true;
      if (newFolderItem) {
        newFolderItem.style.display = 'flex';
        const label = newFolderItem.querySelector('.os-new-folder-name');
        if (label) label.textContent = name;
      }
      appendCli(`<span style="color:#22c55e;">[OK] Папката „${esc(name)}“ беше успешно създадена в директорията!</span> (Погледнете в десния GUI прозорец — тя вече се появи и там!)`);
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
    } else if (lower === 'ipconfig') {
      appendCli(`
        Настройка на IP за Windows:<br><br>
        Адаптер за безжична локална мрежа Wi-Fi:<br>
        &nbsp;&nbsp;IPv4 адрес . . . . . . . . . : 192.168.1.105<br>
        &nbsp;&nbsp;Маска на подмрежата. . . . . : 255.255.255.0<br>
        &nbsp;&nbsp;Шлюз по подразбиране . . . . : 192.168.1.1<br>
        &nbsp;&nbsp;DNS сървъри. . . . . . . . . : 8.8.8.8, 1.1.1.1
      `);
    } else if (lower === 'help') {
      appendCli(`
        Поддържани примерни команди в симулатора:<br>
        • <strong>dir</strong> — показва файловете и папките в текущата директория<br>
        • <strong>mkdir &lt;име&gt;</strong> — създава нова директория (папка)<br>
        • <strong>systeminfo</strong> — извежда хардуерни и софтуерни параметри на ОС<br>
        • <strong>ipconfig</strong> — показва мрежовия IP адрес и интернет връзката<br>
        • <strong>cls</strong> — изчиства терминалния екран
      `);
    } else {
      appendCli(`<span style="color:#ef4444;">'${esc(cmd)}' не се разпознава като вътрешна или външна команда. Въведете <strong>help</strong> за списък.</span>`);
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

  // Missions selector
  missionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      missionChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const mission = chip.dataset.mission;

      if (mission === 'list') {
        executeCommand('dir');
      } else if (mission === 'mkdir') {
        executeCommand('mkdir Proekti');
      } else if (mission === 'sysinfo') {
        executeCommand('systeminfo');
      } else if (mission === 'net') {
        executeCommand('ipconfig');
      }
    });
  });

  // GUI interaction handlers
  if (guiNewFolderBtn) {
    guiNewFolderBtn.addEventListener('click', () => {
      folderCreated = true;
      if (newFolderItem) newFolderItem.style.display = 'flex';
      appendCli('[GUI събитие] Потребителят създаде нова папка чрез десен бутон / лента в GUI. Системата изпълни същата вътрешна системна заявка за създаване на папка.');
    });
  }

  if (guiSysPropsBtn) {
    guiSysPropsBtn.addEventListener('click', () => {
      if (guiModal && guiModalContent && guiModalTitle) {
        guiModalTitle.textContent = 'Свойства на системата (Windows Settings)';
        guiModalContent.innerHTML = `
          <div style="font-size:0.9rem; line-height:1.6; color:#334155;">
            <p><strong>Устройство:</strong> SCHOOL-LAB-08</p>
            <p><strong>Процесор:</strong> 8-Core Intel Core i7 / AMD Ryzen @ 3.80GHz</p>
            <p><strong>RAM:</strong> 16.0 GB (15.8 GB използваема)</p>
            <p><strong>Издание:</strong> Windows 11 Pro, Версия 23H2</p>
            <hr style="margin:0.75rem 0; border:0; border-top:1px solid #e2e8f0;">
            <p style="font-size:0.82rem; color:#64748b;"><i class="fas fa-check-circle" style="color:#10b981;"></i> Забележете: Графичният прозорец ви показва същата информация като командата <code>systeminfo</code>, но в естетичен визуален стил с бутони!</p>
          </div>
        `;
        guiModal.style.display = 'flex';
      }
    });
  }

  if (guiModalClose) {
    guiModalClose.addEventListener('click', () => {
      if (guiModal) guiModal.style.display = 'none';
    });
  }
}
