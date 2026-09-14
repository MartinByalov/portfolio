// Universal Image Lightbox Modal Component
// Displays clean enlarged image preview in a popup modal

let overlay = null;
let activeImg = null;

function ensureOverlay() {
  if (overlay) return overlay;
  overlay = document.createElement('div');
  overlay.className = 'lb-lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Преглед на изображението');
  overlay.innerHTML = `
    <button type="button" class="lb-lightbox-close" aria-label="Затвори (Esc)" title="Затвори (Esc)">
      <i class="fas fa-xmark"></i>
    </button>
    <div class="lb-lightbox-stage">
      <img class="lb-lightbox-img" alt="" />
    </div>
  `;
  document.body.appendChild(overlay);

  const closeBtn = overlay.querySelector('.lb-lightbox-close');
  closeBtn.addEventListener('click', closeLightbox);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.closest('.lb-lightbox-close')) {
      closeLightbox();
    }
  });

  return overlay;
}

export function openLightbox(src, alt) {
  if (!src) return;
  const box = ensureOverlay();
  const img = box.querySelector('.lb-lightbox-img');
  img.src = src;
  img.alt = alt || '';

  box.classList.add('open');
  document.body.classList.add('lb-lightbox-open');
  activeImg = img;
}

export function closeLightbox() {
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.classList.remove('lb-lightbox-open');
  if (activeImg) {
    activeImg.src = '';
    activeImg = null;
  }
}

function isZoomableImage(img) {
  if (!img) return false;
  if (img.classList.contains('lb-lightbox-img')) return false;
  if (img.classList.contains('no-lightbox') || img.dataset.noLightbox === 'true') return false;

  // Exclude tiny icons or avatars
  const rect = img.getBoundingClientRect();
  if (rect.width > 0 && rect.width < 40 && rect.height > 0 && rect.height < 40) return false;

  const src = img.currentSrc || img.src || '';
  if (!src || src.startsWith('data:image/svg') || src.includes('IMAGE_PLACEHOLDER')) return false;

  return true;
}

export function initLightbox(scope = document) {
  if (!scope) return;

  const images = scope.querySelectorAll(
    '.lesson-body img, .titled-image-container img, .person-card img, .timeline-component-container img, .era-panel img, .generation-hardware-sorter-container img, .apple-vs-pravetz-container img, .scale-comparison-container img, .technology-comparison-container img, .interactive-workbench-container img, .interactive-cutaway-container img, .lb-image img, .lb-gallery-item img, .viz-node-img img, .adiagram-image img'
  );

  images.forEach(img => {
    if (img.dataset.lightboxBound) return;
    if (!isZoomableImage(img)) return;

    img.dataset.lightboxBound = 'true';
    img.classList.add('lb-zoomable');
    img.setAttribute('title', 'Кликнете за преглед в изскачащ прозорец');
  });
}

// Global delegated event listener so all images across lessons trigger the popup
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (!img) return;

    if (
      img.closest('.lesson-body, #view-root, .titled-image-container, .timeline-component-container, .interactive-cards-container, .scale-comparison-container, .technology-comparison-container, .lb-gallery-item, .lb-image')
    ) {
      if (!isZoomableImage(img)) return;
      e.preventDefault();
      e.stopPropagation();
      const src = img.currentSrc || img.src;
      const alt = img.getAttribute('alt') || '';
      openLightbox(src, alt);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}
