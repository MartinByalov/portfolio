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
import * as Tradehut from './layout/tradehut.js';
import { fetchLesson, buildLesson, initLesson } from './renderer/renderer.js';
import { initScrollSpy } from './components/scroll-spy.js';
import { initLightbox } from './components/lightbox.js';

let catalogCache = null;

async function getCatalog() {
  if (!catalogCache) {
    const res = await fetch('data/catalog.json');
    if (!res.ok) {
      throw new Error('Неуспешно зареждане на каталога.');
    }
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      throw new Error('Невалиден формат на каталога.');
    }
    catalogCache = await res.json();
  }
  return catalogCache;
}

async function getCourse(courseId) {
  const res = await fetch(`data/courses/${courseId}.json`);
  if (!res.ok) {
    throw new Error(`Курсът "${courseId}" не е намерен.`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('text/html')) {
    throw new Error(`Курсът "${courseId}" не е намерен.`);
  }
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

const LEGACY_LESSON_ID_MAP = {
  'it-8-2': 'it-8-1-1',
  'it-8-3': 'it-8-1-2',
  'it-8-4': 'it-8-1-3',
  'it-8-5': 'it-8-1-4',
  'it-8-6': 'it-8-1-5',
  'it-8-7': 'it-8-2-1',
  'it-8-8': 'it-8-2-2',
  'it-8-9': 'it-8-2-3',
  'it-8-10': 'it-8-2-4',
  'it-8-11': 'it-8-2-5'
};

async function renderLessonView(courseId, lessonId) {
  const normalizedLessonId = LEGACY_LESSON_ID_MAP[lessonId] || lessonId;
  const course = await getCourse(courseId);
  const allLessons = course.sections.flatMap(s => s.lessons);
  let lessonMeta = allLessons.find(l => l.id === normalizedLessonId || l.id === lessonId);
  if (!lessonMeta) {
    lessonMeta = allLessons.find(l =>
      l.id === normalizedLessonId ||
      l.id === lessonId ||
      l.lessonPath?.includes(normalizedLessonId) ||
      l.lessonPath?.includes(lessonId) ||
      (lessonId.includes('2-1') && (l.id === 'it-8-2-1' || l.id === 'it-8-7'))
    );
  }
  if (!lessonMeta || !lessonMeta.lessonPath) {
    throw new Error('Урокът все още не е добавен.');
  }
  const lessonIndex = allLessons.findIndex(l => l.id === lessonMeta.id);
  const isReview = lessonMeta.title && lessonMeta.title.toLowerCase().includes('преговор');
  const secLessonMatch = lessonMeta.id ? lessonMeta.id.match(/^it-\d+-(\d+)-(\d+)$/) : null;
  const lessonTitleNum = isReview
    ? 'Преговор'
    : (lessonMeta.title ? (lessonMeta.title.match(/^(\d+\.\d+)/)?.[1] || (secLessonMatch ? `${secLessonMatch[1]}.${secLessonMatch[2]}` : String(lessonIndex + 1))) : (secLessonMatch ? `${secLessonMatch[1]}.${secLessonMatch[2]}` : String(lessonIndex + 1)));

  const lesson = await fetchLesson(lessonMeta.lessonPath);
  document.body.classList.toggle('lesson-course-it-10', courseId === 'it-10');
  const lessonDisplayTitle = lesson.title || lessonMeta.title || 'Урок';
  Header.setTitle(lessonDisplayTitle, 'fa-solid fa-file-lines');
  document.title = `${lessonDisplayTitle} - Учебна платформа`;

  const { headerHtml, bodyHtml, navItems } = buildLesson(lesson);
  const asideHtml = CourseShell.renderLessonNav(courseId, navItems, lessonTitleNum);
  const mainHtml = headerHtml + `<div class="lesson-body">${bodyHtml}</div>` + renderLessonNavTags(course, lessonMeta.id);

  document.getElementById('view-root').innerHTML = CourseShell.render(asideHtml, mainHtml);
  initLesson(lesson);
  initLightbox(document.getElementById('view-root'));
  initScrollSpy();
}

function getLessonNumLabel(item) {
  if (!item) return '';
  if (item.title && (item.title.toLowerCase().includes('преговор'))) {
    return 'Преговор';
  }
  const prefix = 'Урок';
  const match = item.title ? item.title.match(/^(\d+\.\d+)/) : null;
  if (match) return `${prefix} ${match[1]}`;
  const secLessonMatch = item.id ? item.id.match(/^it-\d+-(\d+)-(\d+)$/) : null;
  if (secLessonMatch) {
    return `${prefix} ${secLessonMatch[1]}.${secLessonMatch[2]}`;
  }
  const idMatch = item.id ? item.id.match(/^it-(\d+)-(\d+)$/) : null;
  if (idMatch) {
    const num = Math.max(0, parseInt(idMatch[2], 10) - 1);
    return `${prefix} ${idMatch[1]}.${num}`;
  }
  return `${prefix} ${item.title || ''}`;
}

// Navigation tags at the end of a lesson pointing to previous and next lessons
function renderLessonNavTags(course, lessonId) {
  const allLessons = (course.sections || []).flatMap(s => s.lessons || []);
  const currentIndex = allLessons.findIndex(l => l.id === lessonId);
  if (currentIndex === -1) return '';

  const prev = allLessons[currentIndex - 1];
  const next = allLessons[currentIndex + 1];

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
  const siteSuffix = 'Учебна платформа';

  Portfolio.cleanupPortfolio();
  About.cleanupAboutAudio();
  Home.cleanupLanding();
  Glossary.cleanupGlossaryPage?.();

  // Re-render sidebar when switching between portfolio and learning modes
  const newMode = (parts[0] === 'portfolio' || parts[0] === 'experience') ? 'portfolio' : 'learning';
  // Persist mode so standalone /tools/* pages render the same side menu
  Sidebar.setStoredMode(newMode);
  const currentMode = body.classList.contains('portfolio-mode') ? 'portfolio' : 'learning';

  body.classList.remove('about-mode', 'portfolio-mode', 'landing-mode', 'tradehut-mode');
  if (headerRoot) headerRoot.style.display = '';
  if (sidebarRoot) sidebarRoot.style.display = '';
  if (footerRoot) footerRoot.style.display = '';

  if (newMode !== currentMode) {
    sidebarRoot.innerHTML = Sidebar.render(newMode);
    Sidebar.init();
  }

  viewRoot.innerHTML = '<p class="loading-state">Зареждане…</p>';

  try {
    if (parts[0] === 'tradehut' || parts[0] === 'trading') {
      body.classList.add('tradehut-mode');
      if (headerRoot) headerRoot.style.display = 'none';
      if (sidebarRoot) sidebarRoot.style.display = 'none';
      document.title = `Tradehut - ${siteSuffix}`;
      viewRoot.innerHTML = Tradehut.renderTradehutPage();
    } else if (parts.length === 0) {
      // Public landing page
      Header.setTitle('Начало', 'fa-solid fa-house');
      document.title = `Начало - ${siteSuffix}`;
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
      Header.setTitle('Учителско портфолио', 'fa-solid fa-graduation-cap');
      document.title = `Учителско портфолио - ${siteSuffix}`;
      viewRoot.innerHTML = Portfolio.renderPortfolioPage();
      requestAnimationFrame(() => Portfolio.initPortfolioPage());
    } else if (parts[0] === 'about') {
      body.classList.add('about-mode');
      if (headerRoot) headerRoot.style.display = 'none';
      if (sidebarRoot) sidebarRoot.style.display = 'none';
      if (footerRoot) footerRoot.style.display = 'none';
      Header.setTitle('Код за достъп', 'fa-solid fa-lock');
      document.title = `Код за достъп - ${siteSuffix}`;
      viewRoot.innerHTML = About.renderAboutPage();
      About.initAboutPage();
      About.initAboutAudio();
    } else if (parts[0] === 'tools') {
      // Redirect to standalone tools dashboard preserving mode
      location.replace(`/tools/index.html?mode=${newMode}`);
      return;
    } else if (parts[0]?.toLowerCase() === 'pocketracer') {
      location.replace('tools/pockeTracer/index.html');
      return;
    } else if (parts[0] === 'experience') {
      if (!About.isPortfolioUnlocked()) {
        location.hash = '#/about';
        return;
      }
      body.classList.add('portfolio-mode');
      Header.setTitle('Професионален опит', 'fa-solid fa-briefcase');
      document.title = `Професионален опит - ${siteSuffix}`;
      viewRoot.innerHTML = Experience.renderExperiencePage();
    } else if (parts[0] === 'lesson' && parts[1] && parts[2]) {
      Header.setTitle('Урок', 'fa-solid fa-file-lines');
      document.title = `Урок - ${siteSuffix}`;
      await renderLessonView(parts[1], parts[2]);
    } else if (parts[0] === 'course' && parts[1]) {
      const course = await getCourse(parts[1]);
      let courseName = course?.title || 'Курс';
      Header.setTitle(courseName, 'fa-solid fa-book');
      document.title = `${courseName} - ${siteSuffix}`;
      await renderCourseView(parts[1]);
    } else if (parts[0] === 'subjects') {
      Header.setTitle('Учебни ресурси', 'fa-solid fa-book-open');
      document.title = `Учебни ресурси - ${siteSuffix}`;
      viewRoot.innerHTML = Home.renderSubjectsPage();
    } else if (parts[0] === 'dictionary') {
      Header.setTitle('Речник', 'fa-solid fa-book');
      document.title = `Речник - ${siteSuffix}`;
      Glossary.cleanupGlossaryPage?.();
      viewRoot.innerHTML = Glossary.renderGlossaryPage();
      requestAnimationFrame(() => Glossary.initGlossaryPage());
    } else if (parts[0] === 'software') {
      Header.setTitle('Софтуер', 'fa-solid fa-code');
      document.title = `Софтуер - ${siteSuffix}`;
      viewRoot.innerHTML = Software.renderSoftwarePage();
      requestAnimationFrame(() => Software.initSoftwarePage());
    } else if (parts[0] === 'blog' || parts[0] === 'other' || parts[0] === 'tutorials') {
      const sub = parts[1];
      if (sub === 'nft-generator') {
        Header.setTitle('Генератор на NFT', 'fa-solid fa-cube');
        document.title = `Генератор на NFT - ${siteSuffix}`;
      } else if (sub === 'charts' || sub === 'graph-js') {
        Header.setTitle('Диаграми с Graph.js', 'fa-solid fa-chart-line');
        document.title = `Диаграми с Graph.js - ${siteSuffix}`;
      } else if (sub === 'firestore-classroom') {
        Header.setTitle('Firestore classroom система', 'fa-solid fa-database');
        document.title = `Firestore classroom система - ${siteSuffix}`;
      } else {
        Header.setTitle('Блог', 'fa-solid fa-shapes');
        document.title = `Блог - ${siteSuffix}`;
      }
      viewRoot.innerHTML = Other.renderOtherPage(sub);
      requestAnimationFrame(() => Other.initOtherPage(sub));
    } else {
      Header.setTitle('Учебни ресурси', 'fa-solid fa-book-open');
      document.title = `Учебни ресурси - ${siteSuffix}`;
      viewRoot.innerHTML = Home.renderSubjectsPage();
    }
  } catch (err) {
    viewRoot.innerHTML = `<p class="error-state">Възникна грешка: ${err.message}</p>`;
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
