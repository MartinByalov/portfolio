// Rich-media lesson blocks component

import * as Infographic from './infographic.js';

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

// Pastel card background from hex color
function tint(color) {
  const c = esc(color);
  return /^#[0-9a-fA-F]{6}$/.test(c) ? c + '22' : c;
}

// Common card wrapper matching lesson styling
function vizWrapper(b, innerHtml) {
  const showTitle = b.title && b.type !== 'video';
  return '<div class="lb-viz"' + (b.id ? ' id="' + esc(b.id) + '"' : '') + '>'
    + (showTitle ? '<div class="lb-viz-title">' + esc(b.title) + '</div>' : '')
    + innerHtml
    + '</div>';
}

// Split-diagram visualization

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

// Tree-diagram visualization

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

// Mindmap visualization

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

// Horizontal flowchart visualization

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

// Smartphone chat mockup

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

// Blog page mockup

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

// Privacy settings panel mockup

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

// Infographic grid component

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

// Table component

function renderTable(b) {
  const head = (b.headers || []).map(h => '<th>' + esc(h) + '</th>').join('');
  const body = (b.rows || []).map(r =>
    '<tr>' + (r || []).map(cell => '<td>' + esc(cell) + '</td>').join('') + '</tr>'
  ).join('');
  return '<div class="lb-table-wrap"' + (b.id ? ' id="' + esc(b.id) + '"' : '') + '>'
    + (b.intro ? '<p class="lb-table-intro">' + esc(b.intro) + '</p>' : '')
    + '<table class="lb-table"><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table>'
    + '</div>';
}

// Image blocks

// Titled image with lightbox
function renderTitledImage(b) {
  return '<figure class="lb-image titled-image">'
    + '<img src="' + esc(b.src) + '" alt="' + esc(b.alt || '') + '" loading="lazy">'
    + (b.caption ? '<figcaption>' + esc(b.caption) + '</figcaption>' : '')
    + '</figure>';
}

// Side-by-side image and media types panel
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

// Glossary term and description list
function renderGlossaryList(b) {
  const rows = (b.items || []).map(it =>
    '<div class="glossary-row">'
    + '<dt class="glossary-row-term">' + esc(it.term || '') + '</dt>'
    + '<dd class="glossary-row-def">' + esc(it.definition || '') + '</dd>'
    + '</div>'
  ).join('');
  return '<dl class="glossary-list">' + rows + '</dl>';
}

// LMS ecosystem diagram with central course hub and modules
function renderLmsEcosystem(spec, b) {
  const dev = spec.centerDevice || {};
  const assetPath = spec.assetPath;
  if (assetPath) {
    const img = '<img class="lms-ecosystem-img" src="' + esc(assetPath) + '" alt="' + esc((b && b.title) || 'LMS') + '" />';
    return '<div class="lms-ecosystem">' + img + '</div>';
  }
  const defaultModules = [
    { label: "Материали", desc: "уроци и ресурси", color: "#8B5CF6", icon: "fas fa-book" },
    { label: "Задачи", desc: "възлагане и предаване", color: "#10B981", icon: "fas fa-tasks" },
    { label: "Комуникация", desc: "съобщения и дискусии", color: "#3B82F6", icon: "fas fa-comments" },
    { label: "Календар", desc: "събития и срокове", color: "#F59E0B", icon: "fas fa-calendar-alt" },
    { label: "Оценяване", desc: "тестове и оценки", color: "#EF4444", icon: "fas fa-star" },
    { label: "Напредък", desc: "проследяване на резултатите", color: "#06B6D4", icon: "fas fa-chart-line" }
  ];
  const list = (spec.modules && spec.modules.length) ? spec.modules : defaultModules;
  const modules = list.map(m =>
    '<div class="lms-module-card" style="border-top-color:' + esc(m.color) + '">'
    + '<div class="lms-module-icon" style="background:' + tint(m.color) + ';color:' + esc(m.color) + '">'
    + '<i class="' + esc(m.icon || 'fas fa-cube') + '"></i>'
    + '</div>'
    + '<div class="lms-module-info">'
    + '<div class="lms-module-title" style="color:' + esc(m.color) + '">' + esc(m.label || '') + '</div>'
    + '<div class="lms-module-desc">' + esc(m.desc || '') + '</div>'
    + '</div>'
    + '</div>'
  ).join('');

  return '<div class="lms-ecosystem">'
    + '<div class="lms-center-laptop">'
    + '<div class="laptop-screen">'
    + '<div class="laptop-notch"><span class="laptop-cam"></span></div>'
    + '<div class="laptop-header">'
    + '<span class="laptop-dots"><i></i><i></i><i></i></span>'
    + '<span class="laptop-title"><i class="fas fa-graduation-cap"></i> ' + esc(dev.title || 'LMS Платформа') + '</span>'
    + '</div>'
    + '<div class="laptop-body">'
    + '<div class="laptop-preview-badge"><i class="fas fa-cubes"></i> Система за управление на обучението</div>'
    + '<div class="laptop-preview-sub">Google Classroom · Microsoft Teams · Moodle</div>'
    + '<div class="laptop-stats">'
    + '<div class="stat-pill"><i class="fas fa-check-circle"></i> 6 активни модула</div>'
    + '<div class="stat-pill"><i class="fas fa-user-graduate"></i> Споделена среда</div>'
    + '</div>'
    + '</div>'
    + '</div>'
    + '<div class="laptop-base"></div>'
    + '</div>'
    + '<div class="lms-modules-grid">' + modules + '</div>'
    + '</div>';
}

