// Application router and entry controller

import * as Header from './layout/header.js';
import * as Sidebar from './layout/sidebar.js';
import * as Footer from './layout/footer.js';
import * as CourseShell from './layout/course-shell.js';
import * as CourseList from './layout/course-list.js';
import * as Home from './layout/home.js';
import * as Portfolio from './layout/portfolio.js';
import * as Experience from './layout/experience.js';
import * as About from './layout/about.js';
import * as Glossary from './layout/glossary.js';
import * as Software from './layout/software.js';
import * as Other from './layout/other.js';
import { fetchLesson, buildLesson, initLesson } from './renderer/renderer.js';
import { initScrollSpy } from './components/scroll-spy.js';
import { initLightbox } from './components/lightbox.js';

let catalogCache = null;

async function getCatalog() {
  if (!catalogCache) {
    const res = await fetch('data/catalog.json');
    catalogCache = await res.json();
  }
  return catalogCache;
}

async function getCourse(courseId) {
  const res = await fetch(`data/courses/${courseId}.json`);
  if (!res.ok) throw new Error(`Курсът "${courseId}" не е намерен.`);
  return res.json();
}

function parseHash() {
  return location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
}

async function renderCourseView(courseId) {
  const [catalog, course] = await Promise.all([getCatalog(), getCourse(courseId)]);
  const asideHtml = CourseShell.renderClassPicker(catalog, courseId);
  const mainHtml = CourseList.render(course);
  document.getElementById('view-root').innerHTML = CourseShell.render(asideHtml, mainHtml);
  CourseList.init(document.querySelector('.course-main'));
}

async function renderLessonView(courseId, lessonId) {
  const course = await getCourse(courseId);
  const allLessons = course.sections.flatMap(s => s.lessons);
  const lessonMeta = allLessons.find(l => l.id === lessonId);
  const lessonIndex = allLessons.findIndex(l => l.id === lessonId);
  const lessonNumber = lessonIndex + 1;
  const lessonTitleNum = lessonMeta.title ? (lessonMeta.title.match(/^(\d+\.\d+)/)?.[1] || String(lessonIndex + 1)) : String(lessonIndex + 1);
  if (!lessonMeta || !lessonMeta.lessonPath) throw new Error('Урокът все още не е добавен.');

  const lesson = await fetchLesson(lessonMeta.lessonPath);
  const { headerHtml, bodyHtml, navItems } = buildLesson(lesson);
  const asideHtml = CourseShell.renderLessonNav(courseId, navItems, lessonTitleNum);
  const mainHtml = headerHtml + `<div class="lesson-body">${bodyHtml}</div>` + renderLessonNavTags(course, lessonId);

  document.getElementById('view-root').innerHTML = CourseShell.render(asideHtml, mainHtml);
  initLesson(lesson);
  initLightbox(document.getElementById('view-root'));
  initScrollSpy();
}

function getLessonNumLabel(item) {
  if (!item) return '';
  const match = item.title ? item.title.match(/^(\d+\.\d+)/) : null;
  if (match) return `Урок ${match[1]}`;
  const idMatch = item.id ? item.id.match(/^it-(\d+)-(\d+)$/) : null;
  if (idMatch) {
    const num = Math.max(0, parseInt(idMatch[2], 10) - 1);
    return `Урок ${idMatch[1]}.${num}`;
  }
  return `Урок ${item.title || ''}`;
}

// Navigation tags at the end of a lesson pointing to previous and next lessons
function renderLessonNavTags(course, lessonId) {
  for (const section of course.sections || []) {
    const lessons = section.lessons || [];
    for (let i = 0; i < lessons.length; i++) {
      if (lessons[i].id !== lessonId) continue;
      const prev = lessons[i - 1];
      const next = lessons[i + 1];

      let prevHtml = '';
      if (prev && prev.lessonPath) {
        const prevLabel = getLessonNumLabel(prev);
        prevHtml = `
          <a class="lesson-nav-tag prev-lesson-tag" href="#/lesson/${course.id}/${prev.id}">
            <i class="fas fa-arrow-left lesson-nav-arrow"></i>
            <span class="lesson-nav-title">${prevLabel}</span>
          </a>`;
      }

      let nextHtml = '';
      if (next && next.lessonPath) {
        const nextLabel = getLessonNumLabel(next);
        nextHtml = `
          <a class="lesson-nav-tag next-lesson-tag" href="#/lesson/${course.id}/${next.id}">
            <span class="lesson-nav-title">${nextLabel}</span>
            <i class="fas fa-arrow-right lesson-nav-arrow"></i>
          </a>`;
      }

      if (!prevHtml && !nextHtml) return '';

      return `
        <div class="lesson-nav-wrap">
          <div class="lesson-nav-prev">${prevHtml}</div>
          <div class="lesson-nav-next">${nextHtml}</div>
        </div>`;
    }
  }
  return '';
}

async function redirectToFirstCourse() {
  const catalog = await getCatalog();
  const firstAvailable = catalog.grades.flatMap(g => g.courses).find(c => c.available);
  if (firstAvailable) {
    location.hash = `#/course/${firstAvailable.id}`;
  } else {
    document.getElementById('view-root').innerHTML = '<p class="error-state">Няма налични курсове.</p>';
  }
}

