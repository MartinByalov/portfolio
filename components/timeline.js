function sanitizePath(src) {
  if (!src) return '';
  return src.replace(/^\[IMAGE_PLACEHOLDER:\s*/, '').replace(/\]$/, '').trim();
}

function renderImageOrPlaceholder(src, alt = '') {
  if (!src) return '';
  const cleanPath = sanitizePath(src);
  const displayTitle = alt || 'Изображение';
  return `
    <img src="${src}" alt="${displayTitle}" data-path="${cleanPath}" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); display: block;" onerror="if(this.src.includes('cdn.jsdelivr.net')){this.src=this.src.replace('cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/','raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/');}else{this.onerror=null;this.outerHTML='<div class=\\'image-placeholder-box\\' style=\\'background: var(--surface-alt, #f8fafc); border: 2px dashed #cbd5e1; border-radius: 12px; padding: 1.5rem 1rem; text-align: center; color: #64748b; margin: 0.5rem 0;\\'><i class=\\'fas fa-image\\' style=\\'font-size: 2rem; color: #94a3b8; margin-bottom: 0.5rem; display: block;\\'></i><strong style=\\'display: block; font-size: 0.95rem; color: #334155; margin-bottom: 0.25rem; font-family: monospace;\\'>' + this.getAttribute('data-path') + '</strong><span>' + (this.getAttribute('alt') || '') + '</span></div>';}" />
  `;
}

