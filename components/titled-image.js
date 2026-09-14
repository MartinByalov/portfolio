function sanitizePath(src) {
  if (!src) return '';
  return src.replace(/^\[IMAGE_PLACEHOLDER:\s*/, '').replace(/\]$/, '').trim();
}

function renderImageOrPlaceholder(src, alt = '', caption = '') {
  if (!src) return '';
  const cleanPath = sanitizePath(src);
  
  return `
    <div class="titled-img-wrapper" style="position: relative; width: 100%;">
      <img src="${src}" alt="${alt || caption}" data-path="${cleanPath}" style="max-width: 100%; height: auto; display: block; border-radius: 12px; margin: 0 auto;" onerror="if(this.src.includes('cdn.jsdelivr.net')){this.src=this.src.replace('cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/','raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/');}else{this.onerror=null;this.outerHTML='<div class=\\'image-placeholder-box\\' style=\\'background: var(--surface-alt, #f8fafc); border: 2px dashed #cbd5e1; border-radius: 12px; padding: 2rem 1.5rem; text-align: center; color: #64748b; margin: 0.5rem auto;\\'><i class=\\'fas fa-image\\' style=\\'font-size: 2.5rem; color: #3b82f6; margin-bottom: 0.75rem; display: block;\\'></i><strong style=\\'display: block; font-size: 1rem; color: #1e293b; margin-bottom: 0.35rem; font-family: monospace;\\'>' + this.getAttribute('data-path') + '</strong><span>' + (this.getAttribute('alt') || '') + '</span></div>';}" />
    </div>
  `;
}

export function render(comp) {
  return `
    <div id="${comp.id}" class="titled-image-container" style="margin: 2rem 0; text-align: center;">
      <div style="background: var(--surface, #ffffff); border-radius: 12px; border: 1px solid var(--border-color, #e2e8f0); overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); display: inline-block; width: 100%;">
        ${renderImageOrPlaceholder(comp.src, comp.alt, comp.caption)}
        ${comp.caption ? `<div style="padding: 1rem; background: var(--surface-alt, #f8fafc); font-size: 0.95rem; color: var(--text-color); font-weight: 500; border-top: 1px solid #e2e8f0;">${comp.caption}</div>` : ''}
      </div>
    </div>
  `;
}
