// Lesson renderer engine

import { renderComponent, initComponent } from './registry.js';
import { resetAccordionState } from '../components/accordion.js';

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export async function fetchLesson(jsonPath) {
  const res = await fetch(jsonPath);
  if (!res.ok) throw new Error(`HTTP ${res.status} loading ${jsonPath}`);
  return await res.json();
}

export function buildLesson(lesson) {
  resetAccordionState();
  const gradeLabel = lesson.grade ? ` · ${lesson.grade} клас` : '';
  const goalLabel = 'Цел:';

  const headerHtml = `
    <div class="course-header-info">
      <span class="sidebar-badge-inline">${lesson.subject || ''}${gradeLabel}</span>
      <h1 class="page-title">${lesson.title}</h1>
      ${lesson.goal ? `<div class="lesson-goal-line tone-orange tag-goal"><span class="lesson-goal-ico"><i class="fas fa-bullseye"></i></span><span class="lesson-goal-text"><strong>${goalLabel}</strong> ${esc(lesson.goal)}</span></div>` : ''}
    </div>
  `;

  const components = lesson.components || [];
  const bodyHtml = components.map(renderComponent).join('');
  const navItems = [];
  components.forEach(c => {
    if (c.heading && c.id && !c.skipNav) navItems.push({ id: c.id, label: c.heading });
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

  // Ensure "Речник" is placed at the very bottom of course sidebar if present
  const glossaryIdx = navItems.findIndex(it => it.label === 'Речник');
  if (glossaryIdx !== -1 && glossaryIdx !== navItems.length - 1) {
    const [glossaryItem] = navItems.splice(glossaryIdx, 1);
    navItems.push(glossaryItem);
  }

  return { headerHtml, bodyHtml, navItems };
}

export function initLesson(lesson) {
  (lesson.components || []).forEach(initComponent);
}