export function render(comp) {
  const eras = comp.eras || [];

  // Check if eras have milestones or era content
  const isEraTabs = eras.length > 0 && eras[0].content !== undefined;

  if (!isEraTabs) {
    // Traditional milestone timeline fallback
    let erasHtml = '';
    eras.forEach(era => {
      const milestones = era.milestones || [];
      const milestonesHtml = milestones.map(m => `
        <div class="timeline-milestone" style="margin-bottom: 1rem; padding-left: 1.5rem; position: relative;">
          <div style="position: absolute; left: 0; top: 0.3rem; width: 10px; height: 10px; border-radius: 50%; background: ${era.color || '#3b82f6'}; border: 2px solid var(--background, #ffffff);"></div>
          <div style="font-weight: bold; color: ${era.color || '#3b82f6'}; font-size: 0.9rem; margin-bottom: 0.25rem;">${m.year}</div>
          <h5 style="margin: 0 0 0.25rem 0; font-size: 1.05rem;">${m.title}</h5>
          <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted, #64748b);">${m.description}</p>
        </div>
      `).join('');

      erasHtml += `
        <div class="timeline-era" style="margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid ${era.color || '#3b82f6'};">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: ${era.color || '#3b82f6'}; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
              <i class="${era.icon || 'fas fa-clock'}"></i>
            </div>
            <div>
              <h4 style="margin: 0; font-size: 1.25rem; color: ${era.color || '#3b82f6'};">${era.label}</h4>
              <div style="font-size: 0.9rem; color: var(--text-muted, #64748b); font-weight: 500;">${era.range}</div>
            </div>
          </div>
          <div class="milestones-container" style="border-left: 2px solid ${era.color || '#3b82f6'}; margin-left: 19px; padding-top: 0.5rem;">
            ${milestonesHtml}
          </div>
        </div>
      `;
    });

    return `
      <div id="${comp.id}" class="timeline-component-container" style="margin: 2.5rem 0;">
        ${comp.title ? `<h3 style="margin-bottom: 0.5rem; text-align: center;">${comp.title}</h3>` : ''}
        ${comp.subtitle ? `<p style="text-align: center; color: var(--text-muted, #64748b); margin-bottom: 2rem;">${comp.subtitle}</p>` : ''}
        <div class="timeline-eras-wrapper" style="max-width: 800px; margin: 0 auto; background: var(--surface, #ffffff); padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          ${erasHtml}
        </div>
      </div>
    `;
  }

  // Interactive Era Selector Timeline
  const colors = ["#8b5cf6", "#3b82f6", "#10b981", "#ef4444"];

  const tabsHtml = eras.map((era, idx) => {
    const active = idx === 0;
    const color = colors[idx % colors.length];
    return `
      <button class="era-tab-btn ${active ? 'active' : ''}" data-idx="${idx}" style="flex: 1; min-width: 140px; padding: 0.85rem 0.5rem; border: none; background: ${active ? color : 'var(--surface-alt, #f1f5f9)'}; color: ${active ? '#ffffff' : '#475569'}; border-radius: 10px; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.25s; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.35rem; box-shadow: ${active ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'};">
        <div style="display: flex; align-items: center; gap: 0.4rem;">
          <i class="${era.icon || 'fas fa-history'}" style="font-size: 1rem;"></i>
          <span>${era.tabLabel || era.label.replace(/\s+етап$/i, '')}</span>
        </div>
        <span style="font-size: 0.75rem; opacity: 0.85; font-weight: normal;">${era.range}</span>
      </button>
    `;
  }).join('');

  const panelsHtml = eras.map((era, idx) => {
    const active = idx === 0;
    const color = colors[idx % colors.length];
    return `
      <div class="era-panel" data-idx="${idx}" style="display: ${active ? 'block' : 'none'}; background: var(--surface, #ffffff); border: 2px solid ${color}; border-radius: 16px; padding: 2rem; transition: all 0.3s; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 1rem; margin-bottom: 1.25rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: ${color}; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
              <i class="${era.icon || 'fas fa-history'}"></i>
            </div>
            <div>
              <h4 style="margin: 0; font-size: 1.35rem; color: var(--text-color, #1e293b);">${era.label}</h4>
              <span style="font-size: 0.85rem; color: #64748b; font-weight: 600;">Период: ${era.range}</span>
            </div>
          </div>
          <span style="background: ${color}20; color: ${color}; border: 1px solid ${color}40; padding: 0.35rem 0.85rem; border-radius: 20px; font-weight: 700; font-size: 0.85rem;">
            Етап ${idx + 1} от ${eras.length}
          </span>
        </div>

        <p style="font-size: 1.05rem; font-weight: 600; color: ${color}; margin-top: 0; margin-bottom: 1rem;">
          <i class="fas fa-info-circle" style="margin-right: 0.4rem;"></i> ${era.summary}
        </p>

        ${renderImageOrPlaceholder(era.image, era.imageCaption || era.content || era.label)}

        <p style="font-size: 1rem; line-height: 1.6; color: var(--text-color, #334155); margin: 1.25rem 0;">
          ${era.content}
        </p>

        ${era.keyPoint ? `
          <div style="background: #f8fafc; border-left: 4px solid ${color}; padding: 1rem 1.25rem; border-radius: 0 10px 10px 0; margin-top: 1.25rem;">
            <strong style="color: ${color}; display: block; margin-bottom: 0.25rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em;">Извод:</strong>
            <span style="font-size: 0.95rem; color: #1e293b; font-weight: 500;">${era.keyPoint}</span>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  const hasHeader = Boolean(comp.badge || comp.title || comp.subtitle);

  return `
    <div id="${comp.id}" class="timeline-component-container" style="margin: 0.5rem 0 1.25rem 0; padding: 1.25rem; background: var(--surface-alt, #f8fafc); border-radius: 20px; border: 1px solid var(--border-color, #e2e8f0);">
      ${hasHeader ? `
        <div style="text-align: center; max-width: 700px; margin: 0 auto 1.25rem auto;">
          ${comp.badge ? `<span style="background: #dbeafe; color: #1e40af; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">${comp.badge}</span>` : ''}
          ${comp.title ? `<h3 style="margin: 0.5rem 0 0.25rem 0; font-size: 1.5rem; color: var(--text-color);">${comp.title}</h3>` : ''}
          ${comp.subtitle ? `<p style="margin: 0.25rem 0 0 0; color: #64748b; font-size: 0.95rem;">${comp.subtitle}</p>` : ''}
        </div>
      ` : ''}

      <div class="era-tabs-container" style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.25rem; justify-content: center;">
        ${tabsHtml}
      </div>

      <div class="era-panels-container">
        ${panelsHtml}
      </div>
    </div>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id);
  if (!root) return;

  const tabBtns = root.querySelectorAll('.era-tab-btn');
  const panels = root.querySelectorAll('.era-panel');
  const colors = ["#8b5cf6", "#3b82f6", "#10b981", "#ef4444"];

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      const color = colors[idx % colors.length];

      tabBtns.forEach((b, bIdx) => {
        b.classList.remove('active');
        b.style.background = 'var(--surface-alt, #f1f5f9)';
        b.style.color = '#475569';
        b.style.boxShadow = 'none';
      });

      btn.classList.add('active');
      btn.style.background = color;
      btn.style.color = '#ffffff';
      btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';

      panels.forEach(p => {
        p.style.display = parseInt(p.dataset.idx, 10) === idx ? 'block' : 'none';
      });
    });
  });
}
