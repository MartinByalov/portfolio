// Peripheral Flow Matrix Component - IT 8 Lesson 2.7
// Interactive functional classification of peripheral devices by data flow

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

const DEFAULT_DEVICES = [
  { id: 'dev-1', name: 'Скенер', cat: 'input', icon: 'fas fa-print', note: 'Дигитализира хартиени документи и ги изпраща към компютъра.' },
  { id: 'dev-2', name: 'Мултимедиен прожектор', cat: 'output', icon: 'fas fa-video', note: 'Излъчва картина и видео от видеокартата върху голям екран.' },
  { id: 'dev-3', name: 'Външен SSD диск', cat: 'storage', icon: 'fas fa-hard-drive', note: 'Записва и съхранява дългосрочно потребителски файлове и архиви.' },
  { id: 'dev-4', name: 'Wi-Fi рутер', cat: 'comm', icon: 'fas fa-wifi', note: 'Предава пакети данни между домашната мрежа и глобалния интернет.' },
  { id: 'dev-5', name: 'Микрофон', cat: 'input', icon: 'fas fa-microphone', note: 'Преобразува гласа в цифров звуков сигнал за запис или разговор.' },
  { id: 'dev-6', name: 'Тонколони', cat: 'output', icon: 'fas fa-volume-high', note: 'Превръщат цифровия звуков поток от звуковата карта в чуваем звук.' },
  { id: 'dev-7', name: 'USB флаш памет', cat: 'storage', icon: 'fas fa-memory', note: 'Преносима енергонезависима памет за четене и запис на данни.' },
  { id: 'dev-8', name: 'Мрежов суич', cat: 'comm', icon: 'fas fa-network-wired', note: 'Свързва множество компютри и мрежови кабели в обща локална мрежа (LAN).' }
];

