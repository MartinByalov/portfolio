/* components/lightbox.js
   Отваря снимките / изображенията / визуалните елементи на урока
   в голям мащаб — модален прозорец в средата на екрана.
   Затваряне: по бутона ✕, клик вън от снимката или Escape.
*/

let overlay = null;
let activeImg = null;

function ensureOverlay() {
  if (overlay) return overlay;
  overlay = document.createElement('div');
  overlay.className = 'lb-lightbox';
  overlay.innerHTML = ''
    + '<button type="button" class="lb-lightbox-close" aria-label="Затвори">&times;</button>'
    + '<div class="lb-lightbox-stage">'
    + '  <img class="lb-lightbox-img" alt="">'
    + '  <div class="lb-lightbox-caption"></div>'
    + '</div>';
  document.body.appendChild(overlay);

  const closeBtn = overlay.querySelector('.lb-lightbox-close');
  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.classList.contains('lb-lightbox-close')) closeLightbox();
  });
  return overlay;
}

export function openLightbox(src, alt, caption) {
  const box = ensureOverlay();
  const img = box.querySelector('.lb-lightbox-img');
  img.src = src;
  img.alt = alt || '';
  box.querySelector('.lb-lightbox-caption').textContent = caption || alt || '';
  box.classList.add('open');
  document.body.classList.add('lb-lightbox-open');
  activeImg = img;
}

export function closeLightbox() {
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.classList.remove('lb-lightbox-open');
  if (activeImg) { activeImg.src = ''; activeImg = null; }
}

export function initLightbox(scope) {
  if (!scope) return;
  scope.querySelectorAll('.lb-image img, .lb-gallery-item img, .viz-node-img img, .adiagram-image img').forEach(img => {
    if (img.dataset.lightboxBound) return;
    img.dataset.lightboxBound = 'true';
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      const fig = img.closest('figure');
      openLightbox(img.currentSrc || img.src, img.getAttribute('alt') || '',
        fig && fig.querySelector('figcaption') ? fig.querySelector('figcaption').textContent : '');
    });
  });
}

let escHandler = (e) => { if (e.key === 'Escape') closeLightbox(); };

document.addEventListener('keydown', escHandler);