// Comparative cards for synchronous vs asynchronous learning
function renderComparisonCardsSync(spec) {
  const cards = (spec.cards || []).map(card => {
    const points = (card.points || []).map(p =>
      '<li><i class="fas fa-check-circle" style="color:' + esc(card.color) + '"></i><span>' + esc(p) + '</span></li>'
    ).join('');

    return '<div class="sync-card" style="border-top-color:' + esc(card.color) + '">'
      + '<div class="sync-card-header">'
      + '<div class="sync-card-icon" style="background:' + tint(card.color) + ';color:' + esc(card.color) + '">'
      + '<i class="' + esc(card.icon || 'fas fa-video') + '"></i>'
      + '</div>'
      + '<div>'
      + '<div class="sync-card-title">' + esc(card.type || '') + '</div>'
      + '<span class="sync-badge" style="background:' + tint(card.color) + ';color:' + esc(card.color) + '">' + esc(card.badge || '') + '</span>'
      + '</div>'
      + '</div>'
      + '<ul class="sync-points">' + points + '</ul>'
      + '</div>';
  }).join('');

  return '<div class="sync-async-grid">' + cards + '</div>';
}

// Cloud storage UI mockup
function renderCloudStorageMockup(spec, b) {
  const defaultSidebar = ['Моят диск (My Drive)', 'Споделени с мен', 'Скорошни', 'Кошче'];
  const defaultFolders = [
    { name: "ИТ_8клас", itemsCount: "5 файла", color: "#FBBF24" },
    { name: "Проекти_Екип", itemsCount: "12 файла", color: "#60A5FA" },
    { name: "Учебни_материали", itemsCount: "4 файла", color: "#34D399" }
  ];
  const defaultFiles = [
    { name: "query.docx", type: "word", shared: true },
    { name: "Доклад_Природа.docx", type: "word", shared: true },
    { name: "Презентация.pptx", type: "powerpoint", shared: true }
  ];
  const sidebarList = (spec.leftSidebar && spec.leftSidebar.length) ? spec.leftSidebar : defaultSidebar;
  const folderList = (spec.folders && spec.folders.length) ? spec.folders : defaultFolders;
  const fileList = (spec.files && spec.files.length) ? spec.files : defaultFiles;
  const cloudAsset = spec.assetPath;

  if (cloudAsset) {
    return '<div class="cloud-storage-mockup cloud-asset-img">'
      + '<img class="cloud-asset-img-el" src="' + esc(cloudAsset) + '" alt="' + esc((b && b.title) || 'Облачна услуга') + '" />'
      + '</div>';
  }

  const navItems = sidebarList.map((item, i) => {
    const icon = i === 0 ? 'fas fa-hdd' : i === 1 ? 'fas fa-user-friends' : i === 2 ? 'fas fa-clock' : 'fas fa-trash-alt';
    return '<div class="cloud-nav-item' + (i === 0 ? ' active' : '') + '">'
      + '<i class="' + icon + '"></i><span>' + esc(item) + '</span>'
      + '</div>';
  }).join('');

  const folders = folderList.map(f =>
    '<div class="cloud-folder-card">'
    + '<i class="fas fa-folder" style="color:' + esc(f.color || '#FBBF24') + '"></i>'
    + '<div class="cloud-folder-details">'
    + '<span class="cloud-folder-name">' + esc(f.name || '') + '</span>'
    + '<span class="cloud-folder-count">' + esc(f.itemsCount || '') + '</span>'
    + '</div>'
    + '<i class="fas fa-ellipsis-v cloud-more"></i>'
    + '</div>'
  ).join('');

  const files = fileList.map(fl => {
    const isDoc = fl.type === 'word' || (fl.name && fl.name.endsWith('.docx'));
    const icon = isDoc ? 'fas fa-file-word' : 'fas fa-file-powerpoint';
    const iconColor = isDoc ? '#2563EB' : '#EA580C';
    const sharedBadge = fl.shared ? '<span class="cloud-badge-shared"><i class="fas fa-user-friends"></i> Споделен</span>' : '';

    return '<div class="cloud-file-row">'
      + '<i class="' + icon + '" style="color:' + iconColor + '"></i>'
      + '<span class="cloud-file-name">' + esc(fl.name || '') + '</span>'
      + sharedBadge
      + '<span class="cloud-file-time">Редактиран днес</span>'
      + '</div>';
  }).join('');

  return '<div class="cloud-storage-mockup">'
    + '<div class="cloud-toolbar">'
    + '<div class="cloud-logo"><i class="fas fa-cloud"></i> Google Drive & OneDrive · Облачно хранилище</div>'
    + '<div class="cloud-search"><i class="fas fa-search"></i> <span>Търсене в Диск...</span></div>'
    + '<div class="cloud-status"><i class="fas fa-check-circle"></i> Синхронизирано</div>'
    + '</div>'
    + '<div class="cloud-body">'
    + '<aside class="cloud-sidebar">'
    + '<button type="button" class="cloud-new-btn"><i class="fas fa-plus"></i> Нов файл</button>'
    + '<div class="cloud-nav-list">' + navItems + '</div>'
    + '</aside>'
    + '<main class="cloud-main">'
    + '<div class="cloud-section-heading">Папки</div>'
    + '<div class="cloud-folders-grid">' + folders + '</div>'
    + '<div class="cloud-section-heading">Файлове</div>'
    + '<div class="cloud-files-list">' + files + '</div>'
    + '</main>'
    + '</div>'
    + '</div>';
}

