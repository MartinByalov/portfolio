// System Anatomy Map — interactive exploration of parts and their connections

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

export function render(comp) {
  const parts = comp.parts || [];
  const first = parts[0] || {};
  const buttons = parts.map((part, index) => `
    <button type="button" class="sam-node ${index === 0 ? 'active' : ''}" data-index="${index}" style="--sam-color:${esc(part.color || '#4f46e5')}">
      <i class="${esc(part.icon)}"></i><span>${esc(part.label)}</span>
    </button>
  `).join('');
  return `
    <section class="system-anatomy-map" id="${esc(comp.id)}">
      <div class="sam-header"><span><i class="fas fa-route"></i> ИНТЕРАКТИВЕН МОДЕЛ</span><h3>${esc(comp.title)}</h3><p>${esc(comp.instruction)}</p></div>
      <div class="sam-layout">
        <div class="sam-stage">
          <div class="sam-placeholder"><i class="fas fa-computer"></i><strong>[IMAGE_PLACEHOLDER: ${esc(comp.placeholder)}]</strong><span>${esc(comp.placeholderInstruction)}</span></div>
          <div class="sam-node-grid">${buttons}</div>
          <div class="sam-bus"><span>адресна шина</span><span>шина за данни</span><span>управляваща шина</span></div>
        </div>
        <aside class="sam-detail" style="--sam-color:${esc(first.color || '#4f46e5')}">
          <div class="sam-detail-icon"><i class="${esc(first.icon)}"></i></div>
          <span class="sam-detail-type">${esc(first.type)}</span>
          <h4 class="sam-detail-title">${esc(first.label)}</h4>
          <p class="sam-detail-role">${esc(first.role)}</p>
          <div class="sam-detail-question"><strong>Попитайте:</strong><span>${esc(first.question)}</span></div>
          <div class="sam-detail-connection"><strong>Работи пряко с:</strong><span>${esc(first.connection)}</span></div>
        </aside>
      </div>
    </section>`;
}

export function init(comp) {
  const root = document.getElementById(comp.id);
  const parts = comp.parts || [];
  if (!root) return;
  root.querySelectorAll('.sam-node').forEach(button => button.addEventListener('click', () => {
    const part = parts[Number(button.dataset.index)];
    if (!part) return;
    root.querySelectorAll('.sam-node').forEach(node => node.classList.toggle('active', node === button));
    const detail = root.querySelector('.sam-detail');
    detail.style.setProperty('--sam-color', part.color || '#4f46e5');
    detail.querySelector('.sam-detail-icon').innerHTML = `<i class="${esc(part.icon)}"></i>`;
    detail.querySelector('.sam-detail-type').textContent = part.type || '';
    detail.querySelector('.sam-detail-title').textContent = part.label || '';
    detail.querySelector('.sam-detail-role').textContent = part.role || '';
    detail.querySelector('.sam-detail-question span').textContent = part.question || '';
    detail.querySelector('.sam-detail-connection span').textContent = part.connection || '';
  }));
}