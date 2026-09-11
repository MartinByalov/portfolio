// Interactive Step Guide & Cloud Drive Simulator component
// Guides students step-by-step through uploading and sharing 'query.docx'

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const id = comp.id || 'interactive-step-guide';
  const title = comp.title || 'Интерактивна стъпка по стъпка задача';
  const steps = comp.steps || [];
  const checkOptions = comp.checkOptions || [];
  const correctIdx = comp.correctIndex != null ? comp.correctIndex : 1;

  const stepList = steps.map((st, idx) => `
    <label class="step-check-item" data-step-index="${idx}">
      <input type="checkbox" class="step-checkbox">
      <span class="step-custom-box"><i class="fas fa-check"></i></span>
      <span class="step-text-label">${esc(st)}</span>
    </label>
  `).join('');

  const optionList = checkOptions.map((opt, idx) => `
    <label class="check-q-opt">
      <input type="radio" name="${id}-question" value="${idx}">
      <span class="opt-label-text">${esc(opt)}</span>
    </label>
  `).join('');

  return `
    <div class="interactive-step-guide-card" id="${id}">
      <div class="interactive-card-header">
        <div class="interactive-card-badge">
          <i class="fas fa-cloud-arrow-up"></i>
          <span>${esc(title)}</span>
        </div>
        <p class="interactive-card-lead">Следвайте стъпките, маркирайте всяка завършена стъпка и тествайте симулатора по-долу:</p>
      </div>

      <!-- Checklist & Progress -->
      <div class="step-progress-wrapper">
        <div class="step-progress-meta">
          <span>Напредък по стъпките:</span>
          <strong class="step-progress-counter">0 от ${steps.length} завършени</strong>
        </div>
        <div class="step-progress-track">
          <div class="step-progress-bar" style="width: 0%;"></div>
        </div>
      </div>

      <div class="steps-checklist-box">
        ${stepList}
      </div>

      <!-- Interactive Mini Simulator -->
      ${id === 'forms-building-simulator' || (comp.title && comp.title.includes('Google Forms')) ? `
        <div class="sim-forms-box">
          <div class="sim-forms-topbar">
            <span class="sim-forms-logo"><i class="fas fa-file-lines text-purple-600"></i> Google Forms · Интерактивен конструктор</span>
            <span class="sim-forms-status"><i class="fas fa-check-circle text-emerald-500"></i> Всички промени са запазени в Диск</span>
          </div>

          <div class="sim-forms-content">
            <div class="sim-forms-header-card">
              <h4 class="sim-forms-title">Тест по Информационни технологии - 8. клас</h4>
              <p class="sim-forms-desc">Проверка на знанията за компютърни системи, обработка на информация и метаданни.</p>
              <div class="sim-forms-meta-badges">
                <span class="badge-quiz-mode"><i class="fas fa-award"></i> Режим „Тест“: АКТИВЕН</span>
                <span class="badge-email-mode"><i class="fas fa-envelope"></i> Изисква се училищен имейл</span>
              </div>
            </div>

            <div class="sim-forms-actions-bar">
              <button type="button" class="btn-sim-load-questions">
                <i class="fas fa-file-import"></i> 1. Зареди 5-те въпроса от архива
              </button>
              <button type="button" class="btn-sim-send-form" style="display:none;">
                <i class="fas fa-paper-plane"></i> 2. Бутон „Изпрати“ (Копирай Short URL)
              </button>
            </div>

            <div class="sim-forms-preview-container" style="display:none;">
              <!-- Simulated loaded questions -->
              <div class="sim-q-item">
                <div class="sim-q-top">
                  <span class="sim-q-num">Въпрос 1 (Множествен избор)</span>
                  <span class="sim-q-pts">1 точка</span>
                </div>
                <p class="sim-q-title">Коя дейност представлява обработване на информация?</p>
                <div class="sim-q-choices">
                  <span class="sim-choice correct"><i class="fas fa-circle-dot text-purple-600"></i> Изчисляване на среден успех на учениците (Ключ)</span>
                  <span class="sim-choice"><i class="far fa-circle text-slate-400"></i> Запис на файл върху външен носител</span>
                </div>
              </div>

              <div class="sim-q-item">
                <div class="sim-q-top">
                  <span class="sim-q-num">Въпрос 2 (Квадратчета / Checkboxes)</span>
                  <span class="sim-q-pts">2 точки</span>
                </div>
                <p class="sim-q-title">Главни компоненти на съвременната компютърна система:</p>
                <div class="sim-q-choices">
                  <span class="sim-choice correct"><i class="fas fa-square-check text-purple-600"></i> Хардуер (Верен)</span>
                  <span class="sim-choice correct"><i class="fas fa-square-check text-purple-600"></i> Софтуер (Верен)</span>
                  <span class="sim-choice correct"><i class="fas fa-square-check text-purple-600"></i> Данни (Верен)</span>
                </div>
              </div>

              <div class="sim-q-item">
                <div class="sim-q-top">
                  <span class="sim-q-num">Въпрос 3 (Снимка 'photo_metadata.jpg')</span>
                  <span class="sim-q-pts">2 точки</span>
                </div>
                <p class="sim-q-title">Определете кой модул записва GPS координати в EXIF метаданните:</p>
                <div class="sim-q-img-badge"><i class="far fa-image text-purple-600"></i> photo_metadata.jpg (Прикачено)</div>
              </div>

              <div class="sim-q-item">
                <div class="sim-q-top">
                  <span class="sim-q-num">Въпрос 4 (Мрежа от квадратчета / Grid)</span>
                  <span class="sim-q-pts">3 точки</span>
                </div>
                <p class="sim-q-title">Съпоставете устройствата (Аритмометър, ABC, ENIAC) с техните белези.</p>
              </div>

              <div class="sim-q-item">
                <div class="sim-q-top">
                  <span class="sim-q-num">Въпрос 5 (Линейна скала 1-5)</span>
                  <span class="sim-q-pts">0 точки</span>
                </div>
                <p class="sim-q-title">Самооценка: Как се справихте с решаването на теста? (1: Трудно ➔ 5: Отлично)</p>
              </div>
            </div>

            <!-- Mini Send Link Modal -->
            <div class="sim-forms-send-modal" style="display:none;">
              <div class="sim-modal-box">
                <div class="sim-modal-header">
                  <h6><i class="fas fa-link text-purple-600"></i> Споделяне на формуляра за попълване</h6>
                  <button type="button" class="sim-modal-close">&times;</button>
                </div>
                <div class="sim-modal-body">
                  <label class="text-xs text-slate-600 font-semibold mb-1 block">Скъсена връзка (Short URL):</label>
                  <div class="sim-link-copy-row">
                    <input type="text" class="sim-copy-input" value="https://forms.gle/IT8ClassTest2026" readonly>
                    <button type="button" class="btn-activity sim-btn-copy-url">
                      <i class="fas fa-copy"></i> Копирай
                    </button>
                  </div>
                  <div class="sim-copy-status" style="display:none;">
                    <i class="fas fa-circle-check text-emerald-500"></i> Връзката е копирана в клипборда! Готови сте за взаимно тестване с друг екип.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      ` : `
        <!-- Interactive Mini Cloud Simulator -->
        <div class="sim-drive-box">
          <div class="sim-drive-topbar">
            <span class="sim-drive-logo"><i class="fab fa-google-drive text-amber-500"></i> Google Drive · Симулатор</span>
            <span class="sim-drive-location"><i class="fas fa-folder text-amber-400"></i> Моят диск (My Drive)</span>
          </div>
          <div class="sim-drive-content">
            <div class="sim-drive-actions">
              <button type="button" class="btn-sim-upload">
                <i class="fas fa-file-arrow-up"></i> 1. Симулирай качване на 'query.docx'
              </button>
              <div class="sim-upload-status" style="display:none;">
                <div class="sim-upload-spinner"></div>
                <span>Качване на 'query.docx'...</span>
              </div>
            </div>

            <div class="sim-drive-files-area">
              <div class="sim-drive-empty">
                <i class="fas fa-cloud-arrow-up"></i>
                <span>Все още няма качени файлове. Натиснете бутона „Симулирай качване“.</span>
              </div>
              <div class="sim-file-item" style="display:none;">
                <div class="sim-file-info">
                  <i class="fas fa-file-word text-blue-600"></i>
                  <strong>query.docx</strong>
                  <span class="sim-file-badge">Качен току-що</span>
                </div>
                <button type="button" class="btn-sim-share">
                  <i class="fas fa-user-plus"></i> Споделяне (Share)
                </button>
              </div>
            </div>

            <!-- Mini Modal for Sharing inside simulator -->
            <div class="sim-share-popup" style="display:none;">
              <div class="sim-share-header">
                <h6><i class="fas fa-share-nodes"></i> Споделяне на „query.docx“</h6>
                <button type="button" class="sim-share-close">&times;</button>
              </div>
              <div class="sim-share-body">
                <div class="sim-form-group">
                  <label>Добавяне на хора или групи:</label>
                  <input type="text" class="sim-input-email" value="uchitel_it8@school.bg" readonly>
                </div>
                <div class="sim-form-group">
                  <label>Право за достъп:</label>
                  <select class="sim-select-role">
                    <option value="viewer" selected>Преглед (Viewer)</option>
                    <option value="commenter">Коментар (Commenter)</option>
                    <option value="editor">Редактиране (Editor)</option>
                  </select>
                </div>
                <button type="button" class="btn-activity sim-share-confirm">
                  <i class="fas fa-check"></i> Изпрати споделянето
                </button>
                <div class="sim-share-alert" style="display:none;"></div>
              </div>
            </div>
          </div>
        </div>
      `}

      <!-- Verification Question -->
      ${comp.checkQuestion ? `
        <div class="step-check-question-card">
          <div class="check-q-header">
            <i class="fas fa-circle-question"></i>
            <h5>Проверка на разбирането:</h5>
          </div>
          <p class="check-q-prompt">${esc(comp.checkQuestion)}</p>
          <div class="check-q-options" data-correct="${correctIdx}">
            ${optionList}
          </div>
          <div class="check-q-actions">
            <button type="button" class="btn-activity check-q-submit">
              <i class="fas fa-check"></i> Провери въпроса
            </button>
          </div>
          <div class="check-q-result" style="display:none;"></div>
        </div>
      ` : ''}
    </div>
  `;
}

