// Lesson scroll-spy and active section tracker

export function initScrollSpy() {
  const links = Array.from(document.querySelectorAll('.course-list-nav .course-link'));
  const targets = links.map(a => {
    const href = a.getAttribute('href') || '';
    if (!href.startsWith('#')) return null;
    const el = document.getElementById(href.slice(1));
    return el ? { link: a, el } : null;
  }).filter(Boolean);
  if (!targets.length) return;

  // Клик на сайдбар линк → отвори съответния акордеон item (ако е затворен)
  links.forEach(a => {
    if (a.dataset.scrollSpyBound) return;
    a.dataset.scrollSpyBound = 'true';
    a.addEventListener('click', () => {
      const href = a.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      const el = document.getElementById(href.slice(1));
      if (!el) return;
      const item = el.closest('.accordion-item');
      if (item && !item.classList.contains('active')) {
        const header = item.querySelector('.accordion-header');
        if (header) header.click();
      }
    });
  });

  const probeLimit = () => Math.round((window.innerHeight || 900) * 0.35);

  const update = () => {
    const limit = probeLimit();
    let current = null;
    for (const t of targets) {
      const r = t.el.getBoundingClientRect();
      if (r.top <= limit) current = t; else break;
    }
    targets.forEach(t => t.link.classList.toggle('active', t === current));
  };

  // Следим и скрола, и преоразмеряване (акордеон content проано адаптир).
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}