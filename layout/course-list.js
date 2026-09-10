/* layout/course-list.js
   Renders a course's sections as an accordion of lesson links — the
   "Раздел -> Урок" level of the hierarchy. Lessons that have a
   lessonPath are real links to #/lesson/...; the rest render as
   disabled "предстои" items, same idea as the "#" placeholders in the
   original HTML pages.
*/

import { initAccordion } from '../components/accordion-behavior.js';

export function render(course) {
  const sections = (course.sections || []).map(section => {
    const items = section.lessons.map(lesson => {
      if (lesson.lessonPath) {
        return `<li><a href="#/lesson/${course.id}/${lesson.id}">${lesson.title}</a></li>`;
      }
      return `<li><span class="lesson-link-disabled">${lesson.title} <em>(предстои)</em></span></li>`;
    }).join('');

    return `
      <div class="accordion-item">
        <div class="accordion-header">
          <span class="card-title">${section.title}</span>
          <i class="fas fa-chevron-down card-icon-mini"></i>
        </div>
        <div class="accordion-content">
          <ul class="lesson-links">${items}</ul>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="course-header-info">
      <h1 class="page-title">${course.title}</h1>
      <p class="page-description">${course.description || ''}</p>
    </div>
    <div class="accordion">${sections}</div>
  `;
}

export function init(root) {
  initAccordion(root.querySelector('.accordion'));
}
