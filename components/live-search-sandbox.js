// Live Search Sandbox Component
// Search engine simulator supporting operators (site:, filetype:, -, OR, quotes)

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

const DEFAULT_MOCK_DATABASE = [
  {
    title: "Васил Левски - Биография и историческо дело",
    url: "https://history.bg/levski",
    snippet: "Апостолът на свободата Васил Левски и неговото революционно дело за освобождението на България.",
    tags: ["Левски", "история", "биография", "България"]
  },
  {
    title: "ПФК Левски София - Официален клубен сайт",
    url: "https://levski.bg/team",
    snippet: "Последни футболни новини за представителния отбор на Левски София, мачове, резултати и класиране.",
    tags: ["Левски", "футбол", "спорт", "мачове"]
  },
  {
    title: "Учебна програма по ИТ за 8. клас (МОН)",
    url: "https://mon.bg/docs/it_8klas.pdf",
    snippet: "Официален PDF документ на Министерството на образованието и науката за обучението по информационни технологии.",
    tags: ["site:mon.bg", "filetype:pdf", "информационни технологии", "МОН", "учебна програма"]
  },
  {
    title: "Насоки за киберсигурност и защита на личните данни",
    url: "https://mon.bg/safety/cybersecurity.pdf",
    snippet: "Официални правила за киберсигурност и безопасна работа в интернет в училищна среда.",
    tags: ["site:mon.bg", "filetype:pdf", "киберсигурност", "безопасен интернет", "МОН"]
  },
  {
    title: "Национален център за безопасен интернет",
    url: "https://safenet.bg/materials",
    snippet: "Обучителни ресурси за точна фраза „безопасен интернет“, съвети за деца и дигитална грамотност.",
    tags: ["безопасен интернет", "киберсигурност", "онлайн безопасност"]
  }
];

export function render(comp) {
  const id = comp.id || 'live-search-sandbox';
  const title = comp.title || 'Търсещ Симулатор (Sandbox): Изпробвайте операторите в реално време';
  const placeholder = comp.placeholder || 'Въведете заявка (напр. Левски -футбол, site:mon.bg, filetype:pdf)...';

  return `
    <div class="interactive-sandbox-card" id="${esc(id)}">
      <div class="interactive-card-header">
        <div class="interactive-card-badge">
          <i class="fas fa-magnifying-glass-chart"></i>
          <span>${esc(title)}</span>
        </div>
      </div>

      <div class="sandbox-search-bar-wrap">
        <div class="sandbox-input-box">
          <i class="fas fa-search sandbox-search-icon"></i>
          <input type="text" class="sandbox-search-input" placeholder="${esc(placeholder)}" value="Левски -футбол">
          <button type="button" class="sandbox-clear-btn" title="Изчисти"><i class="fas fa-times"></i></button>
          <button type="button" class="btn-activity sandbox-search-btn">Търси</button>
        </div>
      </div>

      <div class="sandbox-quick-queries">
        <span class="quick-label">Изпробвайте готови заявки:</span>
        <button type="button" class="sandbox-chip" data-query="Левски -футбол">Левски -футбол</button>
        <button type="button" class="sandbox-chip" data-query="Левски футбол">Левски футбол</button>
        <button type="button" class="sandbox-chip" data-query="site:mon.bg filetype:pdf">site:mon.bg filetype:pdf</button>
        <button type="button" class="sandbox-chip" data-query="&quot;безопасен интернет&quot;">"безопасен интернет"</button>
        <button type="button" class="sandbox-chip" data-query="история OR спорт">история OR спорт</button>
      </div>

      <div class="sandbox-results-panel">
        <div class="sandbox-results-meta">
          <span class="sandbox-count-text">Резултати: <strong>0</strong> намерени страници</span>
          <span class="sandbox-query-echo"></span>
        </div>
        <div class="sandbox-results-list"></div>
      </div>
    </div>
  `;
}

