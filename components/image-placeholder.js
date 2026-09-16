// Image Placeholder Component
// Renders a placeholder for images that will be uploaded later

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const alt = comp.label || comp.alt || 'Изображение';
  const description = comp.description || '';
  const id = comp.id || '';
  const path = comp.src || comp.path || comp.fileName || '';
  const isMini = comp.size === 'mini' || comp.variant === 'mini' || comp.size === 'compact' || comp.variant === 'compact';
  const isFloat = comp.float === 'right' || comp.align === 'right';

  const rawFileName = path ? path.replace(/^https?:\/\/[^\/]+\/(?:[^\/]+\/)*assets\//, '').split('/').pop() : '';
  const displayTitle = rawFileName && !alt.includes(rawFileName) ? `${alt} - ${rawFileName}` : alt;

  if (isMini) {
    const wrapClass = isFloat ? 'lesson-media-float' : 'lesson-inline-media-wrap';
    const wrapStyle = isFloat ? '' : 'margin: 1rem 0; max-width: 260px;';
    return `
      <div class="${wrapClass}" ${id ? 'id="' + esc(id) + '"' : ''} ${wrapStyle ? 'style="' + wrapStyle + '"' : ''}>
        <div class="lesson-inline-media-card">
          ${path ? `<img src="${esc(path)}" alt="${esc(alt)}" loading="lazy" style="width: 100%; height: auto; max-height: 140px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0; display: block; margin-bottom: 8px;" onload="this.style.display='block'; if(this.nextElementSibling) this.nextElementSibling.style.display='none';" onerror="if(this.src.includes('cdn.jsdelivr.net')){this.src=this.src.replace('cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/','raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/');}else{this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';}" />` : ''}
          <div class="lesson-micro-placeholder-box" ${path ? 'style="display: none;"' : ''}>
            <span class="lesson-micro-badge"><i class="${esc(comp.icon || 'fas fa-image')}"></i> ${esc(comp.badge || 'Визуален детайл')}</span>
            <div class="lesson-micro-title">${esc(displayTitle)}</div>
            ${path ? `<div class="lesson-micro-path">${esc(path)}</div>` : ''}
          </div>
          ${description ? `<div class="lesson-micro-caption">${esc(description)}</div>` : ''}
        </div>
      </div>
    `;
  }

  if (path) {
    return `
      <div class="image-placeholder-container" ${id ? 'id="' + esc(id) + '"' : ''} style="margin: 1.5rem 0; text-align: center;">
        <img src="${esc(path)}" alt="${esc(alt)}" loading="lazy" style="max-width: 100%; height: auto; border-radius: 12px; border: 1px solid #e2e8f0; display: block; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.05);" onload="this.style.display='block'; if(this.nextElementSibling) this.nextElementSibling.style.display='none';" onerror="if(this.src.includes('cdn.jsdelivr.net')){this.src=this.src.replace('cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/','raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/');}else{this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='block';}" />
        <div class="image-placeholder" style="display: none;">
          <div class="image-placeholder-content">
            <div class="image-placeholder-icon">
              <i class="${esc(comp.icon || 'fas fa-image')}"></i>
            </div>
            <div class="image-placeholder-text">
              <strong class="image-placeholder-alt">${esc(displayTitle)}</strong>
              ${description ? '<p class="image-placeholder-desc">' + esc(description) + '</p>' : ''}
              <div class="image-placeholder-path" style="margin-top: 8px; font-family: monospace; font-size: 0.85rem; color: #475569; background: #e2e8f0; padding: 4px 10px; border-radius: 6px; display: inline-block;"><i class="fas fa-file-image" style="margin-right: 6px; color: #64748b;"></i>${esc(path)}</div>
            </div>
          </div>
          <div class="image-placeholder-note">* Очакван файл: ${esc(path || alt)}</div>
        </div>
        ${alt || description ? `<p style="margin-top: 0.6rem; font-size: 0.88rem; color: #64748b;"><strong>${esc(alt)}</strong>${description ? ' – ' + esc(description) : ''}</p>` : ''}
      </div>
    `;
  }

  return `
    <div class="image-placeholder" ${id ? 'id="' + esc(id) + '"' : ''}>
      <div class="image-placeholder-content">
        <div class="image-placeholder-icon">
          <i class="${esc(comp.icon || 'fas fa-image')}"></i>
        </div>
        <div class="image-placeholder-text">
          <strong class="image-placeholder-alt">${esc(alt)}</strong>
          ${description ? '<p class="image-placeholder-desc">' + esc(description) + '</p>' : ''}
        </div>
      </div>
      <div class="image-placeholder-note">* Очакван файл: ${esc(path || alt)}</div>
    </div>
  `;
}

export function init(comp) {
  // No initialization needed for image placeholder
}