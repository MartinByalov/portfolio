// Lesson renderer engine

import { renderComponent, initComponent } from './registry.js';

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export async function fetchLesson(jsonPath) {
  const res = await fetch(jsonPath);
  if (!res.ok) throw new Error(`HTTP ${res.status} loading ${jsonPath}`);
  return res.json();
}

export function buildLesson(lesson) {
  const headerHtml = `
    <div class="course-header-info">
      <span class="sidebar-badge-inline">${lesson.subject || ''}${lesson.grade ? ' · ' + lesson.grade + ' клас' : ''}</span>
      <h1 class="page-title">${lesson.title}</h1>
      ${lesson.goal ? `<div class="lesson-goal-line tone-orange tag-goal"><span class="lesson-goal-ico"><i class="fas fa-bullseye"></i></span><span class="lesson-goal-text"><strong>Цел:</strong> ${esc(lesson.goal)}</span></div>` : ''}
    </div>
  `;

  const components = lesson.components || [];
  const bodyHtml = components.map(renderComponent).join('');
  const navItems = [];
  components.forEach(c => {
    if (c.heading && c.id) navItems.push({ id: c.id, label: c.heading });
    // Accordion lesson points become direct in-page nav targets too.
    if (c.type === 'accordion') {
      (c.items || []).forEach(it => {
        if (it.title && it.id) navItems.push({ id: it.id, label: it.title });
      });
    }
  });

  return { headerHtml, bodyHtml, navItems };
}

export function initLesson(lesson) {
  (lesson.components || []).forEach(initComponent);
}
