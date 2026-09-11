// Image Placeholder Component
// Renders a placeholder for images that will be uploaded later

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const alt = comp.alt || 'Изображение';
  const description = comp.description || '';
  const id = comp.id || '';

  return `
    <div class="image-placeholder" id="${id ? 'id="' + esc(id) + '"' : ''}">
      <div class="image-placeholder-content">
        <div class="image-placeholder-icon">
          <i class="fas fa-image"></i>
        </div>
        <div class="image-placeholder-text">
          <strong class="image-placeholder-alt">${esc(alt)}</strong>
          ${description ? '<p class="image-placeholder-desc">' + esc(description) + '</p>' : ''}
        </div>
      </div>
      <div class="image-placeholder-note">* Качете изображение след като я поставите</div>
    </div>
  `;
}

export function init(comp) {
  // No initialization needed for image placeholder
}