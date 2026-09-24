// Interactive Peripheral Installation Lab - IT 8, lesson 2.6
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

export function render(comp) {
  const id = comp.id || 'peripheral-install-lab';
  const devices = comp.devices || [];
  const cards = devices.map((d, i) => `
    <button type="button" class="pil-device" data-index="${i}" aria-pressed="false">
      <i aria-hidden="true" class="${esc(d.icon || 'fa-solid fa-plug')}"></i>
      <span>${esc(d.name)}</span>
    </button>
  `).join('');

  return `
    <section id="${esc(id)}" class="component pil-card">
      <h3>${esc(comp.title || 'Инсталирай периферното устройство')}</h3>
      <p class="pil-desc">${esc(comp.description || '')}</p>
      <div class="pil-devices" aria-label="Избор на устройство">${cards}</div>
      <div class="pil-stage">
        <div class="pil-progress" aria-label="Напредък">
          <span>1. Порт</span>
          <span>2. PnP</span>
          <span>3. Драйвер</span>
          <span>4. Проверка</span>
        </div>
        <div class="pil-question"></div>
        <div class="pil-options"></div>
        <div class="pil-feedback" aria-live="polite"></div>
        <button type="button" class="pil-reset">Избери друго устройство</button>
      </div>
    </section>
  `;
}

export function init(comp) {
  const root = document.getElementById(comp.id || 'peripheral-install-lab');
  if (!root) return;

  const devices = comp.devices || [];
  const cards = [...root.querySelectorAll('.pil-device')];
  const stage = root.querySelector('.pil-stage');
  const q = root.querySelector('.pil-question');
  const opts = root.querySelector('.pil-options');
  const fb = root.querySelector('.pil-feedback');
  const prog = [...root.querySelectorAll('.pil-progress span')];
  const reset = root.querySelector('.pil-reset');

  let device = null;
  let step = 0;
  let stepAnswered = false;

  function feedback(ok, text) {
    fb.className = 'pil-feedback ' + (ok ? 'ok' : 'bad');
    fb.textContent = text;
  }

  function ask(questionText, choices, correctChoice, successMsg, failMsg) {
    stepAnswered = false;
    q.textContent = questionText;
    opts.innerHTML = '';
    fb.className = 'pil-feedback';
    fb.textContent = '';

    choices.forEach(choice => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pil-option';
      b.textContent = choice;
      b.onclick = () => {
        if (stepAnswered) return;

        if (choice !== correctChoice) {
          b.classList.add('incorrect');
          feedback(false, failMsg || 'Това действие не е подходящо в този момент. Опитайте друг отговор.');
          return;
        }

        stepAnswered = true;
        b.classList.add('correct');
        [...opts.children].forEach(btn => { btn.disabled = true; });
        feedback(true, successMsg);

        setTimeout(() => {
          step++;
          renderStep();
        }, 800);
      };
      opts.appendChild(b);
    });
  }

  function renderStep() {
    prog.forEach((p, i) => {
      p.classList.toggle('on', i <= Math.min(step, 3));
    });
    reset.style.display = 'none';

    if (step === 0) {
      const portChoices = ['USB порт', 'HDMI / DisplayPort', 'LAN (RJ-45)', '3.5 mm аудио жак'];
      ask(
        `Към кой порт е най-подходящо да свържете: ${device.name}?`,
        portChoices,
        device.port,
        'Отлично! Избран е правилният физически порт за това устройство.',
        'Този порт не съответства на куплунга на устройството. Изберете правилния порт.'
      );
    } else if (step === 1) {
      ask(
        'Какво е правилното следващо действие след физическото свързване?',
        [
          'Изключваме компютъра веднага',
          'Изчакваме операционната система да разпознае устройството (Plug and Play)',
          'Сваляме произволен драйвер от неофициален сайт'
        ],
        'Изчакваме операционната система да разпознае устройството (Plug and Play)',
        'Точно така! Windows автоматично идентифицира новото устройство чрез Plug and Play.',
        'Първо трябва да дадем възможност на операционната система да идентифицира устройството.'
      );
    } else if (step === 2) {
      if (device.needsDriver) {
        ask(
          `Устройството (${device.name}) е свързано, но за пълната му функционалност е необходим драйвер. Как действаме?`,
          [
            'Инсталираме официалния драйвер от сайта на производителя',
            'Оставяме го само с базовия драйвер без пълните му функции',
            'Инсталираме първия намерен пакет от неофициален сайт'
          ],
          'Инсталираме официалния драйвер от сайта на производителя',
          'Правилен избор! Официалният драйвер гарантира стабилност и достъп до всички функции.',
          'При липсващ или непълен драйвер винаги се използва официалният софтуер от производителя.'
        );
      } else {
        ask(
          `Устройството (${device.name}) е разпознато автоматично от ОС. Как действаме?`,
          [
            'Проверяваме дали устройството работи с автоматично заредения драйвер',
            'Търсим и инсталираме допълнителен драйвер от интернет без нужда',
            'Премахваме устройството и рестартираме'
          ],
          'Проверяваме дали устройството работи с автоматично заредения драйвер',
          'Точно така! Ако Plug and Play осигурява пълна работа, не е необходим допълнителен драйвер.',
          'Ако автоматичният драйвер осигурява пълна функционалност, не инсталираме излишни програми.'
        );
      }
    } else if (step === 3) {
      ask(
        'Къде проверяваме състоянието на хардуера и драйвера в Windows?',
        [
          'Device Manager (Диспечер на устройствата)',
          'Calculator (Калкулатор)',
          'Recycle Bin (Кошче)'
        ],
        'Device Manager (Диспечер на устройствата)',
        'Браво! В Device Manager виждаме всички свързани устройства и статуса на техните драйвери.',
        'Проверката на хардуера се прави в специализирания инструмент за управление на устройства.'
      );
    } else {
      q.textContent = 'Сценарият е завършен успешно!';
      opts.innerHTML = '';
      feedback(true, `Успешна инсталация за ${device.name}: Свързване към порт → Plug and Play → Драйвер → Проверка в Device Manager.`);
      reset.style.display = 'inline-flex';
    }
  }

  cards.forEach((c, i) => {
    c.onclick = () => {
      cards.forEach(x => {
        x.classList.remove('active');
        x.setAttribute('aria-pressed', 'false');
      });
      c.classList.add('active');
      c.setAttribute('aria-pressed', 'true');
      device = devices[i];
      step = 0;
      stage.classList.add('show');
      renderStep();
    };
  });

  reset.onclick = () => {
    cards.forEach(x => {
      x.classList.remove('active');
      x.setAttribute('aria-pressed', 'false');
    });
    stage.classList.remove('show');
    device = null;
    step = 0;
  };
}
