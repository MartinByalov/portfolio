// Embed platform layout in standalone tools

const rootUrl = new URL('../', import.meta.url).href;
import(`${rootUrl}scripts/clone-guard.js`).catch(() => {});

const SITE_CSS = [
  `${rootUrl}styles/theme.css`,
  `${rootUrl}styles/layout.css`,
  `${rootUrl}styles/components.css`
];
const FONT_CSS = [
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
  'https://unpkg.com/boxicons@2.1.0/css/boxicons.min.css'
];

const EMBED_STYLE = `
  body.tools-embedded {
    padding: 60px 0 0;
    margin: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
  }
  .tools-page-shell {
    flex: 1 0 auto;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }
  body.tools-embedded .main-footer { flex-shrink: 0; width: 100%; text-align: left; border-top: 0; }
  body.tools-embedded .tools-page-shell > * { min-height: 0; }
  body.tools-embedded .tools-page-shell > main,
  body.tools-embedded .tools-page-shell > #app { margin-left: auto; margin-right: auto; }
`;

function injectStyles() {
  const head = document.head;
  // Keep a single boxicons version on the page.
  head.querySelectorAll('link[href*="boxicons"]').forEach(l => l.remove());
  for (const href of [...FONT_CSS, ...SITE_CSS]) {
    if (!head.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      // Insert before the page's own CSS so tool styles win the cascade ties.
      head.insertBefore(link, head.firstChild);
    }
  }
  const style = document.createElement('style');
  style.textContent = EMBED_STYLE;
  head.appendChild(style);
}

// Ensure tool pages link back correctly to the SPA
function absolutizeLinks(root, mode) {
  const indexUrl = `${rootUrl}index.html`;
  root.querySelectorAll('a[href^="#/"], a[href="#/"], a[href="#"]').forEach(a => {
    const hash = a.getAttribute('href') || '';
    if (hash.startsWith('#/')) {
      a.setAttribute('href', mode ? `${indexUrl}?mode=${mode}${hash}` : `${indexUrl}${hash}`);
    } else if (hash === '#/' || hash === '#') {
      a.setAttribute('href', mode ? `${indexUrl}?mode=${mode}#/` : `${indexUrl}#/`);
    }
  });
  root.querySelectorAll('a[href^="/#/"], a[href^="/?"]').forEach(a => {
    const raw = a.getAttribute('href');
    if (raw.startsWith('/#/')) {
      const hash = raw.substring(1);
      a.setAttribute('href', mode ? `${indexUrl}?mode=${mode}${hash}` : `${indexUrl}${hash}`);
    } else if (raw.startsWith('/?')) {
      a.setAttribute('href', `${indexUrl}${raw.substring(1)}`);
    }
  });
}

// Preserve mode parameter for navigation between tools
function absolutizeToolsLinks(root, mode) {
  if (!mode) return;
  root.querySelectorAll('a[href*="/tools/"], a[href*="tools/"]').forEach(a => {
    try {
      const href = a.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        const url = new URL(href, location.href);
        if (!url.searchParams.get('mode')) url.searchParams.set('mode', mode);
        a.setAttribute('href', url.href);
      }
    } catch (err) {}
  });
}

// Resolve active mode from URL or session storage
function resolveMode() {
  try {
    const q = new URLSearchParams(location.search).get('mode');
    if (q === 'portfolio' || q === 'learning') {
      try { sessionStorage.setItem('platform-mode', q); } catch (err) {}
      return q;
    }
    const s = sessionStorage.getItem('platform-mode');
    if (s === 'portfolio' || s === 'learning') return s;
  } catch (err) {}
  return 'portfolio';
}

async function mount() {
  injectStyles();
  const mode = resolveMode();
  document.body.classList.add('tools-embedded');
  document.body.classList.toggle('portfolio-mode', mode === 'portfolio');

  const [Header, Sidebar, Footer] = await Promise.all([
    import(`${rootUrl}layout/header.js`),
    import(`${rootUrl}layout/sidebar.js`),
    import(`${rootUrl}layout/footer.js`)
  ]);

  const headerRoot = document.createElement('div');
  headerRoot.id = 'header-root';
  headerRoot.innerHTML = Header.render();

  const sidebarRoot = document.createElement('div');
  sidebarRoot.id = 'sidebar-root';
  sidebarRoot.innerHTML = Sidebar.render(mode);

  const footerRoot = document.createElement('div');
  footerRoot.id = 'footer-root';
  footerRoot.innerHTML = Footer.render();

  const shell = document.createElement('div');
  shell.className = 'tools-page-shell';
  while (document.body.firstChild) shell.appendChild(document.body.firstChild);

  document.body.append(headerRoot, sidebarRoot, shell, footerRoot);

  [headerRoot, sidebarRoot, footerRoot].forEach(root => absolutizeLinks(root, mode));
  // Preserve mode on tools links
  absolutizeToolsLinks(shell, mode);
  Header.init();
  Sidebar.init();

  // Set header title from metadata
  const pageTitle = document.querySelector('meta[name="tool-title"]')?.content;
  if (pageTitle) {
    const pageIcon = document.querySelector('meta[name="tool-icon"]')?.content;
    Header.setTitle(pageTitle, pageIcon || 'fa-solid fa-wrench');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
