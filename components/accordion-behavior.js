// Shared accordion toggle behavior

export function initAccordion(root, opts) {
  if (!root) return;
  const singleOpen = !opts || opts.singleOpen !== false;
  root.querySelectorAll(':scope > .accordion-item, .accordion > .accordion-item').forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    if (!header || !content || header.dataset.accordionBound) return;
    header.dataset.accordionBound = 'true';

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      if (singleOpen) {
        const parent = item.closest('.accordion');
        parent.querySelectorAll('.accordion-item').forEach(el => {
          el.classList.remove('active');
          el.querySelector('.accordion-content').style.display = 'none';
        });
      }
      item.classList.toggle('active', !isActive);
      content.style.display = isActive ? 'none' : 'block';
    });
  });
}
