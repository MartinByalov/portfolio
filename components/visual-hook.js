export function render(comp) {
  const optionsHtml = (comp.interaction?.options || []).map((opt, idx) => `
    <button class="prediction-opt-btn" data-idx="${idx}" style="background: rgba(255, 255, 255, 0.08); border: 2px solid rgba(255, 255, 255, 0.15); border-radius: 10px; padding: 1rem 1.25rem; font-size: 1rem; font-weight: 600; color: #ffffff; cursor: pointer; transition: all 0.2s; text-align: left; display: flex; align-items: center; justify-content: space-between;">
      <span>${opt}</span>
      <i class="far fa-circle opt-icon" style="color: #94a3b8;"></i>
    </button>
  `).join('');

  return `
    <div id="${comp.id}" class="visual-hook-container" style="margin: 2rem 0; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; border-radius: 16px; padding: 2.5rem; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.3); position: relative; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; opacity: 0.08; font-size: 14rem; pointer-events: none;">
        <i class="fas fa-calculator"></i>
      </div>
      <div style="position: relative; z-index: 1; max-width: 800px; margin: 0 auto;">
        <div style="display: inline-block; background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(96, 165, 250, 0.3); padding: 0.35rem 0.85rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1.25rem;">
          <i class="fas fa-lightbulb" style="margin-right: 0.5rem;"></i> Въведение
        </div>
        <h2 style="margin: 0 0 1rem 0; font-size: 2rem; font-weight: 800; line-height: 1.25; color: #ffffff;">${comp.title}</h2>
        <p style="font-size: 1.15rem; line-height: 1.6; color: #cbd5e1; margin-bottom: 2rem;">${comp.content.text}</p>
        
        <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 1.75rem; margin-bottom: 1.5rem;">
          <h4 style="margin: 0 0 1.25rem 0; font-size: 1.1rem; color: #f8fafc; display: flex; align-items: center; gap: 0.6rem;">
            <i class="fas fa-question-circle" style="color: #3b82f6;"></i> ${comp.content.question}
          </h4>
          <div class="options-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
            ${optionsHtml}
          </div>
        </div>

        <div class="hook-feedback-box" style="display: none; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 12px; padding: 1.25rem; color: #34d399; font-size: 1.05rem; line-height: 1.5;">
          <i class="fas fa-check-circle" style="margin-right: 0.5rem; font-size: 1.2rem;"></i>
          ${comp.interaction.feedback}
        </div>
      </div>
    </div>
  `;
}

export function init(comp) {
  const container = document.getElementById(comp.id);
  if (!container) return;

  const btns = container.querySelectorAll('.prediction-opt-btn');
  const feedbackBox = container.querySelector('.hook-feedback-box');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => {
        b.style.borderColor = 'rgba(255,255,255,0.15)';
        b.style.background = 'rgba(255,255,255,0.08)';
        const icon = b.querySelector('.opt-icon');
        if (icon) {
          icon.className = 'far fa-circle';
          icon.style.color = '#94a3b8';
        }
      });

      btn.style.borderColor = '#10b981';
      btn.style.background = 'rgba(16, 185, 129, 0.2)';
      const icon = btn.querySelector('.opt-icon');
      if (icon) {
        icon.className = 'fas fa-check-circle';
        icon.style.color = '#34d399';
      }

      if (feedbackBox) {
        feedbackBox.style.display = 'block';
      }
    });
  });
}
