function sanitizePath(src) {
  if (!src) return '';
  return src.replace(/^\[IMAGE_PLACEHOLDER:\s*/, '').replace(/\]$/, '').trim();
}

function renderImageOrPlaceholder(src, alt = '') {
  if (!src) return '';
  const cleanPath = sanitizePath(src);
  return `
    <img src="${src}" alt="${alt}" data-path="${cleanPath}" style="width: 100%; aspect-ratio: 4 / 5; max-height: 340px; object-fit: cover; object-position: top center; border-radius: 8px; margin-bottom: 0.75rem; display: block;" onerror="if(this.src.includes('cdn.jsdelivr.net')){this.src=this.src.replace('cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/','raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/');}else{this.onerror=null;this.outerHTML='<div class=\\'image-placeholder-box\\' style=\\'background: var(--surface-alt, #f8fafc); border: 1px dashed #cbd5e1; border-radius: 8px; padding: 1rem 0.5rem; text-align: center; color: #64748b; margin-bottom: 0.75rem; aspect-ratio: 4 / 5; max-height: 340px; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;\\'><i class=\\'fas fa-portrait\\' style=\\'font-size: 2.2rem; color: #94a3b8; margin-bottom: 0.35rem; display: block;\\'></i><strong style=\\'display: block; font-size: 0.8rem; color: #334155; font-family: monospace;\\'>' + this.getAttribute('data-path') + '</strong></div>';}" />
  `;
}

export function render(comp) {
  const items = comp.items || [];
  
  // Extract all unique match choices
  const allMatches = Array.from(new Set(items.map(it => it.match)));
  // Shuffle matches for interaction
  const matchesOptions = [...allMatches].sort(() => 0.5 - Math.random());

  const cardsHtml = items.map((it, idx) => {
    const wikiUrl = it.wiki || it.wikipedia || it.url;
    const nameHtml = wikiUrl ? `
      <a href="${wikiUrl}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem; transition: color 0.2s;" onmouseover="this.style.color='#2563eb'" onmouseout="this.style.color='inherit'">
        <span>${it.name}</span>
        <i class="fab fa-wikipedia-w" style="font-size: 0.8rem; color: #64748b;" title="Уикипедия"></i>
      </a>
    ` : it.name;

    return `
      <div class="person-card" data-idx="${idx}" data-match="${it.match}" style="background: var(--surface, #ffffff); border: 2px solid var(--border-color, #e2e8f0); border-radius: 12px; padding: 1.25rem; transition: all 0.25s; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          ${renderImageOrPlaceholder(it.image, it.name)}
          <h4 style="margin: 0 0 0.35rem 0; font-size: 1.1rem; color: var(--text-color); font-weight: 700;">${nameHtml}</h4>
          <p style="margin: 0 0 1rem 0; font-size: 0.9rem; color: #64748b; line-height: 1.4;">${it.fact}</p>
        </div>

        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #475569; margin-bottom: 0.35rem; text-transform: uppercase;">Изберете принос:</label>
          <select class="person-match-select" data-idx="${idx}" style="width: 100%; padding: 0.6rem; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9rem; background: var(--surface, #ffffff); color: var(--text-color); cursor: pointer;">
            <option value="">-- Изберете принос --</option>
            ${matchesOptions.map(m => `<option value="${m}">${m}</option>`).join('')}
          </select>
          <div class="person-fb-box" style="display: none; margin-top: 0.75rem; padding: 0.6rem 0.85rem; border-radius: 6px; font-size: 0.85rem; line-height: 1.4;"></div>
        </div>
      </div>
    `;
  }).join('');

  const hasHeader = Boolean(comp.badge || comp.title || comp.instruction);

  return `
    <div id="${comp.id}" class="interactive-cards-container" style="margin: 0.5rem 0 1.25rem 0; padding: 1.25rem; background: var(--surface-alt, #f8fafc); border-radius: 16px; border: 1px solid var(--border-color, #e2e8f0);">
      ${hasHeader ? `
        <div style="text-align: center; max-width: 700px; margin: 0 auto 1.25rem auto;">
          ${comp.badge ? `<span style="background: #fef3c7; color: #b45309; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">${comp.badge}</span>` : ''}
          ${comp.title ? `<h3 style="margin: 0.5rem 0 0.25rem 0; font-size: 1.5rem; color: var(--text-color);">${comp.title}</h3>` : ''}
          ${comp.instruction ? `<p style="margin: 0.25rem 0 0 0; color: #64748b; font-size: 0.95rem;">${comp.instruction}</p>` : ''}
        </div>
      ` : ''}

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem;">
        ${cardsHtml}
      </div>
    </div>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id);
  if (!root) return;

  const items = comp.items || [];
  const cardEls = root.querySelectorAll('.person-card');

  cardEls.forEach(card => {
    const idx = parseInt(card.dataset.idx, 10);
    const targetMatch = card.dataset.match;
    const item = items[idx];
    const select = card.querySelector('.person-match-select');
    const fb = card.querySelector('.person-fb-box');

    if (select && fb) {
      select.addEventListener('change', () => {
        const val = select.value;
        if (!val) {
          fb.style.display = 'none';
          card.style.borderColor = 'var(--border-color, #e2e8f0)';
          return;
        }

        fb.style.display = 'block';
        if (val === targetMatch) {
          card.style.borderColor = '#10b981';
          card.style.background = '#ffffff';
          fb.style.background = '#f0fdf4';
          fb.style.color = '#166534';
          fb.style.border = '1px solid #bbf7d0';
          fb.innerHTML = `<strong>Правилно!</strong>`;
        } else {
          card.style.borderColor = '#ef4444';
          fb.style.background = '#fef2f2';
          fb.style.color = '#991b1b';
          fb.style.border = '1px solid #fecaca';
          fb.innerHTML = `<strong>Опитай пак!</strong>`;
        }
      });
    }
  });
}
