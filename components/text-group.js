// Text accordion group component

import { initAccordion } from './accordion-behavior.js';

export function render(comp) {
  const items = (comp.items || []).map(item => `
    <div class="accordion-item">
      <div class="accordion-header">
        <span class="card-title">${item.title}</span>
        <i class="fas fa-chevron-down card-icon-mini"></i>
      </div>
      <div class="accordion-content">
        <div class="lesson-text-content">${item.content}</div>
      </div>
    </div>
  `).join('');

  return `
    <section class="component text-group" id="${comp.id || ''}">
      ${comp.heading ? `<h2 class="component-heading">${comp.heading}</h2>` : ''}
      <div class="accordion">${items}</div>
    </section>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id);
  if (root) initAccordion(root.querySelector('.accordion'));
}
