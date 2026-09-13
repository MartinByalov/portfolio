// Venn Logic Diagram Component
// Interactive Venn diagrams for logical operators (AND, OR, NOT) in File Explorer

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const id = comp.id || 'venn-logic-diagram';
  const title = comp.title || 'Интерактивни Вен-диаграми: Логически оператори (AND, OR, NOT) във File Explorer';
  const operators = comp.operators || [
    {
      name: "AND",
      query: "north AND america",
      effect: "Изисква едновременното присъствие и на двете думи във файла.",
      activeRegion: "intersection",
      color: "#3B82F6"
    },
    {
      name: "OR",
      query: "north OR america",
      effect: "Намира файлове, съдържащи коя да е от двете думи (поне едната).",
      activeRegion: "union",
      color: "#10B981"
    },
    {
      name: "NOT",
      query: "north NOT america",
      effect: "Намира файлове, съдържащи думата 'north', но ИЗКЛЮЧВА тези с 'america'.",
      activeRegion: "left-only",
      color: "#EF4444"
    }
  ];

  const tabsHtml = operators.map((op, idx) => `
    <button type="button" class="venn-tab-btn ${idx === 0 ? 'active' : ''}" data-op-idx="${idx}" style="--op-color: ${esc(op.color)}">
      
      <span class="venn-op-query"><code>${esc(op.query)}</code></span>
    </button>
  `).join('');

  return `
    <div class="interactive-venn-card" id="${esc(id)}">
      <div class="interactive-card-header">
        <div class="interactive-card-badge">
          
          <span>${esc(title)}</span>
        </div>
      </div>
      
      <div class="venn-operator-tabs">
        ${tabsHtml}
      </div>

      <div class="venn-display-area">
        <div class="venn-svg-wrapper">
          <svg viewBox="0 0 420 240" class="venn-svg" aria-label="Вен диаграма за логически оператори">
            <defs>
              <clipPath id="${id}-clip-left">
                <circle cx="160" cy="120" r="85" />
              </clipPath>
              <clipPath id="${id}-clip-right">
                <circle cx="260" cy="120" r="85" />
              </clipPath>
            </defs>

            <!-- Background circles -->
            <circle class="venn-circle-base venn-base-left" cx="160" cy="120" r="85" fill="#F1F5F9" stroke="#94A3B8" stroke-width="2" />
            <circle class="venn-circle-base venn-base-right" cx="260" cy="120" r="85" fill="#F1F5F9" stroke="#94A3B8" stroke-width="2" />

            <!-- Highlight regions -->
            <!-- Left only region (Left circle without right) -->
            <path class="venn-region venn-region-left" d="M 160 35 A 85 85 0 0 0 160 205 A 85 85 0 0 0 210 188 A 85 85 0 0 1 210 52 A 85 85 0 0 0 160 35 Z" fill="transparent" />

            <!-- Right only region -->
            <path class="venn-region venn-region-right" d="M 260 35 A 85 85 0 0 1 260 205 A 85 85 0 0 1 210 188 A 85 85 0 0 0 210 52 A 85 85 0 0 1 260 35 Z" fill="transparent" />

            <!-- Intersection region -->
            <path class="venn-region venn-region-intersection" d="M 210 52 A 85 85 0 0 1 210 188 A 85 85 0 0 1 210 52 Z" fill="#3B82F6" opacity="0.8" />

            <!-- Borders -->
            <circle cx="160" cy="120" r="85" fill="none" stroke="#64748B" stroke-width="2.5" stroke-dasharray="none" />
            <circle cx="260" cy="120" r="85" fill="none" stroke="#64748B" stroke-width="2.5" stroke-dasharray="none" />

            <!-- Labels -->
            <text x="110" y="125" class="venn-label venn-label-left" text-anchor="middle">north</text>
            <text x="310" y="125" class="venn-label venn-label-right" text-anchor="middle">america</text>
            <text x="210" y="125" class="venn-label venn-label-center" text-anchor="middle" fill="#FFFFFF" font-weight="bold">AND</text>
          </svg>
        </div>

        <div class="venn-info-panel">
          <div class="venn-info-badge" style="background: ${esc(operators[0].color)}">${esc(operators[0].name)}</div>
          <div class="venn-info-query">Заявка: <code>${esc(operators[0].query)}</code></div>
          <p class="venn-info-effect">${esc(operators[0].effect)}</p>
          <div class="venn-info-files">
            <span class="files-title"><i class="fas fa-folder-open"></i> Примерни файлове:</span>
            <ul class="files-list">
              <li class="match-yes"><i class="fas fa-check text-emerald-600"></i> <code>north_america_map.png</code> (съдържа и двете)</li>
              <li class="match-no"><i class="fas fa-xmark text-rose-600"></i> <code>north_pole.docx</code> (само north)</li>
              <li class="match-no"><i class="fas fa-xmark text-rose-600"></i> <code>south_america.pptx</code> (само america)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function init(comp) {
  const id = comp.id || 'venn-logic-diagram';
  const root = document.getElementById(id);
  if (!root) return;

  const operators = comp.operators || [];
  const tabBtns = root.querySelectorAll('.venn-tab-btn');
  const regionLeft = root.querySelector('.venn-region-left');
  const regionRight = root.querySelector('.venn-region-right');
  const regionInter = root.querySelector('.venn-region-intersection');
  const labelCenter = root.querySelector('.venn-label-center');
  const infoBadge = root.querySelector('.venn-info-badge');
  const infoQuery = root.querySelector('.venn-info-query');
  const infoEffect = root.querySelector('.venn-info-effect');
  const filesList = root.querySelector('.files-list');

  const filesByOp = {
    AND: [
      { text: 'north_america_map.png (съдържа и двете)', match: true },
      { text: 'north_pole.docx (само north)', match: false },
      { text: 'south_america.pptx (само america)', match: false },
      { text: 'europe_geography.pdf (нито една)', match: false }
    ],
    OR: [
      { text: 'north_america_map.png (съдържа и двете)', match: true },
      { text: 'north_pole.docx (само north)', match: true },
      { text: 'south_america.pptx (само america)', match: true },
      { text: 'europe_geography.pdf (нито една)', match: false }
    ],
    NOT: [
      { text: 'north_pole.docx (съдържа north БЕЗ america)', match: true },
      { text: 'north_wind.pdf (съдържа north БЕЗ america)', match: true },
      { text: 'north_america_map.png (съдържа america - ИЗКЛЮЧЕН)', match: false },
      { text: 'south_america.pptx (липсва north - ИЗКЛЮЧЕН)', match: false }
    ]
  };

  function selectOperator(idx) {
    const op = operators[idx];
    if (!op) return;

    tabBtns.forEach((b, i) => b.classList.toggle('active', i === idx));

    if (infoBadge) {
      infoBadge.textContent = op.name;
      infoBadge.style.background = op.color;
    }
    if (infoQuery) {
      infoQuery.innerHTML = `Заявка: <code>${esc(op.query)}</code>`;
    }
    if (infoEffect) {
      infoEffect.textContent = op.effect;
    }

    if (labelCenter) {
      labelCenter.textContent = op.name;
      labelCenter.setAttribute('fill', op.name === 'NOT' ? '#64748B' : '#FFFFFF');
    }

    // Update Venn SVG regions
    if (regionLeft && regionRight && regionInter) {
      if (op.name === 'AND') {
        regionLeft.setAttribute('fill', 'transparent');
        regionRight.setAttribute('fill', 'transparent');
        regionInter.setAttribute('fill', op.color);
        regionInter.setAttribute('opacity', '0.85');
      } else if (op.name === 'OR') {
        regionLeft.setAttribute('fill', op.color);
        regionRight.setAttribute('fill', op.color);
        regionInter.setAttribute('fill', op.color);
        regionLeft.setAttribute('opacity', '0.75');
        regionRight.setAttribute('opacity', '0.75');
        regionInter.setAttribute('opacity', '0.9');
      } else if (op.name === 'NOT') {
        regionLeft.setAttribute('fill', op.color);
        regionLeft.setAttribute('opacity', '0.85');
        regionRight.setAttribute('fill', 'transparent');
        regionInter.setAttribute('fill', 'transparent');
      }
    }

    // Update sample files list
    if (filesList) {
      const items = filesByOp[op.name] || [];
      filesList.innerHTML = items.map(item => `
        <li class="${item.match ? 'match-yes' : 'match-no'}">
          <i class="fas ${item.match ? 'fa-check text-emerald-600' : 'fa-xmark text-rose-600'}"></i>
          <code>${esc(item.text)}</code>
        </li>
      `).join('');
    }
  }

  tabBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => selectOperator(idx));
  });

  // initial setup
  selectOperator(0);
}
