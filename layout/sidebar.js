// Sidebar navigation drawer component

import * as SchoolCalendar from './school-calendar.js';

export const MODE_STORAGE_KEY = 'platform-mode';
export const LANG_STORAGE_KEY = 'platform-lang';
export const THEME_STORAGE_KEY = 'platform-theme';

const TRANSLATIONS = {
  bg: {
    menu: 'Меню',
    portfolio: 'Портфолио',
    learningResources: 'Учебни ресурси',
    tools: 'Инструменти',
    experience: 'Опит',
    home: 'Начало',
    calendar: 'Календар',
    calculators: 'Калкулатори',
    dictionary: 'Речник',
    software: 'Софтуер',
    other: 'Други',
    about: 'За мен'
  },
  en: {
    menu: 'Menu',
    portfolio: 'Portfolio',
    learningResources: 'Learning Resources',
    tools: 'Tools',
    experience: 'Experience',
    home: 'Home',
    calendar: 'Calendar',
    calculators: 'Calculators',
    dictionary: 'Glossary',
    software: 'Software',
    other: 'Other',
    about: 'About'
  }
};

export function getStoredLang() {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'bg' || saved === 'en') return saved;
  } catch (err) {}
  return 'bg';
}

export function setStoredLang(lang) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch (err) {}
}

export function getStoredMode() {
  try {
    const params = new URLSearchParams(location.search);
    const q = params.get('mode');
    if (q === 'portfolio' || q === 'learning') return q;
    const s = sessionStorage.getItem(MODE_STORAGE_KEY);
    if (s === 'portfolio' || s === 'learning') return s;
  } catch (err) {}
  return null;
}

export function setStoredMode(mode) {
  try {
    if (mode === 'portfolio' || mode === 'learning') sessionStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch (err) {}
}

export function getStoredTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch (err) {}
  return 'light';
}

export function setStoredTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (err) {}
}

export function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  if (document.body) {
    document.body.classList.toggle('dark-mode', isDark);
  }
  setStoredTheme(theme);

  const checkbox = document.getElementById('darkmode-toggle');
  if (checkbox) {
    checkbox.checked = isDark;
  }
  const label = document.querySelector('label.darkmode-label');
  if (label) {
    label.setAttribute('title', isDark ? 'Превключи към светъл режим' : 'Превключи към тъмен режим');
  }
}

function getNavItems(mode) {
  const lang = getStoredLang();
  const tr = TRANSLATIONS[lang] || TRANSLATIONS.bg;
  if (mode === 'portfolio') {
    return [
      { icon: 'bx bx-book-reader',  label: tr.portfolio,      href: '#/portfolio', 'data-nav': 'portfolio' },
      { icon: 'bx bx-home-alt',     label: tr.learningResources, href: '#/',          'data-nav': 'portfolio' },
      { icon: 'bx bx-wrench',       label: tr.tools,          href: 'tools/index.html?mode=portfolio', 'data-nav': 'portfolio' },
      { icon: 'bx bx-briefcase-alt',label: tr.experience,     href: '#/experience', 'data-nav': 'portfolio' }
    ];
  } else {
    return [
      { icon: 'bx bx-home-alt',    label: tr.home,            href: '#/',           'data-nav': 'learning' },
      { icon: 'bx bx-book-reader', label: tr.learningResources, href: '#/subjects',   'data-nav': 'learning' },
      { icon: 'bx bx-wrench',      label: tr.tools,           href: 'tools/index.html?mode=learning', 'data-nav': 'learning' },
      { icon: 'bx bx-calendar',    label: tr.calendar,        href: '#calendar',    'data-nav': 'learning' },
      { icon: 'bx bx-calculator',  label: tr.calculators,     href: 'tools/calculators/index.html?mode=learning', 'data-nav': 'learning' },
      { icon: 'bx bx-book',        label: tr.dictionary,      href: '#/dictionary', 'data-nav': 'learning' },
      { icon: 'bx bx-code-alt',    label: tr.software,        href: '#/software',   'data-nav': 'learning' },
      { icon: 'bx bx-layer',       label: tr.other,           href: '#/other',      'data-nav': 'learning' },
      { icon: 'bx bx-user-pin',    label: tr.about,           href: '#/about',      'data-nav': 'learning' }
    ];
  }
}

