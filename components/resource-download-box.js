// Resource Download Box component
// Displays downloadable exercise resource archives with file previews

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

function getFileIcon(filename) {
  if (/\.(docx|doc)$/i.test(filename)) return 'fa-file-word text-blue-600';
  if (/\.(xlsx|xls)$/i.test(filename)) return 'fa-file-excel text-emerald-600';
  if (/\.(pptx|ppt)$/i.test(filename)) return 'fa-file-powerpoint text-orange-600';
  if (/\.(jpg|jpeg|png|gif|webp)$/i.test(filename)) return 'fa-file-image text-purple-600';
  if (/\.(pdf)$/i.test(filename)) return 'fa-file-pdf text-red-600';
  if (/\.(zip|rar|7z)$/i.test(filename)) return 'fa-file-zipper text-amber-600';
  return 'fa-file-lines text-slate-600';
}

export function render(comp) {
  const id = comp.id || 'resource-download-box';
  const fileName = comp.archiveName || comp.fileName || 'test_inf.zip';
  const cardTitle = comp.title || ('Архив с учебни материали: ' + fileName);
  const cardDesc = comp.description || 'Пакетът съдържа форматиран документ със задачи и мултимедия.';
  const fileSize = comp.fileSize || '1.8 MB';
  
  const rawList = comp.files || comp.includedFiles || [
    { name: 'test-inf_questions.docx', type: 'word', desc: 'Списък със задачите и верните отговори' },
    { name: 'photo_metadata.jpg', type: 'image', desc: 'Снимка за въпрос №3' }
  ];

  const filesHtml = rawList.map((item) => {
    let name = typeof item === 'string' ? item.split('–')[0].split('-')[0].trim() : item.name;
    let desc = typeof item === 'string' ? item : (item.desc || item.name);
    const iconClass = getFileIcon(name);
    return `
      <li class="resource-file-item">
        <span class="file-icon"><i class="fas ${iconClass}"></i></span>
        <div class="file-info-col">
          <strong class="file-name">${esc(name)}</strong>
          <span class="file-desc">${esc(desc)}</span>
        </div>
      </li>
    `;
  }).join('');

  return `
    <div class="resource-download-card" id="${id}">
      <div class="resource-card-main">
        <div class="resource-meta-left">
          <div class="resource-zip-icon">
            <i class="fas fa-file-zipper"></i>
          </div>
          <div class="resource-info">
            <h4 class="resource-card-title">${esc(cardTitle)}</h4>
            <p class="resource-card-desc">${esc(cardDesc)}</p>
            <div class="resource-tags">
              <span class="resource-tag"><i class="fas fa-hard-drive"></i> ${esc(fileSize)}</span>
              <span class="resource-tag"><i class="fas fa-layer-group"></i> ${rawList.length} файла</span>
              <span class="resource-tag"><i class="fas fa-circle-check text-emerald-500"></i> Готов за сваляне</span>
            </div>
          </div>
        </div>
        <div class="resource-actions">
          <button type="button" class="btn-download-archive" data-filename="${esc(fileName)}">
            <i class="fas fa-download"></i> Изтегли архива (.ZIP)
          </button>
        </div>
      </div>

      <div class="resource-card-contents">
        <div class="contents-header">
          <i class="fas fa-folder-open text-amber-500"></i>
          <strong>Съдържание на ресурсния пакет:</strong>
        </div>
        <ul class="resource-files-list">
          ${filesHtml}
        </ul>
      </div>

      <!-- Quick preview trigger -->
      <div class="resource-preview-bar">
        <button type="button" class="btn-toggle-preview">
          <i class="fas fa-eye"></i> Преглед на въпросите от теста (test-inf_questions.docx)
        </button>
        <div class="resource-preview-drawer" style="display:none;">
          <div class="preview-drawer-header">
            <strong><i class="fas fa-file-word text-blue-600"></i> Текстов образец за въпросите в Google Forms:</strong>
          </div>
          <div class="preview-drawer-content">
            <div class="preview-q-card">
              <span class="q-badge">Въпрос 1 · Множествен избор (1 т.)</span>
              <p><strong>Коя от следните дейности представлява обработване на информация?</strong></p>
              <ul>
                <li>А) Търсене на статия в интернет</li>
                <li>Б) Запис на файл върху флашка</li>
                <li><strong>В) Изчисляване на среден успех на учениците (Верен отговор)</strong></li>
                <li>Г) Разпечатване на снимка на принтер</li>
              </ul>
            </div>
            <div class="preview-q-card">
              <span class="q-badge">Въпрос 2 · Квадратчета / Checkboxes (2 т.)</span>
              <p><strong>Кои са трите задължителни компонента на съвременната компютърна система?</strong></p>
              <ul>
                <li><strong>☑ Хардуер (Верен)</strong></li>
                <li><strong>☑ Софтуер (Верен)</strong></li>
                <li><strong>☑ Потребителски данни (Верен)</strong></li>
                <li>☐ Оптичен микроскоп</li>
              </ul>
            </div>
            <div class="preview-q-card">
              <span class="q-badge">Въпрос 3 · Изображение + Кратък отговор (2 т.)</span>
              <p><strong>След преглед на приложената снимка 'photo_metadata.jpg', посочете кой сензор записва координатите (географска ширина и дължина) в EXIF метаданните?</strong></p>
              <p class="text-xs text-slate-500">Ключ за верен отговор: GPS / GPS приемник</p>
            </div>
          </div>
        </div>
      </div>
      <div class="resource-download-alert" style="display:none;"></div>
    </div>
  `;
}

export function init(comp) {
  const id = comp.id || 'resource-download-box';
  const root = document.getElementById(id);
  if (!root) return;

  const downloadBtn = root.querySelector('.btn-download-archive');
  const previewBtn = root.querySelector('.btn-toggle-preview');
  const drawer = root.querySelector('.resource-preview-drawer');
  const alertBox = root.querySelector('.resource-download-alert');

  if (downloadBtn && alertBox) {
    downloadBtn.addEventListener('click', () => {
      const fileName = downloadBtn.getAttribute('data-filename') || 'Ресурсни_файлове_IT_8клас.zip';
      // Simulate file download trigger
      downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Подготовка на архива...';
      downloadBtn.disabled = true;

      setTimeout(() => {
        downloadBtn.innerHTML = '<i class="fas fa-circle-check"></i> Изтеглен!';
        downloadBtn.classList.add('download-complete');
        alertBox.innerHTML = `<i class="fas fa-circle-check text-emerald-600"></i> Пакетът <strong>${esc(fileName)}</strong> е подготвен успешно. Можете да отворите файла в папката 'Изтеглени файлове' (Downloads) на вашия компютър и да разархивирате материалите.`;
        alertBox.className = 'resource-download-alert alert-success';
        alertBox.style.display = 'block';

        setTimeout(() => {
          downloadBtn.disabled = false;
          downloadBtn.innerHTML = '<i class="fas fa-download"></i> Изтегли отново (.ZIP)';
        }, 3000);
      }, 700);
    });
  }

  if (previewBtn && drawer) {
    previewBtn.addEventListener('click', () => {
      const isOpen = drawer.style.display !== 'none';
      drawer.style.display = isOpen ? 'none' : 'block';
      previewBtn.innerHTML = isOpen
        ? '<i class="fas fa-eye"></i> Преглед на въпросите от теста (test-inf_questions.docx)'
        : '<i class="fas fa-eye-slash"></i> Скрий предварителния преглед';
    });
  }
}
