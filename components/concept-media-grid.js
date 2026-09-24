// Concept cards with visual placeholders.

import * as ImagePlaceholder from './image-placeholder.js';

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[ch]));
}

export function render(comp) {
  const items = comp.items || [];
  const cards = items.map((item, index) => {
    const image = item.image || {};
    const placeholder = ImagePlaceholder.render({
      id: `${comp.id || 'concept-media-grid'}-image-${index + 1}`,
      size: 'mini',
      label: image.label || item.title || 'Изображение',
      description: image.description || '',
      src: image.src || '',
      icon: image.icon || 'fas fa-image',
      badge: image.badge || 'Изображение (Placeholder)'
    });

    return `
      <article class="concept-media-grid-card">
        <h3>${esc(item.title || '')}</h3>
        ${placeholder}
        ${item.description ? `<p>${esc(item.description)}</p>` : ''}
      </article>
    `;
  }).join('');

  return `<section id="${esc(comp.id || '')}" class="component concept-media-grid">${cards}</section>`;
}

export function init() {}