/* tools/embed.js
   Mounts the platform chrome (header / sidebar drawer / footer) around the
   standalone tool pages, so /tools/* pages look like the rest of the site.

   Usage — add once before </body> in the tool page:
     <script type="module" src="/tools/embed.js"></script>
*/

const SITE_CSS = ['/styles/theme.css', '/styles/layout.css', '/styles/components.css'];
const FONT_CSS = [
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
  'https://unpkg.com/boxicons@2.1.0/css/boxicons.min.css'
];

const EMBED_STYLE = `
  /* Column flex: header offset on top, shell stretches, footer sits right
     below the content (visible without scrolling on short pages). */
  body.tools-embedded {
    padding: 60px 0 0; /* fixed 60px header offset; NO side/bottom padding so
                          the footer spans the viewport edge to edge */
    margin: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    /* Tool pages style body themselves (planner: align-items:flex-start,
       wpm: align-items:center) — stretch again so the shell and the footer
       are full-width instead of shrink-to-fit. */
    align-items: stretch;
    justify-content: flex-start;
  }
  /* The tool pages' own body padding (20px) moves here, so the footer below
     stays flush with the viewport edges and, being in normal flow after the
     shell, can never clip/cover the page content above it. */
  .tools-page-shell {
    flex: 1 0 auto;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }
  body.tools-embedded .main-footer { flex-shrink: 0; width: 100%; text-align: left; border-top: 0; }
  /* Neutralize tool pages' own min-height:100vh (e.g. planner #app), which
     would otherwise push the footer a full viewport below the fold. */
  body.tools-embedded .tools-page-shell > * { min-height: 0; }
  /* Center the page's main column (wpm <main>, planner #app) in the shell. */
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

// Tool pages live outside the SPA, so hash links must point at "/#/...".
// ?mode= is preserved so "back" links keep the same side menu + footer mode.
function absolutizeLinks(root, mode) {
  root.querySelectorAll('a[href^="#/"]').forEach(a => {
    const hash = a.getAttribute('href');
    a.setAttribute('href', mode ? `/?mode=${mode}${hash}` : `/${hash}`);
  });
  root.querySelectorAll('a[href^="/#/"]').forEach(a => {
    const hash = a.getAttribute('href').replace(/^\//, '');
    a.setAttribute('href', mode ? `/?mode=${mode}${hash}` : `/${hash}`);
  });
}

// Tool-to-tool navigation inside /tools/* keeps the same ?mode=.
function absolutizeToolsLinks(root, mode) {
  if (!mode) return;
  root.querySelectorAll('a[href^="/tools/"]').forEach(a => {
    try {
      const url = new URL(a.getAttribute('href'), location.origin);
      if (!url.searchParams.get('mode')) url.searchParams.set('mode', mode);
      a.setAttribute('href', url.pathname + url.search + url.hash);
    } catch (err) {}
  });
}

// Resolve which side menu + footer mode this tools page is in:
//   1. explicit ?mode=portfolio|learning in the URL (set by sidebar links)
//   2. sessionStorage 'platform-mode' written by the SPA router in app.js
//   3. fallback: portfolio (old behaviour for direct links)
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
    import('/layout/header.js'),
    import('/layout/sidebar.js'),
    import('/layout/footer.js')
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
  // Tool-to-tool navigation inside /tools/* keeps the same mode.
  absolutizeToolsLinks(shell, mode);
  Header.init();
  Sidebar.init();

  // Per-page header title/icon (e.g. "Планировчик"), declared in the page head:
  //   <meta name="tool-title" content="Планировчик">
  //   <meta name="tool-icon" content="fa-solid fa-list-check">
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
