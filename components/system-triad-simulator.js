// System Triad Simulator Component (Триаден симулатор / Последователност) - IT 8 Lesson 2.7
// Standalone Sequential Circuit Simulator for Sandbox Accordion

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

export function render(comp) {
  const id = comp.id || 'system-triad-simulator';
  const title = comp.title || 'Последователност';
  const scenarios = comp.scenarios || [];

  return `
    <section id="${esc(id)}" class="component sts-card" aria-label="${esc(title)}">
      <style>
        .sts-card {
          background: #0f172a;
          border-radius: 16px;
          padding: 24px;
          color: #ffffff;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          font-family: inherit;
        }

        .sts-sim-header-bar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 10px 16px;
          margin-bottom: 20px;
        }

        .sts-sim-counter-badge {
          font-size: 0.82rem;
          font-weight: 700;
          color: #f8fafc;
          background: rgba(255,255,255,0.12);
          padding: 4px 14px;
          border-radius: 20px;
          white-space: nowrap;
        }

        /* Candidate Groups */
        .sts-candidates-section {
          margin-bottom: 24px;
        }

        .sts-cand-group {
          margin-bottom: 16px;
          transition: all 0.4s ease;
        }

        .sts-cand-group.locked {
          opacity: 0.35;
          pointer-events: none;
          filter: grayscale(80%);
        }

        .sts-cand-group.unlocked {
          opacity: 1;
          pointer-events: auto;
          filter: grayscale(0%);
          animation: stsFadeIn 0.4s ease-out;
        }

        @keyframes stsFadeIn {
          0% { opacity: 0.2; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .sts-cand-label {
          font-size: 0.82rem;
          margin-bottom: 8px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sts-cand-label span.status-tag {
          font-size: 0.72rem;
          padding: 2px 8px;
          border-radius: 12px;
          background: rgba(255,255,255,0.1);
        }

        .sts-cand-btns {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .sts-cand-btn {
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

        .sts-cand-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          transform: translateY(-1px);
        }

        .sts-cand-btn.btn-correct {
          background: #059669 !important;
          border-color: #34d399 !important;
          color: #ffffff !important;
        }

        .sts-cand-btn.btn-incorrect {
          background: #dc2626 !important;
          border-color: #fca5a5 !important;
          color: #ffffff !important;
          animation: stsShake 0.3s ease;
        }

        @keyframes stsShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }

        /* Sockets Section */
        .sts-sockets-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          position: relative;
          z-index: 2;
          margin-top: 10px;
        }

        @media (max-width: 640px) {
          .sts-sockets-row {
            grid-template-columns: 1fr;
          }
        }

        .sts-socket {
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

        .sts-socket-type {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .sts-socket-hw .sts-socket-type { color: #f59e0b; }
        .sts-socket-sw .sts-socket-type { color: #38bdf8; }
        .sts-socket-data .sts-socket-type { color: #34d399; }

        .sts-socket-filled {
          background: rgba(255, 255, 255, 0.12);
          border-style: solid;
        }

        .sts-socket-hw.sts-socket-filled { border-color: #f59e0b; }
        .sts-socket-sw.sts-socket-filled { border-color: #38bdf8; }
        .sts-socket-data.sts-socket-filled { border-color: #34d399; }

        .sts-socket-val {
          font-size: 0.88rem;
          font-weight: 600;
          color: #f8fafc;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Signal Animation Line */
        .sts-signal-line {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          margin: 20px 0;
          border-radius: 3px;
          position: relative;
          overflow: hidden;
        }

        .sts-signal-pulse {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 0%;
          background: linear-gradient(90deg, #f59e0b, #38bdf8, #34d399);
          border-radius: 3px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sts-pulse-active {
          animation: stsGlow 1.5s infinite alternate;
        }

        @keyframes stsGlow {
          0% { box-shadow: 0 0 6px #38bdf8; }
          100% { box-shadow: 0 0 22px #38bdf8, 0 0 35px #34d399; }
        }

        .sts-sim-feedback {
          margin-top: 18px;
          padding: 16px;
          border-radius: 12px;
          font-size: 0.88rem;
          line-height: 1.5;
          display: none;
        }

        .sts-sim-feedback.success {
          display: block;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(52, 211, 153, 0.4);
          color: #a7f3d0;
        }

        .sts-sim-feedback.error {
          display: block;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(248, 113, 113, 0.4);
          color: #fca5a5;
        }
      </style>

      <div class="sts-candidates-section"></div>

      <div class="sts-sockets-row">
        <div class="sts-socket sts-socket-hw" data-type="hardware">
          <div class="sts-socket-type"><i class="fas fa-microchip" aria-hidden="true"></i> 1. Хардуер</div>
          <div class="sts-socket-val">Изберете...</div>
        </div>

        <div class="sts-socket sts-socket-sw" data-type="software">
          <div class="sts-socket-type"><i class="fas fa-code" aria-hidden="true"></i> 2. Софтуер</div>
          <div class="sts-socket-val">Изберете...</div>
        </div>

        <div class="sts-socket sts-socket-data" data-type="data">
          <div class="sts-socket-type"><i class="fas fa-database" aria-hidden="true"></i> 3. Данни</div>
          <div class="sts-socket-val">Изберете...</div>
        </div>
      </div>

      <div class="sts-signal-line">
        <div class="sts-signal-pulse"></div>
      </div>

      <div class="sts-bottom-bar" style="display: flex; justify-content: flex-start; margin-top: 12px;">
        <div class="sts-sim-counter-badge">
          Казус <span class="sts-cur-sc-num">1</span> от ${scenarios.length}
        </div>
      </div>

      <div class="sts-sim-feedback"></div>
    </section>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id || 'system-triad-simulator');
  if (!root) return;

  const scenarios = comp.scenarios || [];
  let activeScenarioIndex = 0;
  let currentStep = 1;
  let selections = { hardware: null, software: null, data: null };

  const curNumEl = root.querySelector('.sts-cur-sc-num');
  const candSection = root.querySelector('.sts-candidates-section');
  const feedbackEl = root.querySelector('.sts-sim-feedback');
  const pulseEl = root.querySelector('.sts-signal-pulse');

  const sockets = {
    hardware: root.querySelector('.sts-socket-hw'),
    software: root.querySelector('.sts-socket-sw'),
    data: root.querySelector('.sts-socket-data')
  };

  function updateSockets() {
    ['hardware', 'software', 'data'].forEach(cat => {
      const sock = sockets[cat];
      const val = selections[cat];
      const valEl = sock.querySelector('.sts-socket-val');

      if (val) {
        sock.classList.add('sts-socket-filled');
        valEl.innerHTML = `<i class="${esc(val.icon)}" aria-hidden="true"></i> ${esc(val.text)}`;
      } else {
        sock.classList.remove('sts-socket-filled');
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

    curNumEl.textContent = idx + 1;

    feedbackEl.className = 'sts-sim-feedback';
    feedbackEl.style.display = 'none';
    pulseEl.style.width = '0%';
    pulseEl.classList.remove('sts-pulse-active');

    updateSockets();

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
        <div class="sts-cand-group sts-cand-group-${cat.key} ${isLocked ? 'locked' : 'unlocked'}" data-key="${cat.key}" data-step="${cat.step}">
          <div class="sts-cand-label" style="color: ${cat.color};">
            <span><i class="${cat.icon}" aria-hidden="true"></i> ${esc(cat.label)}</span>
            <span class="status-tag status-tag-${cat.key}">${isLocked ? 'Заключено' : 'Активно'}</span>
          </div>
          <div class="sts-cand-btns">
            ${opts.map(opt => `
              <button type="button" class="sts-cand-btn" data-cat="${cat.key}" data-step="${cat.step}" data-id="${esc(opt.id)}" data-correct="${opt.correct}">
                <i class="${esc(opt.icon || 'fas fa-cube')}" aria-hidden="true"></i>
                <span>${esc(opt.text)}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;
    });

    candSection.innerHTML = html;

    candSection.querySelectorAll('.sts-cand-btn').forEach(btn => {
      btn.onclick = () => {
        const step = parseInt(btn.dataset.step, 10);
        const cat = btn.dataset.cat;
        const isCorrect = btn.dataset.correct === 'true';

        if (step !== currentStep) return;

        if (!isCorrect) {
          btn.classList.add('btn-incorrect');
          setTimeout(() => btn.classList.remove('btn-incorrect'), 600);

          feedbackEl.className = 'sts-sim-feedback error';
          feedbackEl.innerHTML = `<i class="fas fa-triangle-exclamation" aria-hidden="true"></i> Този компонент не е подходящ за поставения казус. Опитайте друга опция.`;
          return;
        }

        btn.classList.add('btn-correct');
        const btnText = btn.querySelector('span').textContent;
        const btnIcon = btn.querySelector('i').className;

        selections[cat] = { text: btnText, icon: btnIcon };
        updateSockets();

        feedbackEl.className = 'sts-sim-feedback';
        feedbackEl.style.display = 'none';

        if (currentStep === 1) {
          pulseEl.style.width = '33.3%';
          currentStep = 2;
          unlockStep('software');
        } else if (currentStep === 2) {
          pulseEl.style.width = '66.6%';
          currentStep = 3;
          unlockStep('data');
        } else if (currentStep === 3) {
          pulseEl.style.width = '100%';
          pulseEl.classList.add('sts-pulse-active');

          feedbackEl.className = 'sts-sim-feedback success';
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
    const groupEl = candSection.querySelector(`.sts-cand-group-${catKey}`);
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
