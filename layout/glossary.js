// Interactive glossary and flashcards component

let TERMS = [];

// Extract plain text from HTML content
function stripHtml(html) {
  return String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function blockToDefinition(content) {
  const text = (content || [])
    .filter(b => b && b.type === 'text')
    .map(b => stripHtml(b.content))
    .join(' ');
  return text.length > 320 ? text.slice(0, 317).trimEnd() + '…' : text;
}

// Load terms from all courses and lessons
async function loadTerms() {
  if (TERMS.length) return TERMS;
  const terms = [];
  try {
    const catalogRes = await fetch('data/catalog.json');
    const catalog = await catalogRes.json();
    const courses = catalog.grades.flatMap(g => g.courses).filter(c => c.available);
    for (const course of courses) {
      const courseRes = await fetch(`data/courses/${course.id}.json`);
      if (!courseRes.ok) continue;
      const courseData = await courseRes.json();
      for (const section of courseData.sections || []) {
        for (const lessonMeta of section.lessons || []) {
          if (!lessonMeta.lessonPath) continue;
          const res = await fetch(lessonMeta.lessonPath);
          if (!res.ok) continue;
          const lesson = await res.json();
          const glossary = (lesson.components || []).find(c =>
            c.type === 'accordion' && (c.heading === 'Речник' || c.id === 'lesson-glossary'));
          if (!glossary) continue;
          const lessonTags = [lesson.grade ? lesson.grade + ' клас' : '', lesson.id || course.id].filter(Boolean).join(' ');
          for (const item of glossary.items || []) {
            // нов формат: блок glossary-list вътре в съдържанието
            for (const block of item.content || []) {
              if (block && block.type === 'glossary-list') {
                for (const it of block.items || []) {
                  if (it.term && it.definition) {
                    terms.push({ term: it.term, definition: it.definition, tags: lessonTags });
                  }
                }
              }
            }
            // стар формат: самият item е термин
            if (item.title && item.title !== 'Речник' && item.definition) {
              terms.push({ term: item.title, definition: item.definition, tags: lessonTags });
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('[glossary] Неуспешно зареждане на термините:', err);
  }
  TERMS = terms;
  return TERMS;
}

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
            </div>
          </div>
          <div class="glossary-grid" id="glossary-grid"></div>
          <div class="flash-grid is-hidden" id="flash-grid"></div>
          <p class="glossary-loading" id="glossary-loading">Зареждане на термините от уроците…</p>
          <p class="glossary-empty is-hidden" id="glossary-empty">Няма термини, отговарящи на избора.</p>
        </div>
      </div>
    </section>
  `;
}

function termImage(term) {
  // Stable seed image for flashcard reverse
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

  // Термините идват от „Речник“ акордеоните в края на урокoвете.
  loadTerms().then(terms => {
    const gridNow = document.getElementById('glossary-grid');
    const alphabetNow = document.getElementById('glossary-alphabet');
    if (!gridNow || gridNow !== grid || !alphabetNow) return; // навигацията е сменена
    const loading = document.getElementById('glossary-loading');
    if (loading) loading.remove();
    if (!terms.length) {
      empty.classList.remove('is-hidden');
      empty.textContent = 'Още няма термини — добавете „Речник“ акордеон в края на даден урок.';
      return;
    }
    const letters = [...new Set(terms.map(t => t.term[0].toUpperCase()))].sort((a, b) => a.localeCompare(b, 'bg'));
    alphabetNow.insertAdjacentHTML('beforeend', letters.map(letter =>
      `<button type="button" class="glossary-letter" data-letter="${letter}">${letter}</button>`).join(''));
    grid.innerHTML = terms.map(renderTermCard).join('');
    apply();
  });

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