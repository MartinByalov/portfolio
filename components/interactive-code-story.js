export function render(comp) {
  const cards = comp.cards || [
    { id: "c1", label: "1. Зареди началните данни в Склада", desc: "Въвеждаме с перфокарти стойностите за А и Б." },
    { id: "c2", label: "2. Прехвърли в Мелницата", desc: "Изпращаме данните към аритметичния модул." },
    { id: "c3", label: "3. Извърши изчислението", desc: "Машината умножава А по Б." },
    { id: "c4", label: "4. Провери условието (Ада Лъвлейс)", desc: "Ако резултатът е < 100, изпълни нов цикъл!" },
    { id: "c5", label: "5. Отпечатай крайния резултат", desc: "Печат на хартия или перфориране на нова карта." }
  ];

  const cardsHtml = cards.map((c, idx) => `
    <div class="code-story-card" data-idx="${idx}" style="background: var(--surface, #ffffff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 10px; padding: 1rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span class="code-card-num" style="background: #3b82f6; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.85rem;">${idx + 1}</span>
        <div>
          <strong style="color: var(--text-color); font-size: 0.95rem; display: block;">${c.label}</strong>
          <span style="color: #64748b; font-size: 0.85rem;">${c.desc}</span>
        </div>
      </div>
      <i class="fas fa-grip-vertical" style="color: #cbd5e1;"></i>
    </div>
  `).join('');

  return `
    <div id="${comp.id}" class="interactive-code-story-container" style="margin: 3rem 0; padding: 2.25rem; background: var(--surface-alt, #f8fafc); border-radius: 16px; border: 1px solid var(--border-color, #e2e8f0);">
      <div style="text-align: center; max-width: 750px; margin: 0 auto 2rem auto;">
        <span style="background: #fce7f3; color: #be185d; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">Първата програма</span>
        <h3 style="margin: 0.5rem 0 0.25rem 0; font-size: 1.6rem; color: var(--text-color);">${comp.title || 'Кога машината започва да следва инструкции?'}</h3>
        <p style="margin: 0; color: #64748b; font-size: 0.95rem;">Подредете инструкциите в правилната програмна последователност:</p>
      </div>

      <div class="code-story-cards-wrapper" style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 700px; margin: 0 auto 2rem auto;">
        ${cardsHtml}
      </div>

      <div style="text-align: center;">
        <button class="run-program-btn" style="background: #059669; color: white; border: none; padding: 0.85rem 2rem; border-radius: 10px; font-weight: bold; font-size: 1.05rem; cursor: pointer; transition: background 0.2s; box-shadow: 0 4px 6px rgba(5,150,105,0.2); display: inline-flex; align-items: center; gap: 0.5rem;">
          <i class="fas fa-play"></i>
          <span>Изпълни програмата</span>
        </button>
      </div>

      <div class="program-result-box" style="display: none; margin-top: 1.5rem; max-width: 700px; margin-left: auto; margin-right: auto; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 1.25rem; border-radius: 12px; color: #065f46; font-size: 0.95rem; line-height: 1.5;">
        <i class="fas fa-check-circle" style="color: #10b981; font-size: 1.25rem; margin-right: 0.5rem;"></i>
        <strong>Успешно изпълнение!</strong> Жакард доказа, че дупчените карти могат да командват машината. Ада Лъвлейс написа първите цикли и условни преходи. Машината вече не просто смята — тя изпълнява алгоритъм!
      </div>
    </div>
  `;
}

export function init(comp) {
  const container = document.getElementById(comp.id);
  if (!container) return;

  const btn = container.querySelector('.run-program-btn');
  const resultBox = container.querySelector('.program-result-box');

  if (btn && resultBox) {
    btn.addEventListener('click', () => {
      btn.style.background = '#047857';
      resultBox.style.display = 'block';
    });
  }
}