export function render(mode = 'learning') {
  const navItems = getNavItems(mode);
  const currentTheme = getStoredTheme();
  const isDark = currentTheme === 'dark';
  const currentLang = getStoredLang().toUpperCase();
  const tr = TRANSLATIONS[getStoredLang()] || TRANSLATIONS.bg;

  const links = navItems.map(item => `
    <li data-nav="${item['data-nav']}">
      <a href="${item.href}"><i class='${item.icon}'></i><span class="link_name">${item.label}</span></a>
    </li>
  `).join('');

  return `
    <div class="sidebar close" id="platform-sidebar">
      <div class="logo-details">
        <i class="fa-solid fa-chalkboard-user"></i>
        <span class="logo_name">${tr.menu}</span>
        <i class='bx bx-log-out' id="bx-logout" title="Скрий менюто"></i>
      </div>

      <!-- Горе преди начало: Бутон за смяна на език (БГ/EN) и превключвател за тема -->
      <div class="sidebar-theme-space">
        <button type="button" id="sidebar-lang-toggle" class="sidebar-lang-btn" title="Смяна на език (BG / EN)" aria-label="Смяна на език">
          <span class="lang-text">${currentLang}</span>
        </button>
        <div class="darkmode-toggle-wrapper">
          <input type="checkbox" id="darkmode-toggle" ${isDark ? 'checked' : ''}>
          <label for="darkmode-toggle" class="darkmode-label" title="${isDark ? 'Превключи към светъл режим' : 'Превключи към тъмен режим'}">
            <span class="sun"></span>
            <span class="moon"></span>
          </label>
        </div>
      </div>

      <ul class="nav-links">
        ${links}
        <li>
          <div class="profile-details">
            <!-- Секция 1: Мартин Бялов / Учител по ИТ -->
            <div class="sidebar-profile-section profile-info-section">
              <div class="profile_name">Мартин Бялов</div>
              <div class="job">Учител по ИТ</div>
            </div>

            <!-- Секция 2: </> -->
            <div class="sidebar-profile-section profile-nft-section">
              <span class="profile-role-separator" id="sidebar-nft-trigger" role="button" tabindex="0" title="Генерирай Stonk NFT (TheStonks)">&lt;/&gt;</span>
            </div>

            <!-- Секция 3: логото на Github -->
            <div class="sidebar-profile-section profile-github-section">
              <a href="https://github.com/byalov" target="_blank" rel="noopener noreferrer" class="github-icon-link" aria-label="GitHub профил" title="GitHub">
                <span class="github-icon"><i class='bx bxl-github'></i></span>
              </a>
            </div>
          </div>
        </li>
      </ul>
    </div>
  `;
}

export function init() {
  const sidebar = document.getElementById('platform-sidebar');
  const logoutBtn = document.getElementById('bx-logout');
  const userLink = document.getElementById('menu-toggle');
  const calendarLink = document.querySelector('#platform-sidebar .nav-links a[href="#calendar"]');
  const nftTrigger = document.getElementById('sidebar-nft-trigger') || document.querySelector('#platform-sidebar .profile-role-separator');
  const themeToggleCheckbox = document.getElementById('darkmode-toggle');
  const langToggle = document.getElementById('sidebar-lang-toggle');

  // Initialize theme
  const initialTheme = getStoredTheme();
  applyTheme(initialTheme);

  if (themeToggleCheckbox) {
    themeToggleCheckbox.addEventListener('change', (e) => {
      const nextTheme = e.target.checked ? 'dark' : 'light';
      applyTheme(nextTheme);
    });
  }

  if (langToggle) {
    langToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const current = getStoredLang();
      const next = current === 'bg' ? 'en' : 'bg';
      setStoredLang(next);
      const span = langToggle.querySelector('.lang-text');
      if (span) span.textContent = next.toUpperCase();
      window.dispatchEvent(new CustomEvent('language-changed', { detail: next }));
      location.reload();
    });
  }

  if (nftTrigger) {
    nftTrigger.style.cursor = 'pointer';
    const launchNft = (e) => {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      import('./nft-popup.js').then(module => module.open()).catch(err => console.error(err));
    };
    nftTrigger.addEventListener('click', launchNft);
    nftTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') launchNft(e);
    });
  }

  function open() {
    sidebar.classList.add('open');
    sidebar.classList.remove('close');
  }
  function close() {
    sidebar.classList.add('close');
    sidebar.classList.remove('open');
  }
  function toggle() {
    sidebar.classList.contains('open') ? close() : open();
  }

  document.addEventListener('toggle-sidebar', toggle);

  logoutBtn?.addEventListener('click', () => {
    toggle();
  });

  calendarLink?.addEventListener('click', (e) => {
    e.preventDefault();
    SchoolCalendar.open();
  });

  userLink?.addEventListener('mouseenter', () => {
    if (sidebar.classList.contains('close')) toggle();
  });

  document.addEventListener('click', (e) => {
    const isInsideSidebar = sidebar?.contains(e.target);
    const isUserMenu = userLink?.contains(e.target);
    const isLogoutBtn = logoutBtn?.contains(e.target);

    if (sidebar && sidebar.classList.contains('open') && !isInsideSidebar && !isUserMenu && !isLogoutBtn) {
      sidebar.classList.remove('open');
      sidebar.classList.add('close');
    }
  });

  window.addEventListener('hashchange', close);
}
