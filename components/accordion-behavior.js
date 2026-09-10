/* components/accordion-behavior.js
   Shared accordion toggle logic, used by text-group, course-list
   and the lesson "accordion" component so the behavior only has to
   be written once.

   opts.singleOpen — true: opening an item closes the others (default);
                     false: items toggle independently (multiple open).
*/

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
