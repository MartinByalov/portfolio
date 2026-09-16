// Step Block Component (Blog / Tutorial Style)

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

function formatContent(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

export function render(comp) {
  const circleClass = comp.circleClass || (comp.tone ? `bg-${comp.tone}` : 'bg-blue');
  const tagClass = comp.tagClass || (comp.tagType ? `tag-${comp.tagType}` : 'tag-ex');

  let bodyHtml = '';
  if (comp.contentHtml) {
    bodyHtml = comp.contentHtml;
  } else if (comp.content) {
    bodyHtml = `<p style="margin: 0 0 16px; font-size: 14.5px; line-height: 1.7; color: var(--tut-text);">${formatContent(comp.content)}</p>`;
  }

  if (comp.items && Array.isArray(comp.items)) {
    const listColor = comp.listColor || comp.tone || 'blue';
    const listItems = comp.items.map(it => {
      const text = typeof it === 'string' ? it : it.text;
      const desc = typeof it === 'object' && it.desc ? `<span style="display:block; font-size:13px; color:var(--tut-muted); margin-top:2px;">${formatContent(it.desc)}</span>` : '';
      return `<li><div>${formatContent(text)}${desc}</div></li>`;
    }).join('');
    bodyHtml += `<ul class="ilist ${listColor}">${listItems}</ul>`;
  }

  if (comp.callout) {
    const calloutTone = comp.callout.tone || 'blue';
    bodyHtml += `
      <div class="callout c-${calloutTone}">
        <strong>${esc(comp.callout.title || 'Важно:')}</strong> ${formatContent(comp.callout.text || '')}
      </div>
    `;
  }

  return `
    <section class="component step-block-container" style="margin-bottom: 24px;">
      <div class="step-block" ${comp.id ? `id="${esc(comp.id)}"` : ''}>
        <div class="step-head">
          ${comp.stepNumber ? `<div class="step-circle ${circleClass}">${esc(comp.stepNumber)}</div>` : ''}
          <h3>${esc(comp.title || '')}</h3>
          ${comp.tag ? `<span class="step-tag ${tagClass}">${esc(comp.tag)}</span>` : ''}
        </div>
        <div class="step-body">
          ${bodyHtml}
        </div>
      </div>
    </section>
  `;
}

export function init(comp) {}