// Permission matrix cards
function renderPermissionMatrix(spec) {
  const cards = (spec.permissions || []).map(p =>
    '<div class="perm-card" style="border-top-color:' + esc(p.color) + '">'
    + '<div class="perm-icon-wrapper" style="background:' + tint(p.color) + ';color:' + esc(p.color) + '">'
    + '<i class="' + esc(p.icon || 'fas fa-shield-alt') + '"></i>'
    + '</div>'
    + '<div class="perm-role" style="color:' + esc(p.color) + '">' + esc(p.role || '') + '</div>'
    + '<div class="perm-action">' + esc(p.action || '') + '</div>'
    + '<div class="perm-usecase">'
    + '<span class="perm-usecase-tag"><i class="fas fa-lightbulb"></i> Препоръка:</span> '
    + '<span>' + esc(p.useCase || '') + '</span>'
    + '</div>'
    + '</div>'
  ).join('');

  return '<div class="perm-matrix-grid">' + cards + '</div>';
}

// Multi-step flowchart for sharing resources
function renderFlowchartSteps(spec) {
  const stepsHtml = (spec.steps || []).map((s, idx, arr) =>
    '<div class="step-card">'
    + '<div class="step-num">' + esc(s.num || (idx + 1)) + '</div>'
    + '<div class="step-ico"><i class="' + esc(s.icon || 'fas fa-check') + '"></i></div>'
    + '<div class="step-text">' + esc(s.label || '') + '</div>'
    + '</div>'
    + (idx < arr.length - 1 ? '<div class="step-arrow"><i class="fas fa-chevron-right"></i></div>' : '')
  ).join('');

  const warning = spec.warningNotice
    ? '<div class="flow-warning-box"><i class="fas fa-exclamation-triangle"></i> <span>' + esc(spec.warningNotice) + '</span></div>'
    : '';

  return '<div class="flowchart-steps-container">'
    + '<div class="flowchart-steps-track">' + stepsHtml + '</div>'
    + warning
    + '</div>';
}

