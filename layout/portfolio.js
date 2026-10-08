// Portfolio page renderer and slider

const ZADANIE_TOOLS = [
  { emoji: '📢', label: 'Регулировчик',   href: 'tools/control/control.html'             },
  { emoji: '⏱️', label: 'Планировчик',    href: 'tools/planner/planner.html'             },
  { emoji: '🎲', label: 'Случайни групи', href: 'tools/random-groups/random-groups.html' },
  { emoji: '⛶',  label: 'QR Code Генератор', href: 'tools/qr_code/qr_code.html'          },
  { emoji: '⌨️', label: 'WPM',            href: 'tools/wpm/wpm.html'                     },
  { emoji: '⏳', label: 'Таймер',         href: 'tools/timer/timer.html'                 },
  { emoji: '🗝️', label: 'Шифър',          href: 'tools/cipher/cipher.html'               },
  { emoji: '🌐', label: 'PockeTracer',    href: 'tools/pockeTracer/index.html'           },
  { emoji: '📐', label: 'Чертожник',      href: 'tools/geometry/geometry.html'           },
  { emoji: '🧮', label: 'Калкулатори',    href: 'tools/calculators/calculators.html'     }
];

const TRAINING_TOOLS = [
  { img: 'https://cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/other/smartest.png',        alt: 'SmarTest',          label: 'СмарТест',        href: 'https://www.smartest.bg/' },
  { img: 'https://cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/other/googleClassroom.png', alt: 'Google Classroom', label: 'Google Classroom', href: 'https://edu.google.com/workspace-for-education/products/classroom/' },
  { img: 'https://cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/other/prepodavame.png',     alt: 'Prepodavame.bg',    label: 'Prepodavame.bg',    href: 'https://prepodavame.bg/' },
  { img: 'https://cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/other/uchase.png',          alt: 'Ucha.se',           label: 'Уча.се',            href: 'https://ucha.se/' },
  { img: 'https://cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/other/domino.png',          alt: 'Domino Pub.',       label: 'Изд. ДОМИНО',       href: 'https://ebook.domino.bg/' },
  { img: 'https://cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/other/smartDraw.png',       alt: 'SmartDraw',         label: 'SmartDraw',         href: 'https://www.smartdraw.com/' },
  { img: 'https://cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/other/sqlOnline.png',       alt: 'SQLite Online',     label: 'SQLite Online',     href: 'https://sqliteonline.com/' },
  { img: 'https://cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/other/logicLy.png',         alt: 'Logic.ly',          label: 'Logic.ly',          href: 'https://logic.ly/demo/' },
  { img: 'https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/vscode/vscode-original.svg', alt: 'VS Code', label: 'VS Code', href: 'https://code.visualstudio.com/', compactIcon: true },
  { img: 'https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/canva/canva-original.svg', alt: 'Canva', label: 'Canva', href: 'https://www.canva.com/', compactIcon: true },
  { img: 'https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/pycharm/pycharm-original.svg', alt: 'PyCharm', label: 'PyCharm', href: 'https://www.jetbrains.com/pycharm/', compactIcon: true },
  { img: 'https://cdn.jsdelivr.net/npm/simple-icons@15.16.0/icons/phpmyadmin.svg', alt: 'phpMyAdmin', label: 'phpMyAdmin', href: 'https://www.phpmyadmin.net/', compactIcon: true },
  { img: 'https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/illustrator/illustrator-plain.svg', alt: 'Adobe Illustrator', label: 'Adobe Illustrator', href: 'https://www.adobe.com/products/illustrator.html', compactIcon: true },
  { img: 'https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/photoshop/photoshop-original.svg', alt: 'Adobe Photoshop', label: 'Adobe Photoshop', href: 'https://www.adobe.com/products/photoshop.html', compactIcon: true },
  { img: 'https://cdn.jsdelivr.net/npm/simple-icons@15.16.0/icons/render.svg', alt: 'Render', label: 'Render', href: 'https://render.com/', compactIcon: true },
  { img: 'https://cdn.prod.website-files.com/635c4eeb78332f7971255095/6a8878772637f1f7a109128e_Frame%2012.png', alt: 'Botpress', label: 'Botpress', href: 'https://botpress.com/', compactIcon: true },
  { img: 'https://www.gstatic.com/images/branding/product/2x/notebooklm_48dp.png', alt: 'NotebookLM', label: 'NotebookLM', href: 'https://notebooklm.google.com/', compactIcon: true }
];

const SKILLS_PROG = [
  'Microsoft Office', 'Google Workspace', 'HTML', 'CSS', 'GitHub',
  'JavaScript', 'Python', 'SQL', 'Node.js', 'Express', 'Firebase',
  'Java', 'C#', 'Hugging Face', '?'
];

