/* components/lesson-media.js
   Rich-media lesson blocks rendered inside accordion items
   (dispatched from components/accordion.js renderBlock).
   All colors are plain hex strings coming from the lesson JSON.

   Block shapes:
   visualization { visualType, title, id, mediaSpec }
     "split-diagram"        mediaSpec.centerNode{label,color,textColor},
                            mediaSpec.branches[{label,subtext,color,iconClass}]
     "tree-diagram"         mediaSpec.nodes[{level,title,subtitle,color}]
     "mindmap"              mediaSpec.center{title,color},
                            mediaSpec.nodes[{title,desc,color,icon}]
     "flowchart-horizontal" mediaSpec.steps[{step,title,desc,color}],
                            mediaSpec.footerWarning
   ui-mockup { title, id, mediaSpec.component }
     "SmartphoneChatMockup"    header, messages[{sender,text,bubbleColor,align}],
                               sideBarMediaTypes[{label,color}]
     "BlogPageMockup"          header, postTitle, date, imagePlaceholder{alt},
                               mediaTypesUsed[], authorSidebar{name,avatarColor},
                               commentsBlock{text,buttonText,badge}
     "PrivacySettingsPanel"    fields[{label,options[],selected}]
   infographic { title, id, mediaSpec.layout }
     "grid-2x3"                cards[{title,subtext,color,icon}]
     "vertical-checklist"      items[{question,sub,color}]
   table { title, id, headers[], rows[][] }
*/

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

/* Pastel card background from a hex color (#RRGGBB + alpha). */
function tint(color) {
  const c = esc(color);
  return /^#[0-9a-fA-F]{6}$/.test(c) ? c + '22' : c;
}

/* Common card wrapper: matches the lesson .lb-viz block styling. */
function vizWrapper(b, innerHtml) {
  return '<div class="lb-viz"' + (b.id ? ' id="' + esc(b.id) + '"' : '') + '>'
    + (b.title ? '<div class="lb-viz-title">' + esc(b.title) + '</div>' : '')
    + innerHtml
    + '</div>';
}

/* --- visualization: split-diagram ------------------------------------ */

function renderSplitDiagram(spec) {
  const c = spec.centerNode || {};
  const branches = (spec.branches || []).map(br =>
    '<div class="sd-branch" style="border-color:' + esc(br.color) + '">'
    + '<div class="sd-branch-ico" style="background:' + esc(br.color) + '">'
    + '<i class="' + esc(br.iconClass || 'fas fa-circle') + '"></i></div>'
    + '<div class="sd-branch-label" style="color:' + esc(br.color) + '">' + esc(br.label || '') + '</div>'
    + (br.subtext ? '<div class="sd-branch-sub">' + esc(br.subtext) + '</div>' : '')
    + '</div>'
  ).join('');
  return '<div class="split-diagram">'
    + '<div class="sd-center" style="background:' + esc(c.color || '#6D28D9')
    + ';color:' + esc(c.textColor || '#FFFFFF') + '">' + esc(c.label || '') + '</div>'
    + '<div class="sd-connector"></div>'
    + '<div class="sd-branches">' + branches + '</div>'
    + '</div>';
}

/* --- visualization: tree-diagram -------------------------------------- */

function renderTreeDiagram(spec) {
  const nodes = (spec.nodes || []).slice().sort((a, b) => (a.level || 0) - (b.level || 0));
  const rows = nodes.map(n =>
    '<div class="tree-node" style="background:' + esc(n.color) + '">'
    + '<span class="tree-node-title">' + esc(n.title || '') + '</span>'
    + (n.subtitle ? '<span class="tree-node-sub">' + esc(n.subtitle) + '</span>' : '')
    + '</div>'
  ).join('<div class="tree-connector"></div>');
  return '<div class="tree-diagram">' + rows + '</div>';
}

/* --- visualization: mindmap -------------------------------------------- */

function renderMindmap(spec) {
  const c = spec.center || {};
  const nodes = spec.nodes || [];
  const half = Math.ceil(nodes.length / 2);
  const nodeHtml = n =>
    '<div class="mm-node">'
    + '<div class="mm-node-ico" style="background:' + esc(n.color) + '">'
    + '<i class="' + esc(n.icon || 'fas fa-star') + '"></i></div>'
    + '<div class="mm-node-body">'
    + '<div class="mm-node-title" style="color:' + esc(n.color) + '">' + esc(n.title || '') + '</div>'
    + (n.desc ? '<div class="mm-node-desc">' + esc(n.desc) + '</div>' : '')
    + '</div>'
    + '</div>';
  return '<div class="mindmap">'
    + '<div class="mm-col mm-left">' + nodes.slice(0, half).map(nodeHtml).join('') + '</div>'
    + '<div class="mm-center" style="background:' + esc(c.color || '#6D28D9') + '">' + esc(c.title || '') + '</div>'
    + '<div class="mm-col mm-right">' + nodes.slice(half).map(nodeHtml).join('') + '</div>'
    + '</div>';
}

