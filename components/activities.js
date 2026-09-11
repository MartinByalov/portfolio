// Activity cards grid component

export function render(comp) {
  const cards = (comp.items || []).map(item => {
    const buttonAttrs = item.action === 'modal'
      ? `href="#" class="btn-activity" data-modal-target="${item.target}"`
      : `href="${item.href}" target="_blank" class="btn-activity"`;

    return `
      <div class="activity-card">
        <div class="activity-card-header">
          <i class="${item.icon}" style="color: ${item.color};"></i>
          <h3>${item.title}</h3>
        </div>
        <p>${item.description}</p>
        <a ${buttonAttrs}>${item.buttonText}</a>
      </div>
    `;
  }).join('');

  return `
    <section class="component activities" id="${comp.id || ''}">
      ${comp.heading ? `<h2 class="component-heading">${comp.heading}</h2>` : ''}
      <div class="activities-grid">${cards}</div>
    </section>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id);
  if (!root) return;

  root.querySelectorAll('[data-modal-target]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = document.getElementById(btn.dataset.modalTarget);
      if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    });
  });
}
