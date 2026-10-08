// Course section and lesson list renderer

import { initAccordion } from '../components/accordion-behavior.js';

export function render(course) {
  const sections = (course.sections || []).map(section => {
    const isPending = ['it-8', 'it-10'].includes(course.id) &&
      !section.lessons.some(lesson => lesson.lessonPath);
    const items = section.lessons.map(lesson => {
      if (lesson.lessonPath) {
        return `<li><a href="#/lesson/${course.id}/${lesson.id}">${lesson.title}</a></li>`;
      }
      return `<li><span class="lesson-link-disabled">${lesson.title} <em>(предстои)</em></span></li>`;
    }).join('');

    return `
      <div class="accordion-item${isPending ? ' course-section-pending' : ''}">
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

  const resourceLinks = course.links && course.links.length
    ? course.links
    : (course.textbookUrl ? [{ label: course.textbookLabel || 'Учебник', url: course.textbookUrl, icon: 'fas fa-book-open' }] : []);

  const resourceBtns = resourceLinks.map(link => `
      <a class="course-textbook-btn" href="${link.url}" target="_blank" rel="noopener">
        <span class="course-textbook-ico"><i class="${link.icon || 'fas fa-link'}"></i></span>
        <span class="course-textbook-text">${link.label}</span>
        <i class="fas fa-chevron-right course-textbook-arrow"></i>
      </a>`).join('');

  return `
    <div class="course-header-info">
      <h1 class="page-title">${course.title}</h1>
      <p class="page-description">${course.description || ''}</p>
      ${resourceBtns}
    </div>
    <div class="accordion">${sections}</div>
  `;
}

export function init(root) {
  initAccordion(root.querySelector('.accordion'));
}
