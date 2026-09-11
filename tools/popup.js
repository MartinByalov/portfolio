// Modal popup handler for dashboard tools

import * as Header from '/layout/header.js';

const POPUP_STYLE = `
  .tool-popup-overlay {
    position: fixed; inset: 0; z-index: 2000;
    background: rgba(0, 0, 0, 0.55);
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    opacity: 0; transition: opacity 0.18s ease;
  }
  .tool-popup-overlay.open { opacity: 1; }
  .tool-popup {
    width: min(960px, 94vw); height: min(680px, 88vh);
    background: #fff; border-radius: 12px; overflow: hidden;
    display: flex; flex-direction: column;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);
    transform: scale(0.96); transition: transform 0.18s ease;
  }
  .tool-popup-overlay.open .tool-popup { transform: scale(1); }
  .tool-popup-header {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 16px; background: #1d1b31; color: #fff;
  }
  .tool-popup-header i { font-size: 1.1rem; }
  .tool-popup-title { font-weight: 600; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tool-popup-close {
    background: none; border: none; color: #fff;
    font-size: 28px; line-height: 1; cursor: pointer;
    padding: 0 4px; transition: color 0.2s;
  }
  .tool-popup-close:hover { color: #f17a3e; }
  .tool-popup-frame { flex: 1; width: 100%; border: 0; background: #fff; }
`;

let overlayEl = null;
let restore = null;

function ensureStyle() {
  if (document.getElementById('tool-popup-style')) return;
  const style = document.createElement('style');
  style.id = 'tool-popup-style';
  style.textContent = POPUP_STYLE;
  document.head.appendChild(style);
}

function onKeydown(e) {
  if (e.key === 'Escape') close();
}

export function open({ title, icon, src }) {
  close(true);
  ensureStyle();
  // Remember the current header state to restore it on close.
  restore = { title: Header.getTitle(), icon: Header.getIcon() };
  Header.setTitle(title, icon);

  overlayEl = document.createElement('div');
  overlayEl.className = 'tool-popup-overlay';
  overlayEl.innerHTML = `
    <div class="tool-popup" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="tool-popup-header">
        <i class="${icon}"></i>
        <span class="tool-popup-title">${title}</span>
        <button class="tool-popup-close" title="Затвори" aria-label="Затвори">&times;</button>
      </div>
      <iframe class="tool-popup-frame" src="${src}" title="${title}"></iframe>
    </div>
  `;
  document.body.appendChild(overlayEl);
  requestAnimationFrame(() => overlayEl.classList.add('open'));

  overlayEl.addEventListener('click', (e) => {
    if (e.target === overlayEl) close();
  });
  overlayEl.querySelector('.tool-popup-close').addEventListener('click', () => close());
  document.addEventListener('keydown', onKeydown);
}

export function close(silent) {
  document.removeEventListener('keydown', onKeydown);
  if (overlayEl) {
    const el = overlayEl;
    overlayEl = null;
    el.classList.remove('open');
    setTimeout(() => el.remove(), 180);
  }
  if (!silent && restore) {
    Header.setTitle(restore.title, restore.icon);
    restore = null;
  }
}

// Bind every data-popup-src card on the page
export function init() {
  document.querySelectorAll('[data-popup-src]').forEach((card) => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      open({
        title: card.dataset.popupTitle || 'Инструмент',
        icon: card.dataset.popupIcon || 'fa-solid fa-wrench',
        src: card.dataset.popupSrc
      });
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
