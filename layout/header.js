// Top navigation header component

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

// Update header title and icon for active route
export function setTitle(title, iconClass) {
  const titleEl = document.getElementById('header-title');
  const iconEl = document.getElementById('header-icon');
  if (titleEl && typeof title === 'string' && title) titleEl.textContent = title;
  if (iconEl && typeof iconClass === 'string' && iconClass) iconEl.className = iconClass;
}

// Current header title and icon state
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
