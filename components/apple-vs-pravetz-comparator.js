// Apple vs Pravetz Comparator Component
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(b) {
  const id = b.id || 'pravetz-comparator';
  const title = b.title || 'Сравнителен симулатор: Правец 82 (1982 г.) vs Съвременен компютър';

  const prav = b.pravetzSpec || {};
  const mod = b.modernSpec || {};
  const gf = b.growthFactors || {};

  return `
    <div class="avp-container" id="${esc(id)}">
      <div class="avp-header">
        <h3 class="avp-main-title">${esc(title)}</h3>
      </div>
      <div class="avp-comparison-grid">
        <div class="avp-card pravetz">
          <div class="avp-card-badge"><i class="fas fa-history"></i> 1982 г.</div>
          <h4 class="avp-card-title">${esc(prav.name || 'Правец 82 / Apple II')}</h4>
          <ul class="avp-specs-list">
            <li><i class="fas fa-microchip"></i> <strong>Процесор:</strong> ${esc(prav.cpu || '1 MHz')}</li>
            <li><i class="fas fa-memory"></i> <strong>Оперативна памет:</strong> ${esc(prav.ram || '64 KB RAM')}</li>
            <li><i class="fas fa-compact-disc"></i> <strong>Памет за съхранение:</strong> ${esc(prav.storage || '5.25" Флопи (475 KB)')}</li>
          </ul>
        </div>

        <div class="avp-vs-divider">
          <div class="avp-vs-circle">VS</div>
        </div>

        <div class="avp-card modern">
          <div class="avp-card-badge modern-badge"><i class="fas fa-bolt"></i> Днес</div>
          <h4 class="avp-card-title">${esc(mod.name || 'Съвременен компютър')}</h4>
          <ul class="avp-specs-list">
            <li><i class="fas fa-microchip"></i> <strong>Процесор:</strong> ${esc(mod.cpu || 'Intel i5 3.3 GHz')}</li>
            <li><i class="fas fa-memory"></i> <strong>Оперативна памет:</strong> ${esc(mod.ram || '16 GB RAM')}</li>
            <li><i class="fas fa-hdd"></i> <strong>Памет за съхранение:</strong> ${esc(mod.storage || '1 TB SSD')}</li>
          </ul>
        </div>
      </div>

      <div class="avp-growth-banner">
        <h5 class="avp-growth-heading"><i class="fas fa-chart-line"></i> Нарастване на производителността:</h5>
        <div class="avp-growth-items">
          <div class="avp-growth-chip"><i class="fas fa-tachometer-alt"></i> <strong>Процесор:</strong> ${esc(gf.cpuGrowth || 'Над 190 000 пъти')}</div>
          <div class="avp-growth-chip"><i class="fas fa-memory"></i> <strong>RAM:</strong> ${esc(gf.ramGrowth || 'Над 250 000 пъти')}</div>
          <div class="avp-growth-chip"><i class="fas fa-database"></i> <strong>Диск:</strong> ${esc(gf.storageGrowth || 'Над 2 000 000 пъти')}</div>
        </div>
      </div>
    </div>
  `;
}

export function init(b) {
  // Static comparative visual card
}
