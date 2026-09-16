function sanitizePath(src) {
  if (!src) return '';
  return src.replace(/^\[IMAGE_PLACEHOLDER:\s*/, '').replace(/\]$/, '').trim();
}

function renderMedia(item) {
  const cleanPath = sanitizePath(item.src || '');
  const rawFileName = cleanPath.split('/').pop();
  const label = item.alt || item.title || 'Изображение';
  const displayTitle = rawFileName && !label.includes(rawFileName) ? `${label} - ${rawFileName}` : label;
  return `<img src="${item.src}" alt="${displayTitle}" data-path="${cleanPath}" style="width: 100%; height: 100%; object-fit: cover;" onerror="if(this.src.includes('cdn.jsdelivr.net')){this.src=this.src.replace('cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/','raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/');}else{this.onerror=null;this.parentElement.innerHTML='<div class=\\'gallery-placeholder\\'><i class=\\'fas fa-image\\'></i><strong style=\\'font-family: monospace;\\'>' + this.getAttribute('data-path') + '</strong><span>' + (this.getAttribute('alt') || '') + '</span></div>';}" />`;
}

export function render(comp) {
  const itemsHtml = comp.items.map(item => `
    <div class="gallery-item" style="display: flex; flex-direction: column; background: var(--surface); border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <div style="height: 200px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; overflow: hidden;">
        ${renderMedia(item)}
      </div>
      <div style="padding: 0.75rem; text-align: center;">
        <span style="font-weight: 500; font-size: 0.95rem; color: var(--text-color);">${item.title}</span>
      </div>
    </div>
  `).join('');

  return `
    <div id="${comp.id}" class="image-gallery-container" style="margin: 2rem 0;">
      ${comp.title ? `<h3 style="margin-bottom: 1rem;">${comp.title}</h3>` : ''}
      <div class="gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        ${itemsHtml}
      </div>
    </div>
  `;
}
