function renderMedia(item) {
  if ((item.src || '').includes('IMAGE_PLACEHOLDER')) {
    const filename = item.src.replace(/^\[IMAGE_PLACEHOLDER:\s*/, '').replace(/\]$/, '').trim();
    return `<div class="gallery-placeholder"><i class="fas fa-image"></i><strong>[IMAGE_PLACEHOLDER: ${filename}]</strong><span>${item.alt || ''}</span></div>`;
  }
  return `<img src="${item.src}" alt="${item.alt}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\'><rect width=\\'100%\\' height=\\'100%\\' fill=\\'%23e5e7eb\\'/><text x=\\'50%\\' y=\\'50%\\' font-family=\\'sans-serif\\' font-size=\\'14\\' fill=\\'%239ca3af\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'>Изображение</text></svg>'" />`;
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
