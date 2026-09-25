// Peripheral Workbench Component - IT 8 Lesson 2.7
// Interactive Workstation: Connect peripherals to ports and classify their data flow role

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

const DEFAULT_DEVICES = [
  {
    id: 'mic',
    name: 'Студиен микрофон',
    icon: 'fas fa-microphone',
    category: 'input',
    categoryLabel: 'Входно',
    port: 'usb',
    portLabel: 'USB'
  },
  {
    id: 'monitor',
    name: '4K Монитор',
    icon: 'fas fa-desktop',
    category: 'output',
    categoryLabel: 'Изходно',
    port: 'hdmi',
    portLabel: 'HDMI'
  },
  {
    id: 'ssd',
    name: 'Външен SSD диск',
    icon: 'fas fa-hard-drive',
    category: 'storage',
    categoryLabel: 'Запомнящо',
    port: 'usb',
    portLabel: 'USB'
  },
  {
    id: 'lan',
    name: 'Мрежов кабел към рутер',
    icon: 'fas fa-network-wired',
    category: 'comm',
    categoryLabel: 'Комуникационно',
    port: 'lan',
    portLabel: 'LAN (RJ-45)'
  },
  {
    id: 'mouse',
    name: 'Оптична мишка',
    icon: 'fas fa-mouse',
    category: 'input',
    categoryLabel: 'Входно',
    port: 'usb',
    portLabel: 'USB'
  },
  {
    id: 'speakers',
    name: 'Стерео тонколони',
    icon: 'fas fa-volume-high',
    category: 'output',
    categoryLabel: 'Изходно',
    port: 'audio',
    portLabel: 'Audio Jack (3.5 mm)'
  }
];

