function sanitizePath(src) {
  if (!src) return '';
  return src.replace(/^\[IMAGE_PLACEHOLDER:\s*/, '').replace(/\]$/, '').trim();
}

function renderImageOrPlaceholder(src, alt = '') {
  if (!src) return '';
  const cleanPath = sanitizePath(src);
  return `
    <div style="height: 240px; width: 100%; display: flex; align-items: center; justify-content: center; margin: 0.75rem 0; overflow: hidden; border-radius: 10px; background: rgba(0,0,0,0.02);">
      <img src="${src}" alt="${alt}" data-path="${cleanPath}" style="max-width: 100%; max-height: 100%; height: 240px; width: 100%; object-fit: contain; border-radius: 10px;" onerror="if(this.src.includes('cdn.jsdelivr.net')){this.src=this.src.replace('cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/','raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/');}else{this.onerror=null;this.parentElement.innerHTML='<div class=\\'image-placeholder-box\\' style=\\'background: var(--surface-alt, #f8fafc); border: 2px dashed #cbd5e1; border-radius: 10px; padding: 1.25rem 1rem; text-align: center; color: #64748b; height: 240px; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;\\'><i class=\\'fas fa-desktop\\' style=\\'font-size: 2rem; color: #94a3b8; margin-bottom: 0.35rem; display: block;\\'></i><strong style=\\'display: block; font-size: 0.85rem; color: #334155; font-family: monospace;\\'>' + this.getAttribute('data-path') + '</strong><span>' + (this.getAttribute('alt') || '') + '</span></div>';}" />
    </div>
  `;
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const id = comp.id || 'before-after-slider';
  const title = comp.title || 'Колко се е променил компютърът?';
  const beforeLabel = comp.beforeLabel || 'Преди';
  const beforeDesc = comp.beforeDescription || '';
  const afterLabel = comp.afterLabel || 'След';
  const afterDesc = comp.afterDescription || '';

  const hasImages = comp.beforeImage || comp.afterImage;

  if (hasImages) {
    return `
      <div class="interactive-slider-card" id="${id}" style="margin: 3rem 0; padding: 2rem; background: var(--surface-alt, #f8fafc); border-radius: 16px; border: 1px solid var(--border-color, #e2e8f0);">
        <div style="text-align: center; max-width: 700px; margin: 0 auto 1.75rem auto;">
          ${comp.badge ? `<span style="background: #fef2f2; color: #991b1b; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">${esc(comp.badge)}</span>` : ''}
          <h3 style="margin: 0.5rem 0 0.25rem 0; font-size: 1.6rem; color: var(--text-color);">${title}</h3>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; align-items: stretch;">
          <div style="background: var(--surface, #ffffff); border: 2px solid #ef4444; border-radius: 12px; padding: 1.5rem; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span style="background: #fef2f2; color: #991b1b; padding: 0.35rem 0.85rem; border-radius: 20px; font-weight: 700; font-size: 0.9rem; display: inline-block; margin-bottom: 0.5rem;">
                ${beforeLabel}
              </span>
              ${renderImageOrPlaceholder(comp.beforeImage, beforeLabel)}
            </div>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.95rem; color: var(--text-color); font-weight: 500; line-height: 1.5;">${beforeDesc}</p>
          </div>

          <div style="background: var(--surface, #ffffff); border: 2px solid #10b981; border-radius: 12px; padding: 1.5rem; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span style="background: #f0fdf4; color: #166534; padding: 0.35rem 0.85rem; border-radius: 20px; font-weight: 700; font-size: 0.9rem; display: inline-block; margin-bottom: 0.5rem;">
                ${afterLabel}
              </span>
              ${renderImageOrPlaceholder(comp.afterImage, afterLabel)}
            </div>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.95rem; color: var(--text-color); font-weight: 500; line-height: 1.5;">${afterDesc}</p>
          </div>
        </div>
      </div>
    `;
  }

  // Fallback to text search before-after slider
  return `
    <div class="interactive-slider-card" id="${id}">
      <div class="interactive-card-header">
        <div class="interactive-card-badge">
          <i class="fas fa-sliders"></i> <span>${title}</span>
        </div>
      </div>

      <div class="slider-comparison-box">
        <div class="slider-views-container">
          <div class="slider-side slider-side-before">
            <div class="slider-side-header">
              <span class="slider-badge badge-before"><i class="fas fa-search"></i> ${beforeLabel}</span>
            </div>
            <p class="slider-desc">${beforeDesc}</p>
          </div>

          <div class="slider-side slider-side-after">
            <div class="slider-side-header">
              <span class="slider-badge badge-after"><i class="fas fa-check"></i> ${afterLabel}</span>
            </div>
            <p class="slider-desc">${afterDesc}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function init(comp) {
  // Simple slider view
}
