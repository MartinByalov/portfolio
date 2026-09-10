/* layout/course-shell.js
   The two-column shell used by both the course listing view and the
   lesson view: a narrow "course-sidebar" aside (either the class/course
   picker, or a back-link + in-page section nav) plus the wide
   "course-main" content area.
*/

export function render(asideHtml, mainHtml) {
  return `
    <section class="home-section">
      <div class="home-content">
        <div class="course-layout">
          <aside class="course-sidebar">${asideHtml}</aside>
          <main class="course-main">${mainHtml}</main>
        </div>
      </div>
    </section>
  `;
}

/* Aside for the catalog/course view: full list of grades and courses. */
export function renderClassPicker(catalog, activeCourseId) {
  const links = catalog.grades.flatMap(grade => grade.courses).map(course => {
    const activeClass = course.id === activeCourseId ? ' active' : '';
    const target = course.available ? `#/course/${course.id}` : '#';
    const disabled = course.available ? '' : ' course-link-disabled';
    return `<a href="${target}" class="course-link${activeClass}${disabled}"><i class='bx bx-chevron-right'></i> ${course.title}</a>`;
  }).join('');

  return `
    <div class="sidebar-badge">Класове</div>
    <nav class="course-list-nav">${links}</nav>
  `;
}

/* Aside for the lesson view: back link + in-page anchors to each named component. */
export function renderLessonNav(courseId, navItems) {
  const links = navItems.map((item, i) => `
    <a href="#${item.id}" class="course-link${i === 0 ? ' active' : ''}"><i class='bx bx-chevron-right'></i> ${item.label}</a>
  `).join('');

  return `
    <div class="sidebar-badge">Урок</div>
    <nav class="course-list-nav">
      <a href="#/course/${courseId}" class="course-link"><i class='bx bx-left-arrow-alt'></i> Назад</a>
      ${links}
    </nav>
  `;
}
