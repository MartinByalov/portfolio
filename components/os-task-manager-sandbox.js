// OS Task Manager Sandbox Component
// Interactive simulation of the Task Manager / Activity Monitor to diagnose and resolve system bottlenecks

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

export function render(comp) {
  const id = comp.id || 'os-task-manager-sandbox';
  const title = comp.title || 'Симулатор: Диспечер на задачите (Task Manager)';
  const subtitle = comp.subtitle || 'Влезте в ролята на системен администратор — открийте претоварените ресурси и спасете замръзналия компютър';

  return `
    <div id="${esc(id)}" class="os-task-manager-sandbox">
      <div class="tm-header">
        <div class="tm-title-wrap">
          <h3>${esc(title)}</h3>
          <p>${esc(subtitle)}</p>
        </div>
        <button type="button" class="btn-activity tm-reset-btn">
          <i class="fas fa-rotate-right"></i> Рестартирай симулацията
        </button>
      </div>

      <!-- Live Resource Gauges -->
      <div class="tm-gauges-grid">
        <div class="tm-gauge-card cpu alert">
          <div class="tm-gauge-top">
            <span class="tm-gauge-label"><i class="fas fa-microchip"></i> Процесор (CPU)</span>
            <strong class="tm-gauge-val tm-cpu-val">96%</strong>
          </div>
          <div class="tm-gauge-bar"><div class="tm-gauge-fill tm-cpu-fill" style="width: 96%;"></div></div>
          <small class="tm-gauge-sub tm-cpu-sub">Критично натоварване!</small>
        </div>

        <div class="tm-gauge-card ram warn">
          <div class="tm-gauge-top">
            <span class="tm-gauge-label"><i class="fas fa-memory"></i> Памет (RAM)</span>
            <strong class="tm-gauge-val tm-ram-val">84%</strong>
          </div>
          <div class="tm-gauge-bar"><div class="tm-gauge-fill tm-ram-fill" style="width: 84%;"></div></div>
          <small class="tm-gauge-sub tm-ram-sub">6.7 / 8.0 GB използвани</small>
        </div>

        <div class="tm-gauge-card disk alert">
          <div class="tm-gauge-top">
            <span class="tm-gauge-label"><i class="fas fa-hard-drive"></i> Дискова активност (SSD)</span>
            <strong class="tm-gauge-val tm-disk-val">98%</strong>
          </div>
          <div class="tm-gauge-bar"><div class="tm-gauge-fill tm-disk-fill" style="width: 98%;"></div></div>
          <small class="tm-gauge-sub tm-disk-sub">Опашката от заявки е претоварена</small>
        </div>
      </div>

      <!-- Task Manager Control Console -->
      <div class="tm-window">
        <div class="tm-window-toolbar">
          <div class="tm-tabs">
            <span class="tm-tab-item active"><i class="fas fa-list-check"></i> Процеси (5)</span>
            <span class="tm-tab-item"><i class="fas fa-chart-line"></i> Производителност</span>
            <span class="tm-tab-item"><i class="fas fa-user-shield"></i> Сигурност</span>
          </div>
          <button type="button" class="btn-activity tm-kill-btn" disabled>
            <i class="fas fa-ban"></i> Завърши задачата (End Task)
          </button>
        </div>

        <!-- Processes Table -->
        <div class="tm-table-wrap">
          <table class="tm-table">
            <thead>
              <tr>
                <th style="width: 32%;">Име на процес / Приложение</th>
                <th style="width: 15%;">Статус</th>
                <th style="width: 14%;">CPU</th>
                <th style="width: 17%;">RAM памет</th>
                <th style="width: 12%;">Диск I/O</th>
                <th style="width: 10%;">PID</th>
              </tr>
            </thead>
            <tbody>
              <tr class="tm-row" data-proc="render" data-pid="4820">
                <td>
                  <div class="proc-name-cell">
                    <i class="fas fa-cube proc-icon red"></i>
                    <div>
                      <strong>VideoRender_3D.exe</strong>
                      <small>3D Видео рендеринг</small>
                    </div>
                  </div>
                </td>
                <td><span class="proc-status status-danger">Не отговаря</span></td>
                <td><strong class="cpu-text red">88.5%</strong></td>
                <td>1,850 MB</td>
                <td>4.2 MB/s</td>
                <td><code>4820</code></td>
              </tr>

              <tr class="tm-row" data-proc="browser" data-pid="3104">
                <td>
                  <div class="proc-name-cell">
                    <i class="fab fa-chrome proc-icon blue"></i>
                    <div>
                      <strong>Chrome_Browser.exe</strong>
                      <small>Google Chrome (16 отворени раздела)</small>
                    </div>
                  </div>
                </td>
                <td><span class="proc-status status-normal">Активен</span></td>
                <td>4.2%</td>
                <td><strong class="ram-text orange">2,950 MB</strong></td>
                <td>0.8 MB/s</td>
                <td><code>3104</code></td>
              </tr>

              <tr class="tm-row" data-proc="antivirus" data-pid="1428">
                <td>
                  <div class="proc-name-cell">
                    <i class="fas fa-shield-virus proc-icon green"></i>
                    <div>
                      <strong>Antivirus_DeepScan.exe</strong>
                      <small>Пълно сканиране на файловете</small>
                    </div>
                  </div>
                </td>
                <td><span class="proc-status status-warn">Фоново сканиране</span></td>
                <td>2.8%</td>
                <td>420 MB</td>
                <td><strong class="disk-text red">145 MB/s (98%)</strong></td>
                <td><code>1428</code></td>
              </tr>

              <tr class="tm-row" data-proc="spooler" data-pid="892">
                <td>
                  <div class="proc-name-cell">
                    <i class="fas fa-print proc-icon purple"></i>
                    <div>
                      <strong>PrintSpooler_Service.exe</strong>
                      <small>Системна опашка за печат</small>
                    </div>
                  </div>
                </td>
                <td><span class="proc-status status-danger">Блокирана опашка</span></td>
                <td>0.1%</td>
                <td>45 MB</td>
                <td>0.0 MB/s</td>
                <td><code>892</code></td>
              </tr>

              <tr class="tm-row" data-proc="kernel" data-pid="4">
                <td>
                  <div class="proc-name-cell">
                    <i class="fas fa-shield-halved proc-icon dark"></i>
                    <div>
                      <strong>System (Kernel)</strong>
                      <small>Защитено ядро на операционната система</small>
                    </div>
                  </div>
                </td>
                <td><span class="proc-status status-kernel">Защитено ядро</span></td>
                <td>0.8%</td>
                <td>380 MB</td>
                <td>0.1 MB/s</td>
                <td><code>4</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Feedback / Message Bar -->
        <div class="tm-message-box" aria-live="polite">
          <i class="fas fa-lightbulb"></i>
          <span class="tm-msg-text">
            Компютърът замръзва! Процесорът и дискът са натоварени на 96%+. Изберете замръзналия процес от списъка и натиснете <strong>„Завърши задачата“</strong>.
          </span>
        </div>
      </div>
    </div>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id);
  if (!root) return;

  const rows = root.querySelectorAll('.tm-row');
  const killBtn = root.querySelector('.tm-kill-btn');
  const resetBtn = root.querySelector('.tm-reset-btn');
  const msgBox = root.querySelector('.tm-message-box');
  const msgText = root.querySelector('.tm-msg-text');

  const cpuVal = root.querySelector('.tm-cpu-val');
  const cpuFill = root.querySelector('.tm-cpu-fill');
  const cpuSub = root.querySelector('.tm-cpu-sub');
  const cpuCard = root.querySelector('.tm-gauge-card.cpu');

  const ramVal = root.querySelector('.tm-ram-val');
  const ramFill = root.querySelector('.tm-ram-fill');
  const ramSub = root.querySelector('.tm-ram-sub');
  const ramCard = root.querySelector('.tm-gauge-card.ram');

  const diskVal = root.querySelector('.tm-disk-val');
  const diskFill = root.querySelector('.tm-disk-fill');
  const diskSub = root.querySelector('.tm-disk-sub');
  const diskCard = root.querySelector('.tm-gauge-card.disk');

  let selectedRow = null;
  let state = {
    renderKilled: false,
    browserKilled: false,
    antivirusKilled: false,
    spoolerFixed: false
  };

  function updateMeters() {
    let cpu = 96;
    let ram = 84;
    let disk = 98;

    if (state.renderKilled) {
      cpu -= 82; // drops to ~14%
      ram -= 22; // drops by ~22%
    }
    if (state.browserKilled) {
      ram -= 36; // drops by ~36%
      cpu -= 3;
    }
    if (state.antivirusKilled) {
      disk -= 92; // drops to ~6%
      cpu -= 2;
    }

    cpu = Math.max(5, cpu);
    ram = Math.max(26, ram);
    disk = Math.max(3, disk);

    // Update CPU
    if (cpuVal) cpuVal.textContent = `${cpu}%`;
    if (cpuFill) cpuFill.style.width = `${cpu}%`;
    if (cpuCard) {
      cpuCard.className = `tm-gauge-card cpu ${cpu > 80 ? 'alert' : (cpu > 50 ? 'warn' : 'ok')}`;
    }
    if (cpuSub) {
      cpuSub.textContent = cpu > 80 ? 'Критично натоварване!' : (cpu > 50 ? 'Умерено натоварване' : 'Нормален свободен режим');
    }

    // Update RAM
    if (ramVal) ramVal.textContent = `${ram}%`;
    if (ramFill) ramFill.style.width = `${ram}%`;
    if (ramCard) {
      ramCard.className = `tm-gauge-card ram ${ram > 80 ? 'alert' : (ram > 60 ? 'warn' : 'ok')}`;
    }
    const ramGb = ((ram / 100) * 8.0).toFixed(1);
    if (ramSub) ramSub.textContent = `${ramGb} / 8.0 GB използвани`;

    // Update Disk
    if (diskVal) diskVal.textContent = `${disk}%`;
    if (diskFill) diskFill.style.width = `${disk}%`;
    if (diskCard) {
      diskCard.className = `tm-gauge-card disk ${disk > 80 ? 'alert' : (disk > 40 ? 'warn' : 'ok')}`;
    }
    if (diskSub) {
      diskSub.textContent = disk > 80 ? 'Дисковата опашка е претоварена' : 'Нормална дискова активност';
    }

    // Victory check
    if (state.renderKilled && state.antivirusKilled) {
      if (msgBox && msgText) {
        msgBox.className = 'tm-message-box success';
        msgText.innerHTML = `<strong>Браво! Системата е спасена!</strong> Процесорът работи само на ${cpu}%, а дискът е разтоварен. Вие успешно приложихте контролните функции на операционната система за управление на ресурсите!`;
      }
    }
  }

  rows.forEach(row => {
    row.addEventListener('click', () => {
      rows.forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
      selectedRow = row;
      if (killBtn) killBtn.disabled = false;

      const proc = row.dataset.proc;
      if (proc === 'kernel') {
        if (msgText) msgText.innerHTML = '<strong>Забележка:</strong> Избрахте системното ядро (Kernel). Опитайте да натиснете „Завърши задачата“, за да видите как ОС защитава целостта си.';
      } else if (proc === 'render') {
        if (msgText) msgText.innerHTML = '<strong>VideoRender_3D.exe:</strong> Процесът е блокирал в безкраен цикъл и консумира 88% от цялата изчислителна мощност на CPU. Прекратете го!';
      } else if (proc === 'antivirus') {
        if (msgText) msgText.innerHTML = '<strong>Antivirus_DeepScan.exe:</strong> Сканира милиони сектори и заема 98% от пропускателната способност на диска.';
      } else if (proc === 'browser') {
        if (msgText) msgText.innerHTML = '<strong>Chrome_Browser.exe:</strong> 16 отворени раздела задържат близо 3 GB RAM памет.';
      } else if (proc === 'spooler') {
        if (msgText) msgText.innerHTML = '<strong>PrintSpooler_Service.exe:</strong> Опашката за печат е блокирана поради заседнал принтер.';
      }
    });
  });

  if (killBtn) {
    killBtn.addEventListener('click', () => {
      if (!selectedRow) return;
      const proc = selectedRow.dataset.proc;

      if (proc === 'kernel') {
        alert('ГРЕШКА В ДОСТЪПА: Операцията е отказана!\n\nSystem (Kernel) е защитено ядро на операционната система. Прекратяването му би довело до моментален син екран (BSoD) или срив на хардуера. ОС не позволява спиране на критични системни процеси.');
        return;
      }

      if (proc === 'render') {
        state.renderKilled = true;
        selectedRow.style.opacity = '0.4';
        selectedRow.querySelector('.proc-status').textContent = 'Прекратен';
        selectedRow.querySelector('.proc-status').className = 'proc-status status-normal';
        selectedRow.querySelector('.cpu-text').textContent = '0.0%';
        selectedRow.querySelector('.cpu-text').className = 'cpu-text';
        if (msgText) {
          msgText.innerHTML = '<span style="color:#166534;"><strong>Успех:</strong> Прекратихте блокиралия процес! Натоварването на процесора спадна драстично.</span>';
        }
      } else if (proc === 'browser') {
        state.browserKilled = true;
        selectedRow.style.opacity = '0.4';
        selectedRow.querySelector('.proc-status').textContent = 'Затворен';
        selectedRow.querySelector('.ram-text').textContent = '210 MB';
        selectedRow.querySelector('.ram-text').className = 'ram-text';
        if (msgText) {
          msgText.innerHTML = '<span style="color:#166534;"><strong>Успех:</strong> Затворихте тежките раздели на браузъра и освободихте над 2.5 GB RAM памет!</span>';
        }
      } else if (proc === 'antivirus') {
        state.antivirusKilled = true;
        selectedRow.style.opacity = '0.4';
        selectedRow.querySelector('.proc-status').textContent = 'Паузиран';
        selectedRow.querySelector('.disk-text').textContent = '0.2 MB/s';
        selectedRow.querySelector('.disk-text').className = 'disk-text';
        if (msgText) {
          msgText.innerHTML = '<span style="color:#166534;"><strong>Успех:</strong> Паузирахте фоновото сканиране и разтоварихте диска!</span>';
        }
      } else if (proc === 'spooler') {
        state.spoolerFixed = true;
        selectedRow.querySelector('.proc-status').textContent = 'Рестартирана';
        selectedRow.querySelector('.proc-status').className = 'proc-status status-normal';
        if (msgText) {
          msgText.innerHTML = '<span style="color:#166534;"><strong>Успех:</strong> Услугата за печат беше рестартирана и опашката се изчисти.</span>';
        }
      }

      updateMeters();
      selectedRow.classList.remove('selected');
      selectedRow = null;
      killBtn.disabled = true;
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state = {
        renderKilled: false,
        browserKilled: false,
        antivirusKilled: false,
        spoolerFixed: false
      };
      rows.forEach(r => {
        r.style.opacity = '1';
        r.classList.remove('selected');
      });
      const rRow = root.querySelector('[data-proc="render"]');
      if (rRow) {
        rRow.querySelector('.proc-status').textContent = 'Не отговаря';
        rRow.querySelector('.proc-status').className = 'proc-status status-danger';
        rRow.querySelector('.cpu-text').textContent = '88.5%';
        rRow.querySelector('.cpu-text').className = 'cpu-text red';
      }
      const bRow = root.querySelector('[data-proc="browser"]');
      if (bRow) {
        bRow.querySelector('.proc-status').textContent = 'Активен';
        bRow.querySelector('.ram-text').textContent = '2,950 MB';
        bRow.querySelector('.ram-text').className = 'ram-text orange';
      }
      const aRow = root.querySelector('[data-proc="antivirus"]');
      if (aRow) {
        aRow.querySelector('.proc-status').textContent = 'Фоново сканиране';
        aRow.querySelector('.disk-text').textContent = '145 MB/s (98%)';
        aRow.querySelector('.disk-text').className = 'disk-text red';
      }
      const sRow = root.querySelector('[data-proc="spooler"]');
      if (sRow) {
        sRow.querySelector('.proc-status').textContent = 'Блокирана опашка';
        sRow.querySelector('.proc-status').className = 'proc-status status-danger';
      }
      if (killBtn) killBtn.disabled = true;
      selectedRow = null;
      if (msgBox) msgBox.className = 'tm-message-box';
      if (msgText) {
        msgText.textContent = 'Компютърът замръзва! Процесорът и дискът са натоварени на 96%+. Изберете замръзналия процес от списъка и натиснете „Завърши задачата“.';
      }
      updateMeters();
    });
  }
}