// Real-time collaborative document editor mockup
function renderRealtimeDocEditor(spec) {
  const defaultUsers = [
    { name: "Мария Иванова", color: "#10B981", avatar: "M" },
    { name: "Иван Петров", color: "#8B5CF6", avatar: "I" }
  ];
  const defaultContent = [
    { text: "България разполага с богати природни ресурси.", cursor: null },
    { text: " В този проект разглеждаме националните паркове.", cursor: { user: "Мария", color: "#10B981" } },
    { text: " Нашата цел е опазване на биологичното разнообразие и представянето му пред класа.", cursor: { user: "Иван", color: "#8B5CF6" } }
  ];
  const defaultComments = [
    { author: "Мария", time: "10:15", text: "Може ли да добавим информация за Национален парк Рила?" },
    { author: "Иван", time: "10:18", text: "Чудесна идея! Добавям точките от работния лист." }
  ];

  const userList = (spec.activeUsers && spec.activeUsers.length) ? spec.activeUsers : defaultUsers;
  const contentList = (spec.editorContent && spec.editorContent.length) ? spec.editorContent : defaultContent;
  const commentList = (spec.sideComments && spec.sideComments.length) ? spec.sideComments : defaultComments;

  const avatars = userList.map(u =>
    '<span class="editor-user-avatar" style="background:' + esc(u.color) + '" title="' + esc(u.name) + '">'
    + esc(u.avatar || (u.name ? u.name.charAt(0) : 'U'))
    + '</span>'
  ).join('');

  const paragraphs = contentList.map(c => {
    const cursor = c.cursor
      ? '<span class="live-cursor" style="border-left-color:' + esc(c.cursor.color) + '">'
        + '<span class="cursor-flag" style="background:' + esc(c.cursor.color) + '">' + esc(c.cursor.user) + '</span>'
        + '</span>'
      : '';
    return '<p class="editor-para">' + esc(c.text || '') + cursor + '</p>';
  }).join('');

  const comments = commentList.map(comm =>
    '<div class="comment-bubble">'
    + '<div class="comment-head">'
    + '<strong>' + esc(comm.author || '') + '</strong>'
    + '<span class="comment-time">' + esc(comm.time || '') + '</span>'
    + '</div>'
    + '<div class="comment-body">' + esc(comm.text || '') + '</div>'
    + '</div>'
  ).join('');

  const highlight = (spec.featureHighlight || 'Всички промени се запазват в облака автоматично на всяка секунда')
    ? '<div class="editor-footer-highlight"><i class="fas fa-history"></i> <span>' + esc(spec.featureHighlight || 'Всички промени се запазват в облака автоматично на всяка секунда') + '</span></div>'
    : '';

  return '<div class="doc-editor-mockup">'
    + '<div class="editor-header">'
    + '<div class="editor-title-row">'
    + '<i class="fas fa-file-word editor-doc-icon"></i>'
    + '<div class="editor-title-wrap">'
    + '<span class="editor-doc-title">' + esc(spec.documentTitle || 'Документ: Околна_среда_Проект.docx') + '</span>'
    + '<span class="editor-saved-status"><i class="fas fa-cloud-upload-alt"></i> Всички промени са запазени в Диск</span>'
    + '</div>'
    + '</div>'
    + '<div class="editor-users-bar">'
    + avatars
    + '<span class="editor-version-btn"><i class="fas fa-history"></i> История на версиите</span>'
    + '</div>'
    + '</div>'
    + '<div class="editor-ribbon">'
    + '<button type="button" class="ribbon-btn active"><i class="fas fa-bold"></i></button>'
    + '<button type="button" class="ribbon-btn"><i class="fas fa-italic"></i></button>'
    + '<button type="button" class="ribbon-btn"><i class="fas fa-underline"></i></button>'
    + '<span class="ribbon-sep"></span>'
    + '<button type="button" class="ribbon-btn"><i class="fas fa-align-left"></i></button>'
    + '<button type="button" class="ribbon-btn"><i class="fas fa-align-center"></i></button>'
    + '<span class="ribbon-sep"></span>'
    + '<span class="ribbon-indicator"><i class="fas fa-users"></i> Съвместно редактиране (Co-authoring)</span>'
    + '</div>'
    + '<div class="editor-workspace">'
    + '<div class="editor-page">'
    + '<div class="editor-page-content">' + paragraphs + '</div>'
    + '</div>'
    + '<aside class="editor-comments-side">'
    + '<div class="comments-heading"><i class="fas fa-comments"></i> Коментари и бележки</div>'
    + comments
    + '</aside>'
    + '</div>'
    + highlight
    + '</div>';
}

// Group email distribution diagram
function renderGroupEmailDiagram(spec) {
  const recipients = (spec.recipients || []).map(r =>
    '<span class="recipient-pill"><i class="fas fa-user-graduate"></i> ' + esc(r) + '</span>'
  ).join('');

  return '<div class="group-email-diagram">'
    + '<div class="email-broadcast-wrap">'
    + '<div class="email-sender-box">'
    + '<div class="email-icon"><i class="fas fa-paper-plane"></i></div>'
    + '<div class="email-sender-title">Подател</div>'
    + '<div class="email-sender-sub">Учител / Ученик</div>'
    + '</div>'
    + '<div class="email-flow-arrow"><i class="fas fa-arrow-right"></i></div>'
    + '<div class="email-hub-box">'
    + '<div class="hub-badge"><i class="fas fa-mail-bulk"></i> Групов адрес</div>'
    + '<div class="hub-address">' + esc(spec.centralAddress || '') + '</div>'
    + '<div class="hub-desc">' + esc(spec.description || '') + '</div>'
    + '</div>'
    + '<div class="email-flow-arrow"><i class="fas fa-arrow-right"></i></div>'
    + '<div class="email-recipients-box">'
    + '<div class="recipients-title"><i class="fas fa-users"></i> Получават едновременно:</div>'
    + '<div class="recipients-grid">' + recipients + '</div>'
    + '</div>'
    + '</div>'
    + '</div>';
}

