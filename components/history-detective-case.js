export function render(comp) {
  const suspectsHtml = comp.suspects.map(suspect => `
    <div class="suspect-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; height: 100%;">
      <div style="background: #f1f5f9; padding: 1.5rem; text-align: center; border-bottom: 1px solid var(--border-color);">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.1rem; color: #1e293b;">${suspect.name}</h4>
        <div style="font-weight: bold; color: #3b82f6; font-size: 0.95rem;">${suspect.machine}</div>
        <div style="font-size: 0.85rem; color: #64748b; margin-top: 0.25rem;"><i class="fas fa-calendar-alt" style="margin-right: 0.4rem;"></i>${suspect.years}</div>
      </div>
      <div style="padding: 1.5rem; flex: 1; display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <div style="font-size: 0.8rem; text-transform: uppercase; font-weight: bold; color: #10b981; margin-bottom: 0.4rem;">Аргументи "ЗА"</div>
          <p style="margin: 0; font-size: 0.95rem; color: var(--text-color); line-height: 1.5;">${suspect.claim}</p>
        </div>
        <div style="margin-top: auto; padding-top: 1rem; border-top: 1px dashed var(--border-color);">
          <div style="font-size: 0.8rem; text-transform: uppercase; font-weight: bold; color: #ef4444; margin-bottom: 0.4rem;">Слаби места / Проблеми</div>
          <p style="margin: 0; font-size: 0.9rem; color: var(--text-muted); line-height: 1.4; font-style: italic;">${suspect.limitation}</p>
        </div>
      </div>
    </div>
  `).join('');

  const evidenceHtml = comp.evidence.map(ev => `
    <div style="display: flex; gap: 1rem; align-items: flex-start; padding: 1rem; background: #f8fafc; border-radius: 8px; border-left: 4px solid #f59e0b;">
      <div style="background: #fef3c7; color: #d97706; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1.1rem;">
        <i class="${ev.icon}"></i>
      </div>
      <div>
        <h5 style="margin: 0 0 0.3rem 0; font-size: 0.95rem; color: #334155;">${ev.label}</h5>
        <p style="margin: 0; font-size: 0.9rem; color: #475569; line-height: 1.4;">${ev.content}</p>
      </div>
    </div>
  `).join('');

  return `
    <div id="${comp.id}" class="detective-case-container" style="margin: 3rem 0; border: 2px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
      <!-- Header -->
      <div style="background: #1e293b; color: white; padding: 2rem; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -20px; right: -20px; opacity: 0.1; font-size: 12rem; transform: rotate(15deg);">
          <i class="fas fa-fingerprint"></i>
        </div>
        <div style="position: relative; z-index: 1;">
          <div style="display: inline-block; background: #ef4444; color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-weight: bold; font-size: 0.85rem; margin-bottom: 1rem; letter-spacing: 1px;">
            ${comp.caseNumber || 'ДОСИЕ'}
          </div>
          <h3 style="margin: 0 0 1rem 0; font-size: 1.75rem; line-height: 1.2;">${comp.title}</h3>
          <p style="margin: 0; font-size: 1.05rem; opacity: 0.9; max-width: 800px; line-height: 1.6;">${comp.intro}</p>
        </div>
      </div>

      <div style="padding: 2rem; background: var(--background);">
        <!-- Suspects -->
        <h4 style="margin: 0 0 1.5rem 0; font-size: 1.25rem; color: #334155; display: flex; align-items: center; gap: 0.5rem;">
          <i class="fas fa-users" style="color: #64748b;"></i> Заподозрени
        </h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
          ${suspectsHtml}
        </div>

        <!-- Evidence -->
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 2rem; margin-bottom: 2rem;">
          <h4 style="margin: 0 0 1.5rem 0; font-size: 1.25rem; color: #334155; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-microscope" style="color: #64748b;"></i> Събрани улики
          </h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
            ${evidenceHtml}
          </div>
        </div>

        <!-- Verdict Interactive Area -->
        <div class="verdict-section" id="verdict-section-${comp.id}" style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 2.5rem; text-align: center;">
          <i class="fas fa-gavel" style="font-size: 3rem; color: #94a3b8; margin-bottom: 1rem;"></i>
          <h4 style="margin: 0 0 1rem 0; font-size: 1.2rem; color: #334155;">${comp.verdictQuestion || 'Кого бихте посочили вие?'}</h4>
          <button class="reveal-verdict-btn" style="background: #1e293b; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: bold; font-size: 1rem; cursor: pointer; transition: background 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <i class="fas fa-lock-open" style="margin-right: 0.5rem;"></i> Прочети официалната присъда
          </button>
        </div>

        <!-- Hidden Verdict Content -->
        <div class="verdict-content hidden" id="verdict-content-${comp.id}" style="display: none; background: #fffbeb; border: 1px solid #fcd34d; border-radius: 12px; padding: 2rem; margin-top: 1rem; box-shadow: 0 10px 15px -3px rgba(251, 191, 36, 0.2);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; border-bottom: 2px solid #fde68a; padding-bottom: 1rem;">
            <div>
              <h3 style="margin: 0 0 0.25rem 0; color: #b45309; font-size: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-balance-scale-right"></i> Окончателна присъда
              </h3>
              <div style="color: #92400e; font-weight: 500;">${comp.verdict.date} | ${comp.verdict.court} | ${comp.verdict.judge}</div>
            </div>
            <div style="background: #b45309; color: white; padding: 0.5rem 1rem; border-radius: 4px; font-weight: bold; transform: rotate(5deg);">
              РЕШЕНО
            </div>
          </div>
          
          <p style="font-size: 1.1rem; line-height: 1.6; color: #451a03; margin-bottom: 1.5rem; font-style: italic; border-left: 4px solid #f59e0b; padding-left: 1rem;">
            ${comp.verdict.rulingText}
          </p>
          
          <div style="background: white; padding: 1.25rem; border-radius: 8px; margin-bottom: 1rem;">
            <strong style="color: #b45309; display: block; margin-bottom: 0.25rem;">Исторически резултат:</strong>
            <span style="color: #334155; line-height: 1.5;">${comp.verdict.outcome}</span>
          </div>

          ${comp.verdict.twist ? `
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 1rem; border-radius: 8px; color: #166534; font-size: 0.95rem;">
              <i class="fas fa-lightbulb" style="color: #22c55e; margin-right: 0.5rem;"></i>
              ${comp.verdict.twist}
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

export function init(comp) {
  const container = document.getElementById(comp.id);
  if (!container) return;

  const btn = container.querySelector('.reveal-verdict-btn');
  const section = container.querySelector('.verdict-section');
  const content = container.querySelector('.verdict-content');

  if (btn && section && content) {
    btn.addEventListener('click', () => {
      section.style.display = 'none';
      content.style.display = 'block';
      
      // Simple fade in animation
      content.style.opacity = '0';
      content.style.transform = 'translateY(10px)';
      content.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      
      setTimeout(() => {
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
      }, 50);
    });
  }
}