/* --- visualization: flowchart-horizontal -------------------------------- */

function renderFlowchart(spec) {
  const steps = (spec.steps || []).map(s =>
    '<div class="flow-step" style="border-color:' + esc(s.color) + ';background:' + tint(s.color) + '">'
    + '<span class="flow-step-num" style="background:' + esc(s.color) + '">' + esc(s.step || '') + '</span>'
    + '<div class="flow-step-title" style="color:' + esc(s.color) + '">' + esc(s.title || '') + '</div>'
    + (s.desc ? '<div class="flow-step-desc">' + esc(s.desc) + '</div>' : '')
    + '</div>'
  ).join('<div class="flow-arrow"><i class="fas fa-chevron-right"></i></div>');
  return '<div class="flow-steps">' + steps + '</div>'
    + (spec.footerWarning ? '<div class="flow-warning">' + esc(spec.footerWarning) + '</div>' : '');
}

/* --- ui-mockup: SmartphoneChatMockup ---------------------------------- */

function renderChatMockup(spec) {
  const msgs = (spec.messages || []).map(m =>
    '<div class="chat-bubble" style="background:' + esc(m.bubbleColor || '#DBEAFE') + '">'
    + '<span class="chat-sender">' + esc(m.sender || '') + '</span>'
    + '<span class="chat-text">' + esc(m.text || '') + '</span>'
    + '</div>'
  ).join('');
  const side = (spec.sideBarMediaTypes || []).map(t =>
    '<div class="mockup-side-item">'
    + '<span class="mockup-side-dot" style="background:' + esc(t.color) + '"></span>'
    + esc(t.label || '')
    + '</div>'
  ).join('');
  return '<div class="chat-mockup">'
    + '<div class="mockup-phone">'
    + '<div class="mockup-screen-header"><i class="fas fa-users"></i> ' + esc(spec.header || '') + '</div>'
    + '<div class="mockup-messages">' + msgs + '</div>'
    + '<div class="mockup-input"><span>Напишете съобщение…</span><i class="fas fa-paper-plane"></i></div>'
    + '</div>'
    + '<div class="mockup-side">'
    + '<div class="mockup-side-title">Медийни типове</div>' + side
    + '</div>'
    + '</div>';
}

/* --- ui-mockup: BlogPageMockup ----------------------------------------- */

function renderBlogMockup(spec) {
  const ph = spec.imagePlaceholder || {};
  const chips = (spec.mediaTypesUsed || []).map(t =>
    '<span class="blog-chip">' + esc(t) + '</span>'
  ).join('');
  const side = spec.authorSidebar || {};
  const cb = spec.commentsBlock || {};
  return '<div class="blog-mockup">'
    + '<div class="blog-main">'
    + '<div class="blog-header">' + esc(spec.header || '') + '</div>'
    + '<div class="blog-post-title">' + esc(spec.postTitle || '') + '</div>'
    + (spec.date ? '<div class="blog-date">' + esc(spec.date) + '</div>' : '')
    + '<div class="blog-photo"><i class="fas fa-camera-retro"></i>'
    + '<span>' + esc(ph.alt || '') + '</span></div>'
    + (chips ? '<div class="blog-chips">' + chips + '</div>' : '')
    + '</div>'
    + '<aside class="blog-side">'
    + '<div class="blog-author">'
    + '<span class="blog-avatar" style="background:' + esc(side.avatarColor || '#EC4899') + '">'
    + '<i class="fas fa-user"></i></span>'
    + esc(side.name || '')
    + '</div>'
    + '<div class="blog-comments"><p>' + esc(cb.text || '') + '</p>'
    + (cb.badge ? '<span class="blog-badge">' + esc(cb.badge) + '</span>' : '')
    + (cb.buttonText ? '<span class="blog-btn">' + esc(cb.buttonText) + '</span>' : '')
    + '</div>'
    + '</aside>'
    + '</div>';
}

/* --- ui-mockup: PrivacySettingsPanel ------------------------------------ */

function renderPrivacyMockup(spec) {
  const fields = (spec.fields || []).map(f =>
    '<div class="privacy-field">'
    + '<div class="privacy-label">' + esc(f.label || '') + '</div>'
    + '<div class="privacy-options">'
    + (f.options || []).map(o =>
      '<span class="pp-option' + (o === f.selected ? ' selected' : '') + '">'
      + '<span class="pp-dot"></span>' + esc(o) + '</span>'
    ).join('')
    + '</div>'
    + '</div>'
  ).join('');
  return '<div class="privacy-mockup">'
    + '<div class="privacy-header"><i class="fas fa-shield-halved"></i> Настройки за поверителност</div>'
    + fields
    + '</div>';
}

/* --- infographic: grid-2x3 / vertical-checklist -------------------------- */

