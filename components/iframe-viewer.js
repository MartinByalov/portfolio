// IFrame Viewer Component
// Embeds Google Sheets, interactive spreadsheets, Google Docs, or web resources in a responsive container

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

function normalizeGoogleEmbedUrl(url) {
  if (!url) return '';
  let str = String(url).trim();

  // If it's a standard Google Sheets edit or share URL, convert to embed-friendly preview/pubhtml
  if (str.includes('docs.google.com/spreadsheets/d/')) {
    if (str.includes('/pubhtml')) {
      if (!str.includes('widget=')) {
        str += (str.includes('?') ? '&' : '?') + 'widget=true&headers=false';
      }
      return str;
    }
    if (str.includes('/edit') || str.includes('/view')) {
      return str.replace(/\/edit.*$/, '/preview').replace(/\/view.*$/, '/preview');
    }
  }

  // Google Docs
  if (str.includes('docs.google.com/document/d/')) {
    if (str.includes('/pub')) return str;
    if (str.includes('/edit') || str.includes('/view')) {
      return str.replace(/\/edit.*$/, '/preview').replace(/\/view.*$/, '/preview');
    }
  }

  return str;
}

export function render(comp) {
  const id = comp.id || ('embed-' + Math.random().toString(36).slice(2, 8));
  const rawUrl = comp.src || comp.url || '';
  const embedUrl = normalizeGoogleEmbedUrl(rawUrl);
  const title = comp.title || 'Интерактивен преглед на таблица';
  const subtitle = comp.subtitle || comp.description || '';
  const height = comp.height || '520px';
  const tone = comp.tone || 'blue';
  const externalLink = comp.externalUrl || comp.fullscreenLink || rawUrl;
  const downloadUrl = comp.downloadUrl || comp.resourceFile || '';
  const downloadLabel = comp.downloadLabel || 'Изтегли изходен файл (.xlsx)';

  const toneClassMap = {
    blue: 'border-blue-200 dark:border-blue-900/40 bg-blue-50/20 dark:bg-blue-950/10',
    green: 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10',
    purple: 'border-purple-200 dark:border-purple-900/40 bg-purple-50/20 dark:bg-purple-950/10',
    orange: 'border-amber-200 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10',
    dark: 'border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/40'
  };

  const badgeToneMap = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200',
    green: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200',
    orange: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200',
    dark: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
  };

  const containerTone = toneClassMap[tone] || toneClassMap.blue;
  const badgeTone = badgeToneMap[tone] || badgeToneMap.blue;

  return `
    <section class="lesson-embed-section my-8 w-full" id="${esc(id)}">
      <div class="rounded-2xl border ${containerTone} p-5 md:p-6 shadow-sm transition-all duration-200">
        
        <!-- Header: Clean typography without leading decorative icons per AGENTS_md -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase ${badgeTone}">
                ${esc(comp.badgeText || 'Електронна таблица')}
              </span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight m-0">
              ${esc(title)}
            </h3>
            ${subtitle ? `<p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed m-0">${esc(subtitle)}</p>` : ''}
          </div>

          <div class="flex flex-wrap items-center gap-2">
            ${downloadUrl ? `
              <a href="${esc(downloadUrl)}" download class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 hover:bg-emerald-200/70 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 transition-colors shadow-xs" title="Свали ресурсния файл">
                <i class="fas fa-download"></i>
                <span>${esc(downloadLabel)}</span>
              </a>
            ` : ''}
            
            ${externalLink ? `
              <a href="${esc(externalLink)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 transition-colors shadow-xs" title="Отвори в нов таб">
                <i class="fas fa-arrow-up-right-from-square text-xs"></i>
                <span>Отвори в цял прозорец</span>
              </a>
            ` : ''}
          </div>
        </div>

        <!-- Embed Viewport -->
        <div class="relative w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-4 shadow-inner">
          ${embedUrl ? `
            <iframe
              id="${esc(id)}-iframe"
              src="${esc(embedUrl)}"
              class="w-full border-0 block"
              style="height: ${esc(height)}; min-height: 380px;"
              loading="lazy"
              allowfullscreen="true"
              allow="clipboard-write"
              title="${esc(title)}">
            </iframe>
          ` : `
            <div class="flex flex-col items-center justify-center p-12 text-center text-slate-500 dark:text-slate-400">
              <i class="fas fa-table text-4xl mb-3 text-slate-300 dark:text-slate-700"></i>
              <p class="text-sm font-medium">Не е посочен валиден URL адрес за таблицата (src/url).</p>
            </div>
          `}
        </div>

        ${comp.callout ? `
          <div class="mt-4 p-3.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
            <i class="fas fa-circle-info text-blue-500 mt-0.5 shrink-0"></i>
            <div class="leading-relaxed">${esc(comp.callout)}</div>
          </div>
        ` : ''}

      </div>
    </section>
  `;
}

export function init(comp) {
  // Optional client-side lifecycle hooks
}
