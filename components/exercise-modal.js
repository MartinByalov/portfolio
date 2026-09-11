// Exercise modal component

function formatInstructions(text) {
  if (!text) return '';
  let s = String(text);
  s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*(.*?)\*/g, '<em>$1</em>');
  if (!/<[a-z][\s\S]*>/i.test(s)) {
    return s.split(/\n\s*\n/).map(p => '<p>' + p.trim().replace(/\n/g, '<br>') + '</p>').join('');
  }
  return s;
}

export function render(comp) {
  const illustration = (comp.mediaInstruction || (comp.mediaSpec && comp.mediaSpec.illustration) || (comp.id === 'exerciseModal')) ? `
    <div class="case-study-banner">
      <div class="case-study-graphic">
        <div class="case-folder-mock">
          <i class="fas fa-folder-open folder-ico"></i>
          <span class="warning-badge"><i class="fas fa-triangle-exclamation"></i> Публичен достъп: Редактиране</span>
        </div>
        <div class="case-tag-line">
          <strong>Ситуация:</strong> Открит е списък с лични данни (телефони и адреси) в публично достъпна папка без защита!
        </div>
      </div>
    </div>
  ` : '';

  const resources = (comp.resources || []).map(r => `
    <a href="${r.href}" target="_blank" class="resource-item">
      <i class="${r.icon}"></i>
      <span>${r.label}</span>
    </a>
  `).join('');

  return `
    <div id="${comp.id}" class="lesson-modal">
      <div class="modal-wrapper">
        <div class="modal-header">
          <h3 class="modal-title">${comp.title}</h3>
          <button type="button" class="close-modal" data-close-modal="${comp.id}">&times;</button>
        </div>
        <div class="modal-body exercise-modal-content">
          ${illustration}
          <div class="exercise-instructions">
            ${formatInstructions(comp.instructions)}
            ${resources ? `
              <h5 class="resource-section-title">Ресурсни файлове</h5>
              <div class="resource-list">${resources}</div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function init(comp) {
  const modal = document.getElementById(comp.id);
  if (!modal) return;

  const close = () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  };

  modal.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', close);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
}
