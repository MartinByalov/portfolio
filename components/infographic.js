function sanitizePath(src) {
  if (!src) return '';
  return src.replace(/^\[IMAGE_PLACEHOLDER:\s*/, '').replace(/\]$/, '').trim();
}

function renderImageOrPlaceholder(src, alt = '') {
  if (!src) return '';
  const cleanPath = sanitizePath(src);
  return `
    <img src="${src}" alt="${alt}" data-path="${cleanPath}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin: 0.5rem 0;" onerror="if(this.src.includes('cdn.jsdelivr.net')){this.src=this.src.replace('cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/','raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/');}else{this.onerror=null;this.outerHTML='<div class=\\'image-placeholder-box\\' style=\\'background: var(--surface-alt, #f8fafc); border: 1px dashed #cbd5e1; border-radius: 8px; padding: 0.75rem 0.5rem; text-align: center; color: #64748b; margin: 0.5rem 0;\\'><i class=\\'fas fa-microchip\\' style=\\'font-size: 1.5rem; color: #94a3b8; margin-bottom: 0.25rem; display: block;\\'></i><strong style=\\'display: block; font-size: 0.8rem; color: #334155; font-family: monospace;\\'>' + this.getAttribute('data-path') + '</strong></div>';}" />
  `;
}

export function render(comp) {
  const sections = comp.sections || [];
  const colors = ["#8b5cf6", "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];

  const sectionsHtml = sections.map((sec, idx) => {
    const color = colors[idx % colors.length];
    return `
      <div class="infographic-section" style="display: flex; flex-direction: column; text-align: center; padding: 1.25rem; background: var(--surface, #ffffff); border-radius: 12px; border: 2px solid ${color}30; box-shadow: 0 2px 4px rgba(0,0,0,0.03); transition: transform 0.2s;">
        <span style="background: ${color}20; color: ${color}; padding: 0.25rem 0.65rem; border-radius: 12px; font-weight: 700; font-size: 0.8rem; align-self: center; margin-bottom: 0.5rem;">
          ${sec.title}
        </span>
        
        ${sec.technology ? `<div style="font-size: 1.05rem; font-weight: 700; color: var(--text-color); margin-bottom: 0.25rem;">${sec.technology}</div>` : ''}
        
        ${renderImageOrPlaceholder(sec.image, sec.title)}

        ${sec.examples ? `<div style="font-size: 0.85rem; color: #64748b; margin-top: 0.35rem;"><strong>Примери:</strong> ${sec.examples}</div>` : ''}
        ${sec.description ? `<p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: var(--text-color); line-height: 1.4;">${sec.description}</p>` : ''}
      </div>
    `;
  }).join('');

  const hasHeader = Boolean(comp.badge || comp.title || comp.subtitle);
  const is2x2 = comp.layout === '2x2' || comp.id === 'memory-hierarchy-infographic';
  const gridStyle = is2x2
    ? 'display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem;'
    : 'display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem;';

  return `
    <div id="${comp.id}" class="infographic-container" style="margin: 0.5rem 0 1.25rem 0; padding: 1.25rem; background: var(--surface-alt, #f8fafc); border-radius: 16px; border: 1px solid var(--border-color, #e2e8f0);">
      ${hasHeader ? `
        <div style="text-align: center; max-width: 700px; margin: 0 auto 1.25rem auto;">
          ${comp.badge ? `<span style="background: #e0e7ff; color: #3730a3; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">${comp.badge}</span>` : ''}
          ${comp.title ? `<h3 style="margin: 0.5rem 0 0.25rem 0; font-size: 1.5rem; color: var(--text-color);">${comp.title}</h3>` : ''}
          ${comp.subtitle ? `<p style="margin: 0.25rem 0 0 0; color: #64748b; font-size: 0.95rem;">${comp.subtitle}</p>` : ''}
        </div>
      ` : ''}

      <div class="infographic-grid" style="${gridStyle}">
        ${sectionsHtml}
      </div>
    </div>
  `;
}
