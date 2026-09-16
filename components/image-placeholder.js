// Image Placeholder Component
// Renders a rich placeholder for images that will be uploaded later,
// with graceful fallback and immediate filename visibility.

import { getCleanMediaInfo } from '../utils/media.js';

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

function getCleanDescription(desc) {
  if (!desc) return '';
  return String(desc).replace(/(?:[\.\,\s\-\—]*)(?:\(|\[)?(?:Файл|файл|File|file):\s*([a-zA-Z0-9_\-\.\/]+)(?:\)|\])?/gi, '').trim();
}

function formatDescriptionWithFileTag(desc, expectedFileName = '') {
  if (!desc) {
    if (expectedFileName) {
      return `<span class="lesson-media-file-tag" title="Очакван файл"><i class="fas fa-file-image"></i> Файл: ${esc(expectedFileName)}</span>`;
    }
    return '';
  }
  const formatted = esc(desc);
  let hasTag = false;
  let res = formatted.replace(/(?:[\.\,\s\-\—]*)(?:\(|\[)?(?:Файл|файл|File|file):\s*([a-zA-Z0-9_\-\.\/]+)(?:\)|\])?/gi, function(match, filename) {
    hasTag = true;
    return ` <span class="lesson-media-file-tag" title="Очакван файл"><i class="fas fa-file-image"></i> Файл: ${filename}</span>`;
  });
  if (!hasTag && expectedFileName) {
    res += ` <span class="lesson-media-file-tag" title="Очакван файл"><i class="fas fa-file-image"></i> Файл: ${esc(expectedFileName)}</span>`;
  }
  return res;
}

