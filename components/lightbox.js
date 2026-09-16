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
      <div class="lb-lightbox-caption" style="display: none;"></div>
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

  const cap = box.querySelector('.lb-lightbox-caption');
  if (cap) {
    if (alt) {
      cap.textContent = alt;
      cap.style.display = 'block';
    } else {
      cap.textContent = '';
      cap.style.display = 'none';
    }
  }

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
  const cap = overlay.querySelector('.lb-lightbox-caption');
  if (cap) {
    cap.textContent = '';
    cap.style.display = 'none';
  }
}

function isZoomableImage(img) {
  if (!img) return false;
  if (img.classList.contains('lb-lightbox-img')) return false;
  if (img.classList.contains('no-lightbox') || img.dataset.noLightbox === 'true') return false;

  // Exclude tiny icons or avatars (ignore placeholder 1x1 size while loading)
  if (img.naturalWidth > 0 && img.naturalWidth < 40 && img.naturalHeight > 0 && img.naturalHeight < 40) return false;
  const rect = img.getBoundingClientRect();
  if (rect.width > 1 && rect.width < 40 && rect.height > 1 && rect.height < 40) return false;

  const src = img.currentSrc || img.src || '';
  if (!src || src.startsWith('data:image/svg') || src.includes('IMAGE_PLACEHOLDER')) return false;

  return true;
}

export function initLightbox(scope = document) {
  if (!scope) return;

  const images = scope.querySelectorAll(
    '.lesson-body img, .titled-image-container img, .image-placeholder-container img, .image-placeholder-wrapper img, .lesson-inline-media-card img, .person-card img, .timeline-component-container img, .era-panel img, .generation-hardware-sorter-container img, .apple-vs-pravetz-container img, .scale-comparison-container img, .technology-comparison-container img, .interactive-workbench-container img, .interactive-cutaway-container img, .lb-image img, .lb-gallery-item img, .viz-node-img img, .adiagram-image img'
  );

  images.forEach(img => {
    if (img.dataset.lightboxBound) return;
    img.dataset.lightboxBound = 'true';

    const applyZoom = () => {
      if (!isZoomableImage(img)) return;
      img.classList.add('lb-zoomable');
      if (!img.getAttribute('title')) {
        img.setAttribute('title', 'Кликнете за преглед в пълен размер');
      }
    };

    if (img.complete && img.naturalWidth > 0) {
      applyZoom();
    } else {
      img.addEventListener('load', applyZoom, { once: true });
      applyZoom();
    }
  });
}

// Global delegated event listener so all images across lessons trigger the popup
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (!img) {
      const card = e.target.closest('.lesson-inline-media-card.image-loaded, .image-placeholder-container.image-loaded, .image-placeholder-wrapper.image-loaded');
      if (card) {
        const cardImg = card.querySelector('img');
        if (cardImg && isZoomableImage(cardImg)) {
          e.preventDefault();
          e.stopPropagation();
          const src = cardImg.currentSrc || cardImg.src;
          const alt = cardImg.getAttribute('alt') || '';
          openLightbox(src, alt);
        }
      }
      return;
    }

    if (
      img.closest('.lesson-body, #view-root, .titled-image-container, .timeline-component-container, .interactive-cards-container, .scale-comparison-container, .technology-comparison-container, .lb-gallery-item, .lb-image, .lesson-inline-media-card, .image-placeholder-container, .image-placeholder-wrapper')
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
