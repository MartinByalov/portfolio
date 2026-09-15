// System Anatomy Map - Interactive Hardware Components & Characteristics Explorer
// Layout:
// 1. Top: Hardware selection buttons arranged in a structured table/grid
// 2. Middle Left: Image preview container
// 3. Middle Right: Function and role in the computer system
// 4. Bottom Horizontal: Key hardware selection characteristics & parameters

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function sanitizePath(src) {
  if (!src) return '';
  return src.replace(/^\[IMAGE_PLACEHOLDER:\s*/, '').replace(/\]$/, '').trim();
}

function renderHardwareImage(src, alt = '', caption = '') {
  if (!src) return '';
  const cleanPath = sanitizePath(src);

  return `
    <div class="sam-img-container">
      <div class="sam-img-frame">
        <img
          src="${esc(src)}"
          alt="${esc(alt || caption)}"
          data-path="${esc(cleanPath)}"
          class="sam-component-photo"
          onerror="if(this.src.includes('cdn.jsdelivr.net')){this.src=this.src.replace('cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/','raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/');}else{this.onerror=null;this.outerHTML='<div class=\\'sam-image-fallback\\'><i class=\\'fas fa-microchip\\'></i><strong>' + this.getAttribute('data-path') + '</strong><span>' + (this.getAttribute('alt') || '') + '</span></div>';}"
        />
      </div>
      ${caption ? `
        <div class="sam-img-caption">
          <span>${esc(caption)}</span>
        </div>
      ` : ''}
    </div>
  `;
}

function renderComponentView(part) {
  const accentColor = part.color || '#0284c7';
  const characteristics = part.characteristics || [];

  return `
    <div class="sam-viewer-wrapper" style="--comp-accent: ${esc(accentColor)}">
      <!-- 1. Top Section (Split Row): Left Image Window + Right Function & Role -->
      <div class="sam-middle-row">
        <!-- Left: Image Display Window -->
        <div class="sam-viewer-media">
          ${renderHardwareImage(part.image, part.label, part.imageCaption || part.label)}
        </div>

        <!-- Right: Function & Role in System -->
        <div class="sam-viewer-role-pane">
          <div class="sam-viewer-header">
            <div class="sam-viewer-avatar">
              <i class="${esc(part.icon || 'fas fa-microchip')}"></i>
            </div>
            <div class="sam-viewer-title-group">
              <span class="sam-viewer-type-badge">${esc(part.type || 'Хардуерен компонент')}</span>
              <h4 class="sam-viewer-heading">${esc(part.label)}</h4>
            </div>
          </div>

          <div class="sam-role-content-box">
            <div class="sam-box-label">
              <i class="fas fa-circle-info"></i> Функция и роля в системата:
            </div>
            <p class="sam-role-paragraph">${esc(part.role || '')}</p>
          </div>

          ${part.connection ? `
            <div class="sam-conn-content-box">
              <div class="sam-box-label">
                <i class="fas fa-link"></i> Свързаност и интерфейс:
              </div>
              <p class="sam-conn-paragraph">${esc(part.connection)}</p>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- 2. Bottom Section: Key Characteristics & Selection Parameters (Horizontal Span) -->
      <div class="sam-bottom-characteristics">
        <div class="sam-char-header">
          <div class="sam-char-title">
            <i class="fas fa-sliders"></i> Характеристики: Ключови параметри при избор
          </div>
        </div>

        ${characteristics.length > 0 ? `
          <div class="sam-characteristics-grid">
            ${characteristics.map(c => `
              <div class="sam-char-card">
                <div class="sam-char-card-header">
                  <span class="sam-char-bullet"><i class="fas fa-check-circle"></i></span>
                  <strong class="sam-char-name">${esc(c.name)}</strong>
                </div>
                <p class="sam-char-desc">${esc(c.desc)}</p>
              </div>
            `).join('')}
          </div>
        ` : `
          <p class="sam-char-fallback">${esc(part.question || '')}</p>
        `}
      </div>
    </div>
  `;
}

export function render(comp) {
  const parts = comp.parts || [];
  const first = parts[0] || {};

  return `
    <section class="system-anatomy-map" id="${esc(comp.id)}">
      <div class="sam-header">
        <h3>${esc(comp.title)}</h3>
        ${comp.instruction ? `<p>${esc(comp.instruction)}</p>` : ''}
      </div>

      <!-- Top Table / Grid of Hardware Selection Buttons -->
      <div class="sam-buttons-table-wrap" role="tablist" aria-label="Хардуерни компоненти">
        <div class="sam-buttons-table">
          ${parts.map((p, idx) => `
            <button
              type="button"
              class="sam-table-btn ${idx === 0 ? 'active' : ''}"
              data-index="${idx}"
              style="--btn-accent: ${esc(p.color || '#0284c7')}"
              role="tab"
              aria-selected="${idx === 0 ? 'true' : 'false'}"
            >
              <div class="sam-btn-icon"><i class="${esc(p.icon || 'fas fa-cube')}"></i></div>
              <div class="sam-btn-content">
                <span class="sam-btn-title">${esc(p.label)}</span>
                <span class="sam-btn-subtitle">${esc(p.type || 'Компонент')}</span>
              </div>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Main Display Viewport (Image Left, Role Right, Specs Bottom) -->
      <div class="sam-display-viewport" id="${esc(comp.id)}-viewport">
        ${renderComponentView(first)}
      </div>
    </section>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id);
  const parts = comp.parts || [];
  if (!root) return;

  const viewport = root.querySelector(`#${comp.id}-viewport`);
  const buttons = root.querySelectorAll('.sam-table-btn');

  function selectPart(index) {
    const part = parts[index];
    if (!part || !viewport) return;

    buttons.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === index);
      btn.setAttribute('aria-selected', idx === index ? 'true' : 'false');
    });

    viewport.innerHTML = renderComponentView(part);
  }

  buttons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      selectPart(idx);
    });
  });
}
