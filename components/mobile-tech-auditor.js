// Mobile Tech Auditor Component - IT 8 Lesson 2.7
// Interactive Fact vs Myth auditor for mobile hardware and wireless technologies

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

const DEFAULT_CLAIMS = [
  {
    id: 'm1',
    topic: 'Клетъчни мрежи',
    icon: 'fas fa-tower-cell',
    color: '#10b981',
    claim: 'Буквата „G“ в 4G и 5G означава Generation (поколение), а не гигабайти.',
    isFact: true
  },
  {
    id: 'm2',
    topic: 'Безжичен обхват',
    icon: 'fas fa-id-card',
    color: '#ec4899',
    claim: 'NFC технологията предава данни на разстояние до 10 метра, подобно на домашния Wi-Fi.',
    isFact: false
  },
  {
    id: 'm3',
    topic: 'Мобилен процесор (SoC)',
    icon: 'fas fa-microchip',
    color: '#f59e0b',
    claim: 'Системата върху чип (SoC) обединява CPU, графичен ускорител (GPU) и модем в един силициев кристал.',
    isFact: true
  },
  {
    id: 'm4',
    topic: 'Сигурност на платформите',
    icon: 'fas fa-shield-halved',
    color: '#3b82f6',
    claim: 'Моделът за сигурност Sandbox позволява на всяко приложение свободно да чете данните на останалите програми.',
    isFact: false
  },
  {
    id: 'm5',
    topic: 'Периферна връзка',
    icon: 'fab fa-bluetooth-b',
    color: '#8b5cf6',
    claim: 'Bluetooth е създаден за безжична периферия с минимална консумация на батерия, а не за пренос на гигабайти.',
    isFact: true
  }
];

export function render(comp) {
  const id = comp.id || 'mobile-tech-auditor';
  const title = comp.title || 'Мобилни технологии: Факт или заблуда?';
  const claims = comp.claims || DEFAULT_CLAIMS;

  return `
    <section id="${esc(id)}" class="component mta-container" aria-label="${esc(title)}">
      <style>
        .mta-container {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          margin: 20px 0;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
          font-family: inherit;
        }

        .mta-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .mta-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .mta-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .mta-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px 20px;
          transition: all 0.25s ease;
          position: relative;
        }

        .mta-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .mta-topic-tag {
          font-size: 0.78rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #334155;
        }

        .mta-claim-text {
          font-size: 0.96rem;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.45;
          margin-bottom: 14px;
        }

        .mta-actions {
          display: flex;
          justify-content: center;
          gap: 14px;
        }

        .mta-btn {
          padding: 8px 22px;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #334155;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .mta-btn:hover:not(:disabled) {
          border-color: #2563eb;
          color: #1d4ed8;
          transform: translateY(-1px);
        }

        .mta-btn.btn-fact:hover:not(:disabled) {
          border-color: #10b981;
          background: #ecfdf5;
          color: #047857;
        }

        .mta-btn.btn-myth:hover:not(:disabled) {
          border-color: #ef4444;
          background: #fef2f2;
          color: #b91c1c;
        }

        .mta-btn.selected-correct {
          background: #10b981 !important;
          border-color: #059669 !important;
          color: #ffffff !important;
        }

        .mta-btn.selected-wrong {
          background: #ef4444 !important;
          border-color: #dc2626 !important;
          color: #ffffff !important;
        }
      </style>

      <div class="mta-header">
        <h3 class="mta-title">${esc(title)}</h3>
      </div>

      <div class="mta-grid">
        ${claims.map(item => `
          <div class="mta-card" data-id="${esc(item.id)}" data-fact="${item.isFact}">
            <div class="mta-card-head">
              <span class="mta-topic-tag" style="border-left: 3px solid ${item.color};">
                <i class="${esc(item.icon)}" style="color: ${item.color};" aria-hidden="true"></i>
                ${esc(item.topic)}
              </span>
            </div>
            <div class="mta-claim-text">${esc(item.claim)}</div>
            <div class="mta-actions">
              <button type="button" class="mta-btn btn-fact" data-choice="true" title="Да">
                <i class="fas fa-thumbs-up" aria-hidden="true"></i> Да
              </button>
              <button type="button" class="mta-btn btn-myth" data-choice="false" title="Не">
                <i class="fas fa-thumbs-down" aria-hidden="true"></i> Не
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id || 'mobile-tech-auditor');
  if (!root) return;

  const cards = root.querySelectorAll('.mta-card');

  cards.forEach(card => {
    const isFact = card.dataset.fact === 'true';
    const btns = card.querySelectorAll('.mta-btn');

    btns.forEach(btn => {
      btn.onclick = () => {
        const userChoice = btn.dataset.choice === 'true';
        const isCorrect = userChoice === isFact;

        btns.forEach(b => { b.disabled = true; });

        if (isCorrect) {
          btn.classList.add('selected-correct');
        } else {
          btn.classList.add('selected-wrong');
          const correctBtn = card.querySelector(`.mta-btn[data-choice="${isFact}"]`);
          if (correctBtn) correctBtn.classList.add('selected-correct');
        }
      };
    });
  });
}