// Video lesson preview block
function renderVideoBlock(b) {
  const spec = b.mediaSpec || {};
  const topics = (spec.topicsCovered || []).map(top =>
    '<div class="topic-item"><i class="fas fa-check-circle"></i><span>' + esc(top) + '</span></div>'
  ).join('');

  const videoUrl = spec.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1';
  return '<div class="video-lesson-card">'
    + '<div class="video-screen-banner">'
    + '<a class="video-overlay-play" href="' + esc(videoUrl) + '" target="_blank" rel="noopener" aria-label="Гледай видео упътването" title="Отвори в YouTube">'
    + '<div class="play-btn-circle"><i class="fas fa-play"></i></div>'
    + '</a>'
    + '<div class="video-conference-ui">'
    + '<div class="conf-top-bar">'
    + '<span class="conf-dot red"></span>'
    + '<span class="conf-title"><i class="fas fa-video"></i> Онлайн сесия · Учебно видео</span>'
    + '<span class="conf-pill-live">REC ●</span>'
    + '</div>'
    + '<div class="conf-grid-sim">'
    + '<div class="conf-tile teacher"><i class="fas fa-chalkboard-teacher"></i> Учител (Организатор)</div>'
    + '<div class="conf-tile screen"><i class="fas fa-desktop"></i> Споделен прозорец</div>'
    + '</div>'
    + '</div>'
    + '<div class="video-meta-bar">'
    + '<span class="video-duration"><i class="fas fa-clock"></i> ' + esc(spec.duration || '04:12') + '</span>'
    + '<span class="video-quality">1080p Full HD</span>'
    + '</div>'
    + '</div>'
    + '<div class="video-info-pane">'
    + '<div class="video-info-title">' + esc(b.title || 'Видео урок: Правила за онлайн сесия') + '</div>'
    + '<div class="video-topics-list">'
    + '<div class="topics-heading"><i class="fas fa-list-check"></i> Ключови акценти:</div>'
    + topics
    + '</div>'
    + '</div>'
    + '</div>';
}

// Google Forms UI Mockups for Lesson 1.3

