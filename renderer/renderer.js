// Lesson renderer engine

import { renderComponent, initComponent } from './registry.js';
import { resetAccordionState } from '../components/accordion.js';
import { resolveLessonMedia } from '../utils/media.js';

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export async function fetchLesson(jsonPath) {
  const res = await fetch(jsonPath);
  if (!res.ok) throw new Error(`HTTP ${res.status} loading ${jsonPath}`);
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('text/html')) {
    throw new Error(`Урокът не можа да бъде намерен (${jsonPath}).`);
  }
  return resolveLessonMedia(await res.json());
}

export function buildLesson(lesson) {
  resetAccordionState();
  const gradeLabel = lesson.grade ? ` · ${lesson.grade} клас` : '';
  const goalLabel = 'Цел:';

  const isBlogStyle = lesson.style === 'blog' || lesson.layoutStyle === 'tutorial' || (lesson.grade && Number(lesson.grade) >= 10);

  let headerHtml = '';
  if (isBlogStyle) {
    const pills = (lesson.pills || []).map(p => `
      <a href="#${esc(p.id)}" class="tut-header-pill">${esc(p.label)}</a>
    `).join('');

    headerHtml = `
      <header class="tut-header ${lesson.themeClass || 'theme-blue'}" style="margin-top: 10px; margin-bottom: 24px; max-width: 100%;">
        <div class="tut-header-inner">
          <div class="tut-header-logo" style="color: ${lesson.logoColor || '#60a5fa'};">
            <i class="${lesson.icon || 'fa-solid fa-graduation-cap'}"></i>
          </div>
          <div>
            <div class="tut-header-meta">${esc(lesson.meta || `${lesson.grade || 10}. КЛАС // ИНФОРМАЦИОННИ ТЕХНОЛОГИИ`)}</div>
            <h1>${esc(lesson.title)}</h1>
            <p>${esc(lesson.subtitle || lesson.description || '')}</p>
            ${pills ? `<div class="tut-header-nav">${pills}</div>` : ''}
          </div>
        </div>
      </header>
      ${lesson.goal ? `<div class="lesson-goal-line tone-orange tag-goal" style="margin-bottom: 24px;"><span class="lesson-goal-ico"><i class="fas fa-bullseye"></i></span><span class="lesson-goal-text"><strong>${goalLabel}</strong> ${esc(lesson.goal)}</span></div>` : ''}
    `;
  } else {
    headerHtml = `
      <div class="course-header-info">
        <span class="sidebar-badge-inline">${lesson.subject || ''}${gradeLabel}</span>
        <h1 class="page-title">${esc(lesson.title)}</h1>
        ${lesson.subtitle ? `<p class="page-subtitle" style="font-size: 1.15rem; color: var(--text-muted); font-weight: normal; margin-top: 0.35rem;">${esc(lesson.subtitle)}</p>` : ''}
        ${lesson.goal ? `<div class="lesson-goal-line tone-orange tag-goal" style="margin-top: 1rem;"><span class="lesson-goal-ico"><i class="fas fa-bullseye"></i></span><span class="lesson-goal-text"><strong>${goalLabel}</strong> ${esc(lesson.goal)}</span></div>` : ''}
      </div>
    `;
  }

  const rawComponents = lesson.components || lesson.sections || [];
  const components = rawComponents.map(c => {
    // Standardize 'type' mapping if 'section' has explicit type
    return { ...c, type: c.type || 'text-group' };
  });

  let bodyHtml = components.map(renderComponent).join('');

  if (lesson.glossary && Array.isArray(lesson.glossary) && lesson.glossary.length > 0) {
    const glossaryItems = lesson.glossary.map(term => {
      const isObj = typeof term === 'object';
      const termTitle = isObj ? term.term : term;
      const termDesc = isObj ? term.definition : '';
      return `<li style="margin-bottom: 0.5rem;"><strong>${esc(termTitle)}</strong>${termDesc ? `: ${esc(termDesc)}` : ''}</li>`;
    }).join('');

    bodyHtml += `
      <section id="glossary" class="glossary-section" style="margin-top: 3rem; padding: 2rem; background: var(--surface-alt, #f8fafc); border-radius: 16px; border: 1px solid var(--border-color, #e2e8f0);">
        <h3 style="margin: 0 0 1rem 0; font-size: 1.4rem; color: var(--text-color); display: flex; align-items: center; gap: 0.5rem;">
          <i class="fas fa-book-open" style="color: #3b82f6;"></i> Речник
        </h3>
        <ul style="margin: 0; padding-left: 1.25rem; color: var(--text-color); line-height: 1.6; font-size: 0.95rem;">
          ${glossaryItems}
        </ul>
      </section>
    `;
  }

  const navItems = [];
  components.forEach(c => {
    // Modals, tags, and components with skipNav are never course sidebar navigation destinations
    if (c.type === 'exercise-modal' || c.skipNav) return;
    if (c.type === 'tag' && !c.includeInNav) return;

    if (c.type === 'step-header' || c.type === 'sh') {
      if (c.id) navItems.push({ id: c.id, label: c.navLabel || c.title });
      return;
    }

    if (c.type === 'step-block') {
      if (c.id && (c.title || c.navLabel)) {
        navItems.push({ id: c.id, label: c.navLabel || c.title });
      }
      return;
    }

    if (c.type === 'it10-sandbox' || c.type === 'live-sandbox-block' || c.type === 'sandbox') {
      if (c.id) navItems.push({ id: c.id, label: c.navLabel || c.title || 'Лаборатория' });
      return;
    }

    if (c.type === 'entry-level-quiz' || c.type === 'quiz') {
      if (c.id) navItems.push({ id: c.id, label: c.navLabel || c.title || c.heading || 'Тест за входно ниво' });
      return;
    }

    // Accordion points: numbered main points, trial tests, and glossary enter sidebar navigation
    if (c.type === 'accordion') {
      (c.items || []).forEach(it => {
        if (it.skipNav) return;
        const title = (it.title || '').trim();
        const isMainPoint = /^\d+[\.\)]/.test(title);
        const isGlossary = title.toLowerCase().includes('речник');
        const isTrial = title.toLowerCase().includes('входно ниво') || title.toLowerCase().includes('пробно');
        const isExplicitNav = it.includeInNav === true;

        if ((isMainPoint || isGlossary || isTrial || isExplicitNav) && it.id) {
          navItems.push({ id: it.id, label: it.title });
        }
      });
      return;
    }

    // Top-level standalone sections with explicit navigation request
    if (c.includeInNav && c.id && (c.title || c.heading || c.navLabel)) {
      navItems.push({ id: c.id, label: c.navLabel || c.heading || c.title });
    }
  });

  if (lesson.glossary && Array.isArray(lesson.glossary) && lesson.glossary.length > 0) {
    if (!navItems.some(it => it.id === 'glossary')) {
      navItems.push({ id: 'glossary', label: 'Речник' });
    }
  }

  // Ensure "Речник" is placed at the very bottom of course sidebar if present
  const glossaryIdx = navItems.findIndex(it => it.label && it.label.toLowerCase().includes('речник'));
  if (glossaryIdx !== -1 && glossaryIdx !== navItems.length - 1) {
    const [glossaryItem] = navItems.splice(glossaryIdx, 1);
    navItems.push(glossaryItem);
  }

  return { headerHtml, bodyHtml, navItems };
}

export function initMediaPlaceholders() {
  if (typeof document === 'undefined') return;

  const bindMediaContainer = (container) => {
    const img = container.querySelector('img');
    if (!img) return;

    let retried = false;

    const handleSuccess = () => {
      container.classList.add('image-loaded');
      container.classList.remove('image-failed');
      img.classList.add('lb-zoomable');
      if (!img.getAttribute('title')) {
        img.setAttribute('title', 'Кликнете за преглед в пълен размер');
      }
    };

    const handleFailure = () => {
      if (!retried) {
        retried = true;
        if (img.src && img.src.includes('raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/')) {
          img.src = img.src.replace('raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/', 'cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/');
          return;
        }
        if (img.src && img.src.includes('cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/')) {
          img.src = img.src.replace('cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/', 'raw.githubusercontent.com/MartinByalov/it-media-assets/main/assets/');
          return;
        }
      }
      container.classList.remove('image-loaded');
      container.classList.add('image-failed');
    };

    img.addEventListener('load', handleSuccess);
    img.addEventListener('error', handleFailure);

    if (img.complete) {
      if (img.naturalWidth > 0) {
        handleSuccess();
      } else if (img.src) {
        handleFailure();
      }
    } else if (img.src) {
      // Actively ensure browser triggers load
      const preloader = new Image();
      preloader.onload = () => handleSuccess();
      preloader.onerror = () => handleFailure();
      preloader.src = img.src;
    }
  };

  // 1. Inline / micro media cards
  document.querySelectorAll('.lesson-inline-media-card').forEach(bindMediaContainer);

  // 2. Full-sized image placeholder containers and wrappers
  document.querySelectorAll('.image-placeholder-container, .image-placeholder-wrapper').forEach(bindMediaContainer);
}

export function initLesson(lesson) {
  const components = lesson.components || lesson.sections || [];
  components.forEach(initComponent);
  initMediaPlaceholders();
}
