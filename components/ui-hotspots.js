// UI Hotspots - interactive mockup with clickable dots explaining UI buttons
// Used for: Google Docs / Word Online collaborative editing mockup

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const id = comp.id || 'ui-hotspots';
  const title = comp.title || 'Интерактивен макет';
  const instruction = comp.mediaInstruction || '';
  const spots = comp.hotspots || [];

  const dots = spots.map((h, i) =>
    '<button type="button" class="hotspot-dot' + (i === 0 ? ' active' : '') + '"'
    + ' data-hotspot-idx="' + i + '"'
    + ' style="left:' + esc(h.x) + '%;top:' + esc(h.y) + '%"'
    + ' aria-label="' + esc(h.title || ('Точка ' + (i + 1))) + '">'
    + '<span class="hotspot-pulse"></span>'
    + '<span class="hotspot-num">' + (i + 1) + '</span>'
    + '</button>'
  ).join('');

  const first = spots[0] || {};
  return '<div class="ui-hotspots-card" id="' + esc(id) + '">'
    + '<div class="interactive-card-header">'
    + '<div class="interactive-card-badge"><i class="fas fa-hand-pointer"></i><span>' + esc(title) + '</span></div>'
    + (instruction ? '<p class="interactive-card-lead">' + esc(instruction) + '</p>' : '')
    + '</div>'
    + '<div class="hotspots-stage">'
    + '<div class="hotspots-mockup">'
    + '<div class="hotspots-doc-bar"><span class="hotspots-doc-dot red"></span><span class="hotspots-doc-dot yellow"></span><span class="hotspots-doc-dot green"></span><span class="hotspots-doc-title"><i class="fas fa-file-word"></i> Етичен_код_Екип1.docx - споделен документ</span></div>'
    + '<div class="hotspots-doc-body">'
    + '<div class="hotspots-doc-lines"><span></span><span></span><span class="short"></span><span></span><span class="short"></span></div>'
    + '<div class="hotspots-doc-side"><span></span><span></span><span></span></div>'
    + '</div>'
    + dots
    + '</div>'
    + '<div class="hotspots-info">'
    + '<h4 class="hotspots-info-title"></h4>'
    + '<p class="hotspots-info-desc"></p>'
    + '<div class="hotspots-nav">'
    + '<button type="button" class="btn-activity hotspots-prev"><i class="fas fa-arrow-left"></i> Назад</button>'
    + '<span class="hotspots-counter"></span>'
    + '<button type="button" class="btn-activity hotspots-next">Напред <i class="fas fa-arrow-right"></i></button>'
    + '</div>'
    + '</div>'
    + '</div>'
    + '<div class="hotspots-data" style="display:none;" data-hotspots=\'' + JSON.stringify(spots).replace(/'/g, '&apos;') + '\'></div>'
    + '</div>';
}

export function init(comp) {
  const id = comp.id || 'ui-hotspots';
  const root = document.getElementById(id);
  if (!root) return;
  let spots = comp.hotspots || [];
  const dataEl = root.querySelector('.hotspots-data');
  if ((!spots.length) && dataEl && dataEl.dataset.hotspots) {
    try { spots = JSON.parse(dataEl.dataset.hotspots); } catch (e) { spots = []; }
  }
  if (!spots.length) return;

  const dots = Array.prototype.slice.call(root.querySelectorAll('.hotspot-dot'));
  const titleEl = root.querySelector('.hotspots-info-title');
  const descEl = root.querySelector('.hotspots-info-desc');
  const counterEl = root.querySelector('.hotspots-counter');
  const prevBtn = root.querySelector('.hotspots-prev');
  const nextBtn = root.querySelector('.hotspots-next');
  let idx = 0;

  function show(i) {
    idx = (i + spots.length) % spots.length;
    dots.forEach((d, di) => d.classList.toggle('active', di === idx));
    if (titleEl) titleEl.textContent = (idx + 1) + '. ' + (spots[idx].title || '');
    if (descEl) descEl.textContent = spots[idx].description || '';
    if (counterEl) counterEl.textContent = (idx + 1) + ' / ' + spots.length;
  }

  dots.forEach((d, di) => d.addEventListener('click', () => show(di)));
  if (prevBtn) prevBtn.addEventListener('click', () => show(idx - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => show(idx + 1));
  show(0);
}
