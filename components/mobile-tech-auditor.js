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

        .mta-card.answered-correct {
          background: #f0fdf4 !important;
          border-color: #86efac !important;
        }

        .mta-card.answered-wrong {
          background: #fef2f2 !important;
          border-color: #fca5a5 !important;
        }

        .mta-card.answered-correct .mta-actions,
        .mta-card.answered-wrong .mta-actions {
          display: none;
        }

        .mta-result-badge {
          font-size: 1.45rem;
          line-height: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          user-select: none;
          animation: mtaPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes mtaPop {
          0% { transform: scale(0.4); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
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
          gap: 16px;
        }

        .mta-btn {
          padding: 8px 24px;
          border-radius: 10px;
          font-size: 1.35rem;
          line-height: 1;
          cursor: pointer;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 64px;
          transition: all 0.2s ease;
          user-select: none;
        }

        .mta-btn:hover:not(:disabled) {
          border-color: #2563eb;
          transform: translateY(-2px) scale(1.06);
          box-shadow: 0 4px 10px rgba(37,99,235,0.15);
        }

        .mta-btn.btn-fact:hover:not(:disabled) {
          border-color: #10b981;
          background: #ecfdf5;
        }

        .mta-btn.btn-myth:hover:not(:disabled) {
          border-color: #ef4444;
          background: #fef2f2;
        }

        .mta-btn.selected-correct {
          background: #10b981 !important;
          border-color: #059669 !important;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.35);
          transform: scale(1.05);
        }

        .mta-btn.selected-wrong {
          background: #ef4444 !important;
          border-color: #dc2626 !important;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.35);
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
              <button type="button" class="mta-btn btn-fact" data-choice="true" title="Да" aria-label="Да">
                👍
              </button>
              <button type="button" class="mta-btn btn-myth" data-choice="false" title="Не" aria-label="Не">
                👎
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

        const head = card.querySelector('.mta-card-head');
        const badge = document.createElement('span');

        if (isCorrect) {
          card.classList.add('answered-correct');
          badge.className = 'mta-result-badge correct';
          badge.textContent = '😎';
        } else {
          card.classList.add('answered-wrong');
          badge.className = 'mta-result-badge wrong';
          badge.textContent = '😭';
        }

        if (head) {
          head.appendChild(badge);
        }
      };
    });
  });
}
