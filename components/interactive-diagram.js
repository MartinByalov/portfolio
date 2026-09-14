function renderImageOrPlaceholder(src, alt = '') {
  if (!src) return '';
  if (src.includes('IMAGE_PLACEHOLDER')) {
    const filename = src.replace(/^\[IMAGE_PLACEHOLDER:\s*/, '').replace(/\]$/, '').trim();
    return `
      <div class="image-placeholder-box" style="background: var(--surface-alt, #f8fafc); border: 2px dashed #cbd5e1; border-radius: 12px; padding: 1.5rem 1rem; text-align: center; color: #64748b; margin-bottom: 1.5rem;">
        <i class="fas fa-microchip" style="font-size: 2.5rem; color: #3b82f6; margin-bottom: 0.5rem; display: block;"></i>
        <strong style="display: block; font-size: 0.95rem; color: #334155;">[IMAGE_PLACEHOLDER: ${filename}]</strong>
        ${alt ? `<span style="font-size: 0.85rem; color: #64748b;">${alt}</span>` : ''}
      </div>
    `;
  }
  return `
    <div style="text-align: center; margin-bottom: 1.5rem;">
      <img src="${src}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.08); display: inline-block;" />
    </div>
  `;
}

export function render(comp) {
  const connections = comp.connections || [];

  const listItemsHtml = connections.map((conn) => `
    <div style="margin-bottom: 0.85rem; display: flex; align-items: center; flex-wrap: wrap; gap: 0.4rem 0.6rem;">
      <span style="background: #e0e7ff; color: #3730a3; padding: 0.25rem 0.65rem; border-radius: 6px; font-weight: 700; font-size: 0.95rem;">
        ${conn.old}
      </span>
      ${conn.description ? `<span style="color: #64748b; font-size: 0.95rem;">(${conn.description})</span>` : ''}
      <i class="fas fa-arrow-right" style="color: #3b82f6; font-size: 0.9rem; margin: 0 0.1rem;"></i>
      <span style="background: #dbeafe; color: #1e40af; padding: 0.25rem 0.65rem; border-radius: 6px; font-weight: 700; font-size: 0.95rem;">
        ${conn.modern}
      </span>
    </div>
  `).join('');

  return `
    <div id="${comp.id}" class="interactive-diagram-container" style="margin: 3rem 0; padding: 2rem; background: var(--surface-alt, #f8fafc); border-radius: 16px; border: 1px solid var(--border-color, #e2e8f0);">
      <div style="text-align: center; max-width: 700px; margin: 0 auto 1.75rem auto;">
        ${comp.badge ? `<span style="background: #dbeafe; color: #1e40af; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">${comp.badge}</span>` : ''}
        <h3 style="margin: 0.5rem 0 0.25rem 0; font-size: 1.6rem; color: var(--text-color);">${comp.title || 'Една стара идея, която познаваме и днес'}</h3>
        ${comp.instruction ? `<p style="margin: 0; color: #64748b; font-size: 0.95rem;">${comp.instruction}</p>` : ''}
      </div>

      ${renderImageOrPlaceholder(comp.image, comp.title)}

      <div style="background: var(--surface, #ffffff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 12px; padding: 1.25rem 1.5rem; max-width: 850px; margin: 0 auto; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
        ${listItemsHtml}
      </div>
    </div>
  `;
}

export function init(comp) {
  // Static table component initialization if needed
}
