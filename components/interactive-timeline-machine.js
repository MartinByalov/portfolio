// Interactive Timeline Machine Component
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(b) {
  const stages = b.stages || [];
  const id = b.id || 'timeline-machine';
  const title = b.title || 'Интерактивна машина на времето';

  const navBtns = stages.map((stg, idx) => `
    <button type="button" class="itm-stage-btn ${idx === 0 ? 'active' : ''}" data-target="${id}-stage-${idx}">
      <span class="itm-stage-icon"><i class="${esc(stg.icon || 'fas fa-clock')}"></i></span>
      <span class="itm-stage-title">${esc(stg.title)}</span>
    </button>
  `).join('');

  const stagePanels = stages.map((stg, idx) => `
    <div class="itm-stage-panel ${idx === 0 ? 'active' : ''}" id="${id}-stage-${idx}">
      <div class="itm-panel-header">
        <div class="itm-panel-badge"><i class="${esc(stg.icon || 'fas fa-cogs')}"></i> ${esc(stg.keyInvention || 'Ключово откритие')}</div>
        <h4 class="itm-panel-title">${esc(stg.title)}</h4>
      </div>
      <p class="itm-panel-desc">${esc(stg.description)}</p>
    </div>
  `).join('');

  return `
    <div class="itm-container" id="${esc(id)}">
      <div class="itm-header">
        <h3 class="itm-main-title"><i class="fas fa-hourglass-half"></i> ${esc(title)}</h3>
        <p class="itm-sub">Кликнете върху етапите, за да преминете през еволюцията на изчислителната техника:</p>
      </div>
      <div class="itm-nav-bar">
        ${navBtns}
      </div>
      <div class="itm-panels-wrap">
        ${stagePanels}
      </div>
    </div>
  `;
}

export function init(b) {
  const root = document.getElementById(b.id || 'timeline-machine');
  if (!root) return;

  const btns = root.querySelectorAll('.itm-stage-btn');
  const panels = root.querySelectorAll('.itm-stage-panel');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      btns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePanel = root.querySelector('#' + CSS.escape(targetId));
      if (activePanel) activePanel.classList.add('active');
    });
  });
}
