// Image with Instruction Component
// Renders visual preview with user upload instructions and fallback mockup

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

function getMockIllustration(id) {
  switch (id) {
    case 'img-concept-map':
      return `
        <div class="iwi-concept-map-grid">
          <div class="iwi-cm-node node-local">
            <i class="fas fa-hard-drive"></i>
            <strong>1. Локално търсене</strong>
            <span>Taskbar Search, File Explorer, Wildcards (*, ?), Логически оператори</span>
          </div>
          <div class="iwi-cm-node node-web">
            <i class="fas fa-globe"></i>
            <strong>2. Интернет търсене</strong>
            <span>Браузър vs Търсачка, Оператори: "фраза", -, OR, site:, filetype:</span>
          </div>
          <div class="iwi-cm-node node-filter">
            <i class="fas fa-filter"></i>
            <strong>3. Подбор на резултати</strong>
            <span>Филтри за дата, размер, файлов формат и ключови думи</span>
          </div>
          <div class="iwi-cm-node node-eval">
            <i class="fas fa-shield-halved"></i>
            <strong>4. Оценка на източника</strong>
            <span>6 критерия: Автор, Домейн, Дата, Обективност, Доказателства, Съпоставка</span>
          </div>
        </div>
      `;

    case 'img-wildcards-table':
      return `
        <div class="iwi-wildcard-mock-grid">
          <div class="iwi-wc-card wc-star">
            <div class="wc-badge-star">* (звездичка)</div>
            <div class="wc-desc">Замества <strong>произволен брой символи</strong> (0, 1 или много)</div>
            <div class="wc-example"><code>*.jpg</code> ➔ намира всички JPG снимки</div>
            <div class="wc-example"><code>project*</code> ➔ project1, project_final</div>
            <div class="wc-example"><code>*report*.docx</code> ➔ файлове съдържащи report</div>
          </div>
          <div class="iwi-wc-card wc-question">
            <div class="wc-badge-quest">? (въпросителен знак)</div>
            <div class="wc-desc">Замества <strong>точно един</strong> неизвестен символ</div>
            <div class="wc-example"><code>photo?.jpg</code> ➔ photo1.jpg, photoA.jpg</div>
            <div class="wc-example"><code>test??.docx</code> ➔ test01.docx, testAB.docx</div>
            <div class="wc-example wc-note"><i class="fas fa-times-circle"></i> НЕ намира photo10.jpg</div>
          </div>
        </div>
      `;

    case 'img-explorer-filters':
      return `
        <div class="iwi-fe-filters-mock">
          <div class="fe-bar-title"><i class="fas fa-sliders"></i> Search Tools / Филтри във File Explorer (Windows 11)</div>
          <div class="fe-filters-pills">
            <div class="fe-pill-box">
              <span class="fe-pill-title"><i class="fas fa-calendar-days text-blue-500"></i> Date Modified (Дата)</span>
              <span class="fe-pill-sub">Днес, Вчера, Миналата седмица, Миналия месец, Тази година</span>
            </div>
            <div class="fe-pill-box">
              <span class="fe-pill-title"><i class="fas fa-shapes text-emerald-500"></i> Kind (Вид)</span>
              <span class="fe-pill-sub">Документ, Картина, Видеоклип, Музика, Папка, Програма</span>
            </div>
            <div class="fe-pill-box">
              <span class="fe-pill-title"><i class="fas fa-weight-scale text-amber-500"></i> Size (Размер)</span>
              <span class="fe-pill-sub">Малък (&lt;100KB), Среден (1-128MB), Голям (128MB-1GB), Огромен</span>
            </div>
            <div class="fe-pill-box">
              <span class="fe-pill-title"><i class="fas fa-tags text-purple-500"></i> Other properties</span>
              <span class="fe-pill-sub">Разширение на файла, Автор, Тагове, Рейтинг</span>
            </div>
          </div>
        </div>
      `;

    case 'img-browser-vs-engine':
      return `
        <div class="iwi-steps-flow">
          <div class="step-card">
            <span class="step-num">1</span>
            <i class="fas fa-window-maximize step-ico text-blue-500"></i>
            <strong>Браузър (Клиент)</strong>
            <span>Chrome, Edge, Firefox</span>
          </div>
          <div class="step-arrow"><i class="fas fa-arrow-right"></i></div>
          <div class="step-card">
            <span class="step-num">2</span>
            <i class="fas fa-server step-ico text-emerald-500"></i>
            <strong>Търсачка</strong>
            <span>Google, Bing, Yahoo!</span>
          </div>
          <div class="step-arrow"><i class="fas fa-arrow-right"></i></div>
          <div class="step-card">
            <span class="step-num">3</span>
            <i class="fas fa-keyboard step-ico text-amber-500"></i>
            <strong>Заявка с оператори</strong>
            <span>site:mon.bg "ИТ"</span>
          </div>
          <div class="step-arrow"><i class="fas fa-arrow-right"></i></div>
          <div class="step-card">
            <span class="step-num">4</span>
            <i class="fas fa-list-check step-ico text-purple-500"></i>
            <strong>Резултати (SERP)</strong>
            <span>Индексирани страници</span>
          </div>
        </div>
      `;

    case 'img-operators-cheatsheet':
      return `
        <div class="iwi-operators-grid">
          <div class="op-chip"><span class="op-symbol">"точна фраза"</span> <span>Търси думите в точен ред без разместване</span> <code>"безопасен интернет"</code></div>
          <div class="op-chip"><span class="op-symbol">-изключване</span> <span>Премахва страници със съответната дума</span> <code>Левски -футбол</code></div>
          <div class="op-chip"><span class="op-symbol">OR</span> <span>Намира страници с поне една от думите</span> <code>ученик OR ученичка</code></div>
          <div class="op-chip"><span class="op-symbol">site:</span> <span>Ограничава търсенето в конкретен уебсайт</span> <code>site:mon.bg информатика</code></div>
          <div class="op-chip"><span class="op-symbol">filetype:</span> <span>Търси само конкретен формат файлове</span> <code>filetype:pdf соларна енергия</code></div>
        </div>
      `;

    case 'img-credibility-grid':
      return `
        <div class="iwi-credibility-grid">
          <div class="cred-box"><span class="cred-num">1</span> <strong>Автор</strong> <span>Посочен експерт/журналист</span></div>
          <div class="cred-box"><span class="cred-num">2</span> <strong>Източник / Домейн</strong> <span>.gov.bg, .edu, официални институции</span></div>
          <div class="cred-box"><span class="cred-num">3</span> <strong>Дата</strong> <span>Дата на публикация или ъпдейт</span></div>
          <div class="cred-box"><span class="cred-num">4</span> <strong>Цел</strong> <span>Обективност без сензации („ШОК“)</span></div>
          <div class="cred-box"><span class="cred-num">5</span> <strong>Доказателства</strong> <span>Цитирани изследвания и факти</span></div>
          <div class="cred-box"><span class="cred-num">6</span> <strong>Съпоставка</strong> <span>Потвърждение от 2-ри източник</span></div>
        </div>
      `;

    case 'img-workbook-page8':
      return `
        <div class="iwi-workbook-mock">
          <div class="wb-header-bar"><i class="fas fa-book-open"></i> Учебна тетрадка по ИТ за 8. клас — Стр. 8 (Урок 3)</div>
          <div class="wb-tasks-overview">
            <span class="wb-task-badge"><i class="fas fa-check"></i> Задача 1: Дефиниции (Ключови думи, Заявка, Поле)</span>
            <span class="wb-task-badge"><i class="fas fa-check"></i> Задача 2: Попълване (Търсещи машини, Метатърсачки, Клиент)</span>
            <span class="wb-task-badge"><i class="fas fa-check"></i> Задача 3: Филтри (Date Modified, Size, Kind, Other)</span>
            <span class="wb-task-badge"><i class="fas fa-check"></i> Задача 4: Тест Да/Не (Оператори AND/OR, Ограничения)</span>
          </div>
        </div>
      `;

    case 'windows11-search-comparison-image':
    default:
      return `
        <div class="iwi-win11-preview-grid">
          <div class="iwi-taskbar-preview">
            <div class="iwi-preview-title"><i class="fas fa-magnifying-glass"></i> Taskbar Search</div>
            <div class="iwi-tb-search-bar"><i class="fas fa-search"></i> <span>Notepad</span></div>
            <div class="iwi-tb-result-item"><i class="fas fa-note-sticky text-blue-500"></i> Notepad (App)</div>
            <div class="iwi-tb-sub">Търсене навсякъде в Windows 11</div>
          </div>
          <div class="iwi-explorer-preview">
            <div class="iwi-preview-title"><i class="fas fa-folder"></i> File Explorer с табове</div>
            <div class="iwi-tabs-bar">
              <span class="tab-item active"><i class="fas fa-folder-open"></i> Документи</span>
              <span class="tab-item"><i class="fas fa-file-pdf"></i> Проекти</span>
              <span class="tab-plus">+</span>
            </div>
            <div class="iwi-command-bar">
              <span class="cmd-pill"><i class="fas fa-filter"></i> Search options</span>
              <span class="cmd-pill"><i class="fas fa-sort"></i> Сортиране</span>
            </div>
            <div class="iwi-fe-sub">Търсене в конкретно устройство/папка</div>
          </div>
        </div>
      `;
  }
}

