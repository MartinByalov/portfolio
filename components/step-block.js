// Step Block Component (Blog / Tutorial Style)

import { getCleanMediaInfo } from '../utils/media.js';

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
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

function getCleanText(text) {
  if (!text) return '';
  return text.replace(/(?:[\.\,\s\-\—]*)(?:\(|\[)?(?:Файл|файл|File|file):\s*([a-zA-Z0-9_\-\.\/]+)(?:\)|\])?/gi, '').trim();
}

function formatCaptionWithFileTag(caption, expectedFileName = '') {
  if (!caption) {
    if (expectedFileName) {
      return `<span class="lesson-media-file-tag" title="Очакван файл"><i class="fas fa-file-image"></i> Файл: ${esc(expectedFileName)}</span>`;
    }
    return '';
  }
  const formatted = formatContent(caption);
  let hasTag = false;
  let res = formatted.replace(/(?:[\.\,\s\-\—]*)(?:\(|\[)?(?:Файл|файл|File|file):\s*([a-zA-Z0-9_\-\.\/]+)(?:\)|\])?/gi, function(match, filename) {
    hasTag = true;
    return ` <span class="lesson-media-file-tag" title="Очакван файл"><i class="fas fa-file-image"></i> Файл: ${filename}</span>`;
  });
  if (!hasTag && expectedFileName) {
    res += ` <span class="lesson-media-file-tag" title="Очакван файл"><i class="fas fa-file-image"></i> Файл: ${esc(expectedFileName)}</span>`;
  }
  return res;
}

function renderItemMedia(media) {
  if (!media) return '';
  const rawPath = media.path || media.src || media.fileName || '';
  const alt = media.alt || media.title || 'Изображение';
  const badge = media.badge || 'Визуален детайл';
  const icon = media.icon || 'fas fa-image';
  const caption = media.caption || media.desc || '';
  const cleanCaption = getCleanText(caption);
  const title = media.title || alt;

  const { fullPath, relativePath, fileName } = getCleanMediaInfo(rawPath);
  const displayFile = relativePath || fileName;

  return `
    <div class="lesson-inline-media-card" style="margin: 0; width: 100%; box-sizing: border-box;">
      ${rawPath ? `<img src="${esc(fullPath || rawPath)}" alt="${esc(alt)}" loading="eager" class="lesson-placeholder-img" onload="const c = this.closest('.lesson-inline-media-card'); if(c){ c.classList.add('image-loaded'); c.classList.remove('image-failed'); }" onerror="const c = this.closest('.lesson-inline-media-card'); if(this.src && this.src.includes('raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/')){ this.src = this.src.replace('raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/', 'cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/'); } else if(this.src && this.src.includes('cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/')){ this.src = this.src.replace('cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/', 'raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/'); } else { if(c){ c.classList.remove('image-loaded'); c.classList.add('image-failed'); } }" />` : ''}
      <div class="lesson-micro-placeholder-box">
        <span class="lesson-micro-badge"><i class="${esc(icon)}"></i> ${esc(badge)}</span>
        <div class="lesson-micro-title">${esc(title)}</div>
        ${displayFile ? `<div class="lesson-micro-path" title="Очакван файл: ${esc(displayFile)}"><i class="fas fa-file-image" style="margin-right: 4px;"></i>${esc(fileName || displayFile)}</div>` : ''}
      </div>
      ${(cleanCaption || displayFile) ? `
        <div class="lesson-micro-caption">
          ${cleanCaption ? formatContent(cleanCaption) : ''}
          ${fileName ? `<span class="lesson-media-file-tag" title="Очакван файл"><i class="fas fa-file-image"></i> Файл: ${esc(fileName)}</span>` : ''}
        </div>
      ` : ''}
    </div>
  `;
}

function renderItemContent(it) {
  const text = typeof it === 'string' ? it : it.text;
  const desc = typeof it === 'object' && it.desc ? `<span class="step-item-desc">${formatContent(it.desc)}</span>` : '';
  const media = typeof it === 'object' ? (it.media || it.image) : null;
  const callout = typeof it === 'object' ? (it.callout || it.importantCard) : null;

  let calloutHtml = '';
  if (callout) {
    if (typeof callout === 'string') {
      calloutHtml = `
        <div class="callout-highlight-box" style="margin: 14px 0 4px; width: 100%; box-sizing: border-box;">
          <span>${formatContent(callout)}</span>
        </div>
      `;
    } else {
      const title = callout.title || 'Важно:';
      const bodyText = callout.text || callout.content || '';
      const boxClass = callout.boxClass || 'callout-highlight-box';
      calloutHtml = `
        <div class="${esc(boxClass)}" style="margin: 14px 0 4px; width: 100%; box-sizing: border-box;${callout.style ? ' ' + esc(callout.style) : ''}">
          <span><strong>${esc(title)}</strong> ${formatContent(bodyText)}</span>
        </div>
      `;
    }
  }

  if (media) {
    return `
      <div style="display: flex; flex-direction: column; width: 100%;">
        <div style="display: flex; flex-direction: row; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 16px; width: 100%;">
          <div style="flex: 1 1 260px; min-width: 220px;">
            <div style="font-weight: 600; font-size: 15px; color: var(--tut-text); line-height: 1.5;">${formatContent(text)}</div>
            ${desc}
          </div>
          <div style="flex: 0 0 240px; max-width: 260px; width: 100%; align-self: flex-start;">
            ${renderItemMedia(media)}
          </div>
        </div>
        ${calloutHtml}
      </div>
    `;
  }

  return `<div><div style="font-weight: 600; font-size: 15px; color: var(--tut-text);">${formatContent(text)}</div>${desc}${calloutHtml}</div>`;
}

