/* layout/glossary.js
   Терминологичен речник (#/dictionary) — понятия от учебните материали,
   подредени по азбучен ред, с филтър по буква и търсене в страницата.
   Нови термини -> добави запис в TERMS по-долу. */

const TERMS = [
  { term: 'Счетоводство', definition: 'Система за събиране, записване и анализ на информация за финансовото състояние на предприятието.', tags: 'финанси анализ информация' },
  { term: 'Активи', definition: 'Всичко, което фирмата притежава и което има икономическа стойност.', tags: 'собственост икономика' },
  { term: 'Пасиви', definition: 'Всичко, което фирмата дължи – задължения към трети лица.', tags: 'дългове задължения' },
  { term: 'Собствен капитал', definition: 'Разликата между активите и пасивите на предприятието (Активи - Пасиви).', tags: 'капитал формула' },
  { term: 'Печалба', definition: 'Положителната разлика между приходите и разходите (Приходи - Разходи).', tags: 'финанси резултат' },
  { term: 'ДДС', definition: 'Косвен данък върху потреблението (Данък върху добавената стойност).', tags: 'данък потребление' },
  { term: 'Амортизация', definition: 'Постепенното отчитане на износването на дълготрайните активи като разход.', tags: 'разход активи износване' },
  { term: 'Ликвидност', definition: 'Способността на предприятието да изплаща текущите си задължения.', tags: 'плащане стабилност' },
  { term: 'Инвентаризация', definition: 'Проверка на реалната наличност на активите и пасивите и сравняването им със счетоводните данни.', tags: 'проверка наличност' },
  { term: 'ООП', definition: 'Парадигма, използваща класове и обекти за организиране на данни и функции по начин, отразяващ реалния свят.', tags: 'програмиране парадигма структура' },
  { term: 'Капсулация', definition: 'Скриване на данните на обект и контролиране на достъпа до тях чрез методи (get и set).', tags: 'сигурност методи данни' },
  { term: 'Абстракция', definition: 'Скриване на детайлите по реализацията и предоставяне само на съществената функционалност.', tags: 'интерфейс функционалност' },
  { term: 'Наследяване', definition: 'Позволява на един подклас да наследи характеристики и методи от родителски клас за преизползване на код.', tags: 'клас преизползване' },
  { term: 'Полиморфизъм', definition: 'Възможност един метод да има различно поведение в зависимост от обекта, който го използва.', tags: 'метод поведение' },
  { term: 'Клас', definition: 'Шаблон за създаване на обекти, дефиниращ техните атрибути (характеристики) и методи (поведение).', tags: 'шаблон обект' },
  { term: 'Обект', definition: 'Инстанция на даден клас; абстрактно представяне на обект от реалния свят.', tags: 'инстанция данни' },
  { term: 'Конструктор', definition: 'Специален метод, извикван автоматично при създаване на обект за инициализиране на атрибутите му.', tags: 'инициализация метод' }
];

