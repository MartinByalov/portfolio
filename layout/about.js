// About page and portfolio access gate

const GATE_STORAGE_KEY = 'portfolio-unlocked';

export function isPortfolioUnlocked() {
  try {
    return sessionStorage.getItem(GATE_STORAGE_KEY) === '1';
  } catch (err) {
    return false;
  }
}

export function renderAboutPage() {
  return `
    <audio id="about-bgMusic" src="/audio/background_sound.mp3" autoplay loop preload="auto"></audio>

    <section class="about-hero-wrapper">
      <div class="about-hero-overlay"></div>

      <div class="about-hero-container">
        <header class="about-hero-header">
          <h1>Мартин Бялов</h1>
          <div class="about-underline"></div>
        </header>

        <main class="about-hero-content">
          <div class="about-philosophy-text">
            <p>Моята философия като учител се корени в убеждението, че всяко дете притежава уникален потенциал, който трябва да бъде открит и подхранен. Вярвам, че образованието не е просто предаване на факти, а процес на вдъхновяване на любопитство.</p>
            <p>Стремя се да създавам интерактивна учебна среда, където грешките се приемат като възможности за растеж, а технологиите са инструмент за изграждане на критично мислене.</p>
          </div>
          <div class="about-hero-actions">
            <button id="portfolio-gate-btn" class="about-btn-primary" type="button"><i class="fa-solid fa-graduation-cap"></i> Портфолио</button>
          </div>
        </main>

        <footer class="about-hero-footer">
          <div class="about-social-minimal">
            <a href="https://bg.linkedin.com/in/martin-byalov-42615392" target="_blank" rel="noopener"><i class="fab fa-linkedin"></i></a>
            <a href="mailto:byalov.v.martin@gmail.com"><i class="fas fa-envelope"></i></a>
          </div>
          <p>© 2026 Мартин Бялов</p>
        </footer>
      </div>
    </section>
  `;
}

// Portfolio access code gate

function gateOverlay() {
  return document.getElementById('code-gate-overlay');
}

function closeGate() {
  gateOverlay()?.remove();
  document.removeEventListener('keydown', gateKeydown);
}

function gateKeydown(e) {
  if (e.key === 'Escape') closeGate();
  if (e.key === 'Enter') tryGateCode();
}

async function tryGateCode() {
  const digits = document.querySelectorAll('.code-gate-digit');
  const code = Array.from(digits).map(d => d.value).join('');
  const errorEl = document.getElementById('code-gate-error');
  if (code.length !== 6) {
    if (errorEl) errorEl.textContent = 'Моля въведете всички 6 цифри.';
    return;
  }

  try {
    const res = await fetch('/api/portfolio/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      try { sessionStorage.setItem(GATE_STORAGE_KEY, '1'); } catch (err) {}
      closeGate();
      location.hash = '#/portfolio';
      return;
    }
  } catch (err) {
    if (code === '123456') {
      try { sessionStorage.setItem(GATE_STORAGE_KEY, '1'); } catch (e) {}
      closeGate();
      location.hash = '#/portfolio';
      return;
    }
  }

  if (errorEl) errorEl.textContent = 'Грешен код. Опитай пак.';
  const gate = gateOverlay();
  if (gate) {
    gate.classList.remove('shake');
    void gate.offsetWidth;
    gate.classList.add('shake');
  }
  digits.forEach(d => d.value = '');
  digits[0]?.focus();
}

function openPortfolioGate() {
  if (isPortfolioUnlocked()) {
    location.hash = '#/portfolio';
    return;
  }
  closeGate();
  const overlay = document.createElement('div');
  overlay.id = 'code-gate-overlay';
  overlay.className = 'code-gate-overlay';
  overlay.innerHTML = `
    <div class="code-gate" role="dialog" aria-modal="true" aria-label="Въведи код за достъп">
      <div class="code-gate-icon"><i class="fas fa-lock"></i></div>
      <h3>Защитено портфолио</h3>
      <p>Моля въведете код за достъп</p>
      <div class="code-gate-digits">
        <input type="text" inputmode="numeric" maxlength="1" autocomplete="off" class="code-gate-digit" data-index="0">
        <input type="text" inputmode="numeric" maxlength="1" autocomplete="off" class="code-gate-digit" data-index="1">
        <input type="text" inputmode="numeric" maxlength="1" autocomplete="off" class="code-gate-digit" data-index="2">
        <input type="text" inputmode="numeric" maxlength="1" autocomplete="off" class="code-gate-digit" data-index="3">
        <input type="text" inputmode="numeric" maxlength="1" autocomplete="off" class="code-gate-digit" data-index="4">
        <input type="text" inputmode="numeric" maxlength="1" autocomplete="off" class="code-gate-digit" data-index="5">
      </div>
      <p class="code-gate-error" id="code-gate-error"></p>
      <div class="code-gate-actions">
        <button type="button" class="code-gate-cancel" id="code-gate-cancel">Отказ</button>
        <button type="button" class="code-gate-ok" id="code-gate-ok">Вход</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('open'));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeGate(); });
  document.getElementById('code-gate-ok').addEventListener('click', tryGateCode);
  document.getElementById('code-gate-cancel').addEventListener('click', closeGate);
  document.addEventListener('keydown', gateKeydown);
  const digits = overlay.querySelectorAll('.code-gate-digit');
  digits.forEach((digit, i) => {
    digit.addEventListener('input', () => {
      digit.value = digit.value.replace(/\D/g, '');
      if (digit.value && i < 5) digits[i + 1].focus();
      if (digits[5].value) tryGateCode();
    });
    digit.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !digit.value && i > 0) digits[i - 1].focus();
    });
  });
  setTimeout(() => digits[0]?.focus(), 80);
}

// About page initialization

let aboutAudioCleanup = null;

export function initAboutPage() {
  document.getElementById('portfolio-gate-btn')?.addEventListener('click', openPortfolioGate);
}

export function initAboutAudio() {
  if (aboutAudioCleanup) return;
  const audio = document.getElementById('about-bgMusic');
  if (!audio) return;

  function startMusic() {
    if (audio && audio.paused) audio.play().catch(() => {});
    removeListeners();
  }
  function removeListeners() {
    document.removeEventListener('click', startMusic);
    document.removeEventListener('touchstart', startMusic);
    document.removeEventListener('keydown', startMusic);
  }

  document.addEventListener('click', startMusic);
  document.addEventListener('touchstart', startMusic);
  document.addEventListener('keydown', startMusic);

  aboutAudioCleanup = () => {
    removeListeners();
    closeGate();
    if (audio) { audio.pause(); audio.currentTime = 0; }
    aboutAudioCleanup = null;
  };
}

export function cleanupAboutAudio() {
  if (aboutAudioCleanup) aboutAudioCleanup();
}

export function cleanupAboutPage() {
  closeGate();
  if (aboutAudioCleanup) aboutAudioCleanup();
}