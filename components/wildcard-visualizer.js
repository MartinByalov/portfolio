// Wildcard Visualizer Component (* and ?)
// Interactive component explaining wildcards in Windows 11 with live pattern tester

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const id = comp.id || 'wildcard-visualizer';
  const title = comp.title || 'Глобални символи при търсене (* и ?) в Windows 11';
  const symbols = comp.symbols || [];

  const cardsHtml = symbols.map((item, idx) => {
    const examples = (item.examples || []).map(ex => `<li><code>${esc(ex)}</code></li>`).join('');
    return `
      <div class="wildcard-card" style="border-top-color: ${esc(item.color || '#3B82F6')}">
        <div class="wildcard-header">
          <span class="wildcard-symbol-badge" style="background: ${esc(item.color || '#3B82F6')}">${esc(item.symbol)}</span>
        </div>
        <p class="wildcard-rule">${esc(item.rule)}</p>
        <div class="wildcard-examples-box">
          <span class="wildcard-examples-title"><i class="fas fa-terminal"></i> Примери:</span>
          <ul class="wildcard-examples-list">${examples}</ul>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="interactive-wildcard-card" id="${esc(id)}">
      <div class="interactive-card-header">
        <div class="interactive-card-badge">
          <i class="fas fa-asterisk"></i>
          <span>${esc(title)}</span>
        </div>
      </div>
      <div class="wildcard-grid">
        ${cardsHtml}
      </div>
      <div class="wildcard-tester-box">
        <div class="wildcard-tester-header">
          <i class="fas fa-vial"></i> <strong>Интерактивен тест:</strong> Изпробвайте маска за търсене
        </div>
        <div class="wildcard-tester-controls">
          <div class="wildcard-input-wrap">
            <label>Маска за търсене:</label>
            <input type="text" class="wildcard-pattern-input" value="*.jpg" placeholder="напр. *.jpg, photo?.jpg, project*">
          </div>
          <div class="wildcard-input-wrap">
            <label>Име на тестов файл:</label>
            <input type="text" class="wildcard-test-filename" value="photo1.jpg" placeholder="напр. photo1.jpg, report.docx">
          </div>
          <button type="button" class="btn-activity wildcard-check-btn">Тествай съвпадение</button>
        </div>
        <div class="wildcard-presets">
          <span class="presets-label">Бързи примери:</span>
          <button type="button" class="wildcard-chip" data-p="*.jpg" data-f="nature.jpg">*.jpg ➔ nature.jpg (Да)</button>
          <button type="button" class="wildcard-chip" data-p="photo?.jpg" data-f="photo1.jpg">photo?.jpg ➔ photo1.jpg (Да)</button>
          <button type="button" class="wildcard-chip" data-p="photo?.jpg" data-f="photo10.jpg">photo?.jpg ➔ photo10.jpg (Не)</button>
          <button type="button" class="wildcard-chip" data-p="*report*.docx" data-f="final_report_v2.docx">*report*.docx ➔ final_report_v2.docx (Да)</button>
        </div>
        <div class="wildcard-tester-result" style="display:none;"></div>
      </div>
    </div>
  `;
}

function wildcardMatch(pattern, text) {
  const regexStr = '^' + pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.') + '$';
  try {
    const regex = new RegExp(regexStr, 'i');
    return regex.test(text);
  } catch (e) {
    return false;
  }
}

export function init(comp) {
  const id = comp.id || 'wildcard-visualizer';
  const root = document.getElementById(id);
  if (!root) return;

  const patternInput = root.querySelector('.wildcard-pattern-input');
  const filenameInput = root.querySelector('.wildcard-test-filename');
  const checkBtn = root.querySelector('.wildcard-check-btn');
  const resultBox = root.querySelector('.wildcard-tester-result');
  const chips = root.querySelectorAll('.wildcard-chip');

  function runTest() {
    if (!patternInput || !filenameInput || !resultBox) return;
    const pat = patternInput.value.trim();
    const file = filenameInput.value.trim();
    if (!pat || !file) {
      resultBox.innerHTML = '<i class="fas fa-circle-exclamation"></i> Моля, въведете маска и име на файл.';
      resultBox.className = 'wildcard-tester-result result-error';
      resultBox.style.display = 'block';
      return;
    }

    const matches = wildcardMatch(pat, file);
    if (matches) {
      resultBox.innerHTML = `<i class="fas fa-circle-check"></i> <strong>СЪВПАДЕНИЕ!</strong> Файлът <code>${esc(file)}</code> <strong>ще бъде намерен</strong> от маската <code>${esc(pat)}</code>.`;
      resultBox.className = 'wildcard-tester-result result-success';
    } else {
      resultBox.innerHTML = `<i class="fas fa-circle-xmark"></i> <strong>НЯМА СЪВПАДЕНИЕ!</strong> Файлът <code>${esc(file)}</code> <strong>НЕ отговаря</strong> на маската <code>${esc(pat)}</code>.`;
      resultBox.className = 'wildcard-tester-result result-error';
    }
    resultBox.style.display = 'block';
  }

  if (checkBtn) checkBtn.addEventListener('click', runTest);
  if (patternInput) patternInput.addEventListener('keydown', e => { if (e.key === 'Enter') runTest(); });
  if (filenameInput) filenameInput.addEventListener('keydown', e => { if (e.key === 'Enter') runTest(); });

  chips.forEach(c => {
    c.addEventListener('click', () => {
      if (patternInput) patternInput.value = c.dataset.p || '';
      if (filenameInput) filenameInput.value = c.dataset.f || '';
      runTest();
    });
  });
}
