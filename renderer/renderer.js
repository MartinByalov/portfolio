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
  return resolveLessonMedia(await res.json());
}

export function buildLesson(lesson) {
  resetAccordionState();
  const gradeLabel = lesson.grade ? ` · ${lesson.grade} клас` : '';
  const goalLabel = 'Цел:';

  const headerHtml = `
    <div class="course-header-info">
      <span class="sidebar-badge-inline">${lesson.subject || ''}${gradeLabel}</span>
      <h1 class="page-title">${esc(lesson.title)}</h1>
      ${lesson.subtitle ? `<p class="page-subtitle" style="font-size: 1.15rem; color: var(--text-muted); font-weight: normal; margin-top: 0.35rem;">${esc(lesson.subtitle)}</p>` : ''}
      ${lesson.goal ? `<div class="lesson-goal-line tone-orange tag-goal" style="margin-top: 1rem;"><span class="lesson-goal-ico"><i class="fas fa-bullseye"></i></span><span class="lesson-goal-text"><strong>${goalLabel}</strong> ${esc(lesson.goal)}</span></div>` : ''}
    </div>
  `;

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
    // Modals are never course sidebar navigation destinations
    if (c.type === 'exercise-modal') return;

    const label = c.heading || c.title;
    if (label && c.id && !c.skipNav) navItems.push({ id: c.id, label: label });
    // Accordion lesson points become direct in-page nav targets too.
    if (c.type === 'accordion') {
      (c.items || []).forEach(it => {
        if (it.title && it.id && !it.skipNav) navItems.push({ id: it.id, label: it.title });
      });
    }
    if (c.type === 'tag' && c.text && c.id && !c.skipNav) {
      navItems.push({ id: c.id, label: c.text });
    }
  });

  if (lesson.glossary && Array.isArray(lesson.glossary) && lesson.glossary.length > 0) {
    navItems.push({ id: 'glossary', label: 'Речник' });
  }

  // Ensure "Речник" is placed at the very bottom of course sidebar if present
  const glossaryIdx = navItems.findIndex(it => it.label === 'Речник');
  if (glossaryIdx !== -1 && glossaryIdx !== navItems.length - 1) {
    const [glossaryItem] = navItems.splice(glossaryIdx, 1);
    navItems.push(glossaryItem);
  }

  return { headerHtml, bodyHtml, navItems };
}

export function initLesson(lesson) {
  const components = lesson.components || lesson.sections || [];
  components.forEach(initComponent);
}
