export function render(comp) {
  const nodesHtml = comp.nodes.map(n => `
    <div class="vis-node" style="border-left: 4px solid ${n.color || '#ccc'}; padding: 1rem; background: var(--surface); border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
        <i class="${n.icon}" style="color: ${n.color || '#333'}; font-size: 1.5rem;"></i>
        <h4 style="margin: 0; font-size: 1.1rem; color: var(--text-color);">${n.label}</h4>
      </div>
      <p style="margin: 0; color: var(--text-muted);">${n.description}</p>
    </div>
  `).join('');

  return `
    <div id="${comp.id}" class="visualization-container" style="margin: 2rem 0;">
      ${comp.title ? `<h3 style="margin-bottom: 1rem;">${comp.title}</h3>` : ''}
      <div class="vis-nodes" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
        ${nodesHtml}
      </div>
    </div>
  `;
}
