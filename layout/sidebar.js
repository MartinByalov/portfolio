// Sidebar navigation drawer component

import * as SchoolCalendar from './school-calendar.js';

export const MODE_STORAGE_KEY = 'platform-mode';
let sidebarListeners = null;

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

function getNavItems(mode) {
  if (mode === 'portfolio') {
    return [
      { icon: 'bx bx-book-reader',  label: 'Учителско Портфолио', href: '#/portfolio', 'data-nav': 'portfolio' },
      { icon: 'bx bx-home-alt',     label: 'Учебни ресурси',      href: '#/',          'data-nav': 'portfolio' },
      { icon: 'bx bx-wrench',       label: 'Инструменти',         href: '/tools/index.html?mode=learning', 'data-nav': 'portfolio' },
      { icon: 'bx bx-briefcase-alt',label: 'Професионален опит',  href: '#/experience', 'data-nav': 'portfolio' }
    ];
  } else {
    return [
      { icon: 'bx bx-home-alt',    label: 'Начало',            href: '#/',           'data-nav': 'learning' },
      { icon: 'bx bx-book-reader', label: 'Учебни ресурси',   href: '#/subjects',   'data-nav': 'learning' },
      { icon: 'bx bx-wrench',      label: 'Инструменти',       href: '/tools/index.html?mode=learning', 'data-nav': 'learning' },
      { icon: 'bx bx-calendar',    label: 'Календар',          href: '#calendar',    'data-nav': 'learning' },
      { icon: 'bx bx-calculator',  label: 'Калкулатори',       href: '/tools/calculators/calculators.html?mode=learning', 'data-nav': 'learning' },
      { icon: 'bx bx-book',        label: 'Речник',            href: '#/dictionary', 'data-nav': 'learning' },
      { icon: 'bx bx-code-alt',    label: 'Софтуер',           href: '#/software',   'data-nav': 'learning' },
      { icon: 'bx bx-layer',       label: 'Блог',              href: '#/blog',       'data-nav': 'learning' },
      { icon: 'bx bx-user-pin',    label: 'За мен',            href: '#/about',      'data-nav': 'learning' }
    ];
  }
}

export function render(mode = 'learning') {
  const navItems = getNavItems(mode);

  const links = navItems.map(item => `
    <li data-nav="${item['data-nav']}">
      <a href="${item.href}"><i class='${item.icon}'></i><span class="link_name">${item.label}</span></a>
    </li>
  `).join('');

  return `
    <div class="sidebar close" id="platform-sidebar">
      <div class="logo-details">
        <i class="fa-solid fa-chalkboard-user"></i>
        <span class="logo_name">Меню</span>
        <i class='bx bx-log-out' id="bx-logout" title="Скрий менюто"></i>
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
  // The router replaces the sidebar when the mode changes. Remove handlers
  // bound to the previous sidebar before registering handlers for the new one.
  sidebarListeners?.abort();
  sidebarListeners = new AbortController();
  const { signal } = sidebarListeners;
  const sidebar = document.getElementById('platform-sidebar');
  const logoutBtn = document.getElementById('bx-logout');
  const userLink = document.getElementById('menu-toggle');
  const calendarLink = document.querySelector('#platform-sidebar .nav-links a[href="#calendar"]');
  const nftTrigger = document.getElementById('sidebar-nft-trigger') || document.querySelector('#platform-sidebar .profile-role-separator');

  if (nftTrigger) {
    nftTrigger.style.cursor = 'pointer';
    const launchNft = (e) => {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      import('./nft-popup.js').then(module => module.open()).catch(err => console.error(err));
    };
    nftTrigger.addEventListener('click', launchNft, { signal });
    nftTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') launchNft(e);
    }, { signal });
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

  document.addEventListener('toggle-sidebar', toggle, { signal });

  logoutBtn?.addEventListener('click', () => {
    toggle();
  }, { signal });

  calendarLink?.addEventListener('click', (e) => {
    e.preventDefault();
    SchoolCalendar.open();
  }, { signal });

  userLink?.addEventListener('mouseenter', () => {
    if (sidebar.classList.contains('close')) toggle();
  }, { signal });

  document.addEventListener('click', (e) => {
    const isInsideSidebar = sidebar?.contains(e.target);
    const isUserMenu = userLink?.contains(e.target);
    const isLogoutBtn = logoutBtn?.contains(e.target);

    if (sidebar && sidebar.classList.contains('open') && !isInsideSidebar && !isUserMenu && !isLogoutBtn) {
      sidebar.classList.remove('open');
      sidebar.classList.add('close');
    }
  }, { signal });

  window.addEventListener('hashchange', close, { signal });
}
