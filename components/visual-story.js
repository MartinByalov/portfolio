export function render(comp) {
  const items = comp.items || [
    { label: "Пръсти", desc: "Най-старият калкулатор - римската пръстова система, описана от Беда Достопочтени.", icon: "fas fa-hand-paper", year: "Древност" },
    { label: "Камъчета", desc: "Използвани в Месопотамия и Древен Гърция - думата 'calculus' означава каменно камъче.", icon: "fas fa-gem", year: "V хил. пр.Хр." },
    { label: "Връвчици с възли (Кипу)", desc: "Инките и древните китайци кодирали търговски и данъчни записи чрез възли.", icon: "fas fa-ribbon", year: "III хил. пр.Хр." },
    { label: "Абак", desc: "Дъска с камъчета в улейчета - ползван в Египет, Индия, Китай и Рим.", icon: "fas fa-border-all", year: "III хил. пр.Хр." },
    { label: "Сметало", desc: "Арабите пренасят абака в Европа; камъчетата стават мъниста на метални телове.", icon: "fas fa-calculator", year: "VIII–XV в." }
  ];

  const stepsHtml = items.map((item, idx) => `
    <div class="visual-story-item ${idx === 0 ? 'active' : ''}" data-idx="${idx}" style="padding: 1.25rem; border-radius: 12px; background: ${idx === 0 ? '#eff6ff' : 'var(--surface, #ffffff)'}; border: 2px solid ${idx === 0 ? '#3b82f6' : 'var(--border-color, #e2e8f0)'}; cursor: pointer; transition: all 0.25s;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
        <span style="font-weight: 700; color: #3b82f6; font-size: 0.85rem; background: #dbeafe; padding: 0.2rem 0.6rem; border-radius: 12px;">Стъпка ${idx + 1}</span>
        <span style="font-size: 0.8rem; color: #64748b; font-weight: 600;">${item.year}</span>
      </div>
      <h4 style="margin: 0 0 0.5rem 0; font-size: 1.1rem; color: var(--text-color); flex-grow: 1; display: flex; align-items: center; gap: 0.5rem;">
        <i class="${item.icon}" style="color: #3b82f6;"></i> ${item.label}
      </h4>
      <p style="margin: 0; font-size: 0.9rem; color: #475569; line-height: 1.4;">${item.desc}</p>
    </div>
  `).join('');

  return `
    <div id="${comp.id}" class="visual-story-container" style="margin: 3rem 0; padding: 2rem; background: var(--surface-alt, #f8fafc); border-radius: 16px; border: 1px solid var(--border-color, #e2e8f0);">
      <div style="text-align: center; margin-bottom: 2rem;">
        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.6rem; color: var(--text-color);">${comp.title || 'Преди машините: човекът сам е бил калкулатор'}</h3>
        <p style="margin: 0; color: #64748b; font-size: 0.95rem;">Натиснете върху произволен метод или използвайте бутона, за да трансформирате инструмента:</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        ${stepsHtml}
      </div>

      <div style="text-align: center; background: #ffffff; padding: 1.5rem; border-radius: 12px; border: 1px solid #cbd5e1; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <button class="transform-next-btn" style="background: #2563eb; color: white; border: none; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: bold; font-size: 1rem; cursor: pointer; transition: background 0.2s; display: inline-flex; align-items: center; gap: 0.5rem;">
          <span>Трансформирай в следващия уред</span>
          <i class="fas fa-magic"></i>
        </button>
        <div style="margin-top: 1rem; font-style: italic; color: #059669; font-weight: 600; font-size: 1rem;">
          <i class="fas fa-quote-left" style="margin-right: 0.4rem; color: #10b981;"></i>
          Идеята не се променя - променя се инструментът!
          <i class="fas fa-quote-right" style="margin-left: 0.4rem; color: #10b981;"></i>
        </div>
      </div>
    </div>
  `;
}

export function init(comp) {
  const container = document.getElementById(comp.id);
  if (!container) return;

  const items = container.querySelectorAll('.visual-story-item');
  const transformBtn = container.querySelector('.transform-next-btn');

  let currentIdx = 0;

  function setActive(idx) {
    currentIdx = idx;
    items.forEach((item, i) => {
      if (i === currentIdx) {
        item.style.background = '#eff6ff';
        item.style.borderColor = '#3b82f6';
        item.style.transform = 'translateY(-2px)';
        item.style.boxShadow = '0 4px 6px -1px rgba(59,130,246,0.2)';
      } else {
        item.style.background = 'var(--surface, #ffffff)';
        item.style.borderColor = 'var(--border-color, #e2e8f0)';
        item.style.transform = 'none';
        item.style.boxShadow = 'none';
      }
    });
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => setActive(i));
  });

  if (transformBtn) {
    transformBtn.addEventListener('click', () => {
      const nextIdx = (currentIdx + 1) % items.length;
      setActive(nextIdx);
    });
  }
}
