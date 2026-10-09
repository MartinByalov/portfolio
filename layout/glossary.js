// Interactive glossary and flashcards component
import { resolveGlossaryImageUrl, resolveGlossaryRawUrl, getGlossaryFilename } from '../utils/glossaryMedia.js';
import { openLightbox } from '../components/lightbox.js';

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
  const termsMap = new Map();

  function addTerm(term, definition, tags, image_prompt = '', negative_prompt = '') {
    const cleanTerm = String(term || '').trim();
    const cleanDef = String(definition || '').trim();
    if (!cleanTerm || !cleanDef) return;
    const key = cleanTerm.toLowerCase();
    if (termsMap.has(key)) {
      const existing = termsMap.get(key);
      if (tags && !existing.tags.includes(tags)) {
        existing.tags = `${existing.tags} ${tags}`.trim();
      }
      if (!existing.image_prompt && image_prompt) existing.image_prompt = image_prompt;
      return;
    }
    termsMap.set(key, {
      term: cleanTerm,
      definition: cleanDef,
      tags: String(tags || '').trim(),
      image_prompt: image_prompt || '',
      negative_prompt: negative_prompt || ''
    });
  }

  try {
    const catalogRes = await fetch('data/catalog.json');
    if (!catalogRes.ok) return TERMS;
    const catContentType = catalogRes.headers.get('content-type') || '';
    if (catContentType.includes('text/html')) return TERMS;
    const catalog = await catalogRes.json();
    const catalogCourseIds = (catalog.grades || []).flatMap(g => g.courses || []).map(c => c.id);
    const knownCourses = Array.from(new Set([...catalogCourseIds, 'it-8', 'it-9', 'it-10', 'kaos-12']));

    for (const courseId of knownCourses) {
      try {
        const courseRes = await fetch(`data/courses/${courseId}.json`);
        if (!courseRes.ok) continue;
        const courseContentType = courseRes.headers.get('content-type') || '';
        if (courseContentType.includes('text/html')) continue;
        const courseData = await courseRes.json();
        for (const section of courseData.sections || []) {
          for (const lessonMeta of section.lessons || []) {
            if (!lessonMeta.lessonPath) continue;
            try {
              const res = await fetch(lessonMeta.lessonPath);
              if (!res.ok) continue;
              const lessonContentType = res.headers.get('content-type') || '';
              if (lessonContentType.includes('text/html')) continue;
              const lesson = await res.json();
              const lessonTags = [
                lesson.grade ? `${lesson.grade} клас` : (courseData.title?.includes('8') ? '8 клас' : (courseData.title?.includes('10') ? '10 клас' : '')),
                lesson.id || lessonMeta.id || courseId
              ].filter(Boolean).join(' ');

              // 1. Top-level lesson.glossary (e.g. 10th grade format)
              if (Array.isArray(lesson.glossary)) {
                for (const it of lesson.glossary) {
                  if (it && it.term && (it.definition || it.text)) {
                    addTerm(it.term, it.definition || it.text, lessonTags, it.image_prompt || it.prompt, it.negative_prompt);
                  } else if (it && it.title && it.definition) {
                    addTerm(it.title, it.definition, lessonTags, it.image_prompt || it.prompt, it.negative_prompt);
                  }
                }
              }

              // 2. Component-level glossary
              for (const comp of lesson.components || []) {
                if (!comp) continue;
                if (comp.type === 'glossary-list' && Array.isArray(comp.items)) {
                  for (const it of comp.items) {
                    if (it && it.term && it.definition) {
                      addTerm(it.term, it.definition, lessonTags, it.image_prompt || it.prompt, it.negative_prompt);
                    }
                  }
                } else if (comp.type === 'accordion' && Array.isArray(comp.items)) {
                  for (const item of comp.items) {
                    for (const block of item.content || []) {
                      if (block && block.type === 'glossary-list' && Array.isArray(block.items)) {
                        for (const it of block.items) {
                          if (it && it.term && it.definition) {
                            addTerm(it.term, it.definition, lessonTags, it.image_prompt || it.prompt, it.negative_prompt);
                          }
                        }
                      }
                    }
                    if (item.title && item.title !== 'Речник' && item.definition) {
                      addTerm(item.title, item.definition, lessonTags, item.image_prompt || item.prompt, item.negative_prompt);
                    }
                  }
                }
              }
            } catch (err) {
              console.warn('[glossary] Проблем при зареждане на урок:', lessonMeta.lessonPath, err);
            }
          }
        }
      } catch (err) {
        console.warn('[glossary] Проблем при зареждане на курс:', courseId, err);
      }
    }
  } catch (err) {
    console.error('[glossary] Неуспешно зареждане на термините:', err);
  }

  TERMS = Array.from(termsMap.values()).sort((a, b) => a.term.localeCompare(b.term, 'bg'));
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
          <h2 class="page-title">Речник на термините</h2>
          <p class="page-description" id="glossary-description">Всички термини, дефиниции и понятия от уроците по Информационни технологии.</p>
          <div class="glossary-tools">
            <div class="glossary-modes" id="glossary-modes" role="tablist" aria-label="Речник">
              <button type="button" class="glossary-mode active" data-mode="list"><i class="fas fa-list"></i> Списък</button>
              <button type="button" class="glossary-mode" data-mode="flash"><i class="fas fa-layer-group"></i> Флаш карти</button>
            </div>
            <input type="text" id="glossary-filter" class="glossary-filter" placeholder="Търсене на термин или понятие...">
            <div class="glossary-alphabet" id="glossary-alphabet">
              <button type="button" class="glossary-letter active" data-letter="">Всички</button>
            </div>
          </div>
          <div class="glossary-grid" id="glossary-grid"></div>
          <div class="flash-grid is-hidden" id="flash-grid"></div>
          <p class="glossary-loading" id="glossary-loading">Зареждане на термините от уроците…</p>
          <p class="glossary-empty is-hidden" id="glossary-empty">Няма намерени термини.</p>
        </div>
      </div>
    </section>
  `;
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
  const descEl = document.getElementById('glossary-description');
  if (!input || !alphabet || !grid) return;

  const LIST_DESCRIPTION = 'Всички термини, дефиниции и понятия от уроците по Информационни технологии.';
  const FLASH_DESCRIPTION = 'Интерактивни флаш карти с илюстрации за бързо преговаряне и самопроверка на основните понятия.';

  let activeLetter = '';
  let query = '';
  let mode = 'list';

  // Load terms from lesson glossary sections
  loadTerms().then(terms => {
    const gridNow = document.getElementById('glossary-grid');
    const alphabetNow = document.getElementById('glossary-alphabet');
    if (!gridNow || gridNow !== grid || !alphabetNow) return; // Navigation changed
    const loading = document.getElementById('glossary-loading');
    if (loading) loading.remove();
    if (!terms.length) {
      empty.classList.remove('is-hidden');
      empty.textContent = 'Още няма термини - добавете „Речник“ акордеон в края на даден урок.';
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
    // Flashcard mode: cards display term only
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

    const cdnUrl = resolveGlossaryImageUrl(term.term);
    const rawFallbackUrl = resolveGlossaryRawUrl(term.term);
    const safeTerm = escapeHtmlGlossary(term.term);
    const safeFilename = escapeHtmlGlossary(getGlossaryFilename(term.term));

    const overlay = document.createElement('div');
    overlay.className = 'flash-overlay';
    overlay.id = 'flash-overlay';
    overlay.innerHTML = `
      <div class="flash-modal" role="dialog" aria-modal="true" aria-label="${safeTerm}">
        <button type="button" class="flash-close" id="flash-close" aria-label="Затвори">&times;</button>
        <div class="flash-inner" id="flash-inner">
          <div class="flash-face flash-front">
            <h3 class="flash-term-title">${safeTerm}</h3>
            <div class="flash-body-centered">
              <div class="flash-image-wrapper" id="flash-image-wrapper">
                <div class="flash-image-loading" id="flash-image-loading">
                  <i class="fas fa-spinner fa-spin"></i>
                </div>
                <img src="${cdnUrl}"
                     alt="${safeTerm}"
                     class="flash-term-img"
                     loading="eager"
                     onload="this.style.opacity='1'; const spin = document.getElementById('flash-image-loading'); if(spin) spin.style.display='none';"
                     onerror="if(this.src.includes('cdn.jsdelivr.net')){this.src='${rawFallbackUrl}';}else{this.style.display='none'; const fb = document.getElementById('flash-fallback-icon'); if(fb) fb.style.display='flex'; const spin = document.getElementById('flash-image-loading'); if(spin) spin.style.display='none';}"
                     style="opacity: 0; transition: opacity 0.25s ease;"
                     title="Кликнете за увеличение (Zoom)" />
                <div class="flash-micro-fallback" id="flash-fallback-icon" style="display: none;">
                  <i class="fas fa-layer-group"></i>
                  <span>${safeTerm}</span>
                </div>
              </div>
            </div>
            <span class="flash-flip-hint" aria-hidden="true" title="Завърти картата"><i class="fas fa-rotate"></i></span>
          </div>
          <div class="flash-face flash-back">
            <h3 class="flash-back-title">${safeTerm}</h3>
            <div class="flash-body-centered">
              <p class="flash-definition-text">${escapeHtmlGlossary(term.definition)}</p>
            </div>
            <span class="flash-flip-hint" aria-hidden="true" title="Завърти картата"><i class="fas fa-rotate"></i></span>
          </div>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('open'));

    // Zoom image handler
    const handleZoom = (e) => {
      e.stopPropagation();
      e.preventDefault();
      const img = overlay.querySelector('.flash-term-img');
      if (!img || img.style.display === 'none' || img.style.opacity === '0') return;
      const src = img.currentSrc || img.src;
      if (src) {
        openLightbox(src, term.term);
      }
    };

    overlay.querySelector('.flash-term-img')?.addEventListener('click', handleZoom);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeFlash();
    });
    document.getElementById('flash-close')?.addEventListener('click', closeFlash);
    document.getElementById('flash-inner')?.addEventListener('click', (e) => {
      // Do not flip when the image is clicked to open the lightbox
      if (e.target.closest('.flash-term-img')) {
        return;
      }
      document.querySelector('.flash-modal')?.classList.toggle('flipped');
    });
    document.addEventListener('keydown', flashKey);
  }

  function flashKey(e) {
    if (e.key === 'Escape') {
      if (document.body.classList.contains('lb-lightbox-open')) {
        return; // Lightbox handles its own Escape close first
      }
      closeFlash();
    }
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
    if (descEl) {
      descEl.textContent = mode === 'flash' ? FLASH_DESCRIPTION : LIST_DESCRIPTION;
    }
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