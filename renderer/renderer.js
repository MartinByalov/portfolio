/* renderer/renderer.js
   The Lesson Renderer engine. Given lesson JSON, it builds the header
   HTML, the concatenated component body HTML, and a list of in-page nav
   items (label + anchor id) for any component that declares a
   "heading" — app.js uses that list to build the lesson's aside nav.
*/

import { renderComponent, initComponent } from './registry.js';

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
      ${lesson.goal ? `<p class="page-description">Цел: ${lesson.goal}</p>` : ''}
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
