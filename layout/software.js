// Software directory showcase page

export function renderSoftwarePage() {
  return `
    <section class="hall-of-source">

      <header class="hall-header">
        <div class="hall-eyebrow">
          Open Source · Education · IT
        </div>
        <h1 class="hall-title">
          Hall of<br>
          Source.
        </h1>
      </header>

      <div class="hall-grid" id="hallGrid"></div>

      <section class="hall-statement">
        <p>
          Не просто използвай
          технологиите.

          <span>
            Разбери ги.
          </span>
        </p>
      </section>

    </section>
  `;
}

const SOURCES = [
  {
    name: "Python",
    logo: "https://api.iconify.design/logos:python.svg",
    category: "Програмен език",
    description: "Програмен език, с който учениците могат да преминат от алгоритми към реален код.",
    tags: ["Програмиране", "За начинаещи", "Автоматизация"],
    url: "https://www.python.org/"
  },
  {
    name: "PyCharm",
    logo: "https://api.iconify.design/logos:pycharm.svg",
    category: "Разработка",
    description: "Интегрирана среда за разработка, създадена специално за Python.",
    tags: ["Python", "IDE", "Разработка"],
    url: "https://www.jetbrains.com/pycharm/"
  },
  {
    name: "Visual Studio Code",
    logo: "https://api.iconify.design/logos:visual-studio-code.svg",
    category: "Разработка",
    description: "Лек и разширяем редактор за програмиране с огромна екосистема от разширения.",
    tags: ["Редактор", "Код", "Разширения"],
    url: "https://code.visualstudio.com/"
  },
  {
    name: "Mozilla Firefox",
    logo: "https://api.iconify.design/logos:firefox.svg",
    category: "Уеб",
    description: "Отворен уеб браузър за работа и експериментиране със съвременни уеб технологии.",
    tags: ["Уеб", "Браузър", "Open Source"],
    url: "https://www.mozilla.org/firefox/"
  },
  {
    name: "GIMP",
    logo: "/tools/bds/gimp.svg",
    category: "Графика",
    description: "Свободен инструмент за обработка и редактиране на изображения.",
    tags: ["Графика", "Дизайн", "Свободен софтуер"],
    url: "https://www.gimp.org/"
  },
  {
    name: "Inkscape",
    logo: "/tools/bds/inkscape.svg",
    category: "Графика",
    description: "Векторен графичен редактор за създаване на илюстрации, диаграми и графични проекти.",
    tags: ["Векторна графика", "Дизайн", "SVG"],
    url: "https://inkscape.org/"
  },
  {
    name: "BCUninstaller",
    logo: "/tools/bds/bcuninstaller.svg",
    category: "Система",
    description: "Инструмент за управление и премахване на инсталиран софтуер от Windows.",
    tags: ["Windows", "Система", "Управление"],
    url: "https://www.bcuninstaller.com/"
  },
  {
    name: "Microsoft Clipchamp",
    logo: "https://api.iconify.design/logos:microsoft-icon.svg",
    category: "Видео",
    description: "Инструмент за създаване и редактиране на видео съдържание.",
    tags: ["Видео", "Монтаж", "Мултимедия"],
    url: "https://clipchamp.com/"
  },
  {
    name: "Node.js",
    logo: "https://api.iconify.design/logos:nodejs-icon.svg",
    category: "Разработка",
    description: "JavaScript runtime среда за изграждане на приложения извън браузъра.",
    tags: ["JavaScript", "Backend", "Runtime"],
    url: "https://nodejs.org/"
  },
  {
    name: "XAMPP",
    logo: "https://api.iconify.design/logos:xampp.svg",
    category: "Web Development",
    description: "Локална среда за разработка с Apache, MariaDB, PHP и Perl.",
    tags: ["PHP", "Apache", "MariaDB"],
    url: "https://www.apachefriends.org/"
  },
  {
    name: "WinRAR",
    logo: "/tools/bds/winrar.svg",
    category: "Система",
    description: "Инструмент за компресиране, архивиране и управление на файлове.",
    tags: ["Архиви", "Файлове", "Windows"],
    url: "https://www.win-rar.com/"
  }
];

export function initSoftwarePage() {
  const hallGrid = document.getElementById('hallGrid');
  if (!hallGrid) return;

  SOURCES.forEach(source => {
    const card = document.createElement('article');
    card.className = 'source-card';

    const tags = source.tags
      .map(tag => `<span class="source-tag">${tag}</span>`)
      .join('');

    card.innerHTML = `
      <div class="source-logo">
        <img src="${source.logo}" alt="${source.name}" loading="lazy">
      </div>
      <div class="source-category">${source.category}</div>
      <h2 class="source-name">${source.name}</h2>
      <p class="source-description">${source.description}</p>
      <div class="source-tags">${tags}</div>
      <a class="source-download" href="${source.url}" target="_blank" rel="noopener noreferrer">
        <span>Изтегли</span>
        <span class="source-download-arrow">↗</span>
      </a>
    `;

    hallGrid.appendChild(card);
  });
}
