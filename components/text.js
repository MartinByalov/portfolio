function formatText(text) {
  if (!text) return '';
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

export function render(comp) {
  const content = formatText(comp.content || '');
  const title = comp.title || comp.heading || '';
  const tone = comp.tone ? ' lb-tone-' + comp.tone : '';

  return `
    <section class="component text-block${tone}" id="${comp.id || ''}" style="margin: 2rem 0; padding: 1.5rem 2rem; background: var(--surface, #ffffff); border-radius: 12px; border: 1px solid var(--border-color, #e2e8f0); box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
      ${title ? `<h3 style="margin: 0 0 1rem 0; font-size: 1.3rem; color: var(--text-color); font-weight: 700;">${title}</h3>` : ''}
      <div class="lesson-text-content" style="font-size: 1.05rem; line-height: 1.7; color: var(--text-color);">
        ${content}
      </div>
    </section>
  `;
}

export function init(comp) {
  // Simple text block
}
