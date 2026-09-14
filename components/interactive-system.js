export function render(comp) {
  const nodes = comp.nodes || [
    { id: "input", label: "1. Входни устройства", desc: "Перфокарти, клавиатура, сканер, сензори", icon: "fas fa-keyboard", color: "#10b981" },
    { id: "memory", label: "2. Оперативна памет (RAM)", desc: "Съхранява ДАННИТЕ и ПРОГРАМАТА на едно място в двоичен код!", icon: "fas fa-memory", color: "#3b82f6" },
    { id: "cpu", label: "3. Процесор (CPU)", desc: "АЛУ (изчисления) + УУ (управление)", icon: "fas fa-microchip", color: "#ef4444" },
    { id: "output", label: "4. Изходни устройства", desc: "Монитор, принтер, тонколони", icon: "fas fa-desktop", color: "#f59e0b" }
  ];

  const principles = comp.principles || [
    "1. Компютърът се състои от процесор, памет, вход и изход.",
    "2. Използва се двоична бройна система (0 и 1).",
    "3. Управлението се извършва чрез последователност от инструкции.",
    "4. ПРИНЦИП НА СЪХРАНЕНАТА ПРОГРАМА: Програмата се пази в паметта заедно с данните!"
  ];

  const nodesHtml = nodes.map(n => `
    <div class="von-node-card" id="node-${n.id}" style="background: var(--surface, #ffffff); border: 2px solid ${n.color || '#3b82f6'}; border-radius: 12px; padding: 1.25rem; text-align: center; transition: all 0.3s;">
      <div style="width: 48px; height: 48px; border-radius: 50%; background: ${n.color || '#3b82f6'}; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; margin: 0 auto 0.75rem auto;">
        <i class="${n.icon}"></i>
      </div>
      <h4 style="margin: 0 0 0.3rem 0; font-size: 1.05rem; color: var(--text-color);">${n.label}</h4>
      <p style="margin: 0; font-size: 0.85rem; color: #64748b; line-height: 1.4;">${n.desc}</p>
    </div>
  `).join('');

  const principlesHtml = principles.map(p => `
    <div style="display: flex; align-items: flex-start; gap: 0.75rem; background: #ffffff; padding: 0.85rem 1rem; border-radius: 8px; border-left: 4px solid #3b82f6;">
      <i class="fas fa-check" style="color: #3b82f6; margin-top: 0.2rem;"></i>
      <span style="font-size: 0.95rem; color: #334155; font-weight: 500;">${p}</span>
    </div>
  `).join('');

  return `
    <div id="${comp.id}" class="interactive-system-container" style="margin: 3rem 0; padding: 2.25rem; background: var(--surface-alt, #f8fafc); border-radius: 16px; border: 1px solid var(--border-color, #e2e8f0);">
      <div style="text-align: center; max-width: 750px; margin: 0 auto 2rem auto;">
        <span style="background: #dbeafe; color: #1e40af; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">Архитектура на Фон Нойман</span>
        <h3 style="margin: 0.5rem 0 0.25rem 0; font-size: 1.6rem; color: var(--text-color);">${comp.title || 'Идеята, която прилича на днешния компютър'}</h3>
        <p style="margin: 0; color: #64748b; font-size: 0.95rem;">Натиснете бутона, за да симулирате пътя на данните през системата:</p>
      </div>

      <!-- Node Diagram Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        ${nodesHtml}
      </div>

      <!-- Control Button -->
      <div style="text-align: center; margin-bottom: 2rem;">
        <button class="sim-dataflow-btn" style="background: #2563eb; color: white; border: none; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: bold; font-size: 1rem; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem;">
          <i class="fas fa-play"></i>
          <span>Симулирай изпълнение на програма (Data Flow)</span>
        </button>
      </div>

      <!-- Principles Box -->
      <div style="background: #f1f5f9; border-radius: 12px; padding: 1.5rem; border: 1px solid #cbd5e1;">
        <h4 style="margin: 0 0 1rem 0; font-size: 1.1rem; color: #1e293b; display: flex; align-items: center; gap: 0.5rem;">
          <i class="fas fa-scroll" style="color: #3b82f6;"></i> Основни принципи на Фон Нойман:
        </h4>
        <div style="display: flex; flex-direction: column; gap: 0.6rem;">
          ${principlesHtml}
        </div>
      </div>
    </div>
  `;
}

export function init(comp) {
  const container = document.getElementById(comp.id);
  if (!container) return;

  const btn = container.querySelector('.sim-dataflow-btn');
  const nodeInput = container.querySelector('#node-input');
  const nodeMemory = container.querySelector('#node-memory');
  const nodeCpu = container.querySelector('#node-cpu');
  const nodeOutput = container.querySelector('#node-output');

  if (btn && nodeInput && nodeMemory && nodeCpu && nodeOutput) {
    btn.addEventListener('click', () => {
      const nodes = [nodeInput, nodeMemory, nodeCpu, nodeMemory, nodeOutput];
      btn.disabled = true;

      nodes.forEach(n => {
        n.style.transform = 'none';
        n.style.boxShadow = 'none';
      });

      nodes.forEach((n, idx) => {
        setTimeout(() => {
          nodes.forEach(no => {
            no.style.transform = 'none';
            no.style.boxShadow = 'none';
          });
          n.style.transform = 'scale(1.05)';
          n.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.6)';

          if (idx === nodes.length - 1) {
            setTimeout(() => {
              n.style.transform = 'none';
              n.style.boxShadow = 'none';
              btn.disabled = false;
            }, 600);
          }
        }, idx * 700);
      });
    });
  }
}
