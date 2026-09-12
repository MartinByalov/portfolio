// Before-After Slider Component
// Compares broad search vs exact phrase matching with quotes

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const id = comp.id || 'before-after-slider';
  const title = comp.title || 'Плъзгач „Преди и След“: Обикновено търсене vs Точна фраза в кавички';
  const beforeLabel = comp.beforeLabel || 'Без кавички: безопасен интернет';
  const beforeDesc = comp.beforeDescription || 'Намира над 15 000 000 резултата, съдържащи думите разпръснати на различни места в текста.';
  const afterLabel = comp.afterLabel || 'С кавички: "безопасен интернет"';
  const afterDesc = comp.afterDescription || 'Стеснява резултатите точно до страниците, в които двете думи се срещат една след друга като точен израз.';

  return `
    <div class="interactive-slider-card" id="${esc(id)}">
      <div class="interactive-card-header">
        <div class="interactive-card-badge">
          <i class="fas fa-sliders"></i>
          <span>${esc(title)}</span>
        </div>
      </div>

      <div class="slider-comparison-box">
        <div class="slider-views-container">
          <div class="slider-side slider-side-before">
            <div class="slider-side-header">
              <span class="slider-badge badge-before"><i class="fas fa-search"></i> Без кавички</span>
              <code class="slider-query">безопасен интернет</code>
            </div>
            <div class="slider-metrics-box">
              <div class="metric-number text-slate-600">~15 400 000</div>
              <div class="metric-label">общи намерени резултата</div>
            </div>
            <p class="slider-desc">${esc(beforeDesc)}</p>
            <div class="sample-search-result">
              <div class="sr-url">https://news.bg/tech/tips</div>
              <div class="sr-title">Съвети за работа в <strong>интернет</strong> и <strong>безопасен</strong> софтуер...</div>
              <div class="sr-snippet">Как да изберем <mark>безопасен</mark> антивирусен пакет при сваляне на файлове от <mark>интернет</mark>.</div>
            </div>
          </div>

          <div class="slider-side slider-side-after">
            <div class="slider-side-header">
              <span class="slider-badge badge-after"><i class="fas fa-quote-left"></i> С точни кавички</span>
              <code class="slider-query">"безопасен интернет"</code>
            </div>
            <div class="slider-metrics-box">
              <div class="metric-number text-emerald-600">~84 200</div>
              <div class="metric-label">прецизни точни съвпадения</div>
            </div>
            <p class="slider-desc">${esc(afterDesc)}</p>
            <div class="sample-search-result result-highlighted">
              <div class="sr-url">https://safenet.bg/kids</div>
              <div class="sr-title">Национален център за <mark>„безопасен интернет“</mark></div>
              <div class="sr-snippet">Всички ресурси, правила и уроци за <mark>„безопасен интернет“</mark> за ученици и учители.</div>
            </div>
          </div>
        </div>

        <div class="slider-interactive-toggle">
          <div class="toggle-track">
            <button type="button" class="toggle-mode-btn active" data-mode="split">
              <i class="fas fa-columns"></i> Сравнение едно до друго
            </button>
            <button type="button" class="toggle-mode-btn" data-mode="before">
              <i class="fas fa-arrow-left"></i> Само без кавички
            </button>
            <button type="button" class="toggle-mode-btn" data-mode="after">
              <i class="fas fa-arrow-right"></i> Само с кавички
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function init(comp) {
  const id = comp.id || 'before-after-slider';
  const root = document.getElementById(id);
  if (!root) return;

  const container = root.querySelector('.slider-views-container');
  const btns = root.querySelectorAll('.toggle-mode-btn');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      btns.forEach(b => b.classList.toggle('active', b === btn));
      if (container) {
        container.className = 'slider-views-container mode-' + mode;
      }
    });
  });
}