export function render(comp) {
  const id = comp.id || 'peripheral-workbench';
  const title = comp.title || 'Периферна работна станция: Свързване и роли';
  const devices = comp.devices || DEFAULT_DEVICES;

  return `
    <section id="${esc(id)}" class="component pwb-container" aria-label="${esc(title)}">
      <style>
        .pwb-container {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          margin: 20px 0;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
          font-family: inherit;
        }

        .pwb-header {
          text-align: center;
          margin-bottom: 22px;
        }

        .pwb-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px 0;
        }

        .pwb-subtitle {
          font-size: 0.88rem;
          color: #64748b;
          margin: 0;
        }

        /* Devices Grid */
        .pwb-devices-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .pwb-device-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pwb-device-card.connected {
          background: #f0fdf4;
          border-color: #86efac;
        }

        .pwb-device-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pwb-device-name {
          font-weight: 700;
          font-size: 0.95rem;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pwb-device-status-badge {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
          background: #e2e8f0;
          color: #64748b;
        }

        .pwb-device-card.connected .pwb-device-status-badge {
          background: #bbf7d0;
          color: #15803d;
        }

        .pwb-step-label {
          font-size: 0.76rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #475569;
          margin-bottom: 6px;
        }

        .pwb-btn-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .pwb-select-btn {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .pwb-select-btn:hover:not(:disabled) {
          border-color: #2563eb;
          color: #1d4ed8;
          background: #eff6ff;
        }

        .pwb-select-btn.active {
          background: #2563eb;
          border-color: #1d4ed8;
          color: #ffffff;
        }

        .pwb-select-btn.correct {
          background: #10b981 !important;
          border-color: #059669 !important;
          color: #ffffff !important;
        }

        .pwb-select-btn.wrong {
          background: #ef4444 !important;
          border-color: #dc2626 !important;
          color: #ffffff !important;
          animation: pwbShake 0.3s ease;
        }

        @keyframes pwbShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }

        /* Final Summary Banner */
        .pwb-summary-banner {
          margin-top: 20px;
          background: #f0fdf4;
          border: 2px solid #86efac;
          border-radius: 12px;
          padding: 14px 18px;
          text-align: center;
          font-size: 0.92rem;
          font-weight: 700;
          color: #166534;
          display: none;
        }
      </style>

      <div class="pwb-header">
        <h3 class="pwb-title">${esc(title)}</h3>
        <p class="pwb-subtitle">Конфигурирайте всяко устройство от работната станция: определете неговата роля и правилния порт за връзка!</p>
      </div>

      <!-- Devices Grid -->
      <div class="pwb-devices-grid">
        ${devices.map(d => `
          <div class="pwb-device-card" data-id="${esc(d.id)}" data-cat="${esc(d.category)}" data-port="${esc(d.port)}">
            <div class="pwb-device-head">
              <span class="pwb-device-name">
                <i class="${esc(d.icon)}" style="color: #2563eb;" aria-hidden="true"></i>
                ${esc(d.name)}
              </span>
              <span class="pwb-device-status-badge">Неактивно</span>
            </div>

            <div>
              <div class="pwb-step-label">1. Роля на устройството:</div>
              <div class="pwb-btn-row pwb-cat-btns">
                <button type="button" class="pwb-select-btn" data-val="input">Входно</button>
                <button type="button" class="pwb-select-btn" data-val="output">Изходно</button>
                <button type="button" class="pwb-select-btn" data-val="storage">Запомнящо</button>
                <button type="button" class="pwb-select-btn" data-val="comm">Комуникационно</button>
              </div>
            </div>

            <div>
              <div class="pwb-step-label">2. Порт за свързване:</div>
              <div class="pwb-btn-row pwb-port-btns">
                <button type="button" class="pwb-select-btn" data-val="usb">USB</button>
                <button type="button" class="pwb-select-btn" data-val="hdmi">HDMI</button>
                <button type="button" class="pwb-select-btn" data-val="lan">LAN (RJ-45)</button>
                <button type="button" class="pwb-select-btn" data-val="audio">Audio Jack</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="pwb-summary-banner">
        <i class="fas fa-circle-check" aria-hidden="true"></i>
        Отлично! Всички периферни устройства са правилно класифицирани и свързани към работната станция!
      </div>
    </section>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id || 'peripheral-workbench');
  if (!root) return;

  const cards = root.querySelectorAll('.pwb-device-card');
  const summaryBanner = root.querySelector('.pwb-summary-banner');

  let connectedCount = 0;

  cards.forEach(card => {
    const trueCat = card.dataset.cat;
    const truePort = card.dataset.port;

    let selectedCat = null;
    let selectedPort = null;

    const catBtns = card.querySelectorAll('.pwb-cat-btns .pwb-select-btn');
    const portBtns = card.querySelectorAll('.pwb-port-btns .pwb-select-btn');
    const badge = card.querySelector('.pwb-device-status-badge');

    function checkCompletion() {
      if (!selectedCat || !selectedPort) return;

      const isCatCorrect = selectedCat === trueCat;
      const isPortCorrect = selectedPort === truePort;

      if (isCatCorrect && isPortCorrect) {
        card.classList.add('connected');
        badge.textContent = 'Свързано';

        catBtns.forEach(b => {
          b.disabled = true;
          if (b.dataset.val === trueCat) b.classList.add('correct');
        });

        portBtns.forEach(b => {
          b.disabled = true;
          if (b.dataset.val === truePort) b.classList.add('correct');
        });

        connectedCount++;
        if (connectedCount === cards.length && summaryBanner) {
          summaryBanner.style.display = 'block';
        }
      } else {
        if (!isCatCorrect) {
          const clickedCatBtn = card.querySelector(`.pwb-cat-btns .pwb-select-btn[data-val="${selectedCat}"]`);
          if (clickedCatBtn) {
            clickedCatBtn.classList.add('wrong');
            setTimeout(() => {
              clickedCatBtn.classList.remove('wrong', 'active');
              selectedCat = null;
            }, 600);
          }
        }
        if (!isPortCorrect) {
          const clickedPortBtn = card.querySelector(`.pwb-port-btns .pwb-select-btn[data-val="${selectedPort}"]`);
          if (clickedPortBtn) {
            clickedPortBtn.classList.add('wrong');
            setTimeout(() => {
              clickedPortBtn.classList.remove('wrong', 'active');
              selectedPort = null;
            }, 600);
          }
        }
      }
    }

    catBtns.forEach(btn => {
      btn.onclick = () => {
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedCat = btn.dataset.val;
        checkCompletion();
      };
    });

    portBtns.forEach(btn => {
      btn.onclick = () => {
        portBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedPort = btn.dataset.val;
        checkCompletion();
      };
    });
  });
}
