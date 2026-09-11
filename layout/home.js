// Home landing page with subject cards and news feed

const SUBJECT_CARDS = [
  { badge: '8 клас',  icon: 'fas fa-desktop',       title: 'ИТ',                       description: 'Основи на работа с компютър и MS Office.',                                 href: '#/course/it-8' },
  { badge: '9 клас',  icon: 'fas fa-file-excel',   title: 'ИТ',                       description: 'Работа с електронни таблици и презентации.',                                href: '#' },
  { badge: '10 клас', icon: 'fas fa-network-wired',title: 'ИТ',                       description: 'Интернет, мрежи, сигурност и уеб основи.',                                   href: '#' },
  { badge: '12 клас', icon: 'fas fa-chart-line',   title: 'Икономическа Информатика', description: 'Информационни системи в бизнеса и управлението.',                              href: '#/course/up-ii-12' },
  { badge: '12 клас', icon: 'fas fa-code',         title: 'Програмиране',             description: 'Програмиране на Python и структури от данни.',                                href: '#/course/programming-12' },
  { badge: '12 клас', icon: 'fas fa-microchip',    title: 'Компютърни Архитектури',   description: 'Хардуер, процесори, памет и операционни системи.',                           href: '#/course/kaos-12' }
];

function escapeHtmlLanding(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function shuffleCourses(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function renderSubjectsPage() {
  const cards = SUBJECT_CARDS.map(c => `
    <a href="${c.href}" class="resource-card">
      <div class="card-badge">${c.badge}</div>
      <div class="card-icon"><i class="${c.icon}"></i></div>
      <div class="card-title">${c.title}</div>
      <div class="card-description">${c.description}</div>
    </a>
  `).join('');

  return `
    <section class="home-section">
      <div class="home-content">
        <div class="main-portfolio-content">
          <div class="resources-grid">${cards}</div>
        </div>
      </div>
    </section>
  `;
}

export function renderLandingPage(catalog) {
  const pool = ((catalog && catalog.grades) || []).flatMap(grade => grade.courses.map(course => ({
    ...course,
    grade: grade.label
  })));

  const initial = [...pool.slice(0, 3)];
  while (initial.length < 3 && pool.length) initial.push(pool[initial.length % pool.length]);

  const expCards = initial.map((course, i) => {
    const images = [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80'
    ];
    return `
    <div class="exp-item${i === 0 ? ' active' : ''}" data-slot="${i}" style="background-image: url('${images[i % 3]}')">
      <div class="exp-item-desc">
        <h3>${escapeHtmlLanding(course.title)}</h3>
        <p>${course.available
          ? escapeHtmlLanding(course.description)
          : `${escapeHtmlLanding(course.grade)} · Coming soon.`}</p>
        ${course.available
          ? `<a href="#/course/${course.id}" class="exp-item-link">Уроци <i class="fas fa-arrow-right"></i></a>`
          : '<span class="exp-item-soon">Скоро</span>'}
      </div>
    </div>`;
  }).join('');

  const poolJson = JSON.stringify(pool).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

  return `
    <section class="home-section subject-section">
      <div class="home-content">
        <div class="main-portfolio-content">
          <div class="exp-slider" id="exp-slider" data-pool="${poolJson}">${expCards}</div>
        </div>
      </div>
    </section>

    <section class="home-section">
      <div class="home-content">
        <div class="main-portfolio-content">
          <div class="trending-area" id="news-collage">
            <div class="trending-bar">
              <span class="trending-badge"><i class="fas fa-arrow-trend-up"></i> Актуално</span>
              <div class="trending-ticker"><div class="trending-ticker-track" id="news-ticker"></div></div>
            </div>
            <div class="trending-grid" id="trending-grid">
              <p class="news-loading news-collage-loading"><i class="fas fa-circle-notch fa-spin"></i> Зареждане на новини...</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

const NEWS_ITEMS_LIMIT = 8;

const NEWS_SOURCES = [
  {
    name: 'Technologies',
    label: 'Технологии',
    icon: 'fas fa-microchip',
    feeds: [
      'https://www.kaldata.com/feed',
      'https://www.technews.bg/feed'
    ]
  },
  {
    name: 'Education',
    label: 'Образование',
    icon: 'fas fa-graduation-cap',
    feeds: [
      'https://news.google.com/rss/search?q=МОН+РУО+образование&hl=bg&gl=BG&ceid=BG:bg',
      'https://prepodavame.bg/feed'
    ]
  },
  {
    name: 'Science',
    label: 'Наука',
    icon: 'fas fa-flask',
    feeds: [
      'https://news.google.com/rss/search?q=наука+технологии+AI&hl=bg&gl=BG&ceid=BG:bg',
      'https://www.sciencedaily.com/rss/all.xml'
    ]
  },
  {
    name: 'Innovations',
    label: 'Иновации',
    icon: 'fas fa-lightbulb',
    feeds: [
      'https://news.google.com/rss/search?q=иновации+стартиращи+компании&hl=bg&gl=BG&ceid=BG:bg',
      'https://devstyler.bg/blog/feed'
    ]
  }
];

const NEWS_CACHE_TTL = 1000 * 60 * 30;

function newsCacheKey(sourceName) {
  return 'news-' + sourceName;
}

function readNewsCache(sourceName) {
  try {
    const raw = localStorage.getItem(newsCacheKey(sourceName));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items) || !parsed.ts) return null;
    if (Date.now() - parsed.ts > NEWS_CACHE_TTL) {
      localStorage.removeItem(newsCacheKey(sourceName));
      return null;
    }
    return parsed.items;
  } catch {
    return null;
  }
}

function writeNewsCache(sourceName, items) {
  try {
    localStorage.setItem(newsCacheKey(sourceName), JSON.stringify({ items, ts: Date.now() }));
  } catch {}
}

const SPAM_KEYWORDS = [
  'panoramastudio', 'ocenaudio', 'audacity', 'download', 'crack', 'serial',
  'keygen', 'torrent', 'warez', 'full version', 'free download', 'nulled',
  'patched', 'license key', 'activation code'
];

function isSpamNews(item) {
  const text = `${item.title || ''} ${item.description || ''} ${item.content || ''}`.toLowerCase();
  return SPAM_KEYWORDS.some(keyword => text.includes(keyword));
}

async function fetchFeed(feedUrl, signal) {
  const apiUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(feedUrl);
  const res = await fetch(apiUrl, { signal });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  if (data.status !== 'ok' || !Array.isArray(data.items)) throw new Error('Invalid RSS response');
  const site = newsSiteName(data.feed && data.feed.title, feedUrl);
  return data.items.slice(0, NEWS_ITEMS_LIMIT).map(item => ({
    title: item.title,
    link: item.link,
    source: newsSiteFromLink(item.link) || site,
    date: '',
    image: getBestImage(item)
  })).filter(item => item.title && item.link && !isSpamNews(item));
}

function newsSiteName(feedTitle, feedUrl) {
  const raw = String(feedTitle || feedUrl || '').trim();
  if (!raw || raw.startsWith('http')) {
    try {
      const host = new URL(feedUrl).hostname.replace(/^www\./, '');
      return host || raw || 'Новини';
    } catch { return raw || 'Новини'; }
  }
  // rss2json връща понякога HTML в feed.title — чистим го.
  const cleaned = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return cleaned || 'Новини';
}

function newsSiteFromLink(link) {
  try {
    return new URL(link).hostname.replace(/^www\./, '') || 'Новини';
  } catch { return 'Новини'; }
}

function getBestImage(item) {
  const sources = [
    item.thumbnail,
    item.enclosure && item.enclosure.link,
    extractImageFromContent(item.content || item.summary || ''),
    item['media:content'] && item['media:content'].url,
    item['media:thumbnail'] && item['media:thumbnail'].url
  ].filter(Boolean);
  return sources.length ? upgradeImageUrl(sources[0]) : '';
}

function extractImageFromContent(content) {
  if (!content) return '';
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match) return match[1];
  const ogMatch = content.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
  if (ogMatch) return ogMatch[1];
  return '';
}

function upgradeImageUrl(url) {
  if (!url) return '';
  url = url.replace(/-\d+x\d+\.(jpg|jpeg|png|gif)/i, '.$1');
  url = url.replace(/\/(s|w)\d+\//, '/');
  url = url.replace(/\/p\d+x\d+\//, '/');
  if (url.includes('youtube.com') && url.includes('default.jpg')) {
    url = url.replace('default.jpg', 'hqdefault.jpg');
  }
  if (url.startsWith('//')) url = 'https:' + url;
  return url;
}

const FALLBACK_NEWS = {
  Technologies: [
    { title: 'AI революция в образованието: Как изкуственият интелект променя начина на учене', link: 'https://kaldata.com', source: 'kaldata.com', date: '', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=90' },
    { title: 'Нови технологии за киберсигурност в училищата', link: 'https://kaldata.com', source: 'kaldata.com', date: '', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=90' },
    { title: 'Програмирането стана задължително в новия учебен план', link: 'https://devstyler.bg', source: 'devstyler.bg', date: '', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&q=90' },
    { title: 'Виртуалната реалност влезе в българските училища', link: 'https://technews.bg', source: 'technews.bg', date: '', image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=1600&q=90' }
  ],
  Education: [
    { title: 'МОН обяви нови стандарти за дигитално образование', link: 'https://www.mon.bg', source: 'mon.bg', date: '', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=90' },
    { title: 'Българските учители получиха нови инструменти за онлайн обучение', link: 'https://prepodavame.bg', source: 'prepodavame.bg', date: '', image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1600&q=90' },
    { title: 'Програма за подкрепа на учениците с трудности в ученето', link: 'https://ruo-sofia-grad.com', source: 'ruo-sofia-grad.com', date: '', image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1600&q=90' },
    { title: 'Нови учебници по информатика за 8 клас', link: 'https://www.mon.bg', source: 'mon.bg', date: '', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&q=90' }
  ],
  Science: [
    { title: 'Български ученици спечелиха международен конкурс по роботика', link: 'https://nauka.bg', source: 'nauka.bg', date: '', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1600&q=90' },
    { title: 'Нови открития в областта на квантовите компютри', link: 'https://nauka.bg', source: 'nauka.bg', date: '', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1600&q=90' },
    { title: 'Изследване: Младите хора все повече се интересуват от STEM', link: 'https://nauka.bg', source: 'nauka.bg', date: '', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1600&q=90' },
    { title: 'България участва в европейски проект за зелена енергия', link: 'https://nauka.bg', source: 'nauka.bg', date: '', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1600&q=90' }
  ],
  Innovations: [
    { title: 'Български стартъп с международно признание за иновации', link: 'https://technews.bg', source: 'technews.bg', date: '', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=90' },
    { title: 'Нови иновативни практики в дигиталното образование', link: 'https://devstyler.bg', source: 'devstyler.bg', date: '', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=90' },
    { title: 'Иновации в класната стая: проектно-базирано обучение', link: 'https://prepodavame.bg', source: 'prepodavame.bg', date: '', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=90' },
    { title: 'Технологични иновации за устойчиво бъдеще', link: 'https://kaldata.com', source: 'kaldata.com', date: '', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=90' }
  ]
};

async function loadNewsBox(source, signal, onItems) {
  const cached = readNewsCache(source.name);
  if (cached) {
    onItems(cached);
    return;
  }
  for (const feedUrl of source.feeds) {
    try {
      const items = await fetchFeed(feedUrl, signal);
      if (signal.aborted) return;
      if (!items.length) continue;
      writeNewsCache(source.name, items);
      onItems(items);
      return;
    } catch (err) {
      if (signal.aborted) return;
    }
  }
  // Fallback: използваме локални данни, ако RSS не работи
  const fallback = FALLBACK_NEWS[source.name];
  if (fallback) {
    onItems(fallback);
  }
}

const CATEGORY_DEFAULT_IMAGES = {
  Technologies: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=90',
  Education: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=90',
  Science: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1600&q=90',
  Innovations: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=90'
};

function categoryClass(source) {
  return 'cat-' + ((source && source.name) || 'other').toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function metaSiteLine(item) {
  // Долу вляво — САМО сайтът-източник (напр. kaldata.com), без [object Object] и без време.
  return `<span class="news-source"><i class="fas fa-newspaper"></i> ${escapeHtmlLanding(String(item.source || 'Новини'))}</span>`;
}

function renderFeaturedNews(item, source) {
  const src = source || item._source || { name: 'Technologies', label: 'Технологии' };
  const badge = `<span class="news-cat news-cat-${categoryClass(src)}">${escapeHtmlLanding(src.label || 'Новини')}</span>`;
  const bgImg = item.image || CATEGORY_DEFAULT_IMAGES[src.name] || CATEGORY_DEFAULT_IMAGES.Technologies;
  return `
    <article class="trending-featured" style="background-image: url('${escapeHtmlLanding(bgImg)}')">
      ${badge}
      <a href="${escapeHtmlLanding(item.link)}" target="_blank" rel="noopener" class="news-featured-link">
        <div class="trending-featured-content">
          <h3>${escapeHtmlLanding(item.title)}</h3>
          <div class="trending-meta">
            ${metaSiteLine(item)}
          </div>
        </div>
      </a>
    </article>
  `;
}

function renderSideNews(item, source) {
  if (!item) return '<div class="trending-side-empty"></div>';
  const src = source || item._source || { name: 'Education', label: 'Образование', icon: 'fas fa-newspaper' };
  const badge = `<span class="news-cat-sm news-cat-sm-${categoryClass(src)}">${escapeHtmlLanding(src.label || 'Новини')}</span>`;
  const icon = `<div class="trending-post-icon"><i class="${escapeHtmlLanding(src.icon || 'fas fa-newspaper')}"></i></div>`;
  return `
    <article class="trending-post">
      <a href="${escapeHtmlLanding(item.link)}" target="_blank" rel="noopener" class="news-side-link">
        ${icon}
        <div class="trending-post-body">
          ${badge}
          <h4>${escapeHtmlLanding(item.title)}</h4>
          <div class="trending-meta">
            ${metaSiteLine(item)}
          </div>
        </div>
      </a>
    </article>
  `;
}

function renderMediumNews(item, source) {
  if (!item) return '';
  const src = source || item._source || { name: 'Innovations', label: 'Иновации' };
  const badge = `<span class="news-cat news-cat-${categoryClass(src)}">${escapeHtmlLanding(src.label || 'Новини')}</span>`;
  const bgImg = item.image || CATEGORY_DEFAULT_IMAGES[src.name] || CATEGORY_DEFAULT_IMAGES.Innovations;
  return `
    <article class="trending-medium" style="background-image: url('${escapeHtmlLanding(bgImg)}')">
      ${badge}
      <a href="${escapeHtmlLanding(item.link)}" target="_blank" rel="noopener" class="news-medium-link">
        <div class="trending-medium-content">
          <h3>${escapeHtmlLanding(item.title)}</h3>
          <div class="trending-meta">
            ${metaSiteLine(item)}
          </div>
        </div>
      </a>
    </article>
  `;
}

export function initLandingPage() {
  const slider = document.getElementById('exp-slider');
  if (slider) {
    slider.addEventListener('click', (e) => {
      const item = e.target.closest('.exp-item');
      if (!item || e.target.closest('a')) return;
      slider.querySelectorAll('.exp-item').forEach(el => {
        el.classList.toggle('active', el === item);
      });
    });

    // Rotate subject cards
    try {
      const poolData = JSON.parse(slider.dataset.pool || '[]');
      if (Array.isArray(poolData) && poolData.length > 3) {
        const cards = [...slider.querySelectorAll('.exp-item')];
        const images = [
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
          'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80'
        ];
        const shown = cards.map(c => (c.querySelector('h3') || {}).textContent || '');
        let nextIdx = poolData.findIndex(c => !shown.includes(c.title));
        if (nextIdx < 0) nextIdx = 0;
        let slot = 0;
        const timer = setInterval(() => {
          if (!document.body.contains(slider)) { clearInterval(timer); return; }
          const course = poolData[nextIdx % poolData.length];
          nextIdx++;
          const card = cards[slot % cards.length];
          slot++;
          if (!card || !course) return;
          card.style.backgroundImage = `url('${images[(slot - 1) % 3]}')`;
          card.querySelector('h3').textContent = course.title;
          card.querySelector('p').textContent = course.available
            ? course.description
            : `${course.grade} · Coming soon.`;
          const link = card.querySelector('a.exp-item-link, span.exp-item-soon');
          if (course.available) {
            const a = document.createElement('a');
            a.href = `#/course/${course.id}`;
            a.className = 'exp-item-link';
            a.innerHTML = 'Уроци <i class="fas fa-arrow-right"></i>';
            link?.replaceWith(a);
          } else {
            const s = document.createElement('span');
            s.className = 'exp-item-soon';
            s.textContent = 'Скоро';
            link?.replaceWith(s);
          }
        }, 5000);
        window.__subjectTimer = timer;
      }
    } catch {}
  }

  const area = document.getElementById('news-collage');
  if (!area) return;

  const controller = new AbortController();
  window.__newsController = controller;
  // Group news items by category
  const boxes = {};
  let pending = NEWS_SOURCES.length;

  function rebuild() {
    if (!area) return;
    const grid = document.getElementById('trending-grid');
    if (!grid) return;

    // Build pools of items for each category
    const techItems = (boxes.Technologies && boxes.Technologies.items) || [];
    const eduItems = (boxes.Education && boxes.Education.items) || [];
    const sciItems = (boxes.Science && boxes.Science.items) || [];
    const innoItems = (boxes.Innovations && boxes.Innovations.items) || [];

    const usedLinks = new Set();
    const usedTitles = new Set();

    function pickItem(primaryList, fallbackLists) {
      const candidates = [...primaryList];
      fallbackLists.forEach(list => candidates.push(...list));
      for (const item of candidates) {
        const id = (item.link || item.title || '').trim();
        const titleKey = (item.title || '').trim();
        if (id && !usedLinks.has(id) && !usedTitles.has(titleKey)) {
          usedLinks.add(id);
          usedTitles.add(titleKey);
          return item;
        }
      }
      return null;
    }

    const first = pickItem(techItems, [innoItems, sciItems, eduItems]);
    const second = pickItem(eduItems, [sciItems, techItems, innoItems]);
    const third = pickItem(sciItems, [eduItems, innoItems, techItems]);
    const fourth = pickItem(innoItems, [techItems, sciItems, eduItems]);

    if (!first) return;

    grid.innerHTML =
      renderFeaturedNews(first, first._source || boxes.Technologies?.source) +
      `<div class="trending-side">` +
        renderSideNews(second, second?._source || boxes.Education?.source) +
        renderSideNews(third, third?._source || boxes.Science?.source) +
      `</div>` +
      renderMediumNews(fourth, fourth?._source || boxes.Innovations?.source);

    // Ticker with fresh, non-overlapping items
    const ticker = document.getElementById('news-ticker');
    if (ticker) {
      const remaining = [];
      Object.values(boxes).forEach(b => {
        (b.items || []).forEach(item => {
          const id = (item.link || item.title || '').trim();
          const titleKey = (item.title || '').trim();
          if (!usedLinks.has(id) && !usedTitles.has(titleKey) && remaining.length < 12) {
            usedLinks.add(id);
            usedTitles.add(titleKey);
            remaining.push(item);
          }
        });
      });

      if (remaining.length) {
        const head = remaining.map(n =>
          `<a href="${escapeHtmlLanding(n.link)}" target="_blank" rel="noopener">${escapeHtmlLanding(n.title)}</a><i class="trending-ticker-sep">•</i>`
        ).join('');
        ticker.innerHTML = `<span class="trending-ticker-group">${head}</span><span class="trending-ticker-group">${head}</span>`;
      }
    }
  }

  function settle() {
    pending--;
    const loading = area?.querySelector('.news-collage-loading');
    const hasAny = Object.values(boxes).some(b => (b.items || []).length);
    if (loading && (hasAny || pending <= 0)) loading.remove();
    if (pending <= 0 && !hasAny) {
      area.innerHTML = '<p class="news-error"><i class="fas fa-triangle-exclamation"></i> Новините не могат да бъдат заредени в момента. Опитайте по-късно.</p>';
    }
  }

  // First attempt: fetch through server-side /api/news for speed, stability & CORS bypass
  fetch('/api/news', { signal: controller.signal })
    .then(r => r.ok ? r.json() : null)
    .then(res => {
      if (res && res.status === 'ok' && res.data) {
        NEWS_SOURCES.forEach(source => {
          const items = res.data[source.name];
          if (Array.isArray(items) && items.length) {
            boxes[source.name] = {
              source,
              items: items.map(item => ({ ...item, _source: source }))
            };
          }
        });
        rebuild();
        const loading = area?.querySelector('.news-collage-loading');
        if (loading) loading.remove();
      } else {
        throw new Error('Fallback to direct RSS');
      }
    })
    .catch(() => {
      // Direct client-side RSS loading as resilient fallback
      NEWS_SOURCES.forEach(source => {
        loadNewsBox(source, controller.signal, items => {
          boxes[source.name] = {
            source,
            items: items.map(item => ({ ...item, _source: source }))
          };
          rebuild();
        }).finally(settle);
      });
    });
}

export function cleanupLanding() {
  const controller = window.__newsController;
  if (controller) controller.abort();
  window.__newsController = null;
  if (window.__subjectTimer) { clearInterval(window.__subjectTimer); window.__subjectTimer = null; }
}