async function route() {
  const parts = parseHash();
  const viewRoot = document.getElementById('view-root');
  const body = document.body;
  const headerRoot = document.getElementById('header-root');
  const sidebarRoot = document.getElementById('sidebar-root');
  const footerRoot = document.getElementById('footer-root');

  Portfolio.cleanupPortfolio();
  About.cleanupAboutAudio();
  Home.cleanupLanding();
  Glossary.cleanupGlossaryPage?.();

  // Re-render sidebar when switching between portfolio and learning modes
  const newMode = (parts[0] === 'portfolio' || parts[0] === 'experience') ? 'portfolio' : 'learning';
  // Persist mode so standalone /tools/* pages render the same side menu
  Sidebar.setStoredMode(newMode);
  const currentMode = body.classList.contains('portfolio-mode') ? 'portfolio' : 'learning';

  body.classList.remove('about-mode', 'portfolio-mode', 'landing-mode');
  if (headerRoot) headerRoot.style.display = '';
  if (sidebarRoot) sidebarRoot.style.display = '';
  if (footerRoot) footerRoot.style.display = '';

  if (newMode !== currentMode) {
    sidebarRoot.innerHTML = Sidebar.render(newMode);
    Sidebar.init();
  }

  viewRoot.innerHTML = '<p class="loading-state">Зареждане...</p>';

  try {
    if (parts.length === 0) {
      // Public landing page
      Header.setTitle('Начало', 'fa-solid fa-house');
      document.body.classList.add('landing-mode');
      const catalog = await getCatalog();
      viewRoot.innerHTML = Home.renderLandingPage(catalog);
      requestAnimationFrame(() => Home.initLandingPage());
    } else if (parts[0] === 'portfolio') {
      // Portfolio access control
      if (!About.isPortfolioUnlocked()) {
        location.hash = '#/about';
        return;
      }
      body.classList.add('portfolio-mode');
      Header.setTitle('Учителско Портфолио', 'fa-solid fa-graduation-cap');
      viewRoot.innerHTML = Portfolio.renderPortfolioPage();
      requestAnimationFrame(() => Portfolio.initPortfolioPage());
    } else if (parts[0] === 'about') {
      body.classList.add('about-mode');
      if (headerRoot) headerRoot.style.display = 'none';
      if (sidebarRoot) sidebarRoot.style.display = 'none';
      if (footerRoot) footerRoot.style.display = 'none';
      viewRoot.innerHTML = About.renderAboutPage();
      About.initAboutPage();
      About.initAboutAudio();
    } else if (parts[0] === 'tools') {
      // Redirect to standalone tools dashboard preserving mode
      location.replace(`/tools/index.html?mode=${newMode}`);
      return;
    } else if (parts[0] === 'experience') {
      if (!About.isPortfolioUnlocked()) {
        location.hash = '#/about';
        return;
      }
      body.classList.add('portfolio-mode');
      Header.setTitle('Професионален опит', 'fa-solid fa-briefcase');
      viewRoot.innerHTML = Experience.renderExperiencePage();
    } else if (parts[0] === 'lesson' && parts[1] && parts[2]) {
      Header.setTitle('Учебни материали', 'fa-solid fa-book-open');
      await renderLessonView(parts[1], parts[2]);
    } else if (parts[0] === 'course' && parts[1]) {
      Header.setTitle('Учебни материали', 'fa-solid fa-book-open');
      await renderCourseView(parts[1]);
    } else if (parts[0] === 'subjects') {
      Header.setTitle('Учебни ресурси', 'fa-solid fa-book-open');
      viewRoot.innerHTML = Home.renderSubjectsPage();
    } else if (parts[0] === 'dictionary') {
      Header.setTitle('Речник', 'fa-solid fa-book');
      Glossary.cleanupGlossaryPage?.();
      viewRoot.innerHTML = Glossary.renderGlossaryPage();
      requestAnimationFrame(() => Glossary.initGlossaryPage());
    } else if (parts[0] === 'software') {
      Header.setTitle('Софтуер', 'fa-solid fa-code');
      viewRoot.innerHTML = Software.renderSoftwarePage();
      requestAnimationFrame(() => Software.initSoftwarePage());
    } else if (parts[0] === 'other' || parts[0] === 'tutorials') {
      const sub = parts[1];
      if (sub === 'nft-generator') {
        Header.setTitle('Генератор на NFT', 'fa-solid fa-cube');
      } else if (sub === 'charts' || sub === 'graph-js') {
        Header.setTitle('Диаграми с Graph.js', 'fa-solid fa-chart-line');
      } else {
        Header.setTitle('Други', 'fa-solid fa-shapes');
      }
      viewRoot.innerHTML = Other.renderOtherPage(sub);
      requestAnimationFrame(() => Other.initOtherPage(sub));
    } else {
      Header.setTitle('Учебни ресурси', 'fa-solid fa-book-open');
      viewRoot.innerHTML = Home.renderSubjectsPage();
    }
  } catch (err) {
    viewRoot.innerHTML = `<p class="error-state">Грешка: ${err.message}</p>`;
    console.error(err);
  }

  window.scrollTo(0, 0);
}

// Mount chrome components and start router
document.getElementById('header-root').innerHTML = Header.render();
const initialMode = Sidebar.getStoredMode()
  || (location.hash.startsWith('#/portfolio') || location.hash.startsWith('#/experience') ? 'portfolio' : 'learning');
document.getElementById('sidebar-root').innerHTML = Sidebar.render(initialMode);
document.getElementById('footer-root').innerHTML = Footer.render();
Header.init();
Sidebar.init();

// Route app paths on hashchange
window.addEventListener('hashchange', () => {
  const h = location.hash;
  if (h === '' || h === '#' || h.startsWith('#/')) route();
});
Sidebar.setStoredMode(initialMode);
route();
