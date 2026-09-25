// System Analyzer Component (Хардуер, софтуер или данни?) - IT 8 Lesson 2.7
// Standalone Classifier with Drag & Drop and Click Fallback

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

export function render(comp) {
  const id = comp.id || 'system-analyzer';
  const title = comp.title || 'Хардуер, софтуер или данни?';
  const items = comp.items || [];

  return `
    <section id="${esc(id)}" class="component sta-card" aria-label="${esc(title)}">
      <style>
        .sta-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          margin: 20px 0;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
          font-family: inherit;
        }

        .sta-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .sta-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .sta-pool-title {
          font-size: 0.88rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 12px;
        }

        .sta-items-pool {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          min-height: 60px;
          padding: 14px;
          background: #f8fafc;
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .sta-item-card {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 10px 16px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #334155;
          cursor: grab;
          user-select: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04);
        }

        .sta-item-card:active {
          cursor: grabbing;
        }

        .sta-item-card:hover {
          border-color: #2563eb;
          color: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37,99,235,0.15);
        }

        .sta-item-card.dragging {
          opacity: 0.4;
          transform: scale(0.95);
        }

        .sta-item-card.selected {
          border-color: #2563eb;
          background: #eff6ff;
          box-shadow: 0 0 0 2px rgba(37,99,235,0.3);
        }

        .sta-item-card.placed {
          display: none;
        }

        /* Category Zones */
        .sta-zones-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        @media (max-width: 768px) {
          .sta-zones-grid {
            grid-template-columns: 1fr;
          }
        }

        .sta-zone {
          border-radius: 12px;
          padding: 16px;
          min-height: 220px;
          display: flex;
          flex-direction: column;
          transition: all 0.2s ease;
          position: relative;
        }

        .sta-zone-hw {
          background: #fffbeb;
          border: 2px solid #fde68a;
        }

        .sta-zone-sw {
          background: #f0f9ff;
          border: 2px solid #bae6fd;
        }

        .sta-zone-data {
          background: #ecfdf5;
          border: 2px solid #a7f3d0;
        }

        .sta-zone.drag-over {
          transform: scale(1.02);
          box-shadow: 0 0 0 4px rgba(37,99,235,0.25);
          border-style: dashed;
        }

        .sta-zone-hw.drag-over { background: #fef3c7; border-color: #d97706; }
        .sta-zone-sw.drag-over { background: #e0f2fe; border-color: #0284c7; }
        .sta-zone-data.drag-over { background: #d1fae5; border-color: #059669; }

        .sta-zone-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 0.95rem;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }

        .sta-zone-hw .sta-zone-header { color: #b45309; }
        .sta-zone-sw .sta-zone-header { color: #0369a1; }
        .sta-zone-data .sta-zone-header { color: #047857; }

        .sta-zone-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sta-placed-card {
          background: #ffffff;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 0.84rem;
          display: flex;
          flex-direction: column;
          gap: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          animation: staPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes staPop {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        .sta-placed-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 600;
          color: #1e293b;
        }

        .sta-placed-reason {
          font-size: 0.78rem;
          color: #64748b;
          line-height: 1.35;
          margin-top: 2px;
        }
      </style>

      <div class="sta-header">
        <h3 class="sta-title">${esc(title)}</h3>
      </div>

      <div class="sta-pool-title">
        Изберете елемент и го поставете в съответната категория:
      </div>
      <div class="sta-items-pool">
        ${items.map((item) => `
          <button type="button" class="sta-item-card" draggable="true" data-id="${esc(item.id)}" data-cat="${esc(item.categoryId)}">
            <i class="${esc(item.icon || 'fas fa-cube')}" aria-hidden="true"></i>
            <span>${esc(item.text)}</span>
          </button>
        `).join('')}
      </div>

      <div class="sta-zones-grid">
        <div class="sta-zone sta-zone-hw" data-cat="hardware">
          <div class="sta-zone-header">
            <i class="fas fa-microchip" aria-hidden="true"></i>
            Хардуер (Hardware)
          </div>
          <div class="sta-zone-content"></div>
        </div>

        <div class="sta-zone sta-zone-sw" data-cat="software">
          <div class="sta-zone-header">
            <i class="fas fa-code" aria-hidden="true"></i>
            Софтуер (Software)
          </div>
          <div class="sta-zone-content"></div>
        </div>

        <div class="sta-zone sta-zone-data" data-cat="data">
          <div class="sta-zone-header">
            <i class="fas fa-database" aria-hidden="true"></i>
            Данни (Data)
          </div>
          <div class="sta-zone-content"></div>
        </div>
      </div>
    </section>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id || 'system-analyzer');
  if (!root) return;

  const items = comp.items || [];
  const itemCards = root.querySelectorAll('.sta-item-card');
  const zones = root.querySelectorAll('.sta-zone');
  let selectedItem = null;

  function placeCardInZone(cardEl, zoneEl) {
    if (!cardEl || !zoneEl) return;

    const targetCat = zoneEl.dataset.cat;
    const cardCat = cardEl.dataset.cat;
    const itemId = cardEl.dataset.id;
    const itemData = items.find(i => i.id === itemId);

    if (targetCat === cardCat) {
      cardEl.classList.remove('selected', 'dragging');
      cardEl.classList.add('placed');

      const container = zoneEl.querySelector('.sta-zone-content');
      const placedCard = document.createElement('div');
      placedCard.className = 'sta-placed-card';
      placedCard.innerHTML = `
        <div class="sta-placed-head">
          <span><i class="${esc(itemData.icon || 'fas fa-check')}" aria-hidden="true"></i> ${esc(itemData.text)}</span>
          <i class="fas fa-circle-check" style="color: #10b981;" aria-hidden="true"></i>
        </div>
        <div class="sta-placed-reason">${esc(itemData.reason || '')}</div>
      `;
      container.appendChild(placedCard);
      selectedItem = null;
    } else {
      cardEl.style.transform = 'translateX(-6px)';
      setTimeout(() => { cardEl.style.transform = 'translateX(6px)'; }, 100);
      setTimeout(() => { cardEl.style.transform = 'none'; }, 200);
    }
  }

  itemCards.forEach(card => {
    card.onclick = () => {
      if (card.classList.contains('placed')) return;

      itemCards.forEach(c => c.classList.remove('selected'));
      selectedItem = card;
      card.classList.add('selected');
    };

    card.addEventListener('dragstart', (e) => {
      if (card.classList.contains('placed')) {
        e.preventDefault();
        return;
      }
      selectedItem = card;
      card.classList.add('dragging');
      e.dataTransfer.setData('text/plain', card.dataset.id);
      e.dataTransfer.effectAllowed = 'move';
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });
  });

  zones.forEach(zone => {
    zone.onclick = () => {
      if (selectedItem) {
        placeCardInZone(selectedItem, zone);
      }
    };

    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    zone.addEventListener('dragenter', (e) => {
      e.preventDefault();
      zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', (e) => {
      if (!zone.contains(e.relatedTarget)) {
        zone.classList.remove('drag-over');
      }
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');

      const droppedId = e.dataTransfer.getData('text/plain');
      let droppedCard = selectedItem;

      if (!droppedCard && droppedId) {
        droppedCard = root.querySelector(`.sta-item-card[data-id="${droppedId}"]`);
      }

      if (droppedCard) {
        placeCardInZone(droppedCard, zone);
      }
    });
  });
}