export function render(comp) {
  const id = comp.id || 'peripheral-flow-matrix';
  const title = comp.title || 'Класификация на периферните устройства';
  const devices = comp.devices || DEFAULT_DEVICES;

  return `
    <section id="${esc(id)}" class="component pfm-container" aria-label="${esc(title)}">
      <style>
        .pfm-container {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          margin: 20px 0;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
          font-family: inherit;
        }

        .pfm-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .pfm-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .pfm-pool-label {
          font-size: 0.88rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 10px;
        }

        .pfm-pool {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          padding: 14px;
          background: #f8fafc;
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          margin-bottom: 22px;
          min-height: 58px;
        }

        .pfm-chip {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 0.86rem;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          user-select: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .pfm-chip:hover {
          border-color: #2563eb;
          color: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(37,99,235,0.15);
        }

        .pfm-chip.selected {
          border-color: #2563eb;
          background: #eff6ff;
          box-shadow: 0 0 0 2px rgba(37,99,235,0.3);
        }

        .pfm-chip.placed {
          display: none;
        }

        /* 4 Flow Zones */
        .pfm-zones-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        @media (max-width: 680px) {
          .pfm-zones-grid {
            grid-template-columns: 1fr;
          }
        }

        .pfm-zone {
          border-radius: 12px;
          padding: 16px;
          min-height: 170px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .pfm-zone:hover {
          transform: translateY(-2px);
        }

        .pfm-zone-in { background: #f0fdf4; border: 2px solid #bbf7d0; }
        .pfm-zone-out { background: #eff6ff; border: 2px solid #bfdbfe; }
        .pfm-zone-store { background: #fffbeb; border: 2px solid #fde68a; }
        .pfm-zone-comm { background: #faf5ff; border: 2px solid #e9d5ff; }

        .pfm-zone-head {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 0.92rem;
          margin-bottom: 4px;
        }

        .pfm-zone-in .pfm-zone-head { color: #15803d; }
        .pfm-zone-out .pfm-zone-head { color: #1d4ed8; }
        .pfm-zone-store .pfm-zone-head { color: #b45309; }
        .pfm-zone-comm .pfm-zone-head { color: #7e22ce; }

        .pfm-zone-sub {
          font-size: 0.76rem;
          color: #64748b;
          margin-bottom: 12px;
          line-height: 1.3;
        }

        .pfm-zone-items {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .pfm-placed-item {
          background: #ffffff;
          border-radius: 6px;
          padding: 8px 10px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #1e293b;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          animation: pfmPop 0.25s ease;
        }

        @keyframes pfmPop {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      </style>

      <div class="pfm-header">
        <h3 class="pfm-title">${esc(title)}</h3>
      </div>

      <div class="pfm-pool-label">
        Изберете устройство от списъка и го поставете в неговата категория:
      </div>

      <div class="pfm-pool">
        ${devices.map(dev => `
          <button type="button" class="pfm-chip" data-id="${esc(dev.id)}" data-cat="${esc(dev.cat)}">
            <i class="${esc(dev.icon)}" aria-hidden="true"></i>
            <span>${esc(dev.name)}</span>
          </button>
        `).join('')}
      </div>

      <div class="pfm-zones-grid">
        <div class="pfm-zone pfm-zone-in" data-cat="input">
          <div class="pfm-zone-head">
            <i class="fas fa-arrow-right-to-bracket" aria-hidden="true"></i> Входни устройства
          </div>
          <div class="pfm-zone-sub">Подават данни и команди към компютъра</div>
          <div class="pfm-zone-items"></div>
        </div>

        <div class="pfm-zone pfm-zone-out" data-cat="output">
          <div class="pfm-zone-head">
            <i class="fas fa-arrow-up-from-bracket" aria-hidden="true"></i> Изходни устройства
          </div>
          <div class="pfm-zone-sub">Извеждат резултати и сигнали от компютъра</div>
          <div class="pfm-zone-items"></div>
        </div>

        <div class="pfm-zone pfm-zone-store" data-cat="storage">
          <div class="pfm-zone-head">
            <i class="fas fa-hard-drive" aria-hidden="true"></i> Запомнящи устройства
          </div>
          <div class="pfm-zone-sub">Записват и съхраняват дългосрочно файлове</div>
          <div class="pfm-zone-items"></div>
        </div>

        <div class="pfm-zone pfm-zone-comm" data-cat="comm">
          <div class="pfm-zone-head">
            <i class="fas fa-network-wired" aria-hidden="true"></i> Комуникационни устройства
          </div>
          <div class="pfm-zone-sub">Свързват компютъра към мрежа и интернет</div>
          <div class="pfm-zone-items"></div>
        </div>
      </div>
    </section>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id || 'peripheral-flow-matrix');
  if (!root) return;

  const devices = comp.devices || DEFAULT_DEVICES;
  const chips = root.querySelectorAll('.pfm-chip');
  const zones = root.querySelectorAll('.pfm-zone');
  let selectedChip = null;

  function placeChip(chipEl, zoneEl) {
    if (!chipEl || !zoneEl) return;

    const targetCat = zoneEl.dataset.cat;
    const chipCat = chipEl.dataset.cat;
    const devId = chipEl.dataset.id;
    const devData = devices.find(d => d.id === devId);

    if (targetCat === chipCat) {
      chipEl.classList.remove('selected');
      chipEl.classList.add('placed');

      const itemsContainer = zoneEl.querySelector('.pfm-zone-items');
      const placedEl = document.createElement('div');
      placedEl.className = 'pfm-placed-item';
      placedEl.innerHTML = `
        <span><i class="${esc(devData.icon)}" style="margin-right: 6px;"></i> ${esc(devData.name)}</span>
        <i class="fas fa-check" style="color: #10b981;"></i>
      `;
      itemsContainer.appendChild(placedEl);
      selectedChip = null;
    } else {
      chipEl.style.transform = 'translateX(-6px)';
      setTimeout(() => { chipEl.style.transform = 'translateX(6px)'; }, 100);
      setTimeout(() => { chipEl.style.transform = 'none'; }, 200);
    }
  }

  chips.forEach(chip => {
    chip.onclick = () => {
      if (chip.classList.contains('placed')) return;

      chips.forEach(c => c.classList.remove('selected'));
      selectedChip = chip;
      chip.classList.add('selected');
    };
  });

  zones.forEach(zone => {
    zone.onclick = () => {
      if (selectedChip) {
        placeChip(selectedChip, zone);
      }
    };
  });
}
