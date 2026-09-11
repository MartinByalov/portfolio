// Exercise modal component

export function render(comp) {
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
          <div class="exercise-instructions">
            ${comp.instructions}
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
