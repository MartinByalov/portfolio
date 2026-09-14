export function render(comp) {
  const milestonesHtml = comp.milestones.map((m, idx) => `
    <div class="timeline-item" style="display: flex; gap: 1rem; margin-bottom: 1.5rem; position: relative;">
      <div class="timeline-marker" style="display: flex; flex-direction: column; align-items: center; min-width: 60px;">
        <div style="background: ${m.color || '#ccc'}; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 2;">
          <i class="${m.icon || 'fas fa-circle'}"></i>
        </div>
        ${idx < comp.milestones.length - 1 ? `<div style="flex: 1; width: 2px; background: #e5e7eb; margin-top: 4px;"></div>` : ''}
      </div>
      <div class="timeline-content" style="background: var(--surface); padding: 1rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); flex: 1; border-top: 3px solid ${m.color || '#ccc'};">
        <div style="font-size: 0.85rem; font-weight: bold; color: ${m.color || '#666'}; text-transform: uppercase; margin-bottom: 0.25rem;">${m.year} | ${m.era}</div>
        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">${m.title}</h4>
        <p style="margin: 0; color: var(--text-muted);">${m.description}</p>
      </div>
    </div>
  `).join('');

  return `
    <div id="${comp.id}" class="interactive-timeline-container" style="margin: 2rem 0;">
      ${comp.title ? `<h3 style="margin-bottom: 1.5rem;">${comp.title}</h3>` : ''}
      <div class="timeline-wrapper">
        ${milestonesHtml}
      </div>
    </div>
  `;
}