function escapeHtmlGlossary(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function renderTermCard(term) {
  const tags = term.tags.split(' ').filter(Boolean).map(tag => `<span>#${escapeHtmlGlossary(tag)}</span>`).join('');
  const search = escapeHtmlGlossary((term.term + ' ' + term.definition + ' ' + term.tags).toLowerCase());
  return `
    <article class="glossary-card" data-letter="${term.term[0].toUpperCase()}" data-search="${search}">
      <h3>${escapeHtmlGlossary(term.term)}</h3>
      <p>${escapeHtmlGlossary(term.definition)}</p>
      <div class="glossary-tags">${tags}</div>
    </article>`;
}

export function renderGlossaryPage() {
  const letters = [...new Set(TERMS.map(t => t.term[0].toUpperCase()))].sort((a, b) => a.localeCompare(b, 'bg'));
  return `
    <section class="home-section">
      <div class="home-content">
        <div class="main-portfolio-content">
          <h2 class="page-title">Терминологичен речник</h2>
          <p class="page-description">Ключови понятия от учебните материали — избери буква или потърси термин.</p>
          <div class="glossary-tools">
            <input type="text" id="glossary-filter" class="glossary-filter" placeholder="Търси термин...">
            <div class="glossary-modes" id="glossary-modes" role="tablist" aria-label="Режим на речника">
              <button type="button" class="glossary-mode active" data-mode="list"><i class="fas fa-list"></i> Списък</button>
              <button type="button" class="glossary-mode" data-mode="flash"><i class="fas fa-layer-group"></i> Флаш карти</button>
            </div>
            <div class="glossary-alphabet" id="glossary-alphabet">
              <button type="button" class="glossary-letter active" data-letter="">Всички</button>
              ${letters.map(letter => `<button type="button" class="glossary-letter" data-letter="${letter}">${letter}</button>`).join('')}
            </div>
          </div>
          <div class="glossary-grid" id="glossary-grid">
            ${TERMS.map(renderTermCard).join('')}
          </div>
          <div class="flash-grid is-hidden" id="flash-grid"></div>
          <p class="glossary-empty is-hidden" id="glossary-empty">Няма термини, отговарящи на избора.</p>
        </div>
      </div>
    </section>
  `;
}

function termImage(term) {
  // Подходящо изображение за гърба на флаш картата — стабилен seed на термин.
  const seed = encodeURIComponent(String(term.term || 'term').trim().toLowerCase().replace(/\s+/g, '-'));
  return `https://picsum.photos/seed/${seed}/800/500`;
}

function renderFlashCard(term, idx) {
  const search = escapeHtmlGlossary((term.term + ' ' + term.definition + ' ' + term.tags).toLowerCase());
  return `
    <button type="button" class="flash-card" data-idx="${idx}" data-letter="${term.term[0].toUpperCase()}" data-search="${search}">
      <span class="flash-card-term">${escapeHtmlGlossary(term.term)}</span>
      <span class="flash-card-hint"><i class="fas fa-expand"></i> Отвори</span>
    </button>`;
}

export function initGlossaryPage() {
  const input = document.getElementById('glossary-filter');
  const alphabet = document.getElementById('glossary-alphabet');
  const grid = document.getElementById('glossary-grid');
  const empty = document.getElementById('glossary-empty');
  const modes = document.getElementById('glossary-modes');
  const flashGrid = document.getElementById('flash-grid');
  if (!input || !alphabet || !grid) return;

  let activeLetter = '';
  let query = '';
  let mode = 'list';

  function visibleTerms() {
    return TERMS.map((t, i) => ({ ...t, idx: i })).filter(t => {
      const matchLetter = !activeLetter || t.term[0].toUpperCase() === activeLetter;
      const hay = (t.term + ' ' + t.definition + ' ' + t.tags).toLowerCase();
      return matchLetter && (!query || hay.includes(query));
    });
  }

  function apply() {
    let visible = 0;
    grid.querySelectorAll('.glossary-card').forEach(card => {
      const matchLetter = !activeLetter || card.dataset.letter === activeLetter;
      const matchQuery = !query || (card.dataset.search || '').includes(query);
      const show = matchLetter && matchQuery;
      card.classList.toggle('is-hidden', !show);
      if (show) visible++;
    });
    // Флаш режим: картите показват САМО наименованията.
    if (mode === 'flash' && flashGrid) {
      const list = visibleTerms();
      flashGrid.innerHTML = list.map(t => renderFlashCard(t, t.idx)).join('');
      visible = list.length;
    }
    empty?.classList.toggle('is-hidden', visible > 0);
  }

  function openFlash(idx) {
    const term = TERMS[idx];
    if (!term) return;
    closeFlash();
    const overlay = document.createElement('div');
    overlay.className = 'flash-overlay';
    overlay.id = 'flash-overlay';
    overlay.innerHTML = `
      <div class="flash-modal" role="dialog" aria-modal="true" aria-label="${escapeHtmlGlossary(term.term)}">
        <button type="button" class="flash-close" id="flash-close" aria-label="Затвори">&times;</button>
        <div class="flash-inner" id="flash-inner">
          <div class="flash-face flash-front">
            <h3>${escapeHtmlGlossary(term.term)}</h3>
            <p>${escapeHtmlGlossary(term.definition)}</p>
            <span class="flash-flip-hint"><i class="fas fa-rotate"></i> Обърни</span>
          </div>
          <div class="flash-face flash-back">
            <img src="${termImage(term)}" alt="${escapeHtmlGlossary(term.term)}" loading="lazy" onerror="this.style.display='none'">
            <span class="flash-flip-hint"><i class="fas fa-rotate"></i> Обърни</span>
          </div>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('open'));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeFlash();
    });
    document.getElementById('flash-close')?.addEventListener('click', closeFlash);
    document.getElementById('flash-inner')?.addEventListener('click', () => {
      document.querySelector('.flash-modal')?.classList.toggle('flipped');
    });
    document.addEventListener('keydown', flashKey);
  }

  function flashKey(e) {
    if (e.key === 'Escape') closeFlash();
  }

  function closeFlash() {
    document.removeEventListener('keydown', flashKey);
    document.getElementById('flash-overlay')?.remove();
  }

  window.__closeFlash = closeFlash;

  modes?.addEventListener('click', (e) => {
    const btn = e.target.closest('.glossary-mode');
    if (!btn) return;
    modes.querySelectorAll('.glossary-mode').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    mode = btn.dataset.mode || 'list';
    grid.classList.toggle('is-hidden', mode === 'flash');
    flashGrid?.classList.toggle('is-hidden', mode !== 'flash');
    apply();
  });

  flashGrid?.addEventListener('click', (e) => {
    const card = e.target.closest('.flash-card');
    if (!card) return;
    openFlash(Number(card.dataset.idx));
  });

  input.addEventListener('input', () => {
    query = input.value.trim().toLowerCase();
    apply();
  });

  alphabet.addEventListener('click', (e) => {
    const btn = e.target.closest('.glossary-letter');
    if (!btn) return;
    alphabet.querySelectorAll('.glossary-letter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeLetter = btn.dataset.letter;
    apply();
  });
}

export function cleanupGlossaryPage() {
  if (window.__closeFlash) { try { window.__closeFlash(); } catch {} window.__closeFlash = null; }
}