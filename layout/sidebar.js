/* layout/sidebar.js
   The right-hand slide-out drawer with two different nav menus,
   toggled via body.portfolio-mode set in app.js router:
     - portfolio mode (#/portfolio, #/experience): Портфолио / Учебни ресурси(->Начало #/) / Инструменти / Опит
     - learning mode  (all other routes)        : Начало / Учебни ресурси / Инструменти / Календар / Речник / Софтуер / За мен

   The mode is also persisted in sessionStorage ('platform-mode') + the
   ?mode= query param so the standalone /tools/* pages (tools/embed.js)
   can render the SAME menu instead of ending up empty via the
   body.portfolio-mode CSS toggles.
*/

import * as SchoolCalendar from './school-calendar.js';

export const MODE_STORAGE_KEY = 'platform-mode';

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

const PORTFOLIO_NAV = [
  { icon: 'bx bx-book-reader',  label: 'Портфолио',      href: '#/portfolio', 'data-nav': 'portfolio' },
  { icon: 'bx bx-home-alt',     label: 'Учебни ресурси', href: '#/',          'data-nav': 'portfolio' },
  { icon: 'bx bx-wrench',       label: 'Инструменти',    href: '/tools/index.html?mode=portfolio', 'data-nav': 'portfolio' },
  { icon: 'bx bx-briefcase-alt',label: 'Опит',           href: '#/experience', 'data-nav': 'portfolio' }
];

const LEARNING_NAV = [
  { icon: 'bx bx-home-alt',    label: 'Начало',         href: '#/',           'data-nav': 'learning' },
  { icon: 'bx bx-book-reader', label: 'Учебни ресурси', href: '#/subjects',   'data-nav': 'learning' },
  { icon: 'bx bx-wrench',      label: 'Инструменти',    href: '/tools/index.html?mode=learning', 'data-nav': 'learning' },
  { icon: 'bx bx-calendar',    label: 'Календар',       href: '#calendar',    'data-nav': 'learning' },
  { icon: 'bx bx-calculator',  label: 'Калкулатори',    href: '/tools/calculators/index.html?mode=learning', 'data-nav': 'learning' },
  { icon: 'bx bx-book',        label: 'Речник',         href: '#/dictionary', 'data-nav': 'learning' },
  { icon: 'bx bx-code-alt',    label: 'Софтуер',        href: '#/software',   'data-nav': 'learning' },
  { icon: 'bx bx-layer',       label: 'Други',          href: '#/other',      'data-nav': 'learning' },
  { icon: 'bx bx-user-pin',    label: 'За мен',         href: '#/about',      'data-nav': 'learning' }
];

export function render(mode = 'learning') {
  const navItems = mode === 'portfolio' ? PORTFOLIO_NAV : LEARNING_NAV;
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
            <div class="name-job">
              <div class="profile_name">Мартин Бялов</div>
              <div class="job">Учител по ИТ</div>
              <span class="profile-role-separator" id="sidebar-nft-trigger" role="button" tabindex="0" title="Генерирай Stonk NFT (TheStonks)">&lt;/&gt;</span>
              <span class="github-icon" aria-hidden="true"><i class='bx bxl-github'></i></span>
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
