// System Builder Lab - a complete lesson experienced as an engineering workbench

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function optionMarkup(group, selected) {
  return group.options.map(option => `
    <button type="button" class="sbl-part ${option.id === selected ? 'selected' : ''}" data-group="${esc(group.id)}" data-option="${esc(option.id)}">
      <span class="sbl-part-icon"><i class="${esc(option.icon)}"></i></span>
      <span><strong>${esc(option.label)}</strong><small>${esc(option.fact)}</small></span>
    </button>
  `).join('');
}

export function render(comp) {
  const profiles = comp.profiles || [];
  const groups = comp.parts || [];
  const firstProfile = profiles[0] || {};
  const profileCards = profiles.map((profile, index) => `
    <button type="button" class="sbl-profile ${index === 0 ? 'selected' : ''}" data-profile="${esc(profile.id)}">
      <i class="${esc(profile.icon)}"></i><strong>${esc(profile.label)}</strong><span>${esc(profile.brief)}</span>
    </button>
  `).join('');
  const partGroups = groups.map(group => `
    <div class="sbl-part-group">
      <div class="sbl-part-heading"><i class="${esc(group.icon)}"></i><span><strong>${esc(group.label)}</strong><small>${esc(group.role)}</small></span></div>
      <div class="sbl-part-options">${optionMarkup(group, group.options[0]?.id)}</div>
    </div>
  `).join('');

  return `
    <section class="system-builder-lab" id="${esc(comp.id)}">
      <header class="sbl-console-header">
        <div><h2>${esc(comp.title)}</h2><p>${esc(comp.intro)}</p></div>
      </header>

      <nav class="sbl-stage-nav" aria-label="Етапи на лабораторията">
        <button type="button" class="sbl-stage-tab active" data-stage="brief"><span>01</span> Поръчка</button>
        <button type="button" class="sbl-stage-tab" data-stage="build"><span>02</span> Монтаж</button>
        <button type="button" class="sbl-stage-tab" data-stage="post"><span>03</span> POST</button>
        <button type="button" class="sbl-stage-tab" data-stage="run"><span>04</span> Задача</button>
        <button type="button" class="sbl-stage-tab" data-stage="stress"><span>05</span> Стрес тест</button>
        <button type="button" class="sbl-stage-tab" data-stage="explain"><span>06</span> Защита</button>
      </nav>

      <div class="sbl-stage active" data-stage-panel="brief">
        <div class="sbl-stage-copy"><span class="sbl-step">СТЪПКА 01</span><h3>Получавате поръчка. За какво ще служи системата?</h3><p>Няма универсално „най-добър компютър“. Предназначението определя кои ресурси са важни. Изберете клиент и запомнете ограниченията му.</p></div>
        <div class="sbl-profile-grid">${profileCards}</div>
        <div class="sbl-brief-card"><div><span>АКТИВНА ПОРЪЧКА</span><strong class="sbl-brief-title">${esc(firstProfile.label)}</strong></div><p class="sbl-brief-text">${esc(firstProfile.challenge)}</p><div class="sbl-budget"><i class="fas fa-coins"></i> Бюджет: <strong class="sbl-budget-value">${esc(firstProfile.budget)}</strong></div></div>
        <button type="button" class="btn-activity sbl-next" data-next="build">Напред <i class="fas fa-arrow-right"></i></button>
      </div>

      <div class="sbl-stage" data-stage-panel="build">
        <div class="sbl-stage-copy"><span class="sbl-step">СТЪПКА 02</span><h3>Сглобете балансирана система</h3><p>Прочетете ролята на всяка част. Дънната платка свързва компонентите чрез слотове и шини, а захранването трябва да осигури нужната мощност.</p></div>
        <div class="sbl-build-layout">
          <div class="sbl-parts-panel">${partGroups}</div>
        </div>
        <div class="sbl-build-actions"><button type="button" class="btn-activity sbl-check-build"><i class="fas fa-wrench"></i> Провери</button><div class="sbl-build-feedback" aria-live="polite"></div></div>
      </div>

      <div class="sbl-stage" data-stage-panel="post">
        <div class="sbl-stage-copy"><span class="sbl-step">СТЪПКА 03</span><h3>Натиснете POWER - какво става преди екрана?</h3><p>POST е първата проверка на хардуера. Стартиращият код е във firmware памет, която запазва съдържанието си без електрозахранване.</p></div>
        <div class="sbl-post-machine">
          <button type="button" class="sbl-power"><i class="fas fa-power-off"></i><span>POWER</span></button>
          <div class="sbl-post-screen"><div class="sbl-post-line">SYSTEM OFFLINE_</div></div>
        </div>
        <div class="sbl-post-insight"><i class="fas fa-lightbulb"></i><span><strong>ROM / firmware ≠ RAM:</strong> постоянните инструкции започват проверката; RAM става работното пространство след включване.</span></div>
      </div>

      <div class="sbl-stage" data-stage-panel="run">
        <div class="sbl-stage-copy"><span class="sbl-step">СТЪПКА 04</span><h3>Проследете една команда</h3><p>Изберете действие и гледайте как данните се движат. Това е архитектурата на фон Нойман в действие - програма и данни в паметта, двоично представяне и циклично изпълнение.</p></div>
        <div class="sbl-command-picker">
          <button type="button" class="sbl-command selected" data-command="photo"><i class="fas fa-image"></i> Приложи филтър</button>
          <button type="button" class="sbl-command" data-command="sum"><i class="fas fa-calculator"></i> Изчисли сума</button>
          <button type="button" class="sbl-command" data-command="save"><i class="fas fa-floppy-disk"></i> Запази файл</button>
        </div>
        <div class="sbl-data-path">
          <div class="sbl-path-node" data-node="input"><i class="fas fa-keyboard"></i><strong>Вход</strong><span>команда</span></div><i class="fas fa-chevron-right"></i>
          <div class="sbl-path-node" data-node="storage"><i class="fas fa-hard-drive"></i><strong>SSD</strong><span>програма/файл</span></div><i class="fas fa-chevron-right"></i>
          <div class="sbl-path-node" data-node="ram"><i class="fas fa-memory"></i><strong>RAM</strong><span>работни данни</span></div><i class="fas fa-chevron-right"></i>
          <div class="sbl-path-node" data-node="cpu"><i class="fas fa-microchip"></i><strong>CPU</strong><span>fetch → decode → execute</span></div><i class="fas fa-chevron-right"></i>
          <div class="sbl-path-node" data-node="output"><i class="fas fa-display"></i><strong>Изход</strong><span>резултат</span></div>
        </div>
        <button type="button" class="btn-activity sbl-run-command"><i class="fas fa-play"></i> Изпълни командата</button>
        <div class="sbl-binary-strip">00000000 00000000 00000000</div>
        <p class="sbl-command-explanation">Изберете команда и я изпълнете.</p>
      </div>

      <div class="sbl-stage" data-stage-panel="stress">
        <div class="sbl-stage-copy"><span class="sbl-step">СТЪПКА 05</span><h3>Намерете границата на системата</h3><p>Увеличавайте броя на едновременно отворените приложения. После променете RAM и наблюдавайте кога системата започва да използва по-бавното устройство за виртуална памет.</p></div>
        <div class="sbl-stress-grid">
          <label>Отворени приложения <strong class="sbl-app-value">6</strong><input class="sbl-app-slider" type="range" min="1" max="24" value="6"></label>
          <label>Инсталирана RAM <strong class="sbl-ram-value">8 GB</strong><input class="sbl-ram-slider" type="range" min="4" max="32" step="4" value="8"></label>
        </div>
        <div class="sbl-meter"><div class="sbl-meter-fill"></div></div>
        <div class="sbl-stress-result" aria-live="polite"></div>
      </div>

      <div class="sbl-stage" data-stage-panel="explain">
        <div class="sbl-stage-copy"><span class="sbl-step">СТЪПКА 06</span><h3>Финална конфигурация</h3></div>
        <div class="sbl-handover">
          <div class="sbl-handover-summary"></div>
        </div>
      </div>
    </section>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id);
  if (!root) return;
  const profiles = comp.profiles || [];
  const groups = comp.parts || [];
  let activeProfile = profiles[0];
  const selections = Object.fromEntries(groups.map(group => [group.id, group.options[0]?.id]));

  function showStage(stage) {
    root.querySelectorAll('.sbl-stage').forEach(panel => panel.classList.toggle('active', panel.dataset.stagePanel === stage));
    root.querySelectorAll('.sbl-stage-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.stage === stage));
  }
  root.querySelectorAll('.sbl-stage-tab').forEach(tab => tab.addEventListener('click', () => showStage(tab.dataset.stage)));
  root.querySelectorAll('.sbl-next').forEach(button => button.addEventListener('click', () => showStage(button.dataset.next)));

  root.querySelectorAll('.sbl-profile').forEach(button => button.addEventListener('click', () => {
    activeProfile = profiles.find(profile => profile.id === button.dataset.profile) || activeProfile;
    root.querySelectorAll('.sbl-profile').forEach(item => item.classList.toggle('selected', item === button));
    root.querySelector('.sbl-brief-title').textContent = activeProfile.label;
    root.querySelector('.sbl-brief-text').textContent = activeProfile.challenge;
    root.querySelector('.sbl-budget-value').textContent = activeProfile.budget;
  }));

  root.querySelectorAll('.sbl-part').forEach(button => button.addEventListener('click', () => {
    selections[button.dataset.group] = button.dataset.option;
    root.querySelectorAll(`.sbl-part[data-group="${button.dataset.group}"]`).forEach(item => item.classList.toggle('selected', item === button));
  }));
  root.querySelectorAll('.sbl-xray-node').forEach(button => button.addEventListener('click', () => {
    root.querySelector('.sbl-xray-note').textContent = button.dataset.note;
  }));

  root.querySelector('.sbl-check-build').addEventListener('click', () => {
    const feedback = root.querySelector('.sbl-build-feedback');
    const weak = Object.entries(activeProfile.requirements || {}).filter(([groupId, minimum]) => {
      const group = groups.find(item => item.id === groupId);
      const option = group?.options.find(item => item.id === selections[groupId]);
      return (option?.score || 0) < minimum;
    });
    if (weak.length) {
      feedback.className = 'sbl-build-feedback warning';
      feedback.innerHTML = `<i class="fas fa-triangle-exclamation"></i><span><strong>Системата ще стартира, но не е балансирана.</strong> Преразгледайте: ${weak.map(([id]) => esc(groups.find(g => g.id === id)?.label)).join(', ')}.</span>`;
      return;
    }
    feedback.className = 'sbl-build-feedback success';
    feedback.innerHTML = '<i class="fas fa-circle-check"></i><span><strong>Съвместима и подходяща конфигурация.</strong> Свържете захранването и изпълнете POST.</span>';
    const statusText = root.querySelector('.sbl-status-text');
    if (statusText) statusText.textContent = 'Сглобена система';
    const statusLight = root.querySelector('.sbl-status-light');
    if (statusLight) statusLight.classList.add('ready');
    setTimeout(() => showStage('post'), 900);
  });

  root.querySelector('.sbl-power').addEventListener('click', () => {
    const screen = root.querySelector('.sbl-post-screen');
    const lines = ['POWER SIGNAL ........ OK', 'ROM / UEFI .......... LOADED', 'CPU ................ DETECTED', 'RAM TEST ........... PASSED', 'SSD ................ READY', 'OUTPUT ............. READY', 'BOOT DEVICE FOUND', 'SYSTEM READY_'];
    screen.innerHTML = '';
    lines.forEach((line, index) => setTimeout(() => {
      screen.insertAdjacentHTML('beforeend', `<div class="sbl-post-line">${line}</div>`);
      screen.scrollTop = screen.scrollHeight;
      if (index === lines.length - 1) {
        const postStatus = root.querySelector('.sbl-status-text');
        if (postStatus) postStatus.textContent = 'Системата работи';
        setTimeout(() => showStage('run'), 650);
      }
    }, index * 420));
  });

  let command = 'photo';
  root.querySelectorAll('.sbl-command').forEach(button => button.addEventListener('click', () => {
    command = button.dataset.command;
    root.querySelectorAll('.sbl-command').forEach(item => item.classList.toggle('selected', item === button));
  }));
  root.querySelector('.sbl-run-command').addEventListener('click', () => {
    const nodes = [...root.querySelectorAll('.sbl-path-node')];
    const binary = root.querySelector('.sbl-binary-strip');
    const explanations = {
      photo: 'Файлът се прочита от SSD, зарежда се в RAM, CPU изпълнява инструкциите, а GPU подготвя изображението за монитора.',
      sum: 'Входните числа попадат в RAM. Управляващото устройство подава инструкцията, а АЛУ извършва аритметичната операция.',
      save: 'CPU обработва командата, данните преминават от RAM по шината и се записват трайно върху SSD.'
    };
    nodes.forEach(node => node.classList.remove('active'));
    nodes.forEach((node, index) => setTimeout(() => node.classList.add('active'), index * 430));
    let ticks = 0;
    const timer = setInterval(() => {
      binary.textContent = Array.from({ length: 24 }, () => Math.random() > .5 ? '1' : '0').join('');
      if (++ticks > 8) clearInterval(timer);
    }, 160);
    setTimeout(() => root.querySelector('.sbl-command-explanation').textContent = explanations[command], nodes.length * 430);
  });

  const appSlider = root.querySelector('.sbl-app-slider');
  const ramSlider = root.querySelector('.sbl-ram-slider');
  function updateStress() {
    const apps = Number(appSlider.value);
    const ram = Number(ramSlider.value);
    const demand = apps * 1.1;
    const percent = Math.min(100, Math.round(demand / ram * 100));
    root.querySelector('.sbl-app-value').textContent = apps;
    root.querySelector('.sbl-ram-value').textContent = `${ram} GB`;
    const fill = root.querySelector('.sbl-meter-fill');
    fill.style.width = `${percent}%`;
    fill.className = `sbl-meter-fill ${percent > 90 ? 'danger' : percent > 65 ? 'warning' : ''}`;
    root.querySelector('.sbl-stress-result').innerHTML = percent > 90
      ? '<strong>RAM не достига.</strong> Част от данните се местят към по-бавна виртуална памет върху SSD; реакцията се забавя.'
      : percent > 65 ? '<strong>Натоварването расте.</strong> RAM все още побира работните данни, но резервът намалява.'
        : '<strong>Има свободен капацитет.</strong> Текущите програми се побират в RAM.';
  }
  appSlider.addEventListener('input', updateStress);
  ramSlider.addEventListener('input', updateStress);
  updateStress();

  const selectedLabel = group => group.options.find(option => option.id === selections[group.id])?.label || '-';
  root.querySelector('.sbl-handover-summary').innerHTML = `<span>Клиент</span><strong>${esc(activeProfile?.label)}</strong>${groups.map(group => `<span>${esc(group.label)}</span><strong>${esc(selectedLabel(group))}</strong>`).join('')}`;
  root.querySelector('.sbl-stage-tab[data-stage="explain"]').addEventListener('click', () => {
    root.querySelector('.sbl-handover-summary').innerHTML = `<span>Клиент</span><strong>${esc(activeProfile?.label)}</strong>${groups.map(group => `<span>${esc(group.label)}</span><strong>${esc(selectedLabel(group))}</strong>`).join('')}`;
  });
}