function renderTrack(items, renderFn) {
  const half = items.map(renderFn).join('');
  return half + half;
}

function renderZadanieTool(t) {
  return `
    <a href="${t.href}" class="tool-item" target="_blank" rel="noopener">
      <span class="tool-icon-main">${t.emoji}</span>
      <span class="tool-label">${t.label}</span>
    </a>`;
}

function renderTrainingTool(t) {
  return `
    <a href="${t.href}" class="tool-item" target="_blank" rel="noopener">
      <span class="tool-icon-main"><img src="${t.img}" alt="${t.alt}"${t.compactIcon ? ' class="tool-icon-compact"' : ''}></span>
      <span class="tool-label">${t.label}</span>
    </a>`;
}

function renderSteps() {
  return SKILLS_PROG.map((skill, index) => `
    <div class="skill-step" style="--step: ${index};">
      <i class="skill-step-person fas fa-person-walking" aria-hidden="true"></i>
      <span class="skill-step-name">${skill}</span>
    </div>`).join('');
}

export function renderPortfolioPage() {
  const zadanieTrack = renderTrack(ZADANIE_TOOLS, renderZadanieTool);
  const trainingTrack = renderTrack(TRAINING_TOOLS, renderTrainingTool);

  return `
    <div class="slider-container">
      <div class="slider" id="portfolio-slider">
        <div class="slide slide-0 active">
          <div class="slide__bg"></div>
          <div class="slide__content">
            <div class="slide__text">
              <h2 class="slide__text-heading">Иновативни подходи в ИТ</h2>
              <p class="slide__text-desc">Учене чрез действие и интегриране на нови технологии в учебния процес.</p>
              <a class="slide__text-link" href="/tools/index.html?mode=portfolio">Инструменти</a>
            </div>
          </div>
        </div>
        <div class="slide slide-1">
          <div class="slide__bg"></div>
          <div class="slide__content">
            <div class="slide__text">
              <h2 class="slide__text-heading">Изкуствен интелект</h2>
              <p class="slide__text-desc">Workflows, Бази знания и персонализация на обучението.</p>
              <a class="slide__text-link" href="https://cdn.botpress.cloud/webchat/v3.5/shareable.html?configUrl=https://files.bpcontent.cloud/2026/02/07/22/20260207220628-1RC10V1U.json" target="_blank" rel="noopener">Botbook</a>
            </div>
          </div>
        </div>
      </div>
      <div class="slider-controls">
        <div class="slider-control left"><i class="fas fa-chevron-left"></i></div>
        <div class="slider-control right"><i class="fas fa-chevron-right"></i></div>
      </div>
      <ul class="slider-pagi" id="portfolio-pagi"></ul>
    </div>

    <section class="home-section">
      <div class="home-content">
        <div class="main-portfolio-content teachers-intro-panel">
          <div class="intro-header-centered">
            <div class="portfolio-main-label">УЧИТЕЛСКО ПОРТФОЛИО</div>
            <h2 class="teacher-name">МАРТИН ВАЛЕНТИНОВ БЯЛОВ</h2>
            <blockquote class="teacher-motto" style="color: #f5762d;">~</blockquote>
          </div>

          <div class="profile-overview">
            <div class="profile-summary-row">
              <div class="profile-square-img">
                <img src="https://cdn.jsdelivr.net/gh/MartinByalov/it-media-assets@main/assets/other/profile.jpg" alt="Мартин Бялов" onerror="this.style.display='none'">
              </div>
              <div class="profile-info-text">
                <p class="teacher-role">Учител по ИТ</p>
                <p class="teacher-experience">Години опит: <span role="img" aria-label="2">2️⃣</span></p>
                <div class="profile-action-btn">
                  <a href="#/experience" class="simple-exp-btn">Професионален опит <i class="fas fa-arrow-right" aria-hidden="true"></i></a>
                </div>
              </div>
            </div>
            <div class="profile-steps">
              <div class="skill-steps-scroll" role="region" aria-label="Стъпки в технологиите - превъртете хоризонтално" tabindex="0">
                <div class="skill-steps">${renderSteps()}</div>
              </div>
            </div>
          </div>

          <div class="tools-carousel-section" id="tools">
            <div class="tools-slider">
              <div class="tools-track">${zadanieTrack}</div>
            </div>
            <div class="tools-slider training-slider">
              <div class="tools-track training-track">${trainingTrack}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// Portfolio slider

let sliderCleanup = null;
let autoSlideTimeout = null;

const AUTO_SLIDE_DELAY = 6000;
const ANIM_TIME = 500;
const DRAG_THRESHOLD = 8;

export function initPortfolioPage() {
  const slider = document.getElementById('portfolio-slider');
  const pagi = document.getElementById('portfolio-pagi');
  if (!slider || !pagi) return;
  if (sliderCleanup) return;

  const slides = slider.querySelectorAll('.slide');
  const numOfSlides = slides.length - 1;
  let curSlide = 0;
  let animating = false;
  let diff = 0;

  const leftCtrl = document.querySelector('.slider-control.left');
  const rightCtrl = document.querySelector('.slider-control.right');

  function createBullets() {
    pagi.innerHTML = '';
    for (let i = 0; i <= numOfSlides; i++) {
      const li = document.createElement('li');
      li.className = 'slider-pagi__elem slider-pagi__elem-' + i + (i === 0 ? ' active' : '');
      li.dataset.page = String(i);
      pagi.appendChild(li);
    }
  }
  createBullets();
  const bullets = pagi.querySelectorAll('.slider-pagi__elem');

  function manageControls() {
    [leftCtrl, rightCtrl].forEach(c => c?.classList.remove('inactive'));
  }
  manageControls();

  function clearAuto() {
    if (autoSlideTimeout) { clearTimeout(autoSlideTimeout); autoSlideTimeout = null; }
  }

  function autoSlide() {
    clearAuto();
    autoSlideTimeout = setTimeout(() => {
      curSlide++;
      if (curSlide > numOfSlides) curSlide = 0;
      changeSlides();
    }, AUTO_SLIDE_DELAY);
  }

  function changeSlides(instant = false) {
    if (!instant) {
      animating = true;
      manageControls();
      slider.classList.add('animating');
      slider.offsetHeight;
      slides.forEach(s => s.classList.remove('active'));
      slides[curSlide]?.classList.add('active');
      setTimeout(() => {
        slider.classList.remove('animating');
        animating = false;
      }, ANIM_TIME);
    }

    clearAuto();
    bullets.forEach(b => b.classList.remove('active'));
    const activeBullet = pagi.querySelector('.slider-pagi__elem-' + curSlide);
    activeBullet?.classList.add('active');

    slider.style.transform = `translateX(${-curSlide * 100}%)`;
  }

  function updateSliderPosition() {
    slider.style.transform = `translateX(${-curSlide * 100}%)`;
  }

  // Auto-slide
  autoSlide();

  // Slider controls
  leftCtrl?.addEventListener('click', () => {
    if (animating) return;
    curSlide--;
    if (curSlide < 0) curSlide = numOfSlides;
    changeSlides();
    autoSlide();
  });

  rightCtrl?.addEventListener('click', () => {
    if (animating) return;
    curSlide++;
    if (curSlide > numOfSlides) curSlide = 0;
    changeSlides();
    autoSlide();
  });

  // Slider pagination
  pagi.addEventListener('click', (e) => {
    const target = e.target.closest('.slider-pagi__elem');
    if (!target || animating) return;
    const page = parseInt(target.dataset.page, 10);
    if (page === curSlide) return;
    curSlide = page;
    changeSlides();
    autoSlide();
  });

  // Drag gesture support
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    currentX = e.clientX;
    slider.classList.add('dragging');
    clearAuto();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    currentX = e.clientX;
    diff = currentX - startX;
    updateSliderPosition();
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    slider.classList.remove('dragging');
    if (Math.abs(diff) > DRAG_THRESHOLD) {
      if (diff < 0) {
        curSlide++;
        if (curSlide > numOfSlides) curSlide = 0;
      } else {
        curSlide--;
        if (curSlide < 0) curSlide = numOfSlides;
      }
      changeSlides();
    } else {
      updateSliderPosition();
    }
    autoSlide();
  });

  // Touch gesture support
  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    currentX = e.touches[0].clientX;
    clearAuto();
  });

  slider.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    diff = currentX - startX;
    updateSliderPosition();
  });

  slider.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    if (Math.abs(diff) > DRAG_THRESHOLD) {
      if (diff < 0) {
        curSlide++;
        if (curSlide > numOfSlides) curSlide = 0;
      } else {
        curSlide--;
        if (curSlide < 0) curSlide = numOfSlides;
      }
      changeSlides();
    } else {
      updateSliderPosition();
    }
    autoSlide();
  });

  // Pause on hover
  slider.addEventListener('mouseenter', clearAuto);
  slider.addEventListener('mouseleave', autoSlide);

  sliderCleanup = () => {
    clearAuto();
    isDragging = false;
    sliderCleanup = null;
  };
}

export function cleanupPortfolio() {
  if (sliderCleanup) {
    sliderCleanup();
    sliderCleanup = null;
  }
}