function matchItem(item, query) {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  const textCorpus = (item.title + ' ' + item.url + ' ' + item.snippet + ' ' + (item.tags || []).join(' ')).toLowerCase();

  // Handle site: filter
  const siteMatch = q.match(/site:([^\s]+)/);
  if (siteMatch) {
    const domain = siteMatch[1].toLowerCase();
    if (!item.url.toLowerCase().includes(domain)) return false;
  }

  // Handle filetype: filter
  const filetypeMatch = q.match(/filetype:([^\s]+)/);
  if (filetypeMatch) {
    const ext = filetypeMatch[1].toLowerCase();
    if (!item.url.toLowerCase().endsWith('.' + ext) && !item.snippet.toLowerCase().includes(ext)) return false;
  }

  // Handle exact phrase in quotes "..."
  const exactQuotes = q.match(/"([^"]+)"/);
  if (exactQuotes) {
    const phrase = exactQuotes[1].toLowerCase();
    if (!textCorpus.includes(phrase)) return false;
  }

  // Handle negative operator -word
  const minusWords = (q.match(/-([a-zA-Zа-яА-Я0-9]+)/g) || []).map(w => w.slice(1).toLowerCase());
  for (const mw of minusWords) {
    if (textCorpus.includes(mw)) return false;
  }

  // Extract clean positive words (ignoring operators)
  let cleanQ = q
    .replace(/site:[^\s]+/g, '')
    .replace(/filetype:[^\s]+/g, '')
    .replace(/"[^"]+"/g, '')
    .replace(/-[a-zA-Zа-яА-Я0-9]+/g, '')
    .trim();

  if (cleanQ.includes(' or ')) {
    const parts = cleanQ.split(/\s+or\s+/).filter(Boolean);
    const hasAny = parts.some(p => textCorpus.includes(p.trim()));
    if (!hasAny) return false;
  } else if (cleanQ) {
    const words = cleanQ.split(/\s+/).filter(Boolean);
    const hasAll = words.every(w => textCorpus.includes(w));
    if (!hasAll) return false;
  }

  return true;
}

export function init(comp) {
  const id = comp.id || 'live-search-sandbox';
  const root = document.getElementById(id);
  if (!root) return;

  const db = (comp.mockDatabase && comp.mockDatabase.length) ? comp.mockDatabase : DEFAULT_MOCK_DATABASE;
  const input = root.querySelector('.sandbox-search-input');
  const searchBtn = root.querySelector('.sandbox-search-btn');
  const clearBtn = root.querySelector('.sandbox-clear-btn');
  const chips = root.querySelectorAll('.sandbox-chip');
  const countText = root.querySelector('.sandbox-count-text');
  const queryEcho = root.querySelector('.sandbox-query-echo');
  const listContainer = root.querySelector('.sandbox-results-list');

  function doSearch() {
    if (!input || !listContainer) return;
    const q = input.value.trim();
    const matched = db.filter(item => matchItem(item, q));

    if (countText) countText.innerHTML = `Резултати: <strong>${matched.length}</strong> от ${db.length} индексирани записа`;
    if (queryEcho) queryEcho.innerHTML = q ? `Заявка: <code>${esc(q)}</code>` : '';

    if (matched.length === 0) {
      listContainer.innerHTML = `
        <div class="sandbox-empty-state">
          <i class="fas fa-face-frown"></i>
          <p>Няма открити резултати за зададената заявка. Опитайте с по-малко ограничения или проверете за правописни грешки.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = matched.map(item => `
      <div class="sandbox-result-card">
        <div class="sbr-url"><i class="fas fa-globe"></i> ${esc(item.url)}</div>
        <div class="sbr-title"><a href="javascript:void(0)">${esc(item.title)}</a></div>
        <div class="sbr-snippet">${esc(item.snippet)}</div>
        <div class="sbr-tags">
          ${(item.tags || []).map(t => `<span class="sbr-tag">${esc(t)}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  if (searchBtn) searchBtn.addEventListener('click', doSearch);
  if (input) {
    input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
    input.addEventListener('input', () => {
      if (clearBtn) clearBtn.style.display = input.value ? 'inline-flex' : 'none';
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (input) input.value = '';
      clearBtn.style.display = 'none';
      doSearch();
    });
  }

  chips.forEach(c => {
    c.addEventListener('click', () => {
      if (input) {
        input.value = c.dataset.query || '';
        if (clearBtn) clearBtn.style.display = 'inline-flex';
      }
      doSearch();
    });
  });

  // initial search
  doSearch();
}