export function render(comp) {
  const id = comp.id || 'image-with-instruction';
  const title = comp.title || 'Илюстрация / Екранна снимка';
  const imgPath = comp.imagePath || comp.src || 'assets/images/placeholder.jpg';
  const instruction = comp.userUploadInstruction || comp.instruction || '';

  if (id === 'img-concept-map') {
    return `
      <div class="my-6 mb-8 text-center" id="${esc(id)}">
        ${imgPath && imgPath !== 'assets/images/placeholder.jpg' ? `
          <div class="inline-block overflow-hidden rounded-xl shadow-sm border border-slate-200 max-w-lg w-full mb-6">
            <img src="${esc(imgPath)}" alt="${esc(title)}" class="w-full h-auto max-h-[280px] object-contain block mx-auto p-1 bg-white" onerror="this.parentElement.style.display='none'" />
          </div>
        ` : `
          <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6">
            ${getMockIllustration(id)}
          </div>
        `}
      </div>
    `;
  }

  return `
    <div class="image-with-instruction-card" id="${esc(id)}">
      <div class="iwi-header">
        <span class="iwi-badge"><i class="fas fa-image"></i> ${esc(title)}</span>
        ${imgPath && imgPath !== 'assets/images/placeholder.jpg' ? `<span class="iwi-path-badge"><i class="fas fa-file-code"></i> ${esc(imgPath)}</span>` : ''}
      </div>

      <div class="iwi-preview-box">
        ${imgPath && imgPath !== 'assets/images/placeholder.jpg' ? `
          <div class="iwi-real-image-container">
            <img src="${esc(imgPath)}" alt="${esc(title)}" class="iwi-real-img" onerror="this.parentElement.style.display='none'; this.parentElement.nextElementSibling.style.display='block';" />
          </div>
          <div class="iwi-mock-illustration" style="display:none;">
            ${getMockIllustration(id)}
          </div>
        ` : `
          <div class="iwi-mock-illustration">
            ${getMockIllustration(id)}
          </div>
        `}
      </div>

      ${instruction ? `
        <div class="iwi-upload-instruction">
          <div class="iwi-instruction-header">
            <i class="fas fa-camera"></i>
            <span>РЕАЛЕН ПЛЕЙСХОЛДЪР ЗА ИЗОБРАЖЕНИЕ:</span>
          </div>
          <p class="iwi-instruction-text">${esc(instruction)}</p>
        </div>
      ` : ''}
    </div>
  `;
}

export function init(comp) {
  // No complex state needed for presentation
}

