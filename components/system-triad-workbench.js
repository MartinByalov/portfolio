// System Triad Workbench Component - IT 8 Lesson 2.7
// Interactive Classification (Drag & Drop + Click) + Sequential Triad Circuit Simulator

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

export function render(comp) {
  const id = comp.id || 'system-triad-workbench';
  const title = comp.title || 'Хардуер, софтуер или данни?';
  const description = comp.description || 'Изследвайте компютърната триада: плъзнете или кликнете върху компонентите, за да ги разпределите!';

  const items = comp.items || [];
  const scenarios = comp.scenarios || [];

  return `
    <section id="${esc(id)}" class="component stw-card" aria-label="${esc(title)}">
      <style>
        .stw-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          margin: 20px 0;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
          font-family: inherit;
        }

        .stw-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .stw-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .stw-desc {
          font-size: 0.9rem;
          color: #64748b;
          margin: 0;
        }

        /* Navigation Tabs */
        .stw-tabs {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-bottom: 24px;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 12px;
        }

        .stw-tab {
          flex: 1;
          max-width: 280px;
          padding: 10px 16px;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .stw-tab.active {
          background: #ffffff;
          color: #2563eb;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        }

        .stw-tab:hover:not(.active) {
          color: #1e293b;
        }

        /* Views */
        .stw-view {
          display: none;
        }

        .stw-view.active {
          display: block;
        }

        /* Mode 1: Classifier */
        .stw-pool-title {
          font-size: 0.88rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stw-items-pool {
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

        .stw-item-card {
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

        .stw-item-card:active {
          cursor: grabbing;
        }

        .stw-item-card:hover {
          border-color: #2563eb;
          color: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37,99,235,0.15);
        }

        .stw-item-card.dragging {
          opacity: 0.4;
          transform: scale(0.95);
        }

        .stw-item-card.selected {
          border-color: #2563eb;
          background: #eff6ff;
          box-shadow: 0 0 0 2px rgba(37,99,235,0.3);
        }

        .stw-item-card.placed {
          display: none;
        }

        /* Category Zones */
        .stw-zones-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        @media (max-width: 768px) {
          .stw-zones-grid {
            grid-template-columns: 1fr;
          }
        }

        .stw-zone {
          border-radius: 12px;
          padding: 16px;
          min-height: 220px;
          display: flex;
          flex-direction: column;
          transition: all 0.2s ease;
          position: relative;
        }

        .stw-zone-hw {
          background: #fffbeb;
          border: 2px solid #fde68a;
        }

        .stw-zone-sw {
          background: #f0f9ff;
          border: 2px solid #bae6fd;
        }

        .stw-zone-data {
          background: #ecfdf5;
          border: 2px solid #a7f3d0;
        }

        .stw-zone.drag-over {
          transform: scale(1.02);
          box-shadow: 0 0 0 4px rgba(37,99,235,0.25);
          border-style: dashed;
        }

        .stw-zone-hw.drag-over { background: #fef3c7; border-color: #d97706; }
        .stw-zone-sw.drag-over { background: #e0f2fe; border-color: #0284c7; }
        .stw-zone-data.drag-over { background: #d1fae5; border-color: #059669; }

        .stw-zone-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 0.95rem;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }

        .stw-zone-hw .stw-zone-header { color: #b45309; }
        .stw-zone-sw .stw-zone-header { color: #0369a1; }
        .stw-zone-data .stw-zone-header { color: #047857; }

        .stw-zone-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stw-placed-card {
          background: #ffffff;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 0.84rem;
          display: flex;
          flex-direction: column;
          gap: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          animation: stwPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes stwPop {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        .stw-placed-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 600;
          color: #1e293b;
        }

        .stw-placed-reason {
          font-size: 0.78rem;
          color: #64748b;
          line-height: 1.35;
          margin-top: 2px;
        }

        /* Mode 2: Sequential Simulator Board */
        .stw-circuit-board {
          background: #0f172a;
          border-radius: 16px;
          padding: 24px;
          color: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .stw-sim-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 14px 18px;
          margin-bottom: 20px;
        }

        .stw-sim-task-title {
          font-size: 1rem;
          font-weight: 700;
          color: #38bdf8;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .stw-sim-counter-badge {
          font-size: 0.8rem;
          font-weight: 700;
          color: #94a3b8;
          background: rgba(255,255,255,0.1);
          padding: 4px 12px;
          border-radius: 20px;
          white-space: nowrap;
        }

        .stw-sockets-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 640px) {
          .stw-sockets-row {
            grid-template-columns: 1fr;
          }
        }

        .stw-socket {
          background: rgba(255, 255, 255, 0.05);
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          min-height: 110px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .stw-socket-type {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .stw-socket-hw .stw-socket-type { color: #f59e0b; }
        .stw-socket-sw .stw-socket-type { color: #38bdf8; }
        .stw-socket-data .stw-socket-type { color: #34d399; }

        .stw-socket-filled {
          background: rgba(255, 255, 255, 0.12);
          border-style: solid;
        }

        .stw-socket-hw.stw-socket-filled { border-color: #f59e0b; }
        .stw-socket-sw.stw-socket-filled { border-color: #38bdf8; }
        .stw-socket-data.stw-socket-filled { border-color: #34d399; }

        .stw-socket-val {
          font-size: 0.88rem;
          font-weight: 600;
          color: #f8fafc;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Signal Animation Line */
        .stw-signal-line {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          margin: 22px 0;
          border-radius: 3px;
          position: relative;
          overflow: hidden;
        }

        .stw-signal-pulse {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 0%;
          background: linear-gradient(90deg, #f59e0b, #38bdf8, #34d399);
          border-radius: 3px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .stw-pulse-active {
          animation: stwGlow 1.5s infinite alternate;
        }

        @keyframes stwGlow {
          0% { box-shadow: 0 0 6px #38bdf8; }
          100% { box-shadow: 0 0 22px #38bdf8, 0 0 35px #34d399; }
        }

        /* Sequential Steps Candidate Selector */
        .stw-candidates-section {
          margin-top: 20px;
        }

        .stw-cand-group {
          margin-bottom: 16px;
          transition: all 0.4s ease;
        }

        .stw-cand-group.locked {
          opacity: 0.35;
          pointer-events: none;
          filter: grayscale(80%);
        }

        .stw-cand-group.unlocked {
          opacity: 1;
          pointer-events: auto;
          filter: grayscale(0%);
          animation: stwFadeInGroup 0.4s ease-out;
        }

        @keyframes stwFadeInGroup {
          0% { opacity: 0.2; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .stw-cand-label {
          font-size: 0.82rem;
          margin-bottom: 8px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stw-cand-label span.status-tag {
          font-size: 0.72rem;
          padding: 2px 8px;
          border-radius: 12px;
          background: rgba(255,255,255,0.1);
        }

        .stw-cand-btns {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .stw-cand-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #e2e8f0;
          border-radius: 10px;
          padding: 10px 16px;
          font-size: 0.86rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .stw-cand-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          transform: translateY(-1px);
        }

        .stw-cand-btn.btn-correct {
          background: #059669 !important;
          border-color: #34d399 !important;
          color: #ffffff !important;
        }

        .stw-cand-btn.btn-incorrect {
          background: #dc2626 !important;
          border-color: #fca5a5 !important;
          color: #ffffff !important;
          animation: stwShake 0.3s ease;
        }

        @keyframes stwShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }

        /* Simulator Feedback & Navigation */
        .stw-sim-feedback {
          margin-top: 18px;
          padding: 16px;
          border-radius: 12px;
          font-size: 0.88rem;
          line-height: 1.5;
          display: none;
        }

        .stw-sim-feedback.success {
          display: block;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(52, 211, 153, 0.4);
          color: #a7f3d0;
        }

        .stw-sim-feedback.error {
          display: block;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(248, 113, 113, 0.4);
          color: #fca5a5;
        }

        .stw-next-sc-btn {
          margin-top: 14px;
          background: #2563eb;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 10px 18px;
          font-size: 0.86rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .stw-next-sc-btn:hover {
          background: #3b82f6;
          transform: translateY(-1px);
        }
      </style>

      <div class="stw-header">
        <h3 class="stw-title">
          ${esc(title)}
        </h3>
        ${description ? `<p class="stw-desc">${esc(description)}</p>` : ''}
      </div>

      <div class="stw-tabs">
        <button type="button" class="stw-tab active" data-target="classifier">
          <i class="fas fa-layer-group" aria-hidden="true"></i>
          1. Системен анализатор
        </button>
        <button type="button" class="stw-tab" data-target="simulator">
          <i class="fas fa-microchip" aria-hidden="true"></i>
          2. Триаден симулатор
        </button>
      </div>

      <!-- VIEW 1: CLASSIFIER -->
      <div class="stw-view stw-view-classifier active">
        <div class="stw-pool-title">
          Изберете елемент и го поставете в съответната категория:
        </div>
        <div class="stw-items-pool">
          ${items.map((item) => `
            <button type="button" class="stw-item-card" draggable="true" data-id="${esc(item.id)}" data-cat="${esc(item.categoryId)}">
              <i class="${esc(item.icon || 'fas fa-cube')}" aria-hidden="true"></i>
              <span>${esc(item.text)}</span>
            </button>
          `).join('')}
        </div>

        <div class="stw-zones-grid">
          <div class="stw-zone stw-zone-hw" data-cat="hardware">
            <div class="stw-zone-header">
              <i class="fas fa-microchip" aria-hidden="true"></i>
              Хардуер (Hardware)
            </div>
            <div class="stw-zone-content"></div>
          </div>

          <div class="stw-zone stw-zone-sw" data-cat="software">
            <div class="stw-zone-header">
              <i class="fas fa-code" aria-hidden="true"></i>
              Софтуер (Software)
            </div>
            <div class="stw-zone-content"></div>
          </div>

          <div class="stw-zone stw-zone-data" data-cat="data">
            <div class="stw-zone-header">
              <i class="fas fa-database" aria-hidden="true"></i>
              Данни (Data)
            </div>
            <div class="stw-zone-content"></div>
          </div>
        </div>
      </div>

      <!-- VIEW 2: SIMULATOR -->
      <div class="stw-view stw-view-simulator">
        <div class="stw-circuit-board">
          <div class="stw-sim-header-bar">
            <div class="stw-sim-task-title">
              <i class="fas fa-bullseye" style="color: #38bdf8;" aria-hidden="true"></i>
              <span class="stw-sim-goal-text">Сглобете триадната верига</span>
            </div>
            <div class="stw-sim-counter-badge">
              Казус <span class="stw-cur-sc-num">1</span> от ${scenarios.length}
            </div>
          </div>

          <div class="stw-sockets-row">
            <div class="stw-socket stw-socket-hw" data-type="hardware">
              <div class="stw-socket-type"><i class="fas fa-microchip" aria-hidden="true"></i> 1. Хардуер</div>
              <div class="stw-socket-val">Изберете...</div>
            </div>

            <div class="stw-socket stw-socket-sw" data-type="software">
              <div class="stw-socket-type"><i class="fas fa-code" aria-hidden="true"></i> 2. Софтуер</div>
              <div class="stw-socket-val">Изберете...</div>
            </div>

            <div class="stw-socket stw-socket-data" data-type="data">
              <div class="stw-socket-type"><i class="fas fa-database" aria-hidden="true"></i> 3. Данни</div>
              <div class="stw-socket-val">Изберете...</div>
            </div>
          </div>

          <div class="stw-signal-line">
            <div class="stw-signal-pulse"></div>
          </div>

          <div class="stw-candidates-section"></div>

          <div class="stw-sim-feedback"></div>
        </div>
      </div>
    </section>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id || 'system-triad-workbench');
  if (!root) return;

  const items = comp.items || [];
  const scenarios = comp.scenarios || [];

  // Tab switching
  const tabs = root.querySelectorAll('.stw-tab');
  const views = root.querySelectorAll('.stw-view');

  tabs.forEach(tab => {
    tab.onclick = () => {
      const target = tab.dataset.target;
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      views.forEach(v => {
        v.classList.toggle('active', v.classList.contains(`stw-view-${target}`));
      });
    };
  });

  // --- MODE 1: CLASSIFIER LOGIC (DRAG & DROP + CLICK FALLBACK) ---
  const itemCards = root.querySelectorAll('.stw-item-card');
  const zones = root.querySelectorAll('.stw-zone');
  let selectedItem = null;

  function placeCardInZone(cardEl, zoneEl) {
    if (!cardEl || !zoneEl) return;

    const targetCat = zoneEl.dataset.cat;
    const cardCat = cardEl.dataset.cat;
    const itemId = cardEl.dataset.id;
    const itemData = items.find(i => i.id === itemId);

    if (targetCat === cardCat) {
      // Correct classification
      cardEl.classList.remove('selected', 'dragging');
      cardEl.classList.add('placed');

      const container = zoneEl.querySelector('.stw-zone-content');
      const placedCard = document.createElement('div');
      placedCard.className = 'stw-placed-card';
      placedCard.innerHTML = `
        <div class="stw-placed-head">
          <span><i class="${esc(itemData.icon || 'fas fa-check')}" aria-hidden="true"></i> ${esc(itemData.text)}</span>
          <i class="fas fa-circle-check" style="color: #10b981;" aria-hidden="true"></i>
        </div>
        <div class="stw-placed-reason">${esc(itemData.reason || '')}</div>
      `;
      container.appendChild(placedCard);
      selectedItem = null;
    } else {
      // Incorrect attempt animation
      cardEl.style.transform = 'translateX(-6px)';
      setTimeout(() => { cardEl.style.transform = 'translateX(6px)'; }, 100);
      setTimeout(() => { cardEl.style.transform = 'none'; }, 200);
    }
  }

  itemCards.forEach(card => {
    // Click / Select
    card.onclick = () => {
      if (card.classList.contains('placed')) return;

      itemCards.forEach(c => c.classList.remove('selected'));
      selectedItem = card;
      card.classList.add('selected');
    };

    // Native Drag Start
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

    // Native Drag End
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });
  });

  zones.forEach(zone => {
    // Click fallback
    zone.onclick = () => {
      if (selectedItem) {
        placeCardInZone(selectedItem, zone);
      }
    };

    // Drag Over
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    // Drag Enter
    zone.addEventListener('dragenter', (e) => {
      e.preventDefault();
      zone.classList.add('drag-over');
    });

    // Drag Leave
    zone.addEventListener('dragleave', (e) => {
      if (!zone.contains(e.relatedTarget)) {
        zone.classList.remove('drag-over');
      }
    });

    // Drop
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');

      const droppedId = e.dataTransfer.getData('text/plain');
      let droppedCard = selectedItem;

      if (!droppedCard && droppedId) {
        droppedCard = root.querySelector(`.stw-item-card[data-id="${droppedId}"]`);
      }

      if (droppedCard) {
        placeCardInZone(droppedCard, zone);
      }
    });
  });

  // --- MODE 2: SEQUENTIAL SIMULATOR LOGIC ---
  let activeScenarioIndex = 0;
  let currentStep = 1; // 1 = Hardware, 2 = Software, 3 = Data
  let selections = { hardware: null, software: null, data: null };

  const goalTextEl = root.querySelector('.stw-sim-goal-text');
  const curNumEl = root.querySelector('.stw-cur-sc-num');
  const candSection = root.querySelector('.stw-candidates-section');
  const feedbackEl = root.querySelector('.stw-sim-feedback');
  const pulseEl = root.querySelector('.stw-signal-pulse');

  const sockets = {
    hardware: root.querySelector('.stw-socket-hw'),
    software: root.querySelector('.stw-socket-sw'),
    data: root.querySelector('.stw-socket-data')
  };

  function updateSockets() {
    const categories = ['hardware', 'software', 'data'];
    categories.forEach(cat => {
      const sock = sockets[cat];
      const val = selections[cat];
      const valEl = sock.querySelector('.stw-socket-val');

      if (val) {
        sock.classList.add('stw-socket-filled');
        valEl.innerHTML = `<i class="${esc(val.icon)}" aria-hidden="true"></i> ${esc(val.text)}`;
      } else {
        sock.classList.remove('stw-socket-filled');
        valEl.textContent = 'Изберете...';
      }
    });
  }

  function loadScenario(idx) {
    activeScenarioIndex = idx;
    currentStep = 1;
    selections = { hardware: null, software: null, data: null };

    const sc = scenarios[idx];
    if (!sc) return;

    goalTextEl.textContent = sc.goal || sc.title;
    curNumEl.textContent = idx + 1;

    feedbackEl.className = 'stw-sim-feedback';
    feedbackEl.style.display = 'none';
    pulseEl.style.width = '0%';
    pulseEl.classList.remove('stw-pulse-active');

    updateSockets();

    // Render 3 step candidate groups
    const categories = [
      { key: 'hardware', step: 1, label: '1. Изберете Хардуерен компонент', icon: 'fas fa-microchip', color: '#f59e0b' },
      { key: 'software', step: 2, label: '2. Изберете Софтуерен компонент', icon: 'fas fa-code', color: '#38bdf8' },
      { key: 'data', step: 3, label: '3. Изберете Данни', icon: 'fas fa-database', color: '#34d399' }
    ];

    let html = '';
    categories.forEach(cat => {
      const opts = sc.options?.[cat.key] || [];
      const isLocked = cat.step > currentStep;

      html += `
        <div class="stw-cand-group stw-cand-group-${cat.key} ${isLocked ? 'locked' : 'unlocked'}" data-key="${cat.key}" data-step="${cat.step}">
          <div class="stw-cand-label" style="color: ${cat.color};">
            <span><i class="${cat.icon}" aria-hidden="true"></i> ${esc(cat.label)}</span>
            <span class="status-tag status-tag-${cat.key}">${isLocked ? 'Заключено' : 'Активно'}</span>
          </div>
          <div class="stw-cand-btns">
            ${opts.map(opt => `
              <button type="button" class="stw-cand-btn" data-cat="${cat.key}" data-step="${cat.step}" data-id="${esc(opt.id)}" data-correct="${opt.correct}">
                <i class="${esc(opt.icon || 'fas fa-cube')}" aria-hidden="true"></i>
                <span>${esc(opt.text)}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;
    });

    candSection.innerHTML = html;

    // Attach button click events for sequential selection
    candSection.querySelectorAll('.stw-cand-btn').forEach(btn => {
      btn.onclick = () => {
        const step = parseInt(btn.dataset.step, 10);
        const cat = btn.dataset.cat;
        const isCorrect = btn.dataset.correct === 'true';

        if (step !== currentStep) return; // Must follow sequence

        if (!isCorrect) {
          // Wrong choice animation
          btn.classList.add('btn-incorrect');
          setTimeout(() => btn.classList.remove('btn-incorrect'), 600);

          feedbackEl.className = 'stw-sim-feedback error';
          feedbackEl.innerHTML = `<i class="fas fa-triangle-exclamation" aria-hidden="true"></i> Този компонент не е подходящ за поставения казус. Опитайте друга опция.`;
          return;
        }

        // Correct choice!
        btn.classList.add('btn-correct');
        const btnText = btn.querySelector('span').textContent;
        const btnIcon = btn.querySelector('i').className;

        selections[cat] = { text: btnText, icon: btnIcon };
        updateSockets();

        feedbackEl.className = 'stw-sim-feedback';
        feedbackEl.style.display = 'none';

        // Update progress line and unlock next step
        if (currentStep === 1) {
          pulseEl.style.width = '33.3%';
          currentStep = 2;
          unlockStep('software');
        } else if (currentStep === 2) {
          pulseEl.style.width = '66.6%';
          currentStep = 3;
          unlockStep('data');
        } else if (currentStep === 3) {
          // All 3 steps complete!
          pulseEl.style.width = '100%';
          pulseEl.classList.add('stw-pulse-active');

          feedbackEl.className = 'stw-sim-feedback success';
          const hasNext = activeScenarioIndex + 1 < scenarios.length;

          feedbackEl.innerHTML = `
            <div style="font-weight: 700; margin-bottom: 6px; font-size: 0.95rem;">
              <i class="fas fa-circle-check" aria-hidden="true"></i> Триадната верига е успешно сглобена!
            </div>
            <div>${esc(sc.explanation)}</div>
            ${hasNext ? `
              <div style="margin-top: 10px; font-size: 0.84rem; color: #34d399; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Преминаване към Казус ${activeScenarioIndex + 2}...
              </div>
            ` : `
              <div style="margin-top: 12px; font-weight: 700; color: #34d399; font-size: 0.95rem;">
                <i class="fas fa-trophy" aria-hidden="true"></i> Отлично! Успешно сглобихте всички триадни вериги!
              </div>
            `}
          `;

          if (hasNext) {
            setTimeout(() => {
              if (root.contains(feedbackEl)) {
                loadScenario(activeScenarioIndex + 1);
              }
            }, 2000);
          }
        }
      };
    });
  }

  function unlockStep(catKey) {
    const groupEl = candSection.querySelector(`.stw-cand-group-${catKey}`);
    if (groupEl) {
      groupEl.classList.remove('locked');
      groupEl.classList.add('unlocked');
      const tag = groupEl.querySelector('.status-tag');
      if (tag) tag.textContent = 'Активно';
    }
  }

  if (scenarios.length > 0) {
    loadScenario(0);
  }
}