function renderRiskGrid(spec) {
  const cards = (spec.cards || []).map(card =>
    '<div class="risk-card" style="border-left-color:' + esc(card.color) + '">'
    + '<span class="risk-card-icon" style="color:' + esc(card.color) + '">' + esc(card.icon || '⚠') + '</span>'
    + '<div class="risk-card-title">' + esc(card.title || '') + '</div>'
    + (card.subtext ? '<div class="risk-card-sub">' + esc(card.subtext) + '</div>' : '')
    + '</div>'
  ).join('');
  return '<div class="risk-grid">' + cards + '</div>';
}

function renderChecklist(spec) {
  const items = (spec.items || []).map((it, i) =>
    '<div class="checklist-item">'
    + '<span class="checklist-badge" style="background:' + esc(it.color) + '">' + (i + 1) + '</span>'
    + '<div class="checklist-body">'
    + '<div class="checklist-q" style="color:' + esc(it.color) + '">' + esc(it.question || '') + '</div>'
    + (it.sub ? '<div class="checklist-sub">' + esc(it.sub) + '</div>' : '')
    + '</div>'
    + '</div>'
  ).join('');
  return '<div class="checklist">' + items + '</div>';
}

/* --- table --------------------------------------------------------------- */

function renderTable(b) {
  const head = (b.headers || []).map(h => '<th>' + esc(h) + '</th>').join('');
  const body = (b.rows || []).map(r =>
    '<tr>' + (r || []).map(cell => '<td>' + esc(cell) + '</td>').join('') + '</tr>'
  ).join('');
  return '<div class="lb-table-wrap">'
    + '<table class="lb-table"><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table>'
    + '</div>';
}

/* --- image blocks --------------------------------------------------------- */

/* Titled image: card with a heading + lightbox image. */
function renderTitledImage(b) {
  return '<figure class="lb-image titled-image">'
    + '<img src="' + esc(b.src) + '" alt="' + esc(b.alt || '') + '" loading="lazy">'
    + (b.caption ? '<figcaption>' + esc(b.caption) + '</figcaption>' : '')
    + '</figure>';
}

/* Image + "Медийни типове" panel side by side. */
function renderMediaTypes(b) {
  const img = b.image || {};
  const items = (b.items || []).map(t =>
    '<div class="mockup-side-item">'
    + '<span class="mockup-side-dot" style="background:' + esc(t.color) + '"></span>'
    + esc(t.label || '')
    + '</div>'
  ).join('');
  return '<div class="media-types-row">'
    + '<figure class="lb-image">'
    + '<img src="' + esc(img.src || '') + '" alt="' + esc(img.alt || '') + '" loading="lazy">'
    + '</figure>'
    + '<aside class="mockup-side">'
    + '<div class="mockup-side-title">' + esc(b.title || 'Медийни типове') + '</div>'
    + items
    + '</aside>'
    + '</div>';
}

/* glossary-list: термин -> описание (вътре в акордеона „Речник“). */
function renderGlossaryList(b) {
  const rows = (b.items || []).map(it =>
    '<div class="glossary-row">'
    + '<dt class="glossary-row-term">' + esc(it.term || '') + '</dt>'
    + '<dd class="glossary-row-def">' + esc(it.definition || '') + '</dd>'
    + '</div>'
  ).join('');
  return '<dl class="glossary-list">' + rows + '</dl>';
}

/* --- dispatcher ------------------------------------------------------------ */

export function renderRichBlock(b) {
  const spec = b.mediaSpec || {};
  if (b.type === 'visualization') {
    switch (b.visualType) {
      case 'split-diagram':        return vizWrapper(b, renderSplitDiagram(spec));
      case 'tree-diagram':         return vizWrapper(b, renderTreeDiagram(spec));
      case 'mindmap':              return vizWrapper(b, renderMindmap(spec));
      case 'flowchart-horizontal': return vizWrapper(b, renderFlowchart(spec));
      default: return '<!-- unknown visualType: ' + esc(b.visualType) + ' -->';
    }
  }
  if (b.type === 'ui-mockup') {
    let inner = '';
    if (spec.component === 'SmartphoneChatMockup')      inner = renderChatMockup(spec);
    else if (spec.component === 'BlogPageMockup')       inner = renderBlogMockup(spec);
    else if (spec.component === 'PrivacySettingsPanel') inner = renderPrivacyMockup(spec);
    else return '<!-- unknown ui-mockup component: ' + esc(spec.component) + ' -->';
    return vizWrapper(b, inner);
  }
  if (b.type === 'infographic') {
    if (spec.layout === 'vertical-checklist') return vizWrapper(b, renderChecklist(spec));
    return vizWrapper(b, renderRiskGrid(spec));
  }
  if (b.type === 'table') return vizWrapper(b, renderTable(b));
  if (b.type === 'glossary-list') return renderGlossaryList(b);
  if (b.type === 'titled-image') return vizWrapper(b, renderTitledImage(b));
  if (b.type === 'media-types')  return vizWrapper(b, renderMediaTypes(b));
  return '<!-- unknown rich media block: ' + esc(b.type) + ' -->';
}