export function render(comp) {
  const alt = comp.label || comp.alt || comp.title || 'Изображение';
  const description = comp.description || comp.desc || '';
  const cleanDesc = getCleanDescription(description);
  const id = comp.id || '';
  const rawPath = comp.src || comp.path || comp.fileName || '';
  const isMini = comp.size === 'mini' || comp.variant === 'mini' || comp.size === 'compact' || comp.variant === 'compact';
  const isFloat = comp.float === 'right' || comp.align === 'right';

  const { fullPath, relativePath, fileName } = getCleanMediaInfo(rawPath);
  const displayTitle = fileName && !alt.includes(fileName) ? `${alt} - ${fileName}` : alt;
  const displayFile = relativePath || fileName;
  const badgeText = comp.badge || comp.step || 'Екранна снимка (Placeholder)';

  if (isMini) {
    const wrapClass = isFloat ? 'lesson-media-float' : 'lesson-inline-media-wrap';
    const wrapStyle = isFloat ? '' : 'margin: 1rem 0; max-width: 260px;';
    return `
      <div class="${wrapClass}" ${id ? 'id="' + esc(id) + '"' : ''} ${wrapStyle ? 'style="' + wrapStyle + '"' : ''}>
        <div class="lesson-inline-media-card">
          ${rawPath ? `<img src="${esc(fullPath || rawPath)}" alt="${esc(alt)}" loading="eager" class="lesson-placeholder-img" onload="const c = this.closest('.lesson-inline-media-card'); if(c){ c.classList.add('image-loaded'); c.classList.remove('image-failed'); }" onerror="const c = this.closest('.lesson-inline-media-card'); if(this.src && this.src.includes('raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/')){ this.src = this.src.replace('raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/', 'cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/'); } else if(this.src && this.src.includes('cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/')){ this.src = this.src.replace('cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/', 'raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/'); } else { if(c){ c.classList.remove('image-loaded'); c.classList.add('image-failed'); } }" />` : ''}
          <div class="lesson-micro-placeholder-box">
            <span class="lesson-micro-badge"><i class="${esc(comp.icon || 'fas fa-image')}"></i> ${esc(badgeText)}</span>
            <div class="lesson-micro-title">${esc(displayTitle)}</div>
            ${displayFile ? `<div class="lesson-micro-path" title="Очакван файл: ${esc(displayFile)}"><i class="fas fa-file-image" style="margin-right: 4px;"></i>${esc(fileName || displayFile)}</div>` : ''}
          </div>
          ${(cleanDesc || displayFile) ? `
            <div class="lesson-micro-caption">
              ${cleanDesc ? esc(cleanDesc) : ''}
              ${fileName ? `<span class="lesson-media-file-tag" title="Очакван файл"><i class="fas fa-file-image"></i> Файл: ${esc(fileName)}</span>` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  return `
    <div class="image-placeholder-container" ${id ? 'id="' + esc(id) + '"' : ''} style="margin: 1.5rem 0;">
      ${rawPath ? `<img src="${esc(fullPath || rawPath)}" alt="${esc(alt)}" loading="eager" class="lesson-placeholder-img" onload="const c = this.closest('.image-placeholder-container') || this.closest('.image-placeholder-wrapper'); if(c){ c.classList.add('image-loaded'); c.classList.remove('image-failed'); }" onerror="const c = this.closest('.image-placeholder-container') || this.closest('.image-placeholder-wrapper'); if(this.src && this.src.includes('raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/')){ this.src = this.src.replace('raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/', 'cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/'); } else if(this.src && this.src.includes('cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/')){ this.src = this.src.replace('cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/', 'raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/'); } else { if(c){ c.classList.remove('image-loaded'); c.classList.add('image-failed'); } }" />` : ''}
      <div class="lesson-image-placeholder image-placeholder">
        <div class="placeholder-badge">
          <i class="fas fa-camera"></i> ${esc(badgeText)}
          ${fileName ? `<span class="placeholder-filename-badge" style="margin-left: 8px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 700; text-transform: none; color: #1e40af; background: #dbeafe; padding: 2px 8px; border-radius: 4px; border: 1px solid #bfdbfe;"><i class="fas fa-file-image" style="margin-right: 4px;"></i>${esc(fileName)}</span>` : ''}
        </div>
        <div class="placeholder-body">
          <div class="placeholder-icon-wrap">
            <i class="${esc(comp.icon || 'fas fa-image')}"></i>
          </div>
          <div class="placeholder-text-wrap">
            <h4 class="placeholder-heading">${esc(displayTitle)}</h4>
            ${description ? `<p class="placeholder-desc">${formatDescriptionWithFileTag(description, fileName)}</p>` : ''}
            ${displayFile ? `
              <div class="placeholder-file-path" style="margin-top: 10px; display: inline-flex; align-items: center; gap: 6px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.84rem; font-weight: 600; color: #334155; background: #e2e8f0; padding: 4px 10px; border-radius: 6px; border: 1px solid #cbd5e1;">
                <i class="fas fa-file-image" style="color: #64748b;"></i>
                <span>Очакван файл:</span>
                <code style="color: #0f172a; background: #ffffff; padding: 2px 6px; border-radius: 4px; border: 1px solid #cbd5e1;">${esc(displayFile)}</code>
              </div>
            ` : ''}
          </div>
        </div>
        <div class="image-placeholder-note" style="margin-top: 12px; font-size: 0.8rem; color: #64748b;">* Очакван файл: ${esc(displayFile || alt)}</div>
      </div>
      ${(alt || cleanDesc) ? `
        <p class="image-placeholder-caption" style="margin-top: 0.6rem; font-size: 0.88rem; color: #64748b; text-align: center;">
          <strong>${esc(alt)}</strong>${cleanDesc ? ' – ' + esc(cleanDesc) : ''}
          ${fileName ? `<span class="lesson-media-file-tag" title="Очакван файл"><i class="fas fa-file-image"></i> Файл: ${esc(fileName)}</span>` : ''}
        </p>
      ` : ''}
    </div>
  `;
}

export function init(comp) {
  // Initialization handled by initMediaPlaceholders in renderer
}
