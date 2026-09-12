// Section divider tag component

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const tone = comp.tone ? ' tone-' + esc(comp.tone) : ' tone-blue';
  const variant = comp.variant ? ' tag-' + esc(comp.variant) : '';
  const arrow = (comp.href || comp.modalTarget)
    ? '<i class="fas fa-chevron-right lesson-tag-arrow"></i>'
    : '';
  const inner = (comp.icon ? '<span class="lesson-tag-ico"><i class="' + esc(comp.icon) + '"></i></span>' : '')
    + '<span class="lesson-tag-text">' + esc(comp.text || '') + '</span>'
    + arrow;

  if (comp.href) {
    return '<section class="component tag"'
      + (comp.id ? ' id="' + esc(comp.id) + '"' : '') + '>'
      + '<a class="lesson-tag' + tone + variant + '" href="' + esc(comp.href) + '" target="_blank" rel="noopener">'
      + inner
      + '</a>'
      + '</section>';
  }

  if (comp.modalTarget) {
    return '<section class="component tag"'
      + (comp.id ? ' id="' + esc(comp.id) + '"' : '') + '>'
      + '<button type="button" class="lesson-tag' + tone + variant + '" data-modal-target="' + esc(comp.modalTarget) + '">'
      + inner
      + '</button>'
      + '</section>';
  }

  return '<section class="component tag"'
    + (comp.id ? ' id="' + esc(comp.id) + '"' : '') + '>'
    + '<div class="lesson-tag' + tone + variant + '">'
    + inner
    + '</div>'
    + '</section>';
}

export function init(comp) {
  if (!comp || !comp.modalTarget) return;
  const root = document.getElementById(comp.id);
  if (!root) return;
  root.querySelectorAll('[data-modal-target]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = document.getElementById(btn.dataset.modalTarget);
      if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    });
  });
}
