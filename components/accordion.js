/* components/accordion.js
   Lesson "accordion" component — each lesson point is an accordion item
   and ALL of that point's content (text, real images, image-galleries,
   visualizations, subsections) lives INSIDE the item.

   Data shape:
   { type:"accordion", id, heading,
     options: { itemsAlign:"stretch", titleAlign:"left", singleOpen:false },
     items: [{ id, title, content: [ Block, ... ] }] }

   Block types (nested inside an item's content):
     text          { type:"text", content:"<p>..</p>" }
     image         { type:"image", src, alt, caption, fit }
     image-gallery { type:"image-gallery", title, items:[{title,src,alt}] }
     visualization { type:"visualization", id, title,
                     nodes:[{label,description,image}], diagram:{layout,flow} }
     subsection    { type:"subsection", heading, content:[ Block, ... ] }
*/

import { initAccordion } from './accordion-behavior.js';

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

/* --- nested content blocks ------------------------------------------- */

function renderImageBlock(b) {
  return '<figure class="lb-image">'
    + '<img src="' + esc(b.src) + '" alt="' + esc(b.alt || '') + '" loading="lazy">'
    + (b.caption ? '<figcaption>' + esc(b.caption) + '</figcaption>' : '')
    + '</figure>';
}

function renderGalleryBlock(b) {
  const figs = (b.items || []).map(g =>
    '<figure class="lb-gallery-item">'
    + '<img src="' + esc(g.src) + '" alt="' + esc(g.alt || '') + '" loading="lazy">'
    + (g.title ? '<figcaption>' + esc(g.title) + '</figcaption>' : '')
    + '</figure>'
  ).join('');
  return '<div class="lb-gallery">'
    + (b.title ? '<div class="lb-gallery-title">' + esc(b.title) + '</div>' : '')
    + '<div class="lb-gallery-grid">' + figs + '</div>'
    + '</div>';
}

function renderVizBlock(b) {
  const d = b.diagram || {};
  const nodes = d.nodes || b.nodes || b.steps || [];
  const flow = d.flow || b.flow || '';
  const layout = d.layout || b.layout || 'flow';
  const split = layout === 'split';

  const nodeHtml = nodes.map((n, i) => {
    const img = n.image
      ? '<div class="viz-node-img"><img src="' + esc(n.image) + '" alt="' + esc(n.label || '') + '" loading="lazy"></div>'
      : '';
    return '<div class="viz-node step-pop" style="animation-delay:' + (i * 140) + 'ms">'
      + img
      + '<div class="viz-node-label">' + esc(n.label || '') + '</div>'
      + (n.description ? '<div class="viz-node-desc">' + esc(n.description) + '</div>' : '')
      + '</div>';
  }).join(split ? '' : '<div class="viz-link">&#8594;</div>');

  return '<div class="lb-viz"' + (b.id ? ' id="' + esc(b.id) + '"' : '') + '>'
    + (b.title ? '<div class="lb-viz-title">' + esc(b.title) + '</div>' : '')
    + (flow ? '<div class="viz-flow">' + esc(flow) + '</div>' : '')
    + '<div class="viz-nodes' + (split ? ' split' : '') + '">' + nodeHtml + '</div>'
    + '</div>';
}

function renderSubsectionBlock(b) {
  const inner = (b.content || []).map(renderBlock).join('');
  return '<div class="lb-subsection">'
    + (b.heading ? '<h4 class="lb-subsection-heading">' + esc(b.heading) + '</h4>' : '')
    + inner
    + '</div>';
}

function renderBlock(b) {
  switch (b.type) {
    case 'text':           return '<div class="lb-text">' + (b.content || '') + '</div>';
    case 'image':          return renderImageBlock(b);
    case 'image-gallery':  return renderGalleryBlock(b);
    case 'visualization':  return renderVizBlock(b);
    case 'subsection':     return renderSubsectionBlock(b);
    default:               return '<!-- unknown lesson block type: ' + esc(b.type) + ' -->';
  }
}

/* --- component ------------------------------------------------------------------ */

export function render(comp) {
  const items = (comp.items || []).map((it, i) =>
    '<div class="accordion-item' + (i === 0 ? ' active' : '') + '"'
      + (it.id ? ' id="' + esc(it.id) + '"' : '') + '>'
    + '<div class="accordion-header">'
    + '<span class="card-title">' + esc(it.title || '') + '</span>'
    + '<i class="fas fa-chevron-down card-icon-mini"></i>'
    + '</div>'
    + '<div class="accordion-content">'
    + (it.content || []).map(renderBlock).join('')
    + '</div>'
    + '</div>'
  ).join('');

  const align = (comp.options && comp.options.titleAlign) || 'left';
  const stretch = comp.options && comp.options.itemsAlign === 'stretch';

  return '<section class="component accordion' + (stretch ? ' items-stretch' : '') + '"'
    + ' data-title-align="' + esc(align) + '"'
    + ' id="' + esc(comp.id || '') + '">'
    + (comp.heading ? '<h2 class="component-heading">' + esc(comp.heading) + '</h2>' : '')
    + '<div class="accordion">' + items + '</div>'
    + '</section>';
}

export function init(comp) {
  const root = document.getElementById(comp.id);
  if (!root) return;
  const accordion = root.querySelector('.accordion');
  const singleOpen = !(comp.options && comp.options.singleOpen === false);
  initAccordion(accordion, { singleOpen });

  // sync inline display with the pre-rendered .active class (first item open)
  accordion.querySelectorAll('.accordion-item').forEach(item => {
    const content = item.querySelector('.accordion-content');
    if (content) content.style.display = item.classList.contains('active') ? 'block' : 'none';
  });
}