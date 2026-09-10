/* layout/header.js
   Top bar: decorative logo icon (NOT a link — navigation lives in the
   sidebar drawer), dynamic page title and the icon that opens the
   sidebar drawer (dispatches a "toggle-sidebar" event; sidebar.js listens).

   The title + icon are DYNAMIC — call setTitle(title, iconClass) whenever a
   new page/route/tool is shown (app.js for SPA routes, tools/embed.js and
   tools/popup.js for the standalone tool pages):
      - Начало (house)                    -> public landing #/
      - Учебни ресурси (book-open)        -> learning routes
      - Учителско Портфолио (grad-cap)    -> #/portfolio
      - Професионален опит (briefcase)    -> #/experience
      - Инструменти (wrench)              -> /tools dashboard
      - <tool name>                       -> a concrete tool page/popup
*/

export function render() {
  return `
    <header class="main-header">
      <div class="logo">
        <span class="home-icon" id="header-home"><i id="header-icon" class="fa-solid fa-book-open"></i></span>
        <div class="header-title" id="header-title">Учебни материали</div>
      </div>
      <div class="header-icons">
        <a href="#" id="menu-toggle" title="Меню"><i class="fa-solid fa-bars"></i></a>
      </div>
    </header>
  `;
}

/** Update the header title + icon for the currently shown page/route/tool. */
export function setTitle(title, iconClass) {
  const titleEl = document.getElementById('header-title');
  const iconEl = document.getElementById('header-icon');
  if (titleEl && typeof title === 'string' && title) titleEl.textContent = title;
  if (iconEl && typeof iconClass === 'string' && iconClass) iconEl.className = iconClass;
}

/** Current header title/icon (used to restore after tool popups close). */
export function getTitle() {
  return document.getElementById('header-title')?.textContent || '';
}

export function getIcon() {
  return document.getElementById('header-icon')?.className || '';
}

export function init() {
  const menuToggle = document.getElementById('menu-toggle');

  menuToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.dispatchEvent(new CustomEvent('toggle-sidebar'));
  });
}