export function init(comp) {
  const id = comp.id || 'interactive-step-guide';
  const root = document.getElementById(id);
  if (!root) return;

  const totalSteps = (comp.steps || []).length;
  const checkboxes = root.querySelectorAll('.step-checkbox');
  const counter = root.querySelector('.step-progress-counter');
  const progressBar = root.querySelector('.step-progress-bar');

  const updateProgress = () => {
    let count = 0;
    checkboxes.forEach(cb => { if (cb.checked) count++; });
    if (counter) counter.textContent = `${count} от ${totalSteps} завършени`;
    if (progressBar) {
      const pct = totalSteps > 0 ? Math.round((count / totalSteps) * 100) : 0;
      progressBar.style.width = pct + '%';
    }
  };

  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const label = cb.closest('.step-check-item');
      if (label) {
        if (cb.checked) label.classList.add('step-completed');
        else label.classList.remove('step-completed');
      }
      updateProgress();
    });
  });

  // Simulator controls
  const btnUpload = root.querySelector('.btn-sim-upload');
  const uploadStatus = root.querySelector('.sim-upload-status');
  const emptyState = root.querySelector('.sim-drive-empty');
  const fileItem = root.querySelector('.sim-file-item');
  const btnShare = root.querySelector('.btn-sim-share');
  const sharePopup = root.querySelector('.sim-share-popup');
  const shareClose = root.querySelector('.sim-share-close');
  const shareConfirm = root.querySelector('.sim-share-confirm');
  const shareAlert = root.querySelector('.sim-share-alert');
  const selectRole = root.querySelector('.sim-select-role');

  if (btnUpload && uploadStatus && emptyState && fileItem) {
    btnUpload.addEventListener('click', () => {
      btnUpload.disabled = true;
      uploadStatus.style.display = 'inline-flex';
      setTimeout(() => {
        uploadStatus.style.display = 'none';
        emptyState.style.display = 'none';
        fileItem.style.display = 'flex';
        btnUpload.innerHTML = '<i class="fas fa-check"></i> Файлът е качен успешно в Диск';
        btnUpload.classList.add('btn-uploaded');
      }, 900);
    });
  }

  if (btnShare && sharePopup) {
    btnShare.addEventListener('click', () => {
      sharePopup.style.display = 'block';
    });
  }

  if (shareClose && sharePopup) {
    shareClose.addEventListener('click', () => {
      sharePopup.style.display = 'none';
    });
  }

  if (shareConfirm && selectRole && shareAlert) {
    shareConfirm.addEventListener('click', () => {
      const role = selectRole.value;
      if (role === 'viewer') {
        shareAlert.innerHTML = '<i class="fas fa-circle-check"></i> Отлично! Файлът е споделен с учителя само за <strong>Преглед (Viewer)</strong>. Това гарантира, че оригиналната ви работа няма да бъде редактирана по невнимание.';
        shareAlert.className = 'sim-share-alert alert-success';
      } else if (role === 'editor') {
        shareAlert.innerHTML = '<i class="fas fa-triangle-exclamation"></i> Внимание: Правото <strong>Редактиране</strong> позволява на получателя да трие и променя текста. За предаване на оценка е по-подходящо <strong>Преглед</strong>.';
        shareAlert.className = 'sim-share-alert alert-warning';
      } else {
        shareAlert.innerHTML = '<i class="fas fa-info-circle"></i> Зададено е право <strong>Коментар</strong>.';
        shareAlert.className = 'sim-share-alert alert-info';
      }
      shareAlert.style.display = 'block';
    });
  }

  // Google Forms simulator controls
  const btnLoadQ = root.querySelector('.btn-sim-load-questions');
  const btnSendForm = root.querySelector('.btn-sim-send-form');
  const formsPreview = root.querySelector('.sim-forms-preview-container');
  const sendModal = root.querySelector('.sim-forms-send-modal');
  const modalClose = root.querySelector('.sim-modal-close');
  const btnCopyUrl = root.querySelector('.sim-btn-copy-url');
  const copyStatus = root.querySelector('.sim-copy-status');

  if (btnLoadQ && formsPreview && btnSendForm) {
    btnLoadQ.addEventListener('click', () => {
      btnLoadQ.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Зареждане на въпросите...';
      btnLoadQ.disabled = true;
      setTimeout(() => {
        btnLoadQ.innerHTML = '<i class="fas fa-check"></i> Въпросите са заредени!';
        btnLoadQ.classList.add('bg-emerald-600');
        formsPreview.style.display = 'block';
        btnSendForm.style.display = 'inline-flex';
      }, 500);
    });
  }

  if (btnSendForm && sendModal) {
    btnSendForm.addEventListener('click', () => {
      sendModal.style.display = 'flex';
    });
  }

  if (modalClose && sendModal) {
    modalClose.addEventListener('click', () => {
      sendModal.style.display = 'none';
    });
  }

  if (btnCopyUrl && copyStatus) {
    btnCopyUrl.addEventListener('click', () => {
      btnCopyUrl.innerHTML = '<i class="fas fa-check"></i> Копирано!';
      copyStatus.style.display = 'block';
      setTimeout(() => {
        btnCopyUrl.innerHTML = '<i class="fas fa-copy"></i> Копирай';
      }, 3000);
    });
  }

  // Question verification
  const qSubmit = root.querySelector('.check-q-submit');
  const qResult = root.querySelector('.check-q-result');
  const qOptionsWrap = root.querySelector('.check-q-options');

  if (qSubmit && qResult && qOptionsWrap) {
    const correctVal = String(qOptionsWrap.getAttribute('data-correct'));
    qSubmit.addEventListener('click', () => {
      const checked = qOptionsWrap.querySelector('input[type="radio"]:checked');
      if (!checked) {
        qResult.innerHTML = '<i class="fas fa-circle-exclamation"></i> Моля, маркирайте един от възможните отговори!';
        qResult.className = 'check-q-result result-error';
        qResult.style.display = 'block';
        return;
      }

      if (checked.value === correctVal) {
        const customSuccess = comp.checkExplanation || (id === 'forms-building-simulator'
          ? 'Точен отговор! „Мрежа от квадратчета“ (Checkbox grid) или „Множествен избор“ позволява съпоставяне на редове и колони (устройства с техни параметри).'
          : 'Точен отговор! Правото „Преглед (Viewer)“ е правилното решение за предаване на завършена задача.');
        qResult.innerHTML = `<i class="fas fa-circle-check"></i> ${customSuccess}`;
        qResult.className = 'check-q-result result-success';
      } else {
        const customError = id === 'forms-building-simulator'
          ? 'Не съвсем. За таблично съпоставяне на устройства и характеристики в Google Forms се избира „Мрежа от квадратчета / Множествен избор“ (Grid).'
          : 'Не съвсем. Проверете внимателно условието и опитайте отново.';
        qResult.innerHTML = `<i class="fas fa-circle-xmark"></i> ${customError}`;
        qResult.className = 'check-q-result result-error';
      }
      qResult.style.display = 'block';
    });
  }
}