function renderGoogleFormsQuizSettingsUI(spec) {
  return `
    <div class="gforms-mockup">
      <div class="gforms-topbar">
        <div class="gforms-left">
          <i class="fas fa-file-lines gforms-purple-icon"></i>
          <span class="gforms-title">Тест по Информационни технологии - 8. клас</span>
          <span class="gforms-folder"><i class="far fa-folder"></i></span>
          <span class="gforms-star"><i class="far fa-star"></i></span>
        </div>
        <div class="gforms-tabs">
          <span class="gforms-tab">Въпроси</span>
          <span class="gforms-tab">Отговори <span class="gforms-badge-zero">0</span></span>
          <span class="gforms-tab active">Настройки</span>
        </div>
        <div class="gforms-right">
          <span class="gforms-btn-preview"><i class="far fa-eye"></i></span>
          <span class="gforms-btn-send"><i class="fas fa-paper-plane"></i> Изпрати</span>
        </div>
      </div>

      <div class="gforms-settings-container">
        <div class="gforms-setting-card primary-setting">
          <div class="gforms-setting-row">
            <div class="gforms-setting-info">
              <div class="gforms-setting-name"><i class="fas fa-award text-purple-600"></i> Направете това тест (Make this a quiz)</div>
              <div class="gforms-setting-sub">Задавайте точкови стойности, избирайте верни отговори и осигурете автоматично оценяване на теста.</div>
            </div>
            <div class="gforms-switch active"><span class="gforms-switch-knob"></span></div>
          </div>
          <div class="gforms-quiz-suboptions">
            <div class="gforms-sub-header">Публикуване на оценките (Release grades):</div>
            <label class="gforms-radio-mock checked">
              <span class="gforms-radio-dot"></span>
              <span><strong>Веднага след всяко изпращане</strong> (Immediately after each submission)</span>
            </label>
            <label class="gforms-radio-mock">
              <span class="gforms-radio-dot"></span>
              <span>По-късно, след ръчна проверка (Later, after manual review)</span>
            </label>
          </div>
        </div>

        <div class="gforms-setting-card">
          <div class="gforms-setting-card-title"><i class="fas fa-shield-halved text-purple-600"></i> Събиране на отговори и сигурност</div>
          <div class="gforms-setting-row">
            <div class="gforms-setting-info">
              <div class="gforms-setting-name">Събиране на имейл адреси (Collect email addresses)</div>
              <div class="gforms-setting-sub">Задължително идентифициране на учениците от училищната общност.</div>
            </div>
            <div class="gforms-badge-on">Проверени (Verified)</div>
          </div>
          <div class="gforms-setting-row">
            <div class="gforms-setting-info">
              <div class="gforms-setting-name">Ограничаване до 1 отговор (Limit to 1 response)</div>
              <div class="gforms-setting-sub">Учениците попълват теста само веднъж чрез своя акаунт.</div>
            </div>
            <div class="gforms-switch active"><span class="gforms-switch-knob"></span></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderGoogleFormsQuestionTypesUI(spec) {
  return `
    <div class="gforms-mockup">
      <div class="gforms-topbar">
        <div class="gforms-left">
          <i class="fas fa-file-lines gforms-purple-icon"></i>
          <span class="gforms-title">Тест по Информационни технологии - 8. клас</span>
        </div>
        <div class="gforms-tabs">
          <span class="gforms-tab active">Въпроси</span>
          <span class="gforms-tab">Отговори</span>
          <span class="gforms-tab">Настройки</span>
        </div>
      </div>

      <div class="gforms-editor-area">
        <div class="gforms-question-card active">
          <div class="gforms-q-top">
            <div class="gforms-q-input-wrap">
              <input type="text" class="gforms-q-input" value="Кои са главните компоненти на съвременната компютърна система?" readonly>
            </div>
            <div class="gforms-q-type-dropdown-preview">
              <span class="gforms-type-current"><i class="far fa-square-check text-purple-600"></i> Квадратчета (Checkboxes) <i class="fas fa-caret-down"></i></span>
            </div>
          </div>

          <!-- Simulated dropdown showcasing types -->
          <div class="gforms-dropdown-menu-mock">
            <div class="gforms-menu-title"><i class="fas fa-list-check text-purple-600"></i> Видове въпроси в Google Forms за теста:</div>
            <div class="gforms-types-grid">
              <div class="gforms-type-item"><i class="fas fa-align-left text-slate-500"></i> Кратък отговор (Short answer) <span class="gforms-hint-pill">Име, Имейл</span></div>
              <div class="gforms-type-item"><i class="fas fa-bars-staggered text-slate-500"></i> Абзац (Paragraph) <span class="gforms-hint-pill">Разширен текст</span></div>
              <div class="gforms-type-item"><i class="far fa-circle-dot text-slate-500"></i> Множествен избор (Multiple choice) <span class="gforms-hint-pill">1 верен отговор</span></div>
              <div class="gforms-type-item selected"><i class="far fa-square-check text-purple-600"></i> <strong>Квадратчета (Checkboxes)</strong> <span class="gforms-hint-pill purple">няколко верни</span></div>
              <div class="gforms-type-item"><i class="far fa-circle-down text-slate-500"></i> Падащо меню (Dropdown) <span class="gforms-hint-pill">Избор на клас</span></div>
              <div class="gforms-type-item"><i class="fas fa-arrows-left-right text-slate-500"></i> Линейна скала (Linear scale) <span class="gforms-hint-pill">Самооценка 1-5</span></div>
              <div class="gforms-type-item"><i class="fas fa-border-all text-slate-500"></i> Мрежа от квадратчета (Grid) <span class="gforms-hint-pill">Съпоставяне</span></div>
            </div>
          </div>

          <div class="gforms-q-media-cta">
            <span class="gforms-image-btn"><i class="far fa-image text-purple-600"></i> Вмъкване на снимка ('photo_metadata.jpg')</span>
            <span class="gforms-req-toggle">Задължително (Required) <span class="gforms-switch active"><span class="gforms-switch-knob"></span></span></span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderGoogleFormsAnswerKeyUI(spec) {
  return `
    <div class="gforms-mockup">
      <div class="gforms-topbar">
        <div class="gforms-left">
          <i class="fas fa-file-lines gforms-purple-icon"></i>
          <span class="gforms-title">Тест по Информационни технологии · Настройка на Answer Key</span>
        </div>
      </div>

      <div class="gforms-editor-area">
        <div class="gforms-question-card answer-key-mode">
          <div class="gforms-answer-key-banner">
            <div class="gforms-ak-title"><i class="fas fa-key text-emerald-600"></i> Ключ за верни отговори (Answer Key)</div>
            <div class="gforms-points-box">
              <span>Точки:</span>
              <span class="gforms-points-stepper"><strong>2</strong> т.</span>
            </div>
          </div>

          <p class="gforms-q-static">Кои са главните компоненти на съвременната компютърна система?</p>

          <div class="gforms-options-checkable">
            <div class="gforms-opt-row correct">
              <i class="fas fa-circle-check text-emerald-600"></i>
              <span class="gforms-opt-text"><strong>Хардуер (Hardware)</strong> – физическите устройства</span>
              <span class="gforms-opt-badge-correct">Верен отговор</span>
            </div>
            <div class="gforms-opt-row correct">
              <i class="fas fa-circle-check text-emerald-600"></i>
              <span class="gforms-opt-text"><strong>Софтуер (Software)</strong> – програмите и ОС</span>
              <span class="gforms-opt-badge-correct">Верен отговор</span>
            </div>
            <div class="gforms-opt-row correct">
              <i class="fas fa-circle-check text-emerald-600"></i>
              <span class="gforms-opt-text"><strong>Потребителски данни (Data)</strong> – информацията</span>
              <span class="gforms-opt-badge-correct">Верен отговор</span>
            </div>
            <div class="gforms-opt-row">
              <i class="far fa-circle text-slate-300"></i>
              <span class="gforms-opt-text">Електрически трансформатор</span>
            </div>
          </div>

          <div class="gforms-feedback-block">
            <div class="gforms-feedback-header"><i class="fas fa-comment-dots text-purple-600"></i> Обратна връзка при отговаряне:</div>
            <div class="gforms-feedback-body">„Компютърната система представлява единство от хардуер, софтуер и данни, обработвани от потребителя.“</div>
          </div>

          <div class="gforms-ak-footer">
            <button type="button" class="gforms-btn-done"><i class="fas fa-check"></i> Готово (Done)</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderGoogleFormsShareLinkUI(spec) {
  return `
    <div class="gforms-mockup">
      <div class="gforms-send-modal-backdrop">
        <div class="gforms-send-modal">
          <div class="gforms-modal-header">
            <h5><i class="fas fa-share-nodes text-purple-600"></i> Изпращане на формуляр (Send form)</h5>
            <span class="gforms-modal-close">&times;</span>
          </div>

          <div class="gforms-send-tabs">
            <span class="gforms-send-tab"><i class="far fa-envelope"></i> Имейл</span>
            <span class="gforms-send-tab active"><i class="fas fa-link"></i> Връзка (Link)</span>
            <span class="gforms-send-tab"><i class="fas fa-code"></i> HTML вграждане</span>
          </div>

          <div class="gforms-send-body">
            <label class="gforms-link-label">Връзка за попълване на теста от съучениците:</label>
            <div class="gforms-link-input-row">
              <input type="text" class="gforms-link-field" value="https://forms.gle/xK89Qv4Rt2m9IT8" readonly>
              <button type="button" class="gforms-btn-copy-action"><i class="fas fa-copy"></i> Копиране</button>
            </div>

            <div class="gforms-shorten-checkbox-row">
              <label class="gforms-checkbox-custom">
                <input type="checkbox" checked disabled>
                <span class="gforms-chk-box"><i class="fas fa-check"></i></span>
                <span><strong>Скъсяване на URL адреса (Shorten URL)</strong></span>
              </label>
              <span class="gforms-tip-pill"><i class="fas fa-wand-magic-sparkles"></i> Препоръчително за лесно споделяне</span>
            </div>

            <div class="gforms-security-notice">
              <i class="fas fa-shield-halved text-purple-600"></i>
              <span>Формулярът автоматично ще изисква вход с училищен Google акаунт и ще запише имейла на респондента.</span>
            </div>
          </div>

          <div class="gforms-modal-footer">
            <button type="button" class="gforms-btn-cancel">Отказ</button>
            <button type="button" class="gforms-btn-primary"><i class="fas fa-copy"></i> Копирай връзката</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 2x2 grid infographic (also supports grid-2x3 / 5-card layouts via same card style)
function renderInfographicGrid2x2(spec) {
  const cards = (spec.cards || []).map(c =>
    '<div class="info-card" style="border-left-color:' + esc(c.color) + '">'
    + '<div class="info-card-header">'
    + '<div class="info-icon" style="background:' + tint(c.color) + ';color:' + esc(c.color) + '">'
    + '<i class="' + esc(c.icon || 'fas fa-info') + '"></i>'
    + '</div>'
    + '<div class="info-title" style="color:' + esc(c.color) + '">' + esc(c.title || '') + '</div>'
    + '</div>'
    + '<div class="info-body">' + esc(c.text || c.subtext || '') + '</div>'
    + '</div>'
    ).join('');

  const layoutClass = spec.layout || 'grid-2x2';
  return '<div class="infographic-2x2-grid ' + esc(layoutClass) + '">' + cards + '</div>';
}

// Session rules cards with optional start button
function renderSessionRules(spec) {
  const rules = (spec.rules || []).map(r =>
    '<div class="session-rule-card">'
    + '<div class="session-rule-icon">'
    + '<i class="' + esc(r.icon || 'fas fa-check-circle') + '"></i>'
    + '</div>'
    + '<div class="session-rule-body">'
    + '<div class="session-rule-title">' + esc(r.title || '') + '</div>'
    + (r.desc ? '<div class="session-rule-desc">' + esc(r.desc || '') + '</div>' : '')
    + '</div>'
    + '</div>'
  ).join('');

  const startBtn = spec.startButton
    ? '<div class="session-rules-start">'
    + '<a href="' + esc(spec.startButton.href || '') + '" class="session-start-btn">'
    + '<i class="fas fa-play"></i> ' + esc(spec.startButton.text || 'Старт')
    + '</a>'
    + '</div>'
    : '';

  return '<div class="session-rules">'
    + rules
    + startBtn
    + '</div>';
}

// Block dispatcher

export function renderRichBlock(b) {
  const spec = b.mediaSpec || {};
  if (b.type === 'visualization') {
    switch (b.visualType) {
      case 'split-diagram':          return vizWrapper(b, renderSplitDiagram(spec));
      case 'tree-diagram':           return vizWrapper(b, renderTreeDiagram(spec));
      case 'mindmap':                return vizWrapper(b, renderMindmap(spec));
      case 'flowchart-horizontal':   return vizWrapper(b, renderFlowchart(spec));
      case 'lms-ecosystem-diagram':  return vizWrapper(b, renderLmsEcosystem(spec, b));
      case 'comparison-cards-sync':  return vizWrapper(b, renderComparisonCardsSync(spec));
      case 'permission-matrix':      return vizWrapper(b, renderPermissionMatrix(spec));
      case 'flowchart-steps':        return vizWrapper(b, renderFlowchartSteps(spec));
      case 'session-rules':         return vizWrapper(b, renderSessionRules(spec));
      default: return '<!-- unknown visualType: ' + esc(b.visualType) + ' -->';
    }
  }
  if (b.type === 'ui-mockup') {
    let inner = '';
    if (spec.component === 'SmartphoneChatMockup')        inner = renderChatMockup(spec);
    else if (spec.component === 'BlogPageMockup')         inner = renderBlogMockup(spec);
    else if (spec.component === 'PrivacySettingsPanel')   inner = renderPrivacyMockup(spec);
    else if (spec.component === 'CloudStorageMockup' || spec.component === 'CloudStorageRealUI') inner = renderCloudStorageMockup(spec, b);
    else if (spec.component === 'RealtimeDocumentEditor' || spec.component === 'RealtimeDocumentEditorUI') inner = renderRealtimeDocEditor(spec);
    else if (spec.component === 'GoogleFormsQuizSettingsUI') inner = renderGoogleFormsQuizSettingsUI(spec);
    else if (spec.component === 'GoogleFormsQuestionTypesUI') inner = renderGoogleFormsQuestionTypesUI(spec);
    else if (spec.component === 'GoogleFormsAnswerKeyUI') inner = renderGoogleFormsAnswerKeyUI(spec);
    else if (spec.component === 'GoogleFormsShareLinkUI') inner = renderGoogleFormsShareLinkUI(spec);
    else return '<!-- unknown ui-mockup component: ' + esc(spec.component) + ' -->';
    return vizWrapper(b, inner);
  }
  if (b.type === 'infographic') {
    if (b.sections) return Infographic.render(b);
    if (spec.permissions)                      return vizWrapper(b, renderPermissionMatrix(spec));
    if (spec.layout === 'vertical-checklist') return vizWrapper(b, renderChecklist(spec));
    if (spec.layout === 'grid-2x2' || spec.layout === 'grid-2x3') return vizWrapper(b, renderInfographicGrid2x2(spec));
    return vizWrapper(b, renderRiskGrid(spec));
  }
  if (b.type === 'video')        return vizWrapper(b, renderVideoBlock(b));
  if (b.type === 'table')        return vizWrapper(b, renderTable(b));
  if (b.type === 'glossary-list') return renderGlossaryList(b);
  if (b.type === 'titled-image') return vizWrapper(b, renderTitledImage(b));
  if (b.type === 'media-types')  return vizWrapper(b, renderMediaTypes(b));
  return '<!-- unknown rich media block: ' + esc(b.type) + ' -->';
}