function renderFloatMedia(media) {
  if (!media) return '';
  const mediaList = Array.isArray(media) ? media : [media];
  return mediaList.map(m => {
    const rawPath = m.path || m.src || m.fileName || '';
    const alt = m.alt || m.title || 'Изображение';
    const badge = m.badge || 'Визуален детайл';
    const icon = m.icon || 'fas fa-image';
    const caption = m.caption || m.desc || '';
    const cleanCaption = getCleanText(caption);
    const title = m.title || alt;

    const { fullPath, relativePath, fileName } = getCleanMediaInfo(rawPath);
    const displayFile = relativePath || fileName;

    return `
      <div class="lesson-media-float">
        <div class="lesson-inline-media-card">
          ${rawPath ? `<img src="${esc(fullPath || rawPath)}" alt="${esc(alt)}" loading="eager" class="lesson-placeholder-img" onload="const c = this.closest('.lesson-inline-media-card'); if(c){ c.classList.add('image-loaded'); c.classList.remove('image-failed'); }" onerror="const c = this.closest('.lesson-inline-media-card'); if(this.src && this.src.includes('raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/')){ this.src = this.src.replace('raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/', 'cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/'); } else if(this.src && this.src.includes('cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/')){ this.src = this.src.replace('cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/', 'raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/'); } else { if(c){ c.classList.remove('image-loaded'); c.classList.add('image-failed'); } }" />` : ''}
          <div class="lesson-micro-placeholder-box">
            <span class="lesson-micro-badge"><i class="${esc(icon)}"></i> ${esc(badge)}</span>
            <div class="lesson-micro-title">${esc(title)}</div>
            ${displayFile ? `<div class="lesson-micro-path" title="Очакван файл: ${esc(displayFile)}"><i class="fas fa-file-image" style="margin-right: 4px;"></i>${esc(fileName || displayFile)}</div>` : ''}
          </div>
          ${(cleanCaption || displayFile) ? `
            <div class="lesson-micro-caption">
              ${cleanCaption ? formatContent(cleanCaption) : ''}
              ${fileName ? `<span class="lesson-media-file-tag" title="Очакван файл"><i class="fas fa-file-image"></i> Файл: ${esc(fileName)}</span>` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function displayCleanTitle(title, path) {
  if (!path) return title;
  const rawFileName = path.replace(/^https?:\/\/[^\/]+\/(?:[^\/]+\/)*assets\//, '').split('/').pop();
  return rawFileName && !title.includes(rawFileName) ? `${title} - ${rawFileName}` : title;
}

export function render(comp) {
  const circleClass = comp.circleClass || (comp.tone ? `bg-${comp.tone}` : 'bg-blue');
  const badgeClass = comp.badgeClass || (comp.tone ? `bg-${comp.tone}` : 'bg-blue');
  const tagClass = comp.tagClass || (comp.tagType ? `tag-${comp.tagType}` : 'tag-ex');
  const badgeText = comp.badgeText || comp.badge;

  let bodyHtml = '';
  
  if (comp.floatMedia || comp.media) {
    bodyHtml += renderFloatMedia(comp.floatMedia || comp.media);
  }

  if (comp.contentHtml) {
    bodyHtml += comp.contentHtml;
  } else if (comp.content) {
    bodyHtml += `<p style="margin: 0 0 16px; font-size: 14.5px; line-height: 1.7; color: var(--tut-text);">${formatContent(comp.content)}</p>`;
  }

  if (comp.formulaHtml) {
    bodyHtml += comp.formulaHtml;
  }

  if (comp.items && Array.isArray(comp.items)) {
    const listColor = comp.listColor || comp.tone || 'blue';
    const listItems = comp.items.map(it => {
      const hasMedia = typeof it === 'object' && (it.media || it.image);
      const itemClass = comp.mediaCards && hasMedia ? 'step-item-media-card' : '';
      const liStyle = hasMedia && !comp.mediaCards ? 'style="margin-bottom: 20px; align-items: flex-start;"' : '';
      return `<li class="${itemClass}" ${liStyle}><div style="flex: 1; min-width: 0;">${renderItemContent(it)}</div></li>`;
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

  if (comp.hideHeader) {
    return `<div class="step-body">${bodyHtml}</div>`;
  }

  return `
    <section class="component step-block-container" style="margin-bottom: 24px;">
      <div class="step-block" ${comp.id ? `id="${esc(comp.id)}"` : ''}>
        <div class="step-head">
          ${badgeText ? `<span class="sh-badge ${esc(badgeClass)}">${esc(badgeText)}</span>` : (comp.stepNumber ? `<div class="step-circle ${circleClass}">${esc(comp.stepNumber)}</div>` : '')}
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
