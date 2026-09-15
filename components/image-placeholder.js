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

  if (path) {
    return `
      <div class="image-placeholder-container" ${id ? 'id="' + esc(id) + '"' : ''} style="margin: 1.5rem 0; text-align: center;">
        <img src="${esc(path)}" alt="${esc(alt)}" loading="lazy" style="max-width: 100%; height: auto; border-radius: 12px; border: 1px solid #e2e8f0; display: block; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.05);" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='block';" />
        <div class="image-placeholder" style="display: none;">
          <div class="image-placeholder-content">
            <div class="image-placeholder-icon">
              <i class="${esc(comp.icon || 'fas fa-image')}"></i>
            </div>
            <div class="image-placeholder-text">
              <strong class="image-placeholder-alt">${esc(alt)}</strong>
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