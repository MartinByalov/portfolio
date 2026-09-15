// Component: mobile-permissions-auditor
// Interactive permission auditing, risk assessment score, and sandbox security inspector

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

export function render(comp) {
  const id = comp.id || 'comp-perms-auditor-' + Math.random().toString(36).substr(2, 9);
  const title = comp.title || 'Одит на сигурността: Инспектор на системните разрешения';
  const subtitle = comp.subtitle || 'Инспектирайте инсталираните приложения, превключвайте техните права за достъп и анализирайте индекса на риск (Risk Score).';

  const apps = [
    {
      id: 'torch',
      name: 'Super Bright Torch (Безплатно фенерче)',
      category: 'Инструменти',
      icon: 'fas fa-lightbulb',
      iconColor: '#eab308',
      initialScore: 90,
      initialLevel: 'danger',
      description: 'Популярно безплатно фенерче, изтеглено от неофициален магазин или съмнителен уебсайт.',
      permissions: [
        { id: 'cam', name: 'Камера / LED светкавица', risk: 0, defaultChecked: true, legit: true, note: 'Необходимо за включване на светлинния диод на гърба.' },
        { id: 'contacts', name: 'Списък с телефонни контакти', risk: 30, defaultChecked: true, legit: false, note: 'Недопустимо! Фенерчето няма никаква нужда да чете телефонните номера на приятелите ви.' },
        { id: 'sms', name: 'Изпращане и четене на SMS', risk: 35, defaultChecked: true, legit: false, note: 'Критична заплаха! Може да изпраща скрити платени съобщения или да краде банкови кодове.' },
        { id: 'loc', name: 'Точно GPS местоположение', risk: 15, defaultChecked: true, legit: false, note: 'Неоправдано! Използва се за агресивно таргетиране на гео-реклами.' },
        { id: 'mic', name: 'Запис на звук с микрофон', risk: 30, defaultChecked: true, legit: false, note: 'Критична опасност от подслушване (Spyware)!' }
      ]
    },
    {
      id: 'photofx',
      name: 'PhotoFX Studio (Фоторедактор)',
      category: 'Фотография и видео',
      icon: 'fas fa-wand-magic-sparkles',
      iconColor: '#ec4899',
      initialScore: 55,
      initialLevel: 'warning',
      description: 'Приложение за добавяне на ефекти, филтри и рамки към направените снимки.',
      permissions: [
        { id: 'storage', name: 'Достъп до снимки и медийни файлове', risk: 0, defaultChecked: true, legit: true, note: 'Легитимно: задължително за зареждане и запазване на редактираните снимки.' },
        { id: 'camera', name: 'Камера', risk: 0, defaultChecked: true, legit: true, note: 'Легитимно: позволява директно заснемане на нов кадър.' },
        { id: 'contacts', name: 'Достъп до телефонни контакти', risk: 30, defaultChecked: true, legit: false, note: 'Подозрително! Редакторът иска контакти уж за „лесно споделяне“, но може да изтегли адресите ви.' },
        { id: 'phone_id', name: 'Идентификатор на устройството (IMEI/Телефон)', risk: 25, defaultChecked: true, legit: false, note: 'Опасност от трайно проследяване на потребителя между различни рекламни мрежи.' }
      ]
    },
    {
      id: 'calc',
      name: 'Simple Calc Pro (Офлайн калкулатор)',
      category: 'Производителност',
      icon: 'fas fa-calculator',
      iconColor: '#0284c7',
      initialScore: 65,
      initialLevel: 'danger',
      description: 'Математически калкулатор за пресмятане на проценти, дроби и функции.',
      permissions: [
        { id: 'internet', name: 'Пълен достъп до интернет мрежа', risk: 20, defaultChecked: true, legit: false, note: 'Подозрително: обикновените математически сметки не изискват интернет връзка.' },
        { id: 'overlay', name: 'Показване върху други приложения (Overlay)', risk: 35, defaultChecked: true, legit: false, note: 'Сериозен риск! Може да създаде фалшив екран над банково приложение („Tapjacking“).' },
        { id: 'storage', name: 'Пълен достъп до вътрешната памет', risk: 20, defaultChecked: true, legit: false, note: 'Неоправдано за базови изчисления.' }
      ]
    },
    {
      id: 'maps',
      name: 'City Bike Navigator (Градски карти)',
      category: 'Пътуване и навигация',
      icon: 'fas fa-map-location-dot',
      iconColor: '#10b981',
      initialScore: 35,
      initialLevel: 'warning',
      description: 'Навигатор за велосипедни алеи и пешеходни маршрути.',
      permissions: [
        { id: 'loc_use', name: 'GPS локация при използване на приложението', risk: 0, defaultChecked: true, legit: true, note: 'Легитимно и задължително за изчертаване на маршрута.' },
        { id: 'loc_bg', name: 'Постоянно фоново местоположение (24/7)', risk: 25, defaultChecked: true, legit: false, note: 'Внимание: силно изтощава батерията и следи локацията ви дори когато карането е приключило.' },
        { id: 'offline_map', name: 'Съхранение на офлайн карти', risk: 0, defaultChecked: true, legit: true, note: 'Легитимно: позволява сваляне на картата на града за пестене на мобилни данни.' },
        { id: 'contacts', name: 'Свързване с приятели (Контакти)', risk: 20, defaultChecked: false, legit: false, note: 'По избор: ако искате да карате заедно, но крие риск за поверителността.' }
      ]
    }
  ];

  return `
    <div id="${esc(id)}" class="mobile-perms-auditor-wrapper" style="margin: 1.5rem 0; background: var(--surface-alt, #f8fafc); border: 1px solid var(--border-color, #e2e8f0); border-radius: 16px; padding: 1.5rem;">
      <div style="margin-bottom: 1.25rem;">
        <h3 style="margin: 0 0 0.4rem 0; font-size: 1.25rem; color: var(--text-color, #1e293b); font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
          <i class="fas fa-user-shield" style="color: var(--accent-blue, #3b82f6);"></i>
          ${esc(title)}
        </h3>
        ${subtitle ? `<p style="margin: 0; font-size: 0.95rem; color: var(--text-muted, #64748b); line-height: 1.5;">${esc(subtitle)}</p>` : ''}
      </div>

      <!-- App Selection Selector -->
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem;">
        ${apps.map((app, idx) => `
          <button type="button" class="perm-app-btn ${idx === 0 ? 'active' : ''}" data-app="${app.id}" style="padding: 0.55rem 0.9rem; border-radius: 10px; border: 1px solid ${idx === 0 ? 'var(--accent-blue, #3b82f6)' : 'var(--border-color, #e2e8f0)'}; background: ${idx === 0 ? '#eff6ff' : '#ffffff'}; color: ${idx === 0 ? '#1d4ed8' : 'var(--text-color, #1e293b)'}; font-size: 0.88rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.45rem; transition: all 0.2s ease;">
            <i class="${app.icon}" style="color: ${app.iconColor};"></i>
            <span>${esc(app.name)}</span>
          </button>
        `).join('')}
      </div>

      <!-- App Auditing Workstation -->
      <div class="perm-workstation" style="background: #ffffff; border: 1px solid var(--border-color, #e2e8f0); border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
        ${apps.map((app, idx) => `
          <div class="perm-app-card" id="perm-card-${app.id}" style="display: ${idx === 0 ? 'block' : 'none'};">
            
            <!-- App Header & Risk Meter -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9;">
              <div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <div style="width: 36px; height: 36px; border-radius: 8px; background: ${app.iconColor}15; color: ${app.iconColor}; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
                    <i class="${app.icon}"></i>
                  </div>
                  <div>
                    <h4 style="margin: 0; font-size: 1.1rem; color: #0f172a; font-weight: 700;">${esc(app.name)}</h4>
                    <span style="font-size: 0.8rem; color: #64748b;">Категория: ${esc(app.category)}</span>
                  </div>
                </div>
                <div style="font-size: 0.85rem; color: #475569; margin-top: 0.35rem;">${esc(app.description)}</div>
              </div>

              <!-- Risk Score Gauge -->
              <div class="risk-gauge-box" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.6rem 1rem; text-align: right; min-width: 200px;">
                <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #64748b;">Ниво на заплаха (Risk Score)</div>
                <div style="display: flex; align-items: center; justify-content: flex-end; gap: 0.5rem; margin-top: 0.2rem;">
                  <span class="risk-score-value" style="font-size: 1.4rem; font-weight: 800; font-family: monospace; color: #dc2626;">0</span>
                  <span class="risk-badge" style="font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 6px; background: #fee2e2; color: #b91c1c;">Изчисляване...</span>
                </div>
              </div>
            </div>

            <!-- Permission Checklist -->
            <div style="font-size: 0.88rem; font-weight: 700; color: #334155; margin-bottom: 0.75rem; text-transform: uppercase;">
              Искани системни разрешения (Включете/Изключете за тестване на сигурността):
            </div>

            <div class="perms-list" style="display: flex; flex-direction: column; gap: 0.65rem; margin-bottom: 1.25rem;">
              ${app.permissions.map(p => `
                <div class="perm-row" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; padding: 0.75rem; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0;">
                  <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 0.45rem;">
                      <span style="font-weight: 600; color: #1e293b; font-size: 0.9rem;">${esc(p.name)}</span>
                      ${p.legit 
                        ? `<span style="font-size: 0.7rem; font-weight: 700; background: #dcfce7; color: #15803d; padding: 0.1rem 0.4rem; border-radius: 4px;">Легитимно</span>`
                        : `<span style="font-size: 0.7rem; font-weight: 700; background: #fee2e2; color: #b91c1c; padding: 0.1rem 0.4rem; border-radius: 4px;">Опасно</span>`
                      }
                    </div>
                    <div style="font-size: 0.82rem; color: #64748b; margin-top: 0.2rem; line-height: 1.4;">
                      ${esc(p.note)}
                    </div>
                  </div>
                  <div>
                    <label class="switch-label" style="display: inline-flex; align-items: center; cursor: pointer;">
                      <input type="checkbox" class="perm-checkbox" data-risk="${p.risk}" data-legit="${p.legit}" ${p.defaultChecked ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: #2563eb; cursor: pointer;">
                    </label>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Auditor Advice Box -->
            <div class="auditor-advice-box" style="padding: 0.85rem 1rem; border-radius: 8px; font-size: 0.88rem; line-height: 1.45; background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af;">
              <!-- Dynamically updated advice -->
            </div>

          </div>
        `).join('')}
      </div>

      <!-- Security Sandbox Concept Callout -->
      <div style="margin-top: 1.25rem; background: #f1f5f9; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 0.85rem 1rem; font-size: 0.85rem; color: #334155; line-height: 1.5;">
        <strong><i class="fas fa-shield-halved" style="color: #3b82f6; margin-right: 0.35rem;"></i>Принцип на Пясъчника (Sandbox) в мобилните ОС:</strong> В Android и iOS всяко инсталирано приложение работи в строго изолирана защитена среда. То няма право да достъпва файлове на други приложения или хардуерни сензори (микрофон, камера, местоположение), докато потребителят изрично не потвърди диалогов прозорец за разрешение. <em>Златно правило за дигитална безопасност:</em> Ако приложение иска достъп до ресурс, който няма връзка с основната му функция (напр. фенерче, което иска контакти), незабавно откажете разрешението или го деинсталирайте!
      </div>
    </div>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id || 'comp-perms-auditor');
  if (!root) return;

  // Tab switching
  const appBtns = root.querySelectorAll('.perm-app-btn');
  const appCards = root.querySelectorAll('.perm-app-card');

  function calculateScoreForCard(card) {
    const checkboxes = card.querySelectorAll('.perm-checkbox');
    let totalScore = 0;
    let dangerousActive = 0;

    checkboxes.forEach(cb => {
      if (cb.checked) {
        const r = parseInt(cb.getAttribute('data-risk'), 10) || 0;
        totalScore += r;
        const legit = cb.getAttribute('data-legit') === 'true';
        if (!legit) dangerousActive++;
      }
    });

    const scoreVal = card.querySelector('.risk-score-value');
    const badge = card.querySelector('.risk-badge');
    const adviceBox = card.querySelector('.auditor-advice-box');

    if (scoreVal) scoreVal.textContent = `${totalScore}/100`;

    if (totalScore <= 15) {
      if (scoreVal) scoreVal.style.color = '#16a34a';
      if (badge) {
        badge.textContent = 'Безопасно ниво';
        badge.style.background = '#dcfce7';
        badge.style.color = '#15803d';
      }
      if (adviceBox) {
        adviceBox.style.background = '#f0fdf4';
        adviceBox.style.border = '1px solid #bbf7d0';
        adviceBox.style.color = '#166534';
        adviceBox.innerHTML = '<strong><i class="fas fa-circle-check" style="margin-right: 0.35rem;"></i>Отличен одит:</strong> Приложението има само необходимите му функционални права. Личните ви данни и сензори са защитени!';
      }
    } else if (totalScore <= 45) {
      if (scoreVal) scoreVal.style.color = '#d97706';
      if (badge) {
        badge.textContent = 'Умерено предупреждение';
        badge.style.background = '#fef3c7';
        badge.style.color = '#b45309';
      }
      if (adviceBox) {
        adviceBox.style.background = '#fffbeb';
        adviceBox.style.border = '1px solid #fde68a';
        adviceBox.style.color = '#92400e';
        adviceBox.innerHTML = `<strong><i class="fas fa-triangle-exclamation" style="margin-right: 0.35rem;"></i>Внимание:</strong> Има ${dangerousActive} активно разрешение, което не е критично за работата на програмата. Препоръчва се да го деактивирате от системните настройки.`;
      }
    } else {
      if (scoreVal) scoreVal.style.color = '#dc2626';
      if (badge) {
        badge.textContent = 'Критичен риск!';
        badge.style.background = '#fee2e2';
        badge.style.color = '#b91c1c';
      }
      if (adviceBox) {
        adviceBox.style.background = '#fef2f2';
        adviceBox.style.border = '1px solid #fecaca';
        adviceBox.style.color = '#991b1b';
        adviceBox.innerHTML = `<strong><i class="fas fa-ban" style="margin-right: 0.35rem;"></i>Критична заплаха:</strong> Това приложение изисква достъп до чувствителни данни (${dangerousActive} неоправдани права, включително SMS/микрофон/контакти). Риск от зловреден софтуер (Spyware)! Препоръчва се незабавно спиране на правата или пълно изтриване.`;
      }
    }
  }

  // Init scores for all cards
  appCards.forEach(card => {
    calculateScoreForCard(card);

    const checkboxes = card.querySelectorAll('.perm-checkbox');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        calculateScoreForCard(card);
      });
    });
  });

  appBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const appId = btn.getAttribute('data-app');
      appBtns.forEach(b => {
        b.style.background = '#ffffff';
        b.style.borderColor = 'var(--border-color, #e2e8f0)';
        b.style.color = 'var(--text-color, #1e293b)';
      });
      btn.style.background = '#eff6ff';
      btn.style.borderColor = 'var(--accent-blue, #3b82f6)';
      btn.style.color = '#1d4ed8';

      appCards.forEach(card => {
        card.style.display = card.id === `perm-card-${appId}` ? 'block' : 'none';
      });
    });
